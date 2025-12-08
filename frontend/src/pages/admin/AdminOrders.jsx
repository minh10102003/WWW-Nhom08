import { useState, useEffect } from 'react'
import { adminOrderApi, adminUserApi } from '../../services/api'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [shippers, setShippers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [action, setAction] = useState('') // 'assign', 'complete', 'cancel'
  const [selectedShipper, setSelectedShipper] = useState('')
  const [ghiChu, setGhiChu] = useState('')
  const [filters, setFilters] = useState({
    trangThai: '',
    tuNgay: '',
    denNgay: ''
  })

  useEffect(() => {
    loadShippers()
  }, [])

  useEffect(() => {
    loadOrders()
  }, [page, filters])

  const loadShippers = async () => {
    try {
      const response = await adminUserApi.getAll('ROLE_SHIPPER', 1)
      setShippers(response.data.content || [])
    } catch (err) {
      console.error('Error loading shippers:', err)
    }
  }

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await adminOrderApi.getAll(
        page,
        filters.trangThai,
        filters.tuNgay,
        filters.denNgay
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

  const handleAssign = (order) => {
    setSelectedOrder(order)
    setAction('assign')
    setShowModal(true)
  }

  const handleComplete = (order) => {
    setSelectedOrder(order)
    setAction('complete')
    setGhiChu('')
    setShowModal(true)
  }

  const handleCancel = (order) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return
    adminOrderApi.cancel(order.id).then(() => loadOrders())
  }

  const handleSubmit = async () => {
    try {
      if (action === 'assign') {
        await adminOrderApi.assign(selectedOrder.id, selectedShipper)
      } else if (action === 'complete') {
        await adminOrderApi.update(selectedOrder.id, ghiChu)
      }
      setShowModal(false)
      setSelectedOrder(null)
      setAction('')
      loadOrders()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('vi-VN')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
  }

  if (loading && orders.length === 0) {
    return <div className="p-8 text-center">Đang tải...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Đơn Hàng</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-4 gap-4">
        <select
          value={filters.trangThai}
          onChange={(e) => setFilters({ ...filters, trangThai: e.target.value })}
          className="px-3 py-2 border rounded"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đang chờ giao">Đang chờ giao</option>
          <option value="Đang giao">Đang giao</option>
          <option value="Chờ duyệt">Chờ duyệt</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Đã bị hủy">Đã bị hủy</option>
        </select>
        <input
          type="date"
          value={filters.tuNgay}
          onChange={(e) => setFilters({ ...filters, tuNgay: e.target.value })}
          className="px-3 py-2 border rounded"
          placeholder="Từ ngày"
        />
        <input
          type="date"
          value={filters.denNgay}
          onChange={(e) => setFilters({ ...filters, denNgay: e.target.value })}
          className="px-3 py-2 border rounded"
          placeholder="Đến ngày"
        />
        <button
          onClick={() => setFilters({ trangThai: '', tuNgay: '', denNgay: '' })}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Reset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người nhận</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.hoTenNguoiNhan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(order.tongGiaTri)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.trangThaiDonHang === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                    order.trangThaiDonHang === 'Đã bị hủy' ? 'bg-red-100 text-red-800' :
                    order.trangThaiDonHang === 'Đang giao' ? 'bg-blue-100 text-blue-800' :
                    order.trangThaiDonHang === 'Chờ duyệt' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.trangThaiDonHang}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(order.ngayDatHang)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {order.trangThaiDonHang === 'Đang chờ giao' && (
                    <button
                      onClick={() => handleAssign(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Phân công
                    </button>
                  )}
                  {order.trangThaiDonHang === 'Chờ duyệt' && (
                    <button
                      onClick={() => handleComplete(order)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Xác nhận hoàn thành
                    </button>
                  )}
                  {(order.trangThaiDonHang === 'Đang chờ giao') && (
                    <button
                      onClick={() => handleCancel(order)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hủy
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {action === 'assign' ? 'Phân Công Shipper' : 'Xác Nhận Hoàn Thành Đơn Hàng'}
            </h2>
            {action === 'assign' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn Shipper
                </label>
                <select
                  value={selectedShipper}
                  onChange={(e) => setSelectedShipper(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                  required
                >
                  <option value="">Chọn shipper</option>
                  {shippers.map(shipper => (
                    <option key={shipper.id} value={shipper.email}>
                      {shipper.hoTen} ({shipper.email})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  value={ghiChu}
                  onChange={(e) => setGhiChu(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                  rows="3"
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedOrder(null)
                  setAction('')
                }}
                className="px-4 py-2 border rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={action === 'assign' && !selectedShipper}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders

