import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { orderApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user, navigate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderApi.getUserOrders()
      if (response.data) {
        // Sort orders by date (newest first)
        const sortedOrders = [...response.data].sort((a, b) => {
          const dateA = new Date(a.ngayDatHang || 0)
          const dateB = new Date(b.ngayDatHang || 0)
          return dateB - dateA
        })
        setOrders(sortedOrders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang chờ giao':
        return 'bg-yellow-100 text-yellow-800'
      case 'Đang giao':
        return 'bg-blue-100 text-blue-800'
      case 'Chờ duyệt':
        return 'bg-purple-100 text-purple-800'
      case 'Hoàn thành':
        return 'bg-green-100 text-green-800'
      case 'Đã bị hủy':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/account"
            className="text-primary hover:underline mb-4 inline-block"
          >
            ← Quay lại tài khoản
          </Link>
          <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!
            </p>
            <Link
              to="/store"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Đơn hàng #{order.id}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Ngày đặt: {formatDate(order.ngayDatHang)}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.daThanhToan ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.daThanhToan ? '✓ Đã thanh toán' : '✗ Chưa thanh toán'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.phuongThucThanhToan === 'online' ? 'Thanh toán online (VNPay)' : 'Thanh toán khi nhận hàng (COD)'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.trangThaiDonHang
                      )}`}
                    >
                      {order.trangThaiDonHang}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(order.tongGiaTri || 0)}
                    </span>
                  </div>
                  {order.diaChiNhan && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Địa chỉ giao hàng:</strong> {order.diaChiNhan}
                    </div>
                  )}
                  {order.sdtNhanHang && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>SĐT nhận hàng:</strong> {order.sdtNhanHang}
                    </div>
                  )}
                  {order.hoTenNguoiNhan && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Người nhận:</strong> {order.hoTenNguoiNhan}
                    </div>
                  )}
                  {order.ghiChu && (
                    <div className="text-sm text-gray-600">
                      <strong>Ghi chú:</strong> {order.ghiChu}
                    </div>
                  )}
                </div>

                {order.danhSachChiTiet && order.danhSachChiTiet.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold mb-2">Sản phẩm:</h4>
                    <div className="space-y-2">
                      {order.danhSachChiTiet.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm text-gray-600"
                        >
                          <span>
                            {item.sanPham?.tenSanPham || 'Sản phẩm'} x{' '}
                            {item.soLuongDat || 0}
                          </span>
                          <span>{formatPrice(item.donGia || 0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders

