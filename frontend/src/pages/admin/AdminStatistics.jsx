import { useState, useEffect } from 'react'
import { adminOrderApi, adminProductApi, adminUserApi } from '../../services/api'

const AdminStatistics = () => {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('month') // 'month', 'quarter', 'year'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  
  // Statistics data
  const [revenueByMonth, setRevenueByMonth] = useState([])
  const [orderStats, setOrderStats] = useState({
    byStatus: {},
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
  })
  const [topProducts, setTopProducts] = useState([])
  const [userStats, setUserStats] = useState({
    total: 0,
    byRole: {},
    newUsers: 0,
  })
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
  })

  useEffect(() => {
    loadStatistics()
  }, [dateRange, selectedYear])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      
      // Load all statistics in parallel
      await Promise.all([
        loadRevenueByMonth(),
        loadOrderStatistics(),
        loadTopProducts(),
        loadUserStatistics(),
        loadSummary(),
      ])
    } catch (error) {
      console.error('Error loading statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRevenueByMonth = async () => {
    try {
      const response = await adminOrderApi.getReport()
      const reportData = response.data || []
      
      // Transform data: [month, year, total]
      const formattedData = reportData.map(item => {
        const month = item[0] || 0
        const year = item[1] || 0
        const total = item[2] || 0
        
        return {
          month: parseInt(month),
          year: parseInt(year),
          revenue: parseFloat(total) || 0,
          label: `Tháng ${month}/${year}`,
        }
      })
      
      // Filter by selected year if needed
      const filteredData = dateRange === 'year' 
        ? formattedData.filter(item => item.year === selectedYear)
        : formattedData.slice(-12) // Last 12 months
      
      setRevenueByMonth(filteredData)
    } catch (error) {
      console.error('Error loading revenue by month:', error)
    }
  }

  const loadOrderStatistics = async () => {
    try {
      // Get all orders
      const allOrdersResponse = await adminOrderApi.getAll(1)
      const totalOrders = allOrdersResponse.data?.totalElements || 0
      const totalPages = allOrdersResponse.data?.totalPages || 1
      
      let allOrders = [...(allOrdersResponse.data?.content || [])]
      
      // Get all pages
      if (totalPages > 1) {
        const promises = []
        for (let page = 2; page <= totalPages; page++) {
          promises.push(adminOrderApi.getAll(page))
        }
        const responses = await Promise.all(promises)
        responses.forEach(response => {
          if (response.data?.content) {
            allOrders = [...allOrders, ...response.data.content]
          }
        })
      }
      
      // Calculate statistics by status
      const byStatus = {}
      let completed = 0
      let pending = 0
      let cancelled = 0
      
      allOrders.forEach(order => {
        const status = order.trangThaiDonHang || 'Không xác định'
        byStatus[status] = (byStatus[status] || 0) + 1
        
        if (status === 'Hoàn thành') completed++
        else if (status === 'Đang chờ giao' || status === 'Đang giao' || status === 'Chờ duyệt') pending++
        else if (status === 'Đã bị hủy') cancelled++
      })
      
      setOrderStats({
        byStatus,
        total: totalOrders,
        completed,
        pending,
        cancelled,
      })
    } catch (error) {
      console.error('Error loading order statistics:', error)
    }
  }

  const loadTopProducts = async () => {
    try {
      // Get all completed orders to calculate product sales
      const completedOrdersResponse = await adminOrderApi.getAll(1, 'Hoàn thành')
      const totalPagesOrders = completedOrdersResponse.data?.totalPages || 1
      
      let allCompletedOrders = [...(completedOrdersResponse.data?.content || [])]
      
      if (totalPagesOrders > 1) {
        const promises = []
        for (let page = 2; page <= totalPagesOrders; page++) {
          promises.push(adminOrderApi.getAll(page, 'Hoàn thành'))
        }
        const responses = await Promise.all(promises)
        responses.forEach(response => {
          if (response.data?.content) {
            allCompletedOrders = [...allCompletedOrders, ...response.data.content]
          }
        })
      }
      
      // Get order details for each order to get product information
      const productSales = {}
      const orderDetailPromises = allCompletedOrders.map(order => 
        adminOrderApi.getById(order.id).catch(() => null)
      )
      const orderDetails = await Promise.all(orderDetailPromises)
      
      // Calculate product sales from order details
      orderDetails.forEach(orderDetail => {
        if (orderDetail?.data?.danhSachChiTiet) {
          orderDetail.data.danhSachChiTiet.forEach(detail => {
            const product = detail.sanPham
            if (product && product.id) {
              const productId = product.id
              if (!productSales[productId]) {
                productSales[productId] = {
                  product: product,
                  quantity: 0,
                  revenue: 0,
                }
              }
              productSales[productId].quantity += detail.soLuongNhanHang || detail.soLuongDat || 0
              productSales[productId].revenue += detail.donGia || 0
            }
          })
        }
      })
      
      // Convert to array and sort by revenue
      const topProductsList = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)
      
      setTopProducts(topProductsList)
    } catch (error) {
      console.error('Error loading top products:', error)
      // Fallback: set empty array if error
      setTopProducts([])
    }
  }

  const loadUserStatistics = async () => {
    try {
      const roles = ['ROLE_MEMBER', 'ROLE_ADMIN', 'ROLE_SHIPPER']
      const allUserIds = new Set()
      const byRole = {}
      
      for (const role of roles) {
        try {
          const response = await adminUserApi.getAll(role, 1)
          const totalPages = response.data?.totalPages || 1
          
          let users = [...(response.data?.content || [])]
          
          if (totalPages > 1) {
            const promises = []
            for (let page = 2; page <= totalPages; page++) {
              promises.push(adminUserApi.getAll(role, page))
            }
            const responses = await Promise.all(promises)
            responses.forEach(res => {
              if (res.data?.content) {
                users = [...users, ...res.data.content]
              }
            })
          }
          
          users.forEach(user => {
            if (user.id) {
              allUserIds.add(user.id)
            }
          })
          
          byRole[role] = users.length
        } catch (error) {
          console.error(`Error loading users for role ${role}:`, error)
        }
      }
      
      // Calculate new users (users with highest IDs - approximate)
      const newUsers = Math.max(0, allUserIds.size - 10) // Approximate
      
      setUserStats({
        total: allUserIds.size,
        byRole,
        newUsers,
      })
    } catch (error) {
      console.error('Error loading user statistics:', error)
    }
  }

  const loadSummary = async () => {
    try {
      // Get total revenue from completed orders
      const completedOrdersResponse = await adminOrderApi.getAll(1, 'Hoàn thành')
      const totalPages = completedOrdersResponse.data?.totalPages || 1
      
      let totalRevenue = 0
      let allOrders = [...(completedOrdersResponse.data?.content || [])]
      
      if (totalPages > 1) {
        const promises = []
        for (let page = 2; page <= totalPages; page++) {
          promises.push(adminOrderApi.getAll(page, 'Hoàn thành'))
        }
        const responses = await Promise.all(promises)
        responses.forEach(response => {
          if (response.data?.content) {
            allOrders = [...allOrders, ...response.data.content]
          }
        })
      }
      
      totalRevenue = allOrders.reduce((sum, order) => sum + (order.tongGiaTri || 0), 0)
      
      // Get total orders
      const allOrdersResponse = await adminOrderApi.getAll(1)
      const totalOrders = allOrdersResponse.data?.totalElements || 0
      
      // Calculate average order value
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      
      setSummary({
        totalRevenue,
        totalOrders,
        averageOrderValue,
      })
    } catch (error) {
      console.error('Error loading summary:', error)
    }
  }

  // Calculate max revenue for chart scaling
  const maxRevenue = revenueByMonth.length > 0
    ? Math.max(...revenueByMonth.map(item => item.revenue))
    : 1

  // Get month name in Vietnamese
  const getMonthName = (month) => {
    const months = [
      'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
      'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
    ]
    return months[month - 1] || month
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-500">Đang tải dữ liệu thống kê...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">📊 Báo Cáo Thống Kê</h1>
        <p className="text-lg opacity-90">Phân tích chi tiết hoạt động kinh doanh</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Bộ Lọc Thời Gian</h2>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="month">12 Tháng Gần Nhất</option>
            <option value="year">Theo Năm</option>
          </select>
          {dateRange === 'year' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
          <button
            onClick={loadStatistics}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            🔄 Làm Mới
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Tổng Doanh Thu</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {new Intl.NumberFormat('vi-VN').format(summary.totalRevenue)} đ
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Tổng Đơn Hàng</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {summary.totalOrders.toLocaleString('vi-VN')}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Giá Trị Đơn TB</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {new Intl.NumberFormat('vi-VN').format(Math.round(summary.averageOrderValue))} đ
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📈 Doanh Thu Theo Thời Gian</h2>
        {revenueByMonth.length > 0 ? (
          <div className="space-y-4">
            {/* Chart */}
            <div className="relative h-64 flex items-end justify-between space-x-2">
              {revenueByMonth.map((item, index) => {
                const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full relative" style={{ height: '200px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-300 hover:from-primary/90 hover:to-primary/70"
                        style={{ height: `${height}%` }}
                        title={`${item.label}: ${new Intl.NumberFormat('vi-VN').format(item.revenue)} đ`}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                          {new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(item.revenue)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 text-center">
                      {item.label}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Summary Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời Gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doanh Thu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tỷ Trọng
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {revenueByMonth.map((item, index) => {
                    const totalRevenue = revenueByMonth.reduce((sum, i) => sum + i.revenue, 0)
                    const percentage = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.label}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Intl.NumberFormat('vi-VN').format(item.revenue)} đ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Chưa có dữ liệu doanh thu
          </div>
        )}
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Phân Bố Đơn Hàng Theo Trạng Thái</h2>
          {Object.keys(orderStats.byStatus).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(orderStats.byStatus).map(([status, count]) => {
                const percentage = orderStats.total > 0 ? (count / orderStats.total) * 100 : 0
                const getStatusColor = (status) => {
                  if (status === 'Hoàn thành') return 'bg-green-500'
                  if (status === 'Đang chờ giao' || status === 'Đang giao' || status === 'Chờ duyệt') return 'bg-yellow-500'
                  if (status === 'Đã bị hủy') return 'bg-red-500'
                  return 'bg-gray-500'
                }
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{status}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${getStatusColor(status)} h-3 rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Chưa có dữ liệu</div>
          )}
        </div>

        {/* User Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">👥 Thống Kê Người Dùng</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Tổng Người Dùng</span>
              <span className="text-lg font-bold text-primary">{userStats.total}</span>
            </div>
            {Object.entries(userStats.byRole).map(([role, count]) => {
              const roleName = role === 'ROLE_MEMBER' ? 'Khách Hàng' :
                              role === 'ROLE_ADMIN' ? 'Quản Trị Viên' :
                              role === 'ROLE_SHIPPER' ? 'Shipper' : role
              const percentage = userStats.total > 0 ? (count / userStats.total) * 100 : 0
              return (
                <div key={role} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{roleName}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">({percentage.toFixed(1)}%)</span>
                    <span className="text-lg font-bold text-gray-900">{count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 Top 10 Sản Phẩm Bán Chạy</h2>
        {topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên Sản Phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số Lượng Bán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh Thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tỷ Trọng
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((item, index) => {
                  const totalRevenue = topProducts.reduce((sum, p) => sum + p.revenue, 0)
                  const percentage = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0
                  return (
                    <tr key={item.product?.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.product?.tenSanPham || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity.toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">
                        {new Intl.NumberFormat('vi-VN').format(item.revenue)} đ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Chưa có dữ liệu sản phẩm bán chạy
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminStatistics

