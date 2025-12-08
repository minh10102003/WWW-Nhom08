import { useState, useEffect } from 'react'
import { shipperOrderApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const ShipperOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [ghiChu, setGhiChu] = useState('')
  const [quantities, setQuantities] = useState({})
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    trangThai: '',
    tuNgay: '',
    denNgay: ''
  })

  useEffect(() => {
    if (user && user.id) {
      loadOrders()
    }
  }, [page, filters, user])

  const loadOrders = async () => {
    if (!user || !user.id) return
    
    try {
      setLoading(true)
      const response = await shipperOrderApi.getAll(
        page,
        filters.trangThai,
        filters.tuNgay,
        filters.denNgay,
        user.id
      )
      // Sắp xếp theo ngày đặt hàng giảm dần (mới nhất lên trên)
      // Nếu ngày giống nhau, sắp xếp theo ID giảm dần
      const sortedOrders = (response.data.content || []).sort((a, b) => {
        const dateA = a.ngayDatHang ? new Date(a.ngayDatHang).getTime() : 0
        const dateB = b.ngayDatHang ? new Date(b.ngayDatHang).getTime() : 0
        
        // Nếu ngày khác nhau, sắp xếp theo ngày
        if (dateA !== dateB) {
          return dateB - dateA // Giảm dần (mới nhất trước)
        }
        
        // Nếu ngày giống nhau, sắp xếp theo ID giảm dần
        return (b.id || 0) - (a.id || 0)
      })
      setOrders(sortedOrders)
      setTotalPages(response.data.totalPages || 1)
    } catch (err) {
      console.error('Error loading orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelivery = (order) => {
    setSelectedOrder(order)
    setGhiChu('')
    // Initialize quantities with current order details
    const initQuantities = {}
    if (order.danhSachChiTiet) {
      order.danhSachChiTiet.forEach(ct => {
        initQuantities[ct.id] = ct.soLuongDat || 0
      })
    }
    setQuantities(initQuantities)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!selectedOrder) return

    try {
      // Prepare update data
      const updateData = {
        idDonHang: selectedOrder.id,
        ghiChuShipper: ghiChu,
        danhSachCapNhatChiTietDon: selectedOrder.danhSachChiTiet?.map(ct => ({
          idChiTiet: ct.id,
          soLuongNhanHang: quantities[ct.id] || ct.soLuongDat || 0
        })) || []
      }

      await shipperOrderApi.update(updateData)
      setShowModal(false)
      setSelectedOrder(null)
      setGhiChu('')
      setQuantities({})
      loadOrders()
      alert('Xác nhận đã giao hàng thành công!')
    } catch (err) {
      console.error('Error:', err)
      alert('Có lỗi xảy ra khi xác nhận đơn hàng')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('vi-VN')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
  }

  if (!user) {
    return <div className="p-8 text-center">Vui lòng đăng nhập</div>
  }

  if (loading && orders.length === 0) {
    return <div className="p-8 text-center">Đang tải...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản Lý Đơn Hàng</h1>
        <p className="text-gray-600">Theo dõi và cập nhật trạng thái giao hàng</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow-lg mb-6 grid grid-cols-4 gap-4">
        <select
          value={filters.trangThai}
          onChange={(e) => setFilters({ ...filters, trangThai: e.target.value })}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đang giao">Đang giao</option>
          <option value="Chờ duyệt">Chờ duyệt</option>
        </select>
        <input
          type="date"
          value={filters.tuNgay}
          onChange={(e) => setFilters({ ...filters, tuNgay: e.target.value })}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          placeholder="Từ ngày"
        />
        <input
          type="date"
          value={filters.denNgay}
          onChange={(e) => setFilters({ ...filters, denNgay: e.target.value })}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          placeholder="Đến ngày"
        />
        <button
          onClick={() => setFilters({ trangThai: '', tuNgay: '', denNgay: '' })}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
        >
          Reset
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {orders.length === 0 && !loading ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-lg">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Người nhận</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Địa chỉ</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ngày giao</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.hoTenNguoiNhan}</div>
                      <div className="text-sm text-gray-500">{order.sdtNhanHang}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">{order.diaChiNhan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{formatPrice(order.tongGiaTri)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      order.trangThaiDonHang === 'Chờ duyệt' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                      order.trangThaiDonHang === 'Đang giao' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {order.trangThaiDonHang}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.ngayGiaoHang)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.trangThaiDonHang === 'Đang giao' && (
                      <button
                        onClick={() => handleConfirmDelivery(order)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Xác nhận đã giao
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 py-2">Trang {page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal Xác nhận đã giao */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Xác Nhận Đã Giao Hàng
              </h2>
            </div>
            <div className="p-6">
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Thông tin đơn hàng #{selectedOrder.id}
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong className="text-gray-700">Người nhận:</strong> <span className="text-gray-900">{selectedOrder.hoTenNguoiNhan}</span></p>
                <p><strong className="text-gray-700">Địa chỉ:</strong> <span className="text-gray-900">{selectedOrder.diaChiNhan}</span></p>
                <p><strong className="text-gray-700">SĐT:</strong> <span className="text-gray-900">{selectedOrder.sdtNhanHang}</span></p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Chi tiết sản phẩm
              </h3>
              <div className="space-y-3">
                {selectedOrder.danhSachChiTiet?.map((ct) => (
                  <div key={ct.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{ct.sanPham?.tenSanPham || 'N/A'}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Số lượng đặt: <span className="font-semibold">{ct.soLuongDat || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700">Số lượng nhận:</label>
                      <input
                        type="number"
                        min="0"
                        max={ct.soLuongDat || 0}
                        value={quantities[ct.id] || ct.soLuongDat || 0}
                        onChange={(e) => setQuantities({
                          ...quantities,
                          [ct.id]: parseInt(e.target.value) || 0
                        })}
                        className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                rows="3"
                placeholder="Nhập ghi chú về việc giao hàng..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedOrder(null)
                  setGhiChu('')
                  setQuantities({})
                }}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Xác nhận đã giao
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShipperOrders

