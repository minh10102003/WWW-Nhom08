import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productApi } from '../services/api'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await productApi.getLatest()
      setLatestProducts(response.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            IUH Mobile - Địa chỉ tin cậy cho mọi nhu cầu
          </h1>
          <p className="text-xl mb-8 opacity-95">Sản phẩm chính hãng, giá tốt nhất thị trường</p>
          <Link
            to="/store"
            className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Xem sản phẩm
          </Link>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Sản phẩm mới nhất</h2>
            <Link
              to="/store"
              className="text-primary hover:underline font-semibold"
            >
              Xem tất cả →
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12">Đang tải...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} showQuickView={true} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Miễn phí giao hàng</h3>
              <p className="text-gray-600">Giao hàng toàn quốc, nhanh chóng và an toàn</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2">Bảo hành 1 đổi 1</h3>
              <p className="text-gray-600">Chính sách bảo hành uy tín, đổi mới trong 7 ngày</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-2">Thanh toán linh hoạt</h3>
              <p className="text-gray-600">Hỗ trợ trả góp 0%, nhiều phương thức thanh toán</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

