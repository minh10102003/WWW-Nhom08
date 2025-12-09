import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderApi, vnpayApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Checkout = () => {
  const [formData, setFormData] = useState({
    hoTen: '',
    soDienThoai: '',
    diaChi: '',
    ghiChu: '',
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { refreshCart } = useCart()
  const navigate = useNavigate()
  
  // Kiểm tra nếu có sản phẩm "mua ngay" khi component mount
  useEffect(() => {
    const buyNowProduct = localStorage.getItem('buyNowProduct')
    if (buyNowProduct) {
      // Có sản phẩm "mua ngay", giữ lại để dùng khi tạo đơn hàng
      console.log('Checkout với sản phẩm "mua ngay"')
    } else {
      // Không có buyNowProduct, nghĩa là checkout từ cart
      console.log('Checkout từ giỏ hàng')
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e, method) => {
    e.preventDefault()
    
    // Tránh bấm nhiều lần
    if (loading) {
      return
    }
    
    setLoading(true)

    try {
      // Kiểm tra nếu có sản phẩm "mua ngay"
      const buyNowProduct = localStorage.getItem('buyNowProduct')
      let orderData = {
        ...formData,
        paymentMethod: method
      }
      
      // Nếu có sản phẩm "mua ngay", thêm thông tin vào orderData
      if (buyNowProduct) {
        try {
          const buyNowInfo = JSON.parse(buyNowProduct)
          orderData.buyNowProductId = buyNowInfo.productId
          orderData.buyNowQuantity = buyNowInfo.quantity
        } catch (e) {
          console.error('Error parsing buyNowProduct:', e)
        }
      }
      
      const response = await orderApi.create(orderData)
      
      // Xóa thông tin "mua ngay" sau khi tạo đơn hàng thành công
      if (buyNowProduct) {
        localStorage.removeItem('buyNowProduct')
      }
      if (response.data && response.data.status === 'success') {
        const order = response.data.data
        
        // Nếu thanh toán online, chuyển đến VNPay
        if (method === 'online') {
          try {
            const vnpayResponse = await vnpayApi.createPayment(
              order.tongGiaTri,
              order.id,
              '', // bankCode - để trống để chọn tất cả
              'vn' // language
            )
            
            if (vnpayResponse.data && vnpayResponse.data.code === '00') {
              // Chuyển hướng đến trang thanh toán VNPay
              // Không set loading = false vì đang chuyển trang
              window.location.href = vnpayResponse.data.data
            } else {
              alert('Không thể tạo link thanh toán. Vui lòng thử lại.')
              setLoading(false)
            }
          } catch (vnpayError) {
            console.error('VNPay error:', vnpayError)
            alert('Lỗi khi tạo link thanh toán VNPay: ' + (vnpayError.response?.data?.message || vnpayError.message))
            setLoading(false)
          }
        } else {
          // Thanh toán COD - xóa cart và chuyển đến trang cảm ơn
          await refreshCart()
          navigate('/thank-you')
        }
      } else {
        const errorMsg = response.data?.data || response.data?.message || 'Có lỗi xảy ra khi đặt hàng'
        alert(errorMsg)
        setLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      const errorMsg = error.response?.data?.data || error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt hàng'
      alert(errorMsg)
      setLoading(false)
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
        
        <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow-md p-8">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Họ tên *</label>
            <input
              type="text"
              name="hoTen"
              value={formData.hoTen}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Số điện thoại *</label>
            <input
              type="tel"
              name="soDienThoai"
              value={formData.soDienThoai}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Địa chỉ *</label>
            <textarea
              name="diaChi"
              value={formData.diaChi}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Ghi chú</label>
            <textarea
              name="ghiChu"
              value={formData.ghiChu}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Nút thanh toán */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'cod')}
              disabled={loading}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
            
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'online')}
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Thanh toán online'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout

