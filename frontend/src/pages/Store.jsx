import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productApi, categoryApi } from '../services/api'
import ProductCard from '../components/ProductCard'

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const [filters, setFilters] = useState({
    danhMucId: searchParams.get('danhMucId') || '',
    hangSXId: '', // Bỏ filter thương hiệu
    donGia: searchParams.get('donGia') || '',
    sapXepTheoGia: searchParams.get('sapXepTheoGia') || '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [currentPage, filters])

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll()
      setCategories(response.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productApi.getAll(
        currentPage,
        filters.danhMucId,
        filters.hangSXId,
        filters.donGia,
        filters.sapXepTheoGia
      )
      setProducts(response.data.content || [])
      setTotalPages(response.data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setCurrentPage(1)
    setSearchParams(newFilters)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Cửa hàng iPhone
          </h1>
          <p className="text-gray-600">Khám phá bộ sưu tập iPhone mới nhất</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 bg-white p-6 rounded-2xl shadow-lg h-fit sticky top-4 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Bộ lọc
            </h2>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Danh mục</h3>
              <select
                value={filters.danhMucId}
                onChange={(e) => handleFilterChange('danhMucId', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.tenDanhMuc}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Khoảng giá</h3>
              <select
                value={filters.donGia}
                onChange={(e) => handleFilterChange('donGia', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white"
              >
                <option value="">Tất cả mức giá</option>
                <option value="duoi-10-trieu">Dưới 10 triệu</option>
                <option value="10-trieu-den-15-trieu">10 - 15 triệu</option>
                <option value="15-trieu-den-20-trieu">15 - 20 triệu</option>
                <option value="20-trieu-den-25-trieu">20 - 25 triệu</option>
                <option value="tren-25-trieu">Trên 25 triệu</option>
              </select>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Sắp xếp theo</h3>
              <select
                value={filters.sapXepTheoGia}
                onChange={(e) => handleFilterChange('sapXepTheoGia', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white"
              >
                <option value="">Mặc định</option>
                <option value="asc">Giá: Thấp đến cao</option>
                <option value="desc">Giá: Cao đến thấp</option>
              </select>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-gray-600 text-lg">Đang tải sản phẩm...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-600">Thử thay đổi bộ lọc để xem thêm sản phẩm</p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Hiển thị <span className="font-semibold text-gray-900">{products.length}</span> sản phẩm
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} showQuickView={true} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-5 py-2.5 border-2 border-gray-200 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Trước
                    </button>
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-5 py-2.5 border-2 rounded-lg font-semibold transition-all min-w-[44px] ${
                              currentPage === page
                                ? 'bg-primary text-white border-primary shadow-lg scale-105'
                                : 'border-gray-200 hover:bg-gray-50 hover:border-primary/50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      }
                      if (page === currentPage - 3 || page === currentPage + 3) {
                        return <span key={page} className="px-2 text-gray-400">...</span>
                      }
                      return null
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-5 py-2.5 border-2 border-gray-200 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      Sau
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Store

