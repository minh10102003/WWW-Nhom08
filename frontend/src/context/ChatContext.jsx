import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAuth } from './AuthContext'
import api from '../services/api'

const ChatContext = createContext()

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

export const ChatProvider = ({ children }) => {
  const { user } = useAuth()
  const [stompClient, setStompClient] = useState(null)
  const [connected, setConnected] = useState(false)
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const clientRef = useRef(null)

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!user) {
      console.log('Cannot connect: no user')
      return
    }
    
    if (clientRef.current) {
      console.log('Already connecting/connected')
      return
    }

    // Use full URL in development (bypass proxy issues), relative in production
    const wsUrl = import.meta.env.DEV 
      ? 'http://localhost:8080/iphoneshop/ws'  // Use full URL with context path in dev mode
      : '/iphoneshop/ws'  // Use relative URL in production
    
    console.log('Creating WebSocket connection to:', wsUrl)
    const socket = new SockJS(wsUrl)
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('✓ WebSocket connected')
        setConnected(true)
        setStompClient(client)
      },
      onDisconnect: () => {
        console.log('✗ WebSocket disconnected')
        setConnected(false)
        setStompClient(null)
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame)
        setConnected(false)
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event)
        setConnected(false)
      }
    })

    client.activate()
    clientRef.current = client
  }, [user])

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate()
      clientRef.current = null
    }
    setStompClient(null)
    setConnected(false)
  }, [])

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0)
      return
    }
    try {
      const response = await api.get('/chat/unread-count')
      if (response.data.status === 'success') {
        setUnreadCount(response.data.data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }, []) // Empty deps - function không thay đổi

  // Load or create conversation
  const loadConversation = useCallback(async () => {
    try {
      const response = await api.get('/chat/conversation')
      if (response.data.status === 'success') {
        setConversation(response.data.data)
        return response.data.data
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
    return null
  }, []) // Empty deps - function không thay đổi

  // Load messages
  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return []
    try {
      const response = await api.get(`/chat/conversations/${conversationId}/messages`)
      if (response.data.status === 'success') {
        setMessages(response.data.data)
        return response.data.data
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
    return []
  }, []) // Empty deps - function không thay đổi

  // Send message
  const sendMessage = useCallback((content, type = 'text') => {
    if (!stompClient || !conversation || !connected) {
      console.error('Cannot send message: not connected or no conversation')
      return
    }

    stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        conversationId: conversation.id,
        content,
        type
      })
    })
  }, [stompClient, conversation, connected])

  // Send typing indicator
  const sendTyping = useCallback((isTyping) => {
    if (!stompClient || !conversation || !connected) return

    stompClient.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify({
        conversationId: conversation.id,
        isTyping
      })
    })
  }, [stompClient, conversation, connected])

  // Mark as read
  const markAsRead = useCallback(() => {
    if (!stompClient || !conversation || !connected) return

    stompClient.publish({
      destination: '/app/chat.read',
      body: JSON.stringify({
        conversationId: conversation.id
      })
    })
  }, [stompClient, conversation, connected])

  // Subscribe to conversation messages
  useEffect(() => {
    if (!stompClient || !conversation || !connected) return

    const subscription = stompClient.subscribe(
      `/topic/conversation.${conversation.id}`,
      (message) => {
        const newMessage = JSON.parse(message.body)
        setMessages(prev => {
          // Avoid duplicates
          if (prev.find(m => m.id === newMessage.id)) {
            return prev
          }
          return [...prev, newMessage]
        })
        // Nếu tin nhắn không phải từ user hiện tại, tăng unread count
        if (newMessage.senderId !== user?.id) {
          setUnreadCount(prev => prev + 1)
          // KHÔNG tự động mark as read - chỉ mark khi user đang xem chat (trong Chat.jsx)
          // KHÔNG gọi loadUnreadCount ở đây để tránh infinite loop
        }
      }
    )

    // Subscribe to typing indicators
    const typingSubscription = stompClient.subscribe(
      `/topic/conversation.${conversation.id}.typing`,
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

    return () => {
      subscription.unsubscribe()
      typingSubscription.unsubscribe()
    }
  }, [stompClient, conversation, connected, user])

  // Load unread count when user is available
  useEffect(() => {
    if (user) {
      loadUnreadCount()
      // Reload unread count every 30 seconds (tăng interval để giảm số lần gọi)
      const interval = setInterval(() => {
        loadUnreadCount()
      }, 30000)
      return () => clearInterval(interval)
    } else {
      setUnreadCount(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]) // Chỉ depend vào user, không depend vào loadUnreadCount

  // Connect when user is available
  useEffect(() => {
    if (user && !connected && !clientRef.current) {
      console.log('Connecting WebSocket for user:', user.email)
      connect()
    } else if (!user) {
      disconnect()
    }

    return () => {
      if (!user) {
        disconnect()
      }
    }
  }, [user, connected, connect, disconnect])

  const value = {
    connected,
    conversation,
    messages,
    typingUsers,
    unreadCount,
    loadConversation,
    loadMessages,
    sendMessage,
    sendTyping,
    markAsRead,
    loadUnreadCount
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

