import { useState, useEffect } from 'react'
import { adminContactApi } from '../../services/api'

const AdminContacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [formData, setFormData] = useState({
    tieuDe: '',
    noiDungTraLoi: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filters, setFilters] = useState({
    trangThaiLienHe: '',
    tuNgay: '',
    denNgay: ''
  })

  useEffect(() => {
    loadContacts()
  }, [page, filters])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const response = await adminContactApi.getAll(
        page,
        filters.trangThaiLienHe || '',
        filters.tuNgay || '',
        filters.denNgay || ''
      )
      // Sắp xếp theo ngày liên hệ giảm dần (mới nhất lên trên)
      const sortedContacts = (response.data.content || []).sort((a, b) => {
        const dateA = a.ngayLienHe ? new Date(a.ngayLienHe).getTime() : 0
        const dateB = b.ngayLienHe ? new Date(b.ngayLienHe).getTime() : 0
        return dateB - dateA // Giảm dần
      })
      setContacts(sortedContacts)
      setTotalPages(response.data.totalPages || 1)
    } catch (err) {
      console.error('Error loading contacts:', err)
      setError('Không thể tải danh sách liên hệ')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = (contact) => {
    setSelectedContact(contact)
    setFormData({
      tieuDe: `Re: ${contact.tieuDe || 'Liên hệ từ khách hàng'}`,
      noiDungTraLoi: ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      const response = await adminContactApi.reply({
        id: selectedContact.id,
        diaChiDen: selectedContact.emailLienHe,
        tieuDe: formData.tieuDe,
        noiDungTraLoi: formData.noiDungTraLoi
      })
      
      // Hiển thị thông báo từ server (có thể là cảnh báo nếu email không gửi được)
      if (response.data?.data) {
        setSuccess(response.data.data)
      } else {
        setSuccess('Phản hồi đã được gửi thành công')
      }
      
      setShowModal(false)
      setSelectedContact(null)
      setFormData({ tieuDe: '', noiDungTraLoi: '' })
      loadContacts()
      
      // Tự động ẩn thông báo sau 5 giây
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      const errorMsg = err.response?.data?.errorMessages
      if (errorMsg) {
        setError(Object.values(errorMsg).join(', '))
      } else {
        setError('Có lỗi xảy ra khi gửi phản hồi')
      }
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('vi-VN')
  }

  if (loading && contacts.length === 0) {
    return <div className="p-8 text-center">Đang tải...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Liên Hệ</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-4 gap-4">
        <select
          value={filters.trangThaiLienHe}
          onChange={(e) => setFilters({ ...filters, trangThaiLienHe: e.target.value })}
          className="px-3 py-2 border rounded"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Chưa trả lời">Chưa trả lời</option>
          <option value="Đã trả lời">Đã trả lời</option>
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
          onClick={() => setFilters({ trangThaiLienHe: '', tuNgay: '', denNgay: '' })}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Reset
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày gửi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contact.hoTen || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contact.emailLienHe || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contact.tieuDe || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    contact.trangThai === 'Đã trả lời' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {contact.trangThai}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(contact.ngayLienHe)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleReply(contact)}
                    className="text-blue-600 hover:text-blue-900"
                    disabled={contact.trangThai === 'Đã trả lời'}
                  >
                    {contact.trangThai === 'Đã trả lời' ? 'Đã trả lời' : 'Trả lời'}
                  </button>
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
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold mb-4">Trả Lời Liên Hệ</h2>
            
            {/* Contact Info */}
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <p><strong>Người gửi:</strong> {selectedContact.hoTen || '-'}</p>
              <p><strong>Email:</strong> {selectedContact.emailLienHe || '-'}</p>
              <p><strong>Số điện thoại:</strong> {selectedContact.soDienThoai || '-'}</p>
              <p><strong>Tiêu đề:</strong> {selectedContact.tieuDe || '-'}</p>
              <p><strong>Nội dung:</strong></p>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{selectedContact.noiDungLienHe || '-'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề phản hồi *
                </label>
                <input
                  type="text"
                  value={formData.tieuDe}
                  onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung phản hồi *
                </label>
                <textarea
                  value={formData.noiDungTraLoi}
                  onChange={(e) => setFormData({ ...formData, noiDungTraLoi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="6"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setSelectedContact(null)
                    setFormData({ tieuDe: '', noiDungTraLoi: '' })
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Gửi Phản Hồi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminContacts

