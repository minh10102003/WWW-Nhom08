import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productApi, productImageApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getPlaceholderImage, getProductImageUrl, getProductHinhAnhUrl } from '../utils/imageUtils'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState('')
  const [productImages, setProductImages] = useState([])
  const [availableColors, setAvailableColors] = useState([])
  const [currentImageUrl, setCurrentImageUrl] = useState('')
  const [zoomPosition, setZoomPosition] = useState({ 
    x: 0, 
    y: 0, 
    show: false, 
    percentX: 0, 
    percentY: 0,
    previewX: 0,
    previewY: 0
  })
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addToCart, updateCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (product) {
      fetchProductImages()
    }
  }, [product])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productApi.getById(id)
      setProduct(response.data)
      // Set màu mặc định từ sản phẩm
      if (response.data.mauSac) {
        setSelectedColor(response.data.mauSac)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProductImages = async () => {
    try {
      const response = await productImageApi.getByProductId(id)
      const images = response.data || []
      setProductImages(images)
      
      // Lấy danh sách màu sắc có sẵn
      const colors = [...new Set(images.map(img => img.mauSac).filter(Boolean))]
      setAvailableColors(colors)
      
      // Nếu có màu được chọn, lấy hình ảnh của màu đó
      if (selectedColor && colors.includes(selectedColor)) {
        const colorImages = images.filter(img => img.mauSac === selectedColor)
        if (colorImages.length > 0) {
          const imageUrl = getProductHinhAnhUrl(colorImages[0])
          setCurrentImageUrl(imageUrl || getProductImageUrl(product))
        }
      } else if (images.length > 0) {
        // Nếu không có màu được chọn, dùng hình ảnh đầu tiên
        const imageUrl = getProductHinhAnhUrl(images[0])
        setCurrentImageUrl(imageUrl || getProductImageUrl(product))
        if (images[0].mauSac) {
          setSelectedColor(images[0].mauSac)
        }
      } else {
        // Fallback về hình ảnh mặc định của sản phẩm
        setCurrentImageUrl(getProductImageUrl(product))
      }
    } catch (error) {
      console.error('Error fetching product images:', error)
      // Fallback về hình ảnh mặc định
      setCurrentImageUrl(getProductImageUrl(product))
    }
  }

  const handleColorChange = (color) => {
    setSelectedColor(color)
    const colorImages = productImages.filter(img => img.mauSac === color)
    if (colorImages.length > 0) {
      const imageUrl = getProductHinhAnhUrl(colorImages[0])
      setCurrentImageUrl(imageUrl || getProductImageUrl(product))
    }
  }

  const handleAddToCart = async () => {
    // Allow anonymous users to add to cart (stored in cookies)
    const result = await addToCart(id)
    if (result.success) {
      // Show success message
      alert('Đã thêm vào giỏ hàng!')
    } else {
      // If not logged in and API requires login, redirect to login
      if (result.error && result.error.includes('login')) {
        navigate('/login')
      } else {
        alert(result.error || 'Có lỗi xảy ra')
      }
    }
  }

  const handleBuyNow = async () => {
    try {
      // Lưu thông tin sản phẩm "mua ngay" vào localStorage
      // Để checkout biết chỉ tạo đơn hàng với sản phẩm này
      const buyNowInfo = {
        productId: id,
        quantity: quantity
      }
      localStorage.setItem('buyNowProduct', JSON.stringify(buyNowInfo))
      
      // Chuyển đến trang checkout (không cần thêm vào giỏ hàng)
      navigate('/checkout')
    } catch (error) {
      console.error('Buy now error:', error)
      alert('Có lỗi xảy ra khi xử lý đơn hàng')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100
    
    // Đảm bảo lens không ra ngoài biên ảnh
    const lensSize = 150
    const minX = lensSize / 2
    const maxX = rect.width - lensSize / 2
    const minY = lensSize / 2
    const maxY = rect.height - lensSize / 2
    
    const clampedX = Math.max(minX, Math.min(maxX, x))
    const clampedY = Math.max(minY, Math.min(maxY, y))
    
    // Tính vị trí preview box (đi theo con trỏ)
    const previewSize = 384 // w-96 = 384px
    const offset = 20 // Khoảng cách từ con trỏ đến preview box
    
    setZoomPosition({
      x: clampedX,
      y: clampedY,
      show: true,
      percentX: percentX,
      percentY: percentY,
      previewX: e.clientX + offset,
      previewY: e.clientY - previewSize / 2
    })
  }

  const handleMouseLeave = () => {
    setZoomPosition({ ...zoomPosition, show: false })
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Đang tải...</div>
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-12 text-center">Không tìm thấy sản phẩm</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image with Zoom */}
            <div className="relative">
              <div
                className="relative overflow-hidden rounded-lg cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={currentImageUrl || getProductImageUrl(product)}
                  alt={product.tenSanPham}
                  className="w-full rounded-lg select-none"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage(600, 600, 'No Image')
                  }}
                  onLoad={() => setImageLoaded(true)}
                  draggable="false"
                />
                
              </div>
              
              {/* Zoom Preview Box - Follows cursor */}
              {zoomPosition.show && imageLoaded && (
                <div
                  className="fixed w-96 h-96 border-4 border-gray-300 rounded-lg overflow-hidden shadow-2xl bg-white z-20 hidden md:block pointer-events-none"
                  style={{
                    left: `${zoomPosition.previewX || 0}px`,
                    top: `${zoomPosition.previewY || 0}px`,
                    transform: 'translate(0, 0)',
                    maxWidth: 'calc(100vw - 2rem)',
                    maxHeight: 'calc(100vh - 2rem)'
                  }}
                >
                  <img
                    src={currentImageUrl || getProductImageUrl(product)}
                    alt={`${product.tenSanPham} - Zoom`}
                    className="absolute select-none"
                    style={{
                      width: '400%',
                      height: '400%',
                      // Sửa logic để zoom đúng chiều
                      left: `${-zoomPosition.percentX * 3}%`,
                      top: `${-zoomPosition.percentY * 3}%`,
                      objectFit: 'none',
                      pointerEvents: 'none',
                      maxWidth: 'none'
                    }}
                    draggable="false"
                  />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.tenSanPham}</h1>
              
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.donGia)}
                  </span>
                  {product.donGiaKhuyenMai && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.donGiaKhuyenMai)}
                    </span>
                  )}
                </div>
                {product.donViKho > 0 ? (
                  <span className="text-green-600 font-semibold">Còn hàng</span>
                ) : (
                  <span className="text-red-600 font-semibold">Hết hàng</span>
                )}
              </div>

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div className="mb-6">
                  <label className="block font-semibold mb-3">Màu sắc:</label>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                          selectedColor === color
                            ? 'border-primary bg-primary text-white shadow-lg'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              <div className="mb-6 space-y-2">
                {product.chip && (
                  <div className="flex">
                    <span className="font-semibold w-32">Chip:</span>
                    <span>{product.chip}</span>
                  </div>
                )}
                {product.dungLuong && (
                  <div className="flex">
                    <span className="font-semibold w-32">Dung lượng:</span>
                    <span>{product.dungLuong}</span>
                  </div>
                )}
                {product.mauSac && (
                  <div className="flex">
                    <span className="font-semibold w-32">Màu sắc:</span>
                    <span>{product.mauSac}</span>
                  </div>
                )}
                {product.camera && (
                  <div className="flex">
                    <span className="font-semibold w-32">Camera:</span>
                    <span>{product.camera}</span>
                  </div>
                )}
                {product.manHinh && (
                  <div className="flex">
                    <span className="font-semibold w-32">Màn hình:</span>
                    <span>{product.manHinh}</span>
                  </div>
                )}
                {product.heDieuHanh && (
                  <div className="flex">
                    <span className="font-semibold w-32">Hệ điều hành:</span>
                    <span>{product.heDieuHanh}</span>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Số lượng:</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border rounded"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-4 py-2 border rounded text-center"
                    min="1"
                    max={product.donViKho}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.donViKho, quantity + 1))}
                    className="px-4 py-2 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.donViKho === 0}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.donViKho === 0}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.thongTinBaoHanh && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-4">Thông tin bảo hành</h2>
              <p className="text-gray-700">{product.thongTinBaoHanh}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

