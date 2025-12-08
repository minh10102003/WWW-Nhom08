import { Link } from 'react-router-dom'
import { getProductImageUrl, getPlaceholderImage } from '../utils/imageUtils'

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 animate-fade-in">
        <Link to={`/product/${product.id}`} className="block">
          {/* Image Container - Improved */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <div className="aspect-square flex items-center justify-center p-4">
              <img
                src={getProductImageUrl(product)}
                alt={product.tenSanPham}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = getPlaceholderImage(400, 400, 'No Image')
                }}
              />
            </div>
            {/* Stock Badge */}
            {product.donViKho > 0 ? (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg animate-pulse-slow">
                Còn hàng
              </div>
            ) : (
              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                Hết hàng
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-5">
            <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
              {product.tenSanPham}
            </h3>
            
            {/* Price */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.donGia)}
              </span>
              {product.donGiaKhuyenMai && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.donGiaKhuyenMai)}
                </span>
              )}
            </div>

            {/* Quick Specs */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              {product.chip && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {product.chip.split(',')[0]}
                </span>
              )}
              {product.dungLuong && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {product.dungLuong}
                </span>
              )}
              {product.mauSac && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {product.mauSac}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
  )
}

export default ProductCard

