import { createContext, useState, useContext, useEffect } from 'react'
import { cartApi } from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Always fetch cart, regardless of user status (handles both logged in and anonymous)
    fetchCart()
  }, [user])

  const fetchCart = async () => {
    try {
      const response = await cartApi.getItems()
      if (response.data && response.data.items) {
        setCart(response.data.items)
        // Calculate total quantity from quantities map, not just item count
        const quantities = response.data.quantities || {}
        let totalCount = 0
        Object.values(quantities).forEach(qty => {
          totalCount += parseInt(qty) || 1
        })
        // If no quantities map, use item count as fallback
        setCartCount(totalCount > 0 ? totalCount : response.data.items.length)
      } else {
        setCart([])
        setCartCount(0)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCart([])
      setCartCount(0)
    }
  }

  const addToCart = async (id) => {
    try {
      const response = await cartApi.addToCart(id)
      if (response.data && response.data.status === 'success') {
        // Reload cart to get updated items and count
        // Use a small delay to ensure backend has processed the cookie/DB update
        await new Promise(resolve => setTimeout(resolve, 200))
        await fetchCart()
        return { success: true }
      }
      return { success: false, error: 'Sản phẩm đã hết hàng' }
    } catch (error) {
      console.error('Add to cart error:', error)
      // Even if API fails, try to reload cart in case it was added (e.g., cookie was set)
      try {
        await new Promise(resolve => setTimeout(resolve, 200))
        await fetchCart()
      } catch (fetchError) {
        console.error('Error reloading cart after add:', fetchError)
      }
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Thêm vào giỏ hàng thất bại' 
      }
    }
  }

  const updateCart = async (id, quantity) => {
    try {
      const response = await cartApi.updateQuantity(id, quantity)
      if (response.data.status === 'success') {
        return { success: true }
      }
      return { success: false }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Cập nhật giỏ hàng thất bại' 
      }
    }
  }

  const removeFromCart = async (id) => {
    try {
      const response = await cartApi.removeFromCart(id)
      if (response.data.status === 'success') {
        // Reload cart to get updated items and count
        await fetchCart()
        return { success: true }
      }
      return { success: false }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Xóa khỏi giỏ hàng thất bại' 
      }
    }
  }

  const value = {
    cart,
    cartCount,
    loading,
    addToCart,
    updateCart,
    removeFromCart,
    refreshCart: fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

