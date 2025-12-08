import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/api'

const Account = () => {
  const { user, checkAuth } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('info')
  const [formData, setFormData] = useState({
    hoTen: '',
    soDienThoai: '',
    diaChi: '',
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    setFormData({
      hoTen: user.hoTen || '',
      soDienThoai: user.soDienThoai || '',
      diaChi: user.diaChi || '',
    })
  }, [user, navigate])

  const handleUpdateInfo = async (e) => {
    e.preventDefault()
    try {
      await authApi.updateProfile(formData)
      await checkAuth()
      alert('Cập nhật thông tin thành công!')
    } catch (error) {
      alert('Có lỗi xảy ra')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp')
      return
    }
    try {
      await authApi.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
      alert('Đổi mật khẩu thành công!')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      alert('Có lỗi xảy ra')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Tài khoản</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64">
            <div className="bg-white rounded-lg shadow-md p-4">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full text-left p-3 rounded ${activeTab === 'info' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full text-left p-3 rounded ${activeTab === 'password' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              >
                Đổi mật khẩu
              </button>
              <button
                onClick={() => navigate('/account/orders')}
                className="w-full text-left p-3 rounded hover:bg-gray-100"
              >
                Đơn hàng
              </button>
            </div>
          </aside>

          <main className="flex-1">
            {activeTab === 'info' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
                <form onSubmit={handleUpdateInfo}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Họ tên</label>
                    <input
                      type="text"
                      value={formData.hoTen}
                      onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      value={formData.soDienThoai}
                      onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Địa chỉ</label>
                    <textarea
                      value={formData.diaChi}
                      onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
                  >
                    Cập nhật
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>
                <form onSubmit={handleChangePassword}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Mật khẩu cũ</label>
                    <input
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Mật khẩu mới</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
                  >
                    Đổi mật khẩu
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Account

