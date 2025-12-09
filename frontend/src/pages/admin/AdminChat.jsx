import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const AdminChat = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [pendingConversations, setPendingConversations] = useState([])
  const [activeConversations, setActiveConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [stompClient, setStompClient] = useState(null)
  const [connected, setConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [unreadCounts, setUnreadCounts] = useState({})
  const messagesEndRef = useRef(null)
  const clientRef = useRef(null)
  const lastSelectedConvId = useRef(null)
  const conversationsLoadedRef = useRef(false)
  const unreadCountsLoadedRef = useRef(false)

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Check admin role - consistent with Admin.jsx
    const roles = user.vaiTro?.map(vt => vt.tenVaiTro || vt) || []
    const isAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ADMIN')
    if (!isAdmin) {
      navigate('/')
      return
    }
  }, [user, navigate])

  // Connect WebSocket
  useEffect(() => {
    if (!user) return

    // Use full URL in development (bypass proxy issues), relative in production
    const wsUrl = import.meta.env.DEV 
      ? 'http://localhost:8080/iphoneshop/ws'  // Use full URL with context path in dev mode
      : '/iphoneshop/ws'  // Use relative URL in production
    console.log('AdminChat: Creating WebSocket connection to:', wsUrl)
    const socket = new SockJS(wsUrl)
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('✓ Admin WebSocket connected')
        setConnected(true)
        setStompClient(client)
      },
      onDisconnect: () => {
        console.log('✗ Admin WebSocket disconnected')
        setConnected(false)
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame)
      }
    })

    client.activate()
    clientRef.current = client

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate()
      }
    }
  }, [user])

  // Load conversations
  const loadConversations = async () => {
    try {
      // Chỉ set loading lần đầu
      if (!conversationsLoadedRef.current) {
        setLoading(true)
      }
      const response = await api.get('/chat/conversations')
      if (response.data.status === 'success') {
        const allConversations = response.data.data
        setConversations(allConversations)
        
        // Phân loại conversations
        // Đang chờ: chưa có admin nhận
        const pending = allConversations.filter(c => c.trangThai === 'dang_cho' && !c.admin)
        // Đang chat: đã có admin nhận (TẤT CẢ admin đều thấy, không chỉ admin đang xử lý)
        const active = allConversations.filter(c => c.trangThai === 'dang_chat' && c.admin)
        
        console.log('All conversations:', allConversations)
        console.log('Pending conversations:', pending)
        console.log('Active conversations:', active)
        
        setPendingConversations(pending)
        setActiveConversations(active)
        
        // Load unread counts - chỉ load 1 lần
        if (!unreadCountsLoadedRef.current) {
          unreadCountsLoadedRef.current = true
          for (const conv of allConversations) {
            try {
              const unreadResponse = await api.get(`/chat/conversations/${conv.id}/unread-count`)
              if (unreadResponse.data.status === 'success') {
                setUnreadCounts(prev => ({
                  ...prev,
                  [conv.id]: unreadResponse.data.data.unreadCount || 0
                }))
              }
            } catch (err) {
              console.error('Error loading unread count:', err)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load pending conversations
  const loadPendingConversations = async () => {
    try {
      const response = await api.get('/chat/admin/pending')
      if (response.data.status === 'success') {
        const pending = response.data.data
        setPendingConversations(pending)
        // Merge với conversations hiện tại
        setConversations(prev => {
          const existingIds = new Set(prev.map(c => c.id))
          const newPending = pending.filter(c => !existingIds.has(c.id))
          return [...prev, ...newPending]
        })
      }
    } catch (error) {
      console.error('Error loading pending conversations:', error)
    }
  }

  // Load messages
  const loadMessages = async (conversationId) => {
    try {
      console.log('Loading messages for conversation:', conversationId)
      const response = await api.get(`/chat/conversations/${conversationId}/messages`)
      console.log('Messages response:', response.data)
      if (response.data.status === 'success') {
        const messagesData = response.data.data
        console.log('Loaded messages:', messagesData)
        setMessages(messagesData)
        // Mark as read
        await api.get(`/chat/conversations/${conversationId}/unread-count`)
      } else {
        console.error('Failed to load messages:', response.data.data)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      if (error.response) {
        console.error('Error response:', error.response.data)
      }
    }
  }

  // Assign conversation to admin
  const assignConversation = async (conversationId) => {
    try {
      const response = await api.put(`/chat/admin/conversations/${conversationId}/assign`)
      if (response.data.status === 'success') {
        await loadConversations()
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(response.data.data)
        }
      }
    } catch (error) {
      console.error('Error assigning conversation:', error)
      alert('Không thể nhận cuộc trò chuyện này')
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim() || !stompClient || !selectedConversation || !connected) return

    const messageContent = messageInput.trim()
    setMessageInput('') // Clear input ngay để UX tốt hơn

    // Tự động assign admin nếu chưa assign trước khi gửi tin nhắn
    if (selectedConversation.trangThai === 'dang_cho' && !selectedConversation.admin) {
      try {
        const response = await api.put(`/chat/admin/conversations/${selectedConversation.id}/assign`)
        if (response.data.status === 'success') {
          // Update selected conversation với trạng thái mới
          const updatedConv = response.data.data
          setSelectedConversation(updatedConv)
          // Reload conversations để cập nhật UI (chuyển từ "Đang chờ" sang "Đang chat")
          await loadConversations()
          await loadPendingConversations()
        }
      } catch (error) {
        console.error('Error assigning conversation:', error)
        // Vẫn gửi tin nhắn dù có lỗi assign
      }
    }

    // Gửi tin nhắn
    stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        conversationId: selectedConversation.id,
        content: messageContent,
        type: 'text'
      })
    })

    // Sau khi gửi tin nhắn, reload conversations để cập nhật trạng thái
    // (đảm bảo conversation chuyển từ "Đang chờ" sang "Đang chat")
    setTimeout(() => {
      loadConversations()
      loadPendingConversations()
    }, 500)
  }

  // Subscribe to conversation messages
  useEffect(() => {
    if (!stompClient || !selectedConversation || !connected) return

      const subscription = stompClient.subscribe(
        `/topic/conversation.${selectedConversation.id}`,
        (message) => {
          const newMessage = JSON.parse(message.body)
          setMessages(prev => {
            // Avoid duplicates
            if (prev.find(m => m.id === newMessage.id)) {
              return prev
            }
            return [...prev, newMessage]
          })
          
          // Nếu admin gửi tin nhắn đầu tiên, cập nhật trạng thái conversation
          if (newMessage.senderId === user?.id && selectedConversation.trangThai === 'dang_cho') {
            // Reload conversations để cập nhật trạng thái từ backend
            loadConversations().then((allConversations) => {
              if (allConversations && allConversations.length > 0) {
                const updatedConv = allConversations.find(c => c.id === selectedConversation.id)
                if (updatedConv) {
                  setSelectedConversation(updatedConv)
                }
              }
            })
            loadPendingConversations()
          }
          
          // Update unread count
          if (newMessage.senderId !== user?.id) {
            setUnreadCounts(prev => ({
              ...prev,
              [selectedConversation.id]: (prev[selectedConversation.id] || 0) + 1
            }))
          }
        }
      )

    const typingSubscription = stompClient.subscribe(
      `/topic/conversation.${selectedConversation.id}.typing`,
      (message) => {
        const data = JSON.parse(message.body)
        if (data.userId !== user?.id) {
          if (data.isTyping) {
            setTypingUsers(prev => {
              if (!prev.find(u => u.userId === data.userId)) {
                return [...prev, { userId: data.userId, userName: data.userName }]
              }
              return prev
            })
          } else {
            setTypingUsers(prev => prev.filter(u => u.userId !== data.userId))
          }
        }
      }
    )

    // Subscribe to admin unread updates (để cập nhật badge trong Admin.jsx)
    const adminUnreadSubscription = stompClient.subscribe(
      '/topic/admin.unread-update',
      () => {
        // Trigger reload unread count in parent (Admin.jsx)
        window.dispatchEvent(new CustomEvent('chatUnreadUpdate'))
      }
    )

    return () => {
      subscription.unsubscribe()
      typingSubscription.unsubscribe()
      adminUnreadSubscription.unsubscribe()
    }
  }, [stompClient, selectedConversation, connected, user])

  // Load conversations on mount
  useEffect(() => {
    if (conversationsLoadedRef.current) return
    
    const loadData = async () => {
      conversationsLoadedRef.current = true // Set ngay để tránh gọi lại
      await loadConversations()
      await loadPendingConversations()
    }
    
    loadData()
    
    // Refresh conversations every 10 seconds (tăng lên để giảm requests)
    const interval = setInterval(() => {
      loadConversations()
      loadPendingConversations()
    }, 10000)
    
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]) // Clear messages when no conversation selected
      return
    }
    
    // Chỉ load nếu conversation khác với lần trước
    if (lastSelectedConvId.current === selectedConversation.id) {
      console.log('Same conversation, skipping load')
      return
    }
    
    console.log('Loading conversation:', selectedConversation.id)
    lastSelectedConvId.current = selectedConversation.id
    
    // Tự động assign admin nếu conversation chưa có admin
    if (selectedConversation.trangThai === 'dang_cho' && !selectedConversation.admin) {
      assignConversation(selectedConversation.id).then(async () => {
        // Reload conversations sau khi assign
        const allConversations = await loadConversations()
        await loadPendingConversations()
        
        // Cập nhật selected conversation với dữ liệu mới nhất
        if (allConversations && allConversations.length > 0) {
          const updatedConv = allConversations.find(c => c.id === selectedConversation.id)
          if (updatedConv) {
            setSelectedConversation(updatedConv)
          }
        }
        
        // Load messages sau khi assign
        loadMessages(selectedConversation.id)
      })
    } else {
      // Load messages ngay
      loadMessages(selectedConversation.id)
    }
    
    // Reset unread count when viewing
    setUnreadCounts(prev => ({
      ...prev,
      [selectedConversation.id]: 0
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?.id]) // Chỉ depend vào ID, không phải toàn bộ object

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Quản lý Chat</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="bg-primary text-white p-4">
              <h2 className="text-xl font-bold">Danh sách cuộc trò chuyện</h2>
              <p className="text-sm opacity-90">
                {connected ? '✓ Đã kết nối' : '✗ Chưa kết nối'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {conversations.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>Chưa có cuộc trò chuyện nào</p>
                </div>
              ) : (
                <>
                  {/* Đang chờ xử lý */}
                  {pendingConversations.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 px-2">
                        Đang chờ ({pendingConversations.length})
                      </h3>
                      {pendingConversations.map((conv) => {
                        const isSelected = selectedConversation?.id === conv.id
                        const unreadCount = unreadCounts[conv.id] || 0
                        return (
                          <div
                            key={conv.id}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setSelectedConversation(conv)
                            }}
                            className={`p-3 mb-2 rounded-lg cursor-pointer transition relative ${
                              isSelected
                                ? 'bg-primary text-white'
                                : 'bg-yellow-50 hover:bg-yellow-100 border border-yellow-200'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-semibold">
                                {conv.khachHang?.hoTen || 'Khách hàng'}
                              </p>
                              <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    isSelected 
                                      ? 'bg-white text-primary' 
                                      : 'bg-red-500 text-white'
                                  }`}>
                                    {unreadCount}
                                  </span>
                                )}
                                <span className={`text-xs px-2 py-1 rounded ${
                                  isSelected 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-yellow-500 text-white'
                                }`}>
                                  Chờ xử lý
                                </span>
                              </div>
                            </div>
                            {conv.tinNhanCuoiCung && (
                              <p className={`text-sm truncate ${isSelected ? 'opacity-90' : 'text-gray-600'}`}>
                                {conv.tinNhanCuoiCung}
                              </p>
                            )}
                            {conv.thoiGianTinNhanCuoi && (
                              <p className={`text-xs mt-1 ${isSelected ? 'opacity-75' : 'text-gray-500'}`}>
                                {formatDate(conv.thoiGianTinNhanCuoi)}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Đang chat */}
                  {activeConversations.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 px-2">
                        Đang chat ({activeConversations.length})
                      </h3>
                      {activeConversations.map((conv) => {
                        const isSelected = selectedConversation?.id === conv.id
                        const unreadCount = unreadCounts[conv.id] || 0
                        // Kiểm tra xem admin hiện tại có phải là admin đang xử lý conversation này không
                        const isMyConversation = conv.admin?.id === user?.id
                        return (
                          <div
                            key={conv.id}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setSelectedConversation(conv)
                            }}
                            className={`p-3 mb-2 rounded-lg cursor-pointer transition ${
                              isSelected
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex-1">
                                <p className="font-semibold">
                                  {conv.khachHang?.hoTen || 'Khách hàng'}
                                </p>
                                {conv.admin && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Admin: {conv.admin.hoTen || conv.admin.email}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    isSelected 
                                      ? 'bg-white text-primary' 
                                      : 'bg-red-500 text-white'
                                  }`}>
                                    {unreadCount}
                                  </span>
                                )}
                                {!isMyConversation && (
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    isSelected 
                                      ? 'bg-white/20 text-white' 
                                      : 'bg-gray-500 text-white'
                                  }`}>
                                    {conv.admin?.hoTen || 'Admin khác'}
                                  </span>
                                )}
                              </div>
                            </div>
                            {conv.tinNhanCuoiCung && (
                              <p className={`text-sm truncate ${isSelected ? 'opacity-90' : 'text-gray-600'}`}>
                                {conv.tinNhanCuoiCung}
                              </p>
                            )}
                            {conv.thoiGianTinNhanCuoi && (
                              <p className={`text-xs mt-1 ${isSelected ? 'opacity-75' : 'text-gray-500'}`}>
                                {formatDate(conv.thoiGianTinNhanCuoi)}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-primary text-white p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold">
                        {selectedConversation.khachHang?.hoTen || 'Khách hàng'}
                      </h2>
                      <p className="text-sm opacity-90">
                        {selectedConversation.khachHang?.email || ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>Chưa có tin nhắn nào</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      // Handle both WebSocket message format and REST API format
                      const senderId = message.senderId || message.nguoiGui?.id || message.nguoiGui?.id
                      const senderName = message.senderName || message.nguoiGui?.hoTen || message.nguoiGui?.email
                      const content = message.content || message.noiDung
                      const timestamp = message.timestamp || (message.thoiGianGui ? new Date(message.thoiGianGui).getTime() : null)
                      const isOwnMessage = senderId === user?.id
                      
                      // Debug log
                      if (!content) {
                        console.warn('Message missing content:', message)
                      }
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwnMessage
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            {!isOwnMessage && (
                              <p className="text-xs font-semibold mb-1 opacity-75">
                                {senderName || 'Khách hàng'}
                              </p>
                            )}
                            <p className="text-sm">{content || '(Không có nội dung)'}</p>
                            <p className={`text-xs mt-1 ${isOwnMessage ? 'opacity-75' : 'text-gray-600'}`}>
                              {formatTime(timestamp)}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}

                  {/* Typing indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 px-4 py-2 rounded-lg">
                        <p className="text-sm text-gray-600">
                          {typingUsers.map(u => u.userName).join(', ')} đang gõ...
                        </p>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={!connected}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!connected || !messageInput.trim()}
                      className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Chọn một cuộc trò chuyện để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminChat

