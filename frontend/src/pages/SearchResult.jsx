import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { productApi } from '../services/api'
import ProductCard from '../components/ProductCard'

const SearchResult = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      searchProducts()
    }
  }, [query])

  const searchProducts = async () => {
    try {
      setLoading(true)
      const response = await productApi.search(query, 1)
      setProducts(response.data.content || [])
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">
          Kết quả tìm kiếm cho: "{query}"
        </h1>

        {loading ? (
          <div className="text-center py-12">Đang tải...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Không tìm thấy sản phẩm nào</p>
            <Link
              to="/store"
              className="text-primary hover:underline"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} showQuickView={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResult

