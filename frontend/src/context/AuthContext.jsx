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

  // Sử dụng BroadcastChannel để share logout state giữa các tab
  useEffect(() => {
    const channel = new BroadcastChannel('auth-channel')
    
    channel.onmessage = (event) => {
      if (event.data.type === 'logout') {
        console.log('✓ Received logout event from another tab')
        setUser(null)
        setIsLoggingOut(true)
        sessionStorage.setItem('justLoggedOut', 'true')
        // QUAN TRỌNG: Set flag thành 'false' để tab này biết đã logout
        localStorage.setItem('userLoggedIn', 'false')
        console.log('✓ Set logout flags in this tab from broadcast')
        // Redirect to login page - sử dụng absolute URL để đảm bảo redirect đến frontend dev server
        const currentOrigin = window.location.origin
        window.location.replace(`${currentOrigin}/iphoneshop/login`)
      }
    }
    
    return () => {
      channel.close()
    }
  }, [])

  useEffect(() => {
    console.log('=== AuthProvider useEffect ===')
    
    // Check logout state từ cả sessionStorage và localStorage
    const justLoggedOut = sessionStorage.getItem('justLoggedOut')
    const userLoggedInFlag = localStorage.getItem('userLoggedIn')
    console.log('justLoggedOut (sessionStorage):', justLoggedOut)
    console.log('userLoggedIn (localStorage):', userLoggedInFlag)
    
    // CHỈ skip checkAuth nếu CẢ HAI điều kiện:
    // 1. Có justLoggedOut flag trong sessionStorage (logout vừa xảy ra trong session này)
    // 2. HOẶC userLoggedIn flag là 'false' (đã logout từ tab khác hoặc session trước)
    // NHƯNG: Nếu flag là null (chưa được set), thì cho phép checkAuth để xác định trạng thái thực tế
    if (justLoggedOut === 'true' || userLoggedInFlag === 'false') {
      console.log('✓ Detected logout state - skipping checkAuth initially')
      setUser(null)
      setLoading(false)
      
      // Verify backend has no user, then clear flag
      // CHỈ verify nếu thực sự có flag logout, không verify nếu flag là null
      if (justLoggedOut === 'true' || userLoggedInFlag === 'false') {
        verifyLogoutAndClearFlag()
      }
      return
    }
    
    // Nếu không có flag logout, hoặc flag là null/undefined, gọi checkAuth để xác định trạng thái
    console.log('→ No logout flag detected - calling checkAuth()...')
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const verifyLogoutAndClearFlag = async () => {
    try {
      // Wait a bit for backend to process logout
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // QUAN TRỌNG: Kiểm tra flag TRƯỚC KHI verify
      // Nếu flag là 'false', KHÔNG BAO GIỜ set user lại, ngay cả khi backend vẫn trả về user
      const currentFlag = localStorage.getItem('userLoggedIn')
      if (currentFlag === 'true') {
        console.log('✓ User logged in during verify - skipping logout verification')
        sessionStorage.removeItem('justLoggedOut')
        return
      }
      
      // Nếu flag là 'false', đảm bảo user vẫn là null và không set lại
      if (currentFlag === 'false') {
        console.log('✓ Logout flag is false - ensuring user is null and not setting user back')
        setUser(null)
        sessionStorage.removeItem('justLoggedOut')
        // Giữ localStorage flag = 'false'
        localStorage.setItem('userLoggedIn', 'false')
        return // QUAN TRỌNG: Return ngay, không gọi API
      }
      
      // Chỉ verify nếu flag là null (chưa được set)
      // Try to get profile - should return null after logout
      const response = await authApi.getProfile()
      console.log('Verify logout - getProfile response:', response)
      
      // Backend có thể trả về {user: null} hoặc null hoặc user object
      let userData = response.data
      
      // Handle different response formats
      if (userData && typeof userData === 'object') {
        if (userData.user !== undefined) {
          // If wrapped in Map with 'user' key (e.g., {user: null} or {user: {...}})
          userData = userData.user
        }
      }
      
      // Nếu không có user (null hoặc {user: null}), xác nhận đã logout
      if (!userData || (typeof userData === 'object' && !userData.email)) {
        console.log('✓ Backend confirmed logout - clearing sessionStorage flag, keeping localStorage flag')
        sessionStorage.removeItem('justLoggedOut')
        // Giữ localStorage flag = 'false' để các tab khác biết đã logout
        localStorage.setItem('userLoggedIn', 'false')
        // Đảm bảo user là null
        setUser(null)
      } else {
        // Nếu backend vẫn có user, nhưng flag là 'false', KHÔNG set user lại
        // Có thể backend chưa kịp invalidate session, nhưng frontend đã logout
        console.log('⚠️ Backend still has user but logout flag is set - NOT setting user back')
        sessionStorage.removeItem('justLoggedOut')
        localStorage.setItem('userLoggedIn', 'false')
        setUser(null) // Đảm bảo user vẫn là null
      }
    } catch (error) {
      console.log('✓ Backend error (expected after logout) - keeping logout flag')
      // Giữ flag để đảm bảo các tab khác cũng biết đã logout
      // CHỈ set nếu chưa có flag hoặc flag là 'false'
      const currentFlag = localStorage.getItem('userLoggedIn')
      if (currentFlag !== 'true') {
        localStorage.setItem('userLoggedIn', 'false')
      }
      // Đảm bảo user là null
      setUser(null)
    }
  }

  const checkAuth = async () => {
    // Double check - if we just logged out, don't check auth
    const justLoggedOut = sessionStorage.getItem('justLoggedOut')
    const userLoggedInFlag = localStorage.getItem('userLoggedIn')
    
    // CHỈ skip nếu có justLoggedOut flag HOẶC flag là 'false'
    // Nếu flag là null (chưa được set), cho phép checkAuth để xác định trạng thái
    if ((justLoggedOut === 'true' || userLoggedInFlag === 'false') || isLoggingOut) {
      console.log('✗ checkAuth: justLoggedOut or isLoggingOut detected - skipping')
      console.log('  - justLoggedOut:', justLoggedOut)
      console.log('  - userLoggedInFlag:', userLoggedInFlag)
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
      const stillJustLoggedOut = sessionStorage.getItem('justLoggedOut')
      const stillUserLoggedInFlag = localStorage.getItem('userLoggedIn')
      if ((stillJustLoggedOut === 'true' || stillUserLoggedInFlag === 'false') || isLoggingOut) {
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
        const finalJustLoggedOut = sessionStorage.getItem('justLoggedOut')
        const finalUserLoggedInFlag = localStorage.getItem('userLoggedIn')
        if ((finalJustLoggedOut === 'true' || finalUserLoggedInFlag === 'false') || isLoggingOut) {
          console.log('✗ Logout detected after API response - not setting user')
          setUser(null)
          setLoading(false)
          return
        }
        
        console.log('✓ Setting user from BE:', userData.email)
        // CHỈ lưu vào state, KHÔNG lưu vào localStorage
        // User luôn được lấy từ BE, không dùng localStorage
        setUser(userData)
        // Set flag để biết user đã login (dùng để check logout state)
        // QUAN TRỌNG: Set flag SAU KHI đã verify không có logout flag
        localStorage.setItem('userLoggedIn', 'true')
        console.log('✓ Set userLoggedIn flag to true')
      } else {
        console.log('✗ No user data from backend - clearing')
        console.log('  Response data:', response.data)
        setUser(null)
        // Clear logout flag if backend confirms no user
        sessionStorage.removeItem('justLoggedOut')
        // Set localStorage flag to false to indicate logged out state
        // CHỈ set nếu chưa có flag hoặc flag không phải 'true'
        const currentFlag = localStorage.getItem('userLoggedIn')
        if (currentFlag !== 'true') {
          localStorage.setItem('userLoggedIn', 'false')
        }
      }
    } catch (error) {
      console.log('✗ getProfile error:', error.response?.status, error.message)
      setUser(null)
      // Clear logout flag on error (backend likely has no session)
      sessionStorage.removeItem('justLoggedOut')
      // Set localStorage flag to false to indicate logged out state
      // CHỈ set nếu chưa có flag hoặc flag không phải 'true'
      const currentFlag = localStorage.getItem('userLoggedIn')
      if (currentFlag !== 'true') {
        localStorage.setItem('userLoggedIn', 'false')
      }
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
      // KHÔNG remove userLoggedIn flag ngay, sẽ set thành 'true' sau khi login thành công
      console.log('✓ Logout flags cleared')
      
      // Call login API
      const loginResponse = await authApi.login(email, password)
      console.log('✓ Login API successful, response:', loginResponse)
      
      // Set flag thành 'true' NGAY SAU KHI login thành công để tránh race condition
      localStorage.setItem('userLoggedIn', 'true')
      console.log('✓ Set userLoggedIn flag to true')
      
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
    
    // QUAN TRỌNG: Set flags và clear user TRƯỚC TIÊN để ngăn mọi thứ khác set user lại
    setIsLoggingOut(true)
    sessionStorage.setItem('justLoggedOut', 'true')
    // QUAN TRỌNG: Set flag thành 'false' TRƯỚC KHI broadcast để các tab khác nhận được flag đúng
    localStorage.setItem('userLoggedIn', 'false')
    console.log('✓ Set justLoggedOut flag and isLoggingOut state')
    console.log('✓ Set userLoggedIn flag to false in localStorage')
    
    // Clear state immediately to update UI - QUAN TRỌNG: Phải clear TRƯỚC
    setUser(null)
    console.log('✓ Cleared user state')
    
    // Broadcast logout event to other tabs
    try {
      const channel = new BroadcastChannel('auth-channel')
      channel.postMessage({ type: 'logout' })
      // Đợi một chút để đảm bảo message được gửi
      await new Promise(resolve => setTimeout(resolve, 100))
      channel.close()
      console.log('✓ Broadcasted logout event to other tabs')
    } catch (e) {
      console.warn('Could not broadcast logout event:', e)
    }
    
    try {
      // Call backend logout to invalidate session and clear cart
      console.log('→ Calling backend logout API...')
      const response = await authApi.logout()
      console.log('✓ Backend logout response:', response)
    } catch (error) {
      console.error('✗ Backend logout error:', error.response?.status, error.message)
      // Continue with logout even if API fails
    }
    
    // Đảm bảo user vẫn là null sau khi logout (phòng trường hợp có race condition)
    setUser(null)
    localStorage.setItem('userLoggedIn', 'false')
    
    // Wait a bit to ensure backend processes logout and clears cart
    console.log('→ Redirecting in 300ms...')
    setTimeout(() => {
      console.log('→ Redirecting now to /iphoneshop/login')
      // Sử dụng absolute URL để đảm bảo redirect đến frontend dev server
      const currentOrigin = window.location.origin
      window.location.replace(`${currentOrigin}/iphoneshop/login`)
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

