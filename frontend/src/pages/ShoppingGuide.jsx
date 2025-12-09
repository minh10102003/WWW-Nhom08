const ShoppingGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Hướng dẫn mua hàng
          </h1>
          <p className="text-xl text-gray-600">
            Hướng dẫn chi tiết cách mua hàng tại IUH Mobile
          </p>
        </div>

        {/* Steps */}
        <section className="space-y-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Chọn sản phẩm</h3>
                <p className="text-gray-700 mb-4">
                  Duyệt qua danh mục sản phẩm trên website hoặc tìm kiếm sản phẩm bạn muốn mua. 
                  Bạn có thể xem chi tiết thông số kỹ thuật, hình ảnh và giá cả của từng sản phẩm.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>💡 Mẹo:</strong> Sử dụng bộ lọc để tìm sản phẩm theo giá, dung lượng, màu sắc phù hợp với nhu cầu của bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Thêm vào giỏ hàng</h3>
                <p className="text-gray-700 mb-4">
                  Sau khi chọn được sản phẩm ưng ý, nhấn nút "Thêm vào giỏ hàng". 
                  Bạn có thể tiếp tục mua sắm hoặc vào giỏ hàng để thanh toán.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>💡 Mẹo:</strong> Bạn có thể thêm nhiều sản phẩm vào giỏ hàng và thanh toán cùng lúc để tiết kiệm phí giao hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Kiểm tra giỏ hàng</h3>
                <p className="text-gray-700 mb-4">
                  Vào giỏ hàng để kiểm tra lại sản phẩm, số lượng, giá cả. 
                  Bạn có thể thay đổi số lượng hoặc xóa sản phẩm không cần thiết.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>💡 Mẹo:</strong> Kiểm tra kỹ thông tin sản phẩm trước khi thanh toán để tránh nhầm lẫn.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Đăng nhập / Đăng ký</h3>
                <p className="text-gray-700 mb-4">
                  Để tiếp tục thanh toán, bạn cần đăng nhập tài khoản. 
                  Nếu chưa có tài khoản, bạn có thể đăng ký nhanh chóng chỉ với email và số điện thoại.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>💡 Mẹo:</strong> Đăng ký tài khoản để nhận thông tin khuyến mãi và tích điểm thưởng.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Nhập thông tin giao hàng</h3>
                <p className="text-gray-700 mb-4">
                  Điền đầy đủ thông tin người nhận: Họ tên, số điện thoại, địa chỉ giao hàng. 
                  Vui lòng kiểm tra kỹ địa chỉ để đảm bảo giao hàng đúng và nhanh chóng.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>💡 Mẹo:</strong> Lưu địa chỉ thường dùng để tiết kiệm thời gian cho các lần mua sau.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                6
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Chọn phương thức thanh toán</h3>
                <p className="text-gray-700 mb-4">
                  Chọn phương thức thanh toán phù hợp: Thanh toán khi nhận hàng (COD), 
                  Chuyển khoản ngân hàng, Thẻ tín dụng/ghi nợ, hoặc Trả góp 0%.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>💡 Mẹo:</strong> Thanh toán online để được giảm thêm 1-2% và nhận hàng nhanh hơn.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                7
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Xác nhận đơn hàng</h3>
                <p className="text-gray-700 mb-4">
                  Kiểm tra lại toàn bộ thông tin đơn hàng một lần nữa, sau đó nhấn "Đặt hàng" để hoàn tất. 
                  Bạn sẽ nhận được email xác nhận đơn hàng ngay sau đó.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>💡 Mẹo:</strong> Lưu mã đơn hàng để tra cứu tình trạng giao hàng sau này.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lưu ý quan trọng</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span>Vui lòng kiểm tra kỹ thông tin sản phẩm, giá cả trước khi đặt hàng</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span>Địa chỉ giao hàng phải chính xác, có người nhận tại địa chỉ đó</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span>Kiểm tra sản phẩm kỹ lưỡng trước khi thanh toán</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span>Giữ lại hóa đơn để được bảo hành chính hãng</span>
            </li>
          </ul>
        </section>

        {/* Support */}
        <section className="bg-gradient-primary text-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ?</h2>
          <p className="mb-4 opacity-90">
            Nếu bạn gặp khó khăn trong quá trình mua hàng, đừng ngần ngại liên hệ với chúng tôi
          </p>
          <p className="text-xl font-bold">
            Hotline: 1900.5301 | Email: cskh@iuhmobile.com
          </p>
          <p className="mt-4 text-sm opacity-75">
            Thời gian hỗ trợ: 8:00 - 22:00 (Hàng ngày)
          </p>
        </section>
      </div>
    </div>
  )
}

export default ShoppingGuide

