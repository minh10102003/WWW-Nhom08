import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import api from '../services/api'

const Chat = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    connected,
    conversation,
    messages,
    typingUsers,
    loadConversation,
    loadMessages,
    sendMessage,
    sendTyping,
    markAsRead,
    loadUnreadCount
  } = useChat()

  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const initializedRef = useRef(false)
  const prevMessagesLengthRef = useRef(0)
  const markedAsReadRef = useRef(false)
  const lastMessageIdRef = useRef(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Chỉ init 1 lần
    if (initializedRef.current) return

    const initChat = async () => {
      try {
        // Kiểm tra nếu user là admin thì redirect về admin chat
        const isAdmin = user.vaiTro?.some(vt => 
          vt.tenVaiTro === 'ADMIN' || vt.tenVaiTro === 'ROLE_ADMIN'
        )
        if (isAdmin) {
          navigate('/admin/chat')
          return
        }

        initializedRef.current = true // Set ngay để tránh gọi lại
        const conv = await loadConversation()
        if (conv) {
          await loadMessages(conv.id)
          // Reset refs khi load conversation mới
          prevMessagesLengthRef.current = 0
          markedAsReadRef.current = false
          lastMessageIdRef.current = null
          // Scroll to bottom sau khi load messages (chỉ scroll container)
          setTimeout(() => {
            const container = messagesContainerRef.current
            if (container) {
              container.scrollTop = container.scrollHeight
            }
          }, 200)
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
        // Nếu lỗi do admin không thể tạo conversation, redirect về admin chat
        if (error.response?.data?.data?.includes('Admin không thể')) {
          navigate('/admin/chat')
          return
        }
        initializedRef.current = false // Reset nếu lỗi
      }
    }

    initChat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]) // Chỉ depend vào user và navigate

  // Auto scroll to bottom - chỉ scroll khi có message mới từ người khác hoặc khi user gửi
  useEffect(() => {
    if (messages.length === 0) return
    
    const lastMessage = messages[messages.length - 1]
    const lastMessageId = lastMessage?.id
    
    // Chỉ scroll nếu có message mới (ID khác với message cuối cùng trước đó)
    if (lastMessageId && lastMessageId !== lastMessageIdRef.current) {
      const senderId = lastMessage.senderId || lastMessage.nguoiGui?.id
      const isOwnMessage = senderId === user?.id
      
      // Kiểm tra xem user có đang ở gần cuối trang không
      const container = messagesContainerRef.current
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
        
        // Chỉ scroll nếu:
        // 1. Message mới từ người khác (luôn scroll)
        // 2. Hoặc message từ user và user đang ở gần cuối trang
        if (!isOwnMessage || isNearBottom) {
          // Sử dụng scrollTop thay vì scrollIntoView để chỉ scroll container, không scroll cả trang
          setTimeout(() => {
            if (messagesEndRef.current && container) {
              container.scrollTop = container.scrollHeight
            }
          }, 50)
        }
      }
      
      lastMessageIdRef.current = lastMessageId
      prevMessagesLengthRef.current = messages.length
    }
  }, [messages, user?.id])

  // Mark as read when viewing messages - chỉ gọi 1 lần khi load xong
  useEffect(() => {
    if (messages.length > 0 && conversation && !markedAsReadRef.current) {
      markAsRead()
      markedAsReadRef.current = true
      // Reload unread count sau khi mark as read (chỉ 1 lần)
      setTimeout(() => {
        loadUnreadCount()
      }, 500)
    }
    // Reset khi conversation thay đổi
    return () => {
      markedAsReadRef.current = false
    }
  }, [conversation?.id, markAsRead, loadUnreadCount]) // Chỉ depend vào conversation.id

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!messageInput.trim() || !connected) return

    sendMessage(messageInput.trim())
    setMessageInput('')
    setIsTyping(false)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    sendTyping(false)
  }

  const handleInputChange = (e) => {
    setMessageInput(e.target.value)

    if (!isTyping) {
      setIsTyping(true)
      sendTyping(true)
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      sendTyping(false)
    }, 1000)
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-4">
            <h1 className="text-2xl font-bold">Chat với chúng tôi</h1>
            <p className="text-sm opacity-90">
              {connected && conversation ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Đã kết nối
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  {conversation ? 'Đang kết nối...' : 'Đang tải cuộc trò chuyện...'}
                </span>
              )}
            </p>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
              </div>
            ) : (
              messages.map((message) => {
                // Handle both WebSocket message format and REST API format
                const senderId = message.senderId || message.nguoiGui?.id
                const senderName = message.senderName || message.nguoiGui?.hoTen
                const content = message.content || message.noiDung
                const timestamp = message.timestamp || (message.thoiGianGui ? new Date(message.thoiGianGui).getTime() : null)
                const isOwnMessage = senderId === user.id
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
                          {senderName || 'Admin'}
                        </p>
                      )}
                      <p className="text-sm">{content}</p>
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
          <form onSubmit={handleSendMessage} className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={handleInputChange}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={!connected || !conversation}
              />
              <button
                type="submit"
                disabled={!connected || !conversation || !messageInput.trim()}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat

