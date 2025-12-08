import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderApi } from '../services/api'
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await orderApi.create(formData)
      if (response.data && response.data.status === 'success') {
        // Reload cart to clear items after successful checkout
        await refreshCart()
        navigate('/thank-you')
      } else {
        const errorMsg = response.data?.data || response.data?.message || 'Có lỗi xảy ra khi đặt hàng'
        alert(errorMsg)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      const errorMsg = error.response?.data?.data || error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt hàng'
      alert(errorMsg)
    } finally {
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đặt hàng'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Checkout

