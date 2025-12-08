import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cartApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getPlaceholderImage, getProductImageUrl } from '../utils/imageUtils'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [quantities, setQuantities] = useState({})
  const [loading, setLoading] = useState(true)
  const { updateCart, removeFromCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [user])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await cartApi.getItems()
      if (response.data && response.data.items) {
        setCartItems(response.data.items)
        setQuantities(response.data.quantities || {})
      } else {
        setCartItems([])
        setQuantities({})
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      setCartItems([])
      setQuantities({})
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (productId, newQuantity) => {
    const result = await updateCart(productId.toString(), newQuantity)
    if (result.success) {
      // Reload cart to get updated quantities
      await fetchCart()
    }
  }

  const handleRemove = async (productId) => {
    const result = await removeFromCart(productId.toString())
    if (result.success) {
      // Reload cart to get updated items
      await fetchCart()
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const total = cartItems.reduce((sum, item) => {
    const qty = parseInt(quantities[item.id] || 1)
    return sum + (item.donGia * qty)
  }, 0)

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Đang tải...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
          <Link
            to="/store"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                  <img
                    src={getProductImageUrl(item)}
                    alt={item.tenSanPham}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      e.target.src = getPlaceholderImage(100, 100, 'No Image')
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.tenSanPham}</h3>
                    <p className="text-primary font-bold">{formatPrice(item.donGia)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, Math.max(1, parseInt(quantities[item.id] || 1) - 1))}
                      className="px-3 py-1 border rounded"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{quantities[item.id] || 1}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, parseInt(quantities[item.id] || 1) + 1)}
                      className="px-3 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Tổng thanh toán</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

