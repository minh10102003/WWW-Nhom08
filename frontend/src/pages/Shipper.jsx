import { useEffect, useState } from 'react'
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ShipperOrders from './ShipperOrders'
import ShipperGuide from './ShipperGuide'
import { shipperOrderApi } from '../services/api'

const Shipper = () => {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      // Kiểm tra quyền shipper
      const roles = user.vaiTro?.map(vt => vt.tenVaiTro || vt) || []
      if (!roles.includes('ROLE_SHIPPER')) {
        // Nếu không phải shipper, redirect về trang chủ
        navigate('/')
      }
    } else if (!loading && !user) {
      // Nếu chưa đăng nhập, redirect về trang login
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl text-gray-700">Đang tải...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const roles = user.vaiTro?.map(vt => vt.tenVaiTro || vt) || []
  if (!roles.includes('ROLE_SHIPPER')) {
    return null
  }

  const location = useLocation()
  const isDashboard = location.pathname === '/shipper' || location.pathname === '/shipper/'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Top Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Shipper Hub</h1>
              <p className="text-sm text-gray-500">Quản lý giao hàng chuyên nghiệp</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user?.hoTen || user?.email}</p>
              <p className="text-xs text-gray-500">Shipper</p>
            </div>
            <button
              onClick={() => logout()}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white min-h-screen shadow-xl">
          <div className="p-6">
            <nav className="space-y-2 mt-4">
              <Link
                to="/shipper"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isDashboard 
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
                    : 'hover:bg-blue-500 hover:shadow-md'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                to="/shipper/orders"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname.includes('/orders')
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
                    : 'hover:bg-blue-500 hover:shadow-md'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="font-medium">Đơn Hàng</span>
              </Link>
              <Link
                to="/shipper/guide"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname.includes('/guide')
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
                    : 'hover:bg-blue-500 hover:shadow-md'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-medium">Hướng Dẫn</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<ShipperDashboard />} />
            <Route path="/orders" element={<ShipperOrders />} />
            <Route path="/guide" element={<ShipperGuide />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

const ShipperDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    dangGiao: 0,
    choDuyet: 0,
    tongDon: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.id) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    if (!user || !user.id) return
    
    try {
      setLoading(true)
      // Load all orders to calculate stats
      const [dangGiaoRes, choDuyetRes, allRes] = await Promise.all([
        shipperOrderApi.getAll(1, 'Đang giao', '', '', user.id).catch(() => ({ data: { content: [] } })),
        shipperOrderApi.getAll(1, 'Chờ duyệt', '', '', user.id).catch(() => ({ data: { content: [] } })),
        shipperOrderApi.getAll(1, '', '', '', user.id).catch(() => ({ data: { totalElements: 0 } }))
      ])

      setStats({
        dangGiao: dangGiaoRes.data?.totalElements || 0,
        choDuyet: choDuyetRes.data?.totalElements || 0,
        tongDon: allRes.data?.totalElements || 0
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Chào mừng trở lại, <span className="font-semibold text-blue-600">{user?.hoTen || user?.email}</span></p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2 opacity-90">Đơn Hàng Đang Giao</h3>
          <p className="text-4xl font-bold">{loading ? '...' : stats.dangGiao}</p>
          <p className="text-sm opacity-75 mt-2">Cần xử lý ngay</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2 opacity-90">Đơn Hàng Chờ Duyệt</h3>
          <p className="text-4xl font-bold">{loading ? '...' : stats.choDuyet}</p>
          <p className="text-sm opacity-75 mt-2">Đang chờ admin xác nhận</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2 opacity-90">Tổng Đơn Hàng</h3>
          <p className="text-4xl font-bold">{loading ? '...' : stats.tongDon}</p>
          <p className="text-sm opacity-75 mt-2">Tất cả đơn hàng của bạn</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/shipper/orders"
            className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <div className="bg-blue-100 group-hover:bg-blue-200 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Xem tất cả đơn hàng</h3>
              <p className="text-sm text-gray-500">Quản lý và cập nhật trạng thái đơn hàng</p>
            </div>
          </Link>
          <Link
            to="/shipper/guide"
            className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <div className="bg-blue-100 group-hover:bg-blue-200 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Hướng dẫn sử dụng</h3>
              <p className="text-sm text-gray-500">Xem hướng dẫn chi tiết cách sử dụng hệ thống</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Shipper

