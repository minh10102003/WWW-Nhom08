import { useState, useEffect } from 'react'
import { adminUserApi } from '../../services/api'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const roles = [
    { tenVaiTro: 'ROLE_MEMBER' },
    { tenVaiTro: 'ROLE_ADMIN' },
    { tenVaiTro: 'ROLE_SHIPPER' }
    // { tenvaiTro: "ROLE_USER"}
  ]
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    password: '',
    confirmPassword: '',
    diaChi: '',
    sdt: '',
    tenVaiTro: []
  })
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState('ROLE_MEMBER')

  useEffect(() => {
    loadUsers()
  }, [page, selectedRole])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminUserApi.getAll(selectedRole, page)
      // Sắp xếp theo ID giảm dần (mới nhất lên trên - ID lớn hơn = mới hơn)
      const sortedUsers = (response.data.content || []).sort((a, b) => {
        return (b.id || 0) - (a.id || 0) // Giảm dần
      })
      setUsers(sortedUsers)
      setTotalPages(response.data.totalPages || 1)
    } catch (err) {
      console.error('Error loading users:', err)
      setError('Không thể tải danh sách tài khoản')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp')
      return
    }
    
    if (!formData.tenVaiTro || formData.tenVaiTro.length === 0) {
      setError('Vui lòng chọn ít nhất một vai trò')
      return
    }
    
    try {
      // Gửi danh sách vai trò dưới dạng danhSachVaiTro, không gửi tenVaiTro
      const submitData = {
        hoTen: formData.hoTen,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        diaChi: formData.diaChi,
        sdt: formData.sdt,
        danhSachVaiTro: formData.tenVaiTro
      }
      await adminUserApi.save(submitData)
      setShowModal(false)
      setFormData({
        hoTen: '',
        email: '',
        password: '',
        confirmPassword: '',
        diaChi: '',
        sdt: '',
        tenVaiTro: []
      })
      loadUsers()
    } catch (err) {
      const errorMsg = err.response?.data?.errorMessages
      if (errorMsg) {
        setError(Object.values(errorMsg).join(', '))
      } else {
        setError('Có lỗi xảy ra')
      }
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return
    
    try {
      await adminUserApi.delete(id)
      loadUsers()
    } catch (err) {
      setError('Không thể xóa tài khoản')
    }
  }

  const handleAdd = () => {
    setFormData({
      hoTen: '',
      email: '',
      password: '',
      confirmPassword: '',
      diaChi: '',
      sdt: '',
      tenVaiTro: []
    })
    setShowModal(true)
  }

  const handleRoleChange = (roleName) => {
    setFormData(prev => {
      const currentRoles = prev.tenVaiTro || []
      if (currentRoles.includes(roleName)) {
        return { ...prev, tenVaiTro: currentRoles.filter(r => r !== roleName) }
      } else {
        return { ...prev, tenVaiTro: [...currentRoles, roleName] }
      }
    })
  }

  const getRoleName = (vaiTro) => {
    if (!vaiTro || !Array.isArray(vaiTro)) return '-'
    return vaiTro.map(vt => vt.tenVaiTro || vt).join(', ')
  }

  if (loading && users.length === 0) {
    return <div className="p-8 text-center">Đang tải...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Tài Khoản</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Thêm Tài Khoản
        </button>
      </div>

      {/* Filter by Role */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lọc theo vai trò:
        </label>
        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value)
            setPage(1)
          }}
          className="px-3 py-2 border rounded"
        >
          {roles.map(role => (
            <option key={role.tenVaiTro} value={role.tenVaiTro}>
              {role.tenVaiTro}
            </option>
          ))}
        </select>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.hoTen || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.soDienThoai || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.diaChi || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{getRoleName(user.vaiTro)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(user.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
            <h2 className="text-xl font-bold mb-4">Thêm Tài Khoản</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ Tên *
                </label>
                <input
                  type="text"
                  value={formData.hoTen}
                  onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="text"
                  value={formData.sdt}
                  onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  value={formData.diaChi}
                  onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò * (có thể chọn nhiều)
                </label>
                <div className="space-y-2 border border-gray-300 rounded-md p-3">
                  {roles.map(role => (
                    <label key={role.tenVaiTro} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.tenVaiTro?.includes(role.tenVaiTro) || false}
                        onChange={() => handleRoleChange(role.tenVaiTro)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{role.tenVaiTro}</span>
                    </label>
                  ))}
                </div>
                {formData.tenVaiTro?.length === 0 && (
                  <p className="text-red-500 text-xs mt-1">Vui lòng chọn ít nhất một vai trò</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormData({
                      hoTen: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                      diaChi: '',
                      sdt: '',
                      tenVaiTro: []
                    })
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers

