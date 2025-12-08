/**
 * Get product image URL - ưu tiên URL từ web ngoài, nếu không có thì dùng local
 * @param {object} product - Product object
 * @returns {string} Image URL
 */
export const getProductImageUrl = (product) => {
  // Ưu tiên dùng URL từ web ngoài nếu có
  if (product.hinhAnhUrl && product.hinhAnhUrl.trim() !== '') {
    return product.hinhAnhUrl;
  }
  // Fallback về local image
  return `/iphoneshop/img/${product.id}.png`;
}

/**
 * Get product image URL from SanPhamHinhAnh
 * @param {object} hinhAnh - SanPhamHinhAnh object
 * @returns {string} Image URL
 */
export const getProductHinhAnhUrl = (hinhAnh) => {
  if (hinhAnh && hinhAnh.hinhAnhUrl && hinhAnh.hinhAnhUrl.trim() !== '') {
    // Nếu là URL local (bắt đầu bằng /iphoneshop/img/), trả về trực tiếp
    if (hinhAnh.hinhAnhUrl.startsWith('/iphoneshop/img/')) {
      return hinhAnh.hinhAnhUrl;
    }
    // Nếu là URL từ web ngoài, trả về trực tiếp
    return hinhAnh.hinhAnhUrl;
  }
  return null;
}

/**
 * Generate a placeholder image as data URI
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display (default: "No Image")
 * @returns {string} Data URI of the placeholder image
 */
export const getPlaceholderImage = (width = 300, height = 300, text = 'No Image') => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="16" 
        fill="#9ca3af" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `.trim()
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

