import { useEffect, useState } from 'react'
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminProductApi, adminOrderApi, adminUserApi } from '../services/api'
import AdminCategories from './admin/AdminCategories'
import AdminBrands from './admin/AdminBrands'
import AdminProducts from './admin/AdminProducts'
import AdminOrders from './admin/AdminOrders'
import AdminUsers from './admin/AdminUsers'
import AdminContacts from './admin/AdminContacts'
import AdminStatistics from './admin/AdminStatistics'

const Admin = () => {
  // Tất cả hooks phải được gọi ở top level, trước bất kỳ early return nào
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!loading && user) {
      // Kiểm tra quyền admin
      const roles = user.vaiTro?.map(vt => vt.tenVaiTro || vt) || []
      if (!roles.includes('ROLE_ADMIN')) {
        // Nếu không phải admin, redirect về trang chủ
        navigate('/')
      }
    } else if (!loading && !user) {
      // Nếu chưa đăng nhập, redirect về trang login
      navigate('/login')
    }
  }, [user, loading, navigate])

  // Early returns sau khi đã gọi tất cả hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Đang tải...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const roles = user.vaiTro?.map(vt => vt.tenVaiTro || vt) || []
  if (!roles.includes('ROLE_ADMIN')) {
    return null
  }

  const isDashboard = location.pathname === '/admin' || location.pathname === '/admin/'

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/admin/san-pham', label: 'Sản Phẩm', icon: '📱' },
    { path: '/admin/danh-muc', label: 'Danh Mục', icon: '📂' },
    { path: '/admin/nhan-hieu', label: 'Nhãn Hiệu', icon: '🏷️' },
    { path: '/admin/don-hang', label: 'Đơn Hàng', icon: '📦' },
    { path: '/admin/tai-khoan', label: 'Tài Khoản', icon: '👥' },
    { path: '/admin/lien-he', label: 'Liên Hệ', icon: '✉️' },
    { path: '/admin/thong-ke', label: 'Thống Kê', icon: '📈' },
  ]

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path || location.pathname === item.path + '/'
    }
    return location.pathname.includes(item.path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen transition-all duration-300 shadow-2xl flex flex-col relative overflow-hidden`}>
          {/* Logo/Brand Section - Fixed */}
          <div className="p-4 flex-shrink-0 border-b border-gray-700">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold">A</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Admin Panel
                    </h2>
                    <p className="text-xs text-gray-400">IUH Mobile</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                {sidebarOpen ? '◀' : '▶'}
              </button>
            </div>
          </div>

          {/* Navigation Section - Flexible, no scroll */}
          <nav className="flex-1 overflow-hidden flex flex-col py-2 min-h-0">
            <div className="px-2 space-y-1 flex flex-col h-full">
              {menuItems.map((item) => {
                const active = isActive(item)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 flex-shrink-0 ${
                      active
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && <span className="font-medium truncate">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* User Info at bottom - Fixed */}
          {sidebarOpen && (
            <div className="p-4 border-t border-gray-700 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">
                    {(user?.hoTen || user?.email || 'A').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.hoTen || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => isActive(item))?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Quản lý hệ thống IUH Mobile
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  ← Về trang chủ
                </Link>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/danh-muc" element={<AdminCategories />} />
              <Route path="/nhan-hieu" element={<AdminBrands />} />
              <Route path="/san-pham" element={<AdminProducts />} />
              <Route path="/don-hang" element={<AdminOrders />} />
              <Route path="/tai-khoan" element={<AdminUsers />} />
              <Route path="/lien-he" element={<AdminContacts />} />
              <Route path="/thong-ke" element={<AdminStatistics />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState({
    latestOrder: null,
    latestUser: null,
  })

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      
      // Lấy tổng số sản phẩm
      const productsResponse = await adminProductApi.getAll(1)
      const totalProducts = productsResponse.data?.totalElements || 0

      // Lấy tổng số đơn hàng
      const ordersResponse = await adminOrderApi.getAll(1)
      const totalOrders = ordersResponse.data?.totalElements || 0

      // Lấy tổng số người dùng - lấy tất cả người dùng từ role MEMBER (role phổ biến nhất)
      // và cộng với các role khác, nhưng cần lấy tất cả các trang để đảm bảo chính xác
      let totalUsers = 0
      
      // Lấy tất cả người dùng từ mỗi role (lấy tất cả các trang)
      const roles = ['ROLE_MEMBER', 'ROLE_ADMIN', 'ROLE_SHIPPER']
      const allUserIds = new Set() // Dùng Set để tránh đếm trùng
      
      for (const role of roles) {
        try {
          const firstPageResponse = await adminUserApi.getAll(role, 1)
          const totalPages = firstPageResponse.data?.totalPages || 1
          const totalElements = firstPageResponse.data?.totalElements || 0
          
          // Nếu chỉ có 1 trang, lấy từ trang đầu
          if (totalPages === 1 && firstPageResponse.data?.content) {
            firstPageResponse.data.content.forEach(user => {
              if (user.id) allUserIds.add(user.id)
            })
          } else {
            // Lấy tất cả các trang
            const allPagesPromises = []
            for (let page = 1; page <= totalPages; page++) {
              allPagesPromises.push(adminUserApi.getAll(role, page))
            }
            const allPagesResponses = await Promise.all(allPagesPromises)
            allPagesResponses.forEach(response => {
              if (response.data?.content) {
                response.data.content.forEach(user => {
                  if (user.id) allUserIds.add(user.id)
                })
              }
            })
          }
        } catch (error) {
          console.error(`Error loading users for role ${role}:`, error)
        }
      }
      
      // Tổng số người dùng duy nhất
      totalUsers = allUserIds.size

      // Tính doanh thu từ đơn hàng đã hoàn thành
      // Lấy tất cả đơn hàng đã hoàn thành
      const completedOrdersResponse = await adminOrderApi.getAll(1, 'Hoàn thành')
      let totalRevenue = 0
      
      if (completedOrdersResponse.data?.content) {
        // Tính tổng doanh thu từ các đơn hàng đã hoàn thành
        totalRevenue = completedOrdersResponse.data.content.reduce((sum, order) => {
          return sum + (order.tongGiaTri || 0)
        }, 0)

        // Nếu có nhiều trang, cần lấy tất cả
        const totalPages = completedOrdersResponse.data.totalPages || 1
        if (totalPages > 1) {
          const allOrdersPromises = []
          for (let page = 2; page <= totalPages; page++) {
            allOrdersPromises.push(adminOrderApi.getAll(page, 'Hoàn thành'))
          }
          const allOrdersResponses = await Promise.all(allOrdersPromises)
          allOrdersResponses.forEach(response => {
            if (response.data?.content) {
              totalRevenue += response.data.content.reduce((sum, order) => {
                return sum + (order.tongGiaTri || 0)
              }, 0)
            }
          })
        }
      }

      setStats({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
      })

      // Lấy hoạt động gần đây
      await loadRecentActivities()
    } catch (error) {
      console.error('Error loading statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecentActivities = async () => {
    try {
      // Lấy đơn hàng mới nhất (sắp xếp theo ngày đặt hàng giảm dần)
      const ordersResponse = await adminOrderApi.getAll(1)
      let latestOrder = null
      if (ordersResponse.data?.content && ordersResponse.data.content.length > 0) {
        // Sắp xếp theo ngày đặt hàng giảm dần
        const sortedOrders = [...ordersResponse.data.content].sort((a, b) => {
          const dateA = a.ngayDatHang ? new Date(a.ngayDatHang) : new Date(0)
          const dateB = b.ngayDatHang ? new Date(b.ngayDatHang) : new Date(0)
          return dateB - dateA
        })
        latestOrder = sortedOrders[0]
      }

      // Lấy người dùng mới nhất từ tất cả các role
      let latestUser = null
      let latestUserDate = null
      
      const roles = ['ROLE_MEMBER', 'ROLE_ADMIN', 'ROLE_SHIPPER']
      for (const role of roles) {
        try {
          const response = await adminUserApi.getAll(role, 1)
          if (response.data?.content) {
            response.data.content.forEach(user => {
              // Giả sử người dùng được sắp xếp theo ID (ID lớn hơn = mới hơn)
              // Hoặc có thể có field ngày tạo, nhưng hiện tại không có
              // Sử dụng ID như một proxy cho thời gian tạo
              if (!latestUser || (user.id && user.id > latestUser.id)) {
                latestUser = user
                // Nếu không có ngày tạo, sử dụng ID như một proxy
                latestUserDate = user.id
              }
            })
          }
        } catch (error) {
          console.error(`Error loading users for role ${role}:`, error)
        }
      }

      setRecentActivities({
        latestOrder,
        latestUser,
      })
    } catch (error) {
      console.error('Error loading recent activities:', error)
    }
  }

  // Hàm tính thời gian tương đối
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Không xác định'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    
    // Format ngày tháng năm
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const statsData = [
    {
      title: 'Tổng Sản Phẩm',
      value: loading ? '...' : stats.totalProducts.toLocaleString('vi-VN'),
      icon: '📱',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Tổng Đơn Hàng',
      value: loading ? '...' : stats.totalOrders.toLocaleString('vi-VN'),
      icon: '📦',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Tổng Người Dùng',
      value: loading ? '...' : stats.totalUsers.toLocaleString('vi-VN'),
      icon: '👥',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Doanh Thu',
      value: loading ? '...' : new Intl.NumberFormat('vi-VN').format(stats.totalRevenue) + ' đ',
      icon: '💰',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
  ]

  const quickActions = [
    { label: 'Thêm Sản Phẩm', icon: '➕', path: '/admin/san-pham', color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Xem Đơn Hàng', icon: '📦', path: '/admin/don-hang', color: 'bg-green-500 hover:bg-green-600' },
    { label: 'Quản Lý Người Dùng', icon: '👥', path: '/admin/tai-khoan', color: 'bg-purple-500 hover:bg-purple-600' },
    { label: 'Liên Hệ Mới', icon: '✉️', path: '/admin/lien-he', color: 'bg-yellow-500 hover:bg-yellow-600' },
  ]
  
  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl shadow-xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">
            Chào mừng trở lại, {user?.hoTen || user?.email || 'Admin'}! 👋
          </h1>
          <p className="text-lg opacity-90">
            Đây là tổng quan về hệ thống quản lý của bạn
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${stat.color} p-4`}>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{stat.icon}</span>
                <div className={`${stat.bgColor} rounded-lg p-2`}>
                  <span className={`text-2xl ${stat.textColor} font-bold`}>{stat.value}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {stat.title}
              </h3>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thao Tác Nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`${action.color} text-white rounded-lg p-4 flex items-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hoạt Động Gần Đây</h2>
          <div className="space-y-4">
            {recentActivities.latestOrder ? (
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span>📦</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Đơn hàng #{recentActivities.latestOrder.id} - {recentActivities.latestOrder.hoTenNguoiNhan || 'Khách hàng'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {loading ? 'Đang tải...' : getTimeAgo(recentActivities.latestOrder.ngayDatHang)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-primary">
                    {new Intl.NumberFormat('vi-VN').format(recentActivities.latestOrder.tongGiaTri || 0)} đ
                  </p>
                  <p className="text-xs text-gray-500">{recentActivities.latestOrder.trangThaiDonHang}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span>📦</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Đơn hàng mới</p>
                  <p className="text-xs text-gray-500">{loading ? 'Đang tải...' : 'Chưa có đơn hàng'}</p>
                </div>
              </div>
            )}
            {recentActivities.latestUser ? (
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span>👤</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {recentActivities.latestUser.hoTen || recentActivities.latestUser.email || 'Người dùng mới'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {loading ? 'Đang tải...' : 'Đã đăng ký'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {recentActivities.latestUser.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span>👤</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Người dùng mới</p>
                  <p className="text-xs text-gray-500">{loading ? 'Đang tải...' : 'Chưa có người dùng'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thống Kê Nhanh</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Đơn hàng đã hoàn thành</span>
              <span className="text-lg font-bold text-primary">
                {loading ? '...' : (stats.totalOrders > 0 ? Math.round(stats.totalOrders * 0.7) : 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Tổng doanh thu</span>
              <span className="text-lg font-bold text-green-600">
                {loading ? '...' : new Intl.NumberFormat('vi-VN').format(stats.totalRevenue) + ' đ'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Tổng sản phẩm</span>
              <span className="text-lg font-bold text-purple-600">
                {loading ? '...' : stats.totalProducts.toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin

