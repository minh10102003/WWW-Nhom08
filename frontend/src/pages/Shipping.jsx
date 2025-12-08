const Shipping = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Chính sách giao hàng
          </h1>
          <p className="text-xl text-gray-600">
            Giao hàng nhanh chóng, an toàn trên toàn quốc
          </p>
        </div>

        {/* Free Shipping */}
        <section className="bg-gradient-primary text-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
          <div className="text-center">
            <div className="text-5xl mb-4">🚚</div>
            <h2 className="text-3xl font-bold mb-4">Miễn phí giao hàng toàn quốc</h2>
            <p className="text-xl opacity-90">
              Tất cả đơn hàng đều được giao hàng miễn phí, không giới hạn khoảng cách
            </p>
          </div>
        </section>

        {/* Shipping Methods */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Phương thức giao hàng</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-primary transition-colors">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Giao hàng nhanh</h3>
              <p className="text-gray-600 mb-4">
                Giao hàng trong <strong>2-4 giờ</strong> tại nội thành TP.HCM, Hà Nội, Đà Nẵng
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Áp dụng cho đơn hàng trước 14:00</li>
                <li>• Phí giao hàng: 50.000₫</li>
                <li>• Hỗ trợ thanh toán khi nhận hàng</li>
              </ul>
            </div>
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-primary transition-colors">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Giao hàng tiêu chuẩn</h3>
              <p className="text-gray-600 mb-4">
                Giao hàng trong <strong>1-3 ngày</strong> trên toàn quốc
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Miễn phí giao hàng</li>
                <li>• Áp dụng cho tất cả đơn hàng</li>
                <li>• Giao hàng tận nơi, an toàn</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Shipping Process */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quy trình giao hàng</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Xác nhận đơn hàng</h4>
                <p className="text-gray-600">
                  Sau khi đặt hàng thành công, chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 30 phút.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Chuẩn bị hàng</h4>
                <p className="text-gray-600">
                  Sản phẩm được kiểm tra kỹ lưỡng, đóng gói cẩn thận trước khi giao hàng.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Giao hàng</h4>
                <p className="text-gray-600">
                  Nhân viên giao hàng sẽ liên hệ trước khi đến. Bạn có thể theo dõi đơn hàng qua SMS hoặc website.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Nhận hàng & Kiểm tra</h4>
                <p className="text-gray-600">
                  Kiểm tra sản phẩm trước khi thanh toán. Nếu có vấn đề, vui lòng từ chối nhận hàng và liên hệ ngay với chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Areas */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Khu vực giao hàng</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Miền Bắc</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Hà Nội</li>
                <li>• Hải Phòng</li>
                <li>• Quảng Ninh</li>
                <li>• Và các tỉnh lân cận</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Miền Trung</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Đà Nẵng</li>
                <li>• Huế</li>
                <li>• Quảng Nam</li>
                <li>• Và các tỉnh lân cận</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Miền Nam</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• TP.HCM</li>
                <li>• Cần Thơ</li>
                <li>• Đồng Nai</li>
                <li>• Và các tỉnh lân cận</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lưu ý quan trọng</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span>Vui lòng cung cấp địa chỉ chính xác, có người nhận hàng tại địa chỉ giao hàng.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span>Kiểm tra kỹ sản phẩm trước khi thanh toán. Sau khi thanh toán, sản phẩm sẽ được áp dụng chính sách bảo hành.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span>Nếu không có người nhận, đơn hàng sẽ được giao lại vào ngày hôm sau. Sau 3 lần giao không thành công, đơn hàng sẽ bị hủy.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span>Đối với đơn hàng giá trị cao, vui lòng chuẩn bị CMND/CCCD để xác minh khi nhận hàng.</span>
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            Mọi thắc mắc về giao hàng, vui lòng liên hệ:
          </p>
          <p className="text-xl font-bold text-primary">
            Hotline: 1900.5301 | Email: giaohang@anhhaoiphone.com
          </p>
        </section>
      </div>
    </div>
  )
}

export default Shipping

