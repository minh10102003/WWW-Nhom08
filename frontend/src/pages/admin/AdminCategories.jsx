import { useState, useEffect } from 'react'
import { adminCategoryApi } from '../../services/api'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ tenDanhMuc: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    loadCategories()
  }, [page])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await adminCategoryApi.getAll(page)
      // Sắp xếp theo ID giảm dần (mới nhất lên trên - ID lớn hơn = mới hơn)
      const sortedCategories = (response.data.content || []).sort((a, b) => {
        return (b.id || 0) - (a.id || 0) // Giảm dần
      })
      setCategories(sortedCategories)
      setTotalPages(response.data.totalPages || 1)
    } catch (err) {
      console.error('Error loading categories:', err)
      setError('Không thể tải danh sách danh mục')
    } finally {
      setLoading(false)
    }
  }
  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setError('')
  //
  //   try {
  //     if (editingCategory) {
  //       await adminCategoryApi.update({ ...editingCategory, ...formData })
  //     } else {
  //       await adminCategoryApi.save(formData)
  //     }
  //     setShowModal(false)
  //   } catch (err) {
  //     setError(err.response?.data?.errorMessages || 'Có lỗi xảy ra')
  //   }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      if (editingCategory) {
        await adminCategoryApi.update({ ...editingCategory, ...formData })
      } else {
        await adminCategoryApi.save(formData)
      }
      setShowModal(false)
      setFormData({ tenDanhMuc: '' })
      setEditingCategory(null)
      loadCategories()
    } catch (err) {
      setError(err.response?.data?.errorMessages || 'Có lỗi xảy ra')
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({ tenDanhMuc: category.tenDanhMuc || '' })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return
    
    try {
      await adminCategoryApi.delete(id)
      loadCategories()
    } catch (err) {
      setError('Không thể xóa danh mục')
    }
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setFormData({ tenDanhMuc: '' })
    setShowModal(true)
  }

  if (loading && categories.length === 0) {
    return <div className="p-8 text-center">Đang tải...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Danh Mục</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Thêm Danh Mục
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Danh Mục</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.tenDanhMuc}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 py-2">
            Trang {page} / {totalPages}
          </span>
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
              {editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Danh Mục
                </label>
                <input
                  type="text"
                  value={formData.tenDanhMuc}
                  onChange={(e) => setFormData({ ...formData, tenDanhMuc: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingCategory(null)
                    setFormData({ tenDanhMuc: '' })
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingCategory ? 'Cập Nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories

