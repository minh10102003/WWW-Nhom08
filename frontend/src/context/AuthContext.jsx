import { createContext, useState, useContext, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    console.log('=== AuthProvider useEffect ===')
    
    // Check if we just logged out - DON'T clear flag yet, keep it to prevent checkAuth
    const justLoggedOut = sessionStorage.getItem('justLoggedOut')
    console.log('justLoggedOut flag:', justLoggedOut)
    
    if (justLoggedOut) {
      console.log('✓ Detected logout - keeping flag and skipping checkAuth')
      // DON'T remove flag here - keep it to prevent checkAuth from running
      // Only clear it after we verify backend has no user
      setUser(null)
      // Clear localStorage (không dùng cho user, nhưng clear để đảm bảo)
      localStorage.clear()
      setLoading(false)
      
      // Verify backend has no user, then clear flag
      verifyLogoutAndClearFlag()
      return
    }
    
    console.log('→ Calling checkAuth()...')
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const verifyLogoutAndClearFlag = async () => {
    try {
      // Wait a bit for backend to process logout
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Try to get profile - should return null after logout
      const response = await authApi.getProfile()
      console.log('Verify logout - getProfile response:', response)
      
      if (!response.data) {
        console.log('✓ Backend confirmed logout - clearing flag')
        sessionStorage.removeItem('justLoggedOut')
      } else {
        console.log('⚠️ Backend still has user - keeping flag')
        // Keep flag to prevent checkAuth from setting user
      }
    } catch (error) {
      console.log('✓ Backend error (expected after logout) - clearing flag')
      sessionStorage.removeItem('justLoggedOut')
    }
  }

  const checkAuth = async () => {
    // Double check - if we just logged out, don't check auth
    const justLoggedOut = sessionStorage.getItem('justLoggedOut')
    if (justLoggedOut || isLoggingOut) {
      console.log('✗ checkAuth: justLoggedOut or isLoggingOut detected - skipping')
      console.log('  - justLoggedOut:', justLoggedOut)
      console.log('  - isLoggingOut:', isLoggingOut)
      setUser(null)
      setLoading(false)
      return
    }
    
    console.log('=== checkAuth() called ===')
    try {
      const response = await authApi.getProfile()
      console.log('getProfile response:', response)
      
      // Double check again before setting user (in case logout happened during API call)
      if (sessionStorage.getItem('justLoggedOut') || isLoggingOut) {
        console.log('✗ Logout detected during checkAuth - not setting user')
        setUser(null)
        setLoading(false)
        return
      }
      
      // Only set user if we got valid data from backend AND no logout flag
      // Check if response.data is not null, not empty string, and has email property
      // Handle both direct user object and wrapped in Map (response.data.user)
      let userData = response.data;
      
      // Handle different response formats
      if (userData && typeof userData === 'object') {
        if (userData.user !== undefined) {
          // If wrapped in Map with 'user' key (e.g., {user: null} or {user: {...}})
          userData = userData.user;
        }
        // If userData is null or doesn't have email, it's not a valid user
        if (!userData || !userData.email) {
          userData = null;
        }
      } else {
        userData = null;
      }
      
      if (userData && typeof userData === 'object' && userData.email) {
        // Final check - make sure we're not in logout state
        if (sessionStorage.getItem('justLoggedOut') || isLoggingOut) {
          console.log('✗ Logout detected after API response - not setting user')
          setUser(null)
          setLoading(false)
          return
        }
        
        console.log('✓ Setting user from BE:', userData.email)
        // CHỈ lưu vào state, KHÔNG lưu vào localStorage
        // User luôn được lấy từ BE, không dùng localStorage
        setUser(userData)
      } else {
        console.log('✗ No user data from backend - clearing')
        console.log('  Response data:', response.data)
        setUser(null)
        // Clear logout flag if backend confirms no user
        sessionStorage.removeItem('justLoggedOut')
      }
    } catch (error) {
      console.log('✗ getProfile error:', error.response?.status, error.message)
      setUser(null)
      // Clear logout flag on error (backend likely has no session)
      sessionStorage.removeItem('justLoggedOut')
    } finally {
      setLoading(false)
      console.log('=== checkAuth() completed ===')
    }
  }

  const login = async (email, password) => {
    try {
      // Clear logout flags BEFORE login to ensure checkAuth can run
      console.log('→ Clearing logout flags before login...')
      sessionStorage.removeItem('justLoggedOut')
      setIsLoggingOut(false)
      console.log('✓ Logout flags cleared')
      
      // Call login API
      const loginResponse = await authApi.login(email, password)
      console.log('✓ Login API successful, response:', loginResponse)
      
      // Try to get user from login response first
      let userFromLogin = null
      if (loginResponse.data) {
        if (loginResponse.data.user) {
          userFromLogin = loginResponse.data.user
        } else if (loginResponse.data.email) {
          // User object is directly in response.data
          userFromLogin = loginResponse.data
        }
      }
      
      if (userFromLogin && userFromLogin.email) {
        console.log('✓ Got user from login response:', userFromLogin.email)
        setUser(userFromLogin)
        // Wait a bit to ensure session is persisted, then verify with checkAuth
        setTimeout(async () => {
          await checkAuth()
        }, 100)
        return { success: true }
      } else {
        console.log('→ No user in login response, calling checkAuth()...')
        // Wait a bit to ensure session is persisted before calling checkAuth
        await new Promise(resolve => setTimeout(resolve, 200))
        await checkAuth()
        return { success: true }
      }
    } catch (error) {
      console.error('✗ Login error:', error)
      
      // Xử lý lỗi từ backend
      let errorMessage = 'Đăng nhập thất bại'
      
      if (error.response) {
        // Backend trả về JSON error
        if (error.response.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data?.error) {
          // Nếu có error field, parse nó
          const backendError = error.response.data.error
          if (backendError.includes('Bad credentials') || backendError.includes('password')) {
            errorMessage = 'Mật khẩu không đúng'
          } else if (backendError.includes('User not found') || backendError.includes('username')) {
            errorMessage = 'Email không tồn tại'
          } else {
            errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu'
          }
        } else if (error.response.status === 401) {
          errorMessage = 'Email hoặc mật khẩu không đúng'
        }
      } else if (error.message) {
        // Network error hoặc lỗi khác
        if (error.message.includes('Network Error')) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại sau'
        }
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }    

  const logout = async () => {
    console.log('=== LOGOUT STARTED ===')
    
    // Set flags FIRST to prevent checkAuth from running
    setIsLoggingOut(true)
    sessionStorage.setItem('justLoggedOut', 'true')
    console.log('✓ Set justLoggedOut flag and isLoggingOut state')
    
    // Clear state immediately to update UI
    setUser(null)
    console.log('✓ Cleared user state')
    
    // Clear ALL localStorage data (không dùng cho user, nhưng clear để đảm bảo)
    localStorage.clear()
    console.log('✓ Cleared localStorage')
    
    try {
      // Call backend logout to invalidate session
      console.log('→ Calling backend logout API...')
      const response = await authApi.logout()
      console.log('✓ Backend logout response:', response)
    } catch (error) {
      console.error('✗ Backend logout error:', error.response?.status, error.message)
      // Continue with logout even if API fails
    }
    
    // Wait a bit to ensure backend processes logout
    console.log('→ Redirecting in 300ms...')
    setTimeout(() => {
      console.log('→ Redirecting now to /iphoneshop/login')
      window.location.replace('/iphoneshop/login')
    }, 300)
  }

  const register = async (data) => {
    try {
      await authApi.register(data)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Đăng ký thất bại' 
      }
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

