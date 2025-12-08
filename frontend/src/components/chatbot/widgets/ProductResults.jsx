import React from 'react'

const ProductResults = (props) => {
  // react-chatbot-kit truyền state qua props
  // Lấy products từ productsMap dựa trên index của message
  const state = props.state || {}
  const productsMap = state.productsMap || {}
  const messages = state.messages || []
  
  // Tìm tất cả messages có widget productResults và lấy products tương ứng
  // Mỗi widget sẽ render với message tương ứng của nó
  let products = []
  
  // Tìm tất cả messages có widget productResults và lấy products từ productsMap
  // Lưu ý: react-chatbot-kit có thể render widget nhiều lần, nên cần tìm đúng message
  const productResultsMessages = []
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    if (msg && msg.widget === 'productResults') {
      productResultsMessages.push({ index: i, message: msg })
    }
  }
  
  // Lấy products từ message cuối cùng có widget productResults
  // (vì widget mới nhất sẽ được render)
  if (productResultsMessages.length > 0) {
    const lastProductMessage = productResultsMessages[productResultsMessages.length - 1]
    products = productsMap[lastProductMessage.index] || []
  }
  
  // Fallback: lấy từ state.products (cho tương thích ngược)
  if (products.length === 0 && state.products) {
    products = state.products
  }
  
  // Debug log để kiểm tra
  if (products.length === 0) {
    console.log('ProductResults - No products found. productsMap:', productsMap, 'messages with widget:', productResultsMessages.length)
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-results">
        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
      </div>
    )
  }

  return (
    <div className="product-results" style={{ paddingBottom: '1rem', marginBottom: '1rem' }}>
      <p className="font-semibold mb-3 whitespace-nowrap">Tìm thấy {products.length} sản phẩm:</p>
      <div className="grid grid-cols-1 gap-2 mb-3">
        {products.slice(0, 5).map((product, index) => (
          <div
            key={product.id}
            className="product-item p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
            onClick={() => window.location.href = `/iphoneshop/product/${product.id}`}
          >
            <div className="font-medium text-blue-600 mb-1">{product.tenSanPham}</div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-red-600">
                {new Intl.NumberFormat('vi-VN').format(product.donGia)} đ
              </div>
              {product.mauSac && (
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Màu:</span> {product.mauSac}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {products.length > 5 && (
        <button
          className="text-blue-600 hover:underline text-sm whitespace-nowrap"
          onClick={() => window.location.href = '/iphoneshop/store'}
        >
          Xem thêm {products.length - 5} sản phẩm khác →
        </button>
      )}
    </div>
  )
}

export default ProductResults

