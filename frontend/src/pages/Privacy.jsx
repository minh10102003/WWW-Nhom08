const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Chính sách bảo mật
          </h1>
          <p className="text-xl text-gray-600">
            Cam kết bảo vệ thông tin cá nhân của khách hàng
          </p>
        </div>

        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
          <p className="text-gray-700 leading-relaxed">
            <strong>IUH Mobile</strong> cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. 
            Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn 
            khi sử dụng dịch vụ của chúng tôi.
          </p>
        </section>

        {/* Information Collection */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Thông tin chúng tôi thu thập</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Thông tin cá nhân</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Họ và tên</li>
                <li>• Số điện thoại</li>
                <li>• Email</li>
                <li>• Địa chỉ giao hàng</li>
                <li>• Thông tin thanh toán (được mã hóa an toàn)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Thông tin tự động</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Địa chỉ IP</li>
                <li>• Loại trình duyệt và thiết bị</li>
                <li>• Trang web bạn truy cập trước đó</li>
                <li>• Thời gian và ngày truy cập</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Information Usage */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Mục đích sử dụng thông tin</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl">📦</div>
              <div>
                <h4 className="font-bold text-lg mb-2">Xử lý đơn hàng</h4>
                <p className="text-gray-600">Xác nhận, xử lý và giao hàng đơn hàng của bạn</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">💬</div>
              <div>
                <h4 className="font-bold text-lg mb-2">Chăm sóc khách hàng</h4>
                <p className="text-gray-600">Liên hệ, hỗ trợ và giải đáp thắc mắc của khách hàng</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">📧</div>
              <div>
                <h4 className="font-bold text-lg mb-2">Gửi thông tin</h4>
                <p className="text-gray-600">Gửi thông tin về sản phẩm mới, khuyến mãi (nếu bạn đồng ý)</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">🔒</div>
              <div>
                <h4 className="font-bold text-lg mb-2">Bảo mật</h4>
                <p className="text-gray-600">Bảo vệ tài khoản và phát hiện các hoạt động gian lận</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">📊</div>
              <div>
                <h4 className="font-bold text-lg mb-2">Cải thiện dịch vụ</h4>
                <p className="text-gray-600">Phân tích và cải thiện trải nghiệm người dùng</p>
              </div>
            </div>
          </div>
        </section>

        {/* Information Protection */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Bảo vệ thông tin</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Chúng tôi sử dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn:
            </p>
            <ul className="space-y-2 ml-6">
              <li>• <strong>Mã hóa SSL/TLS:</strong> Tất cả dữ liệu được truyền qua kết nối an toàn</li>
              <li>• <strong>Bảo mật cơ sở dữ liệu:</strong> Thông tin được lưu trữ trên hệ thống được mã hóa</li>
              <li>• <strong>Kiểm soát truy cập:</strong> Chỉ nhân viên được ủy quyền mới có thể truy cập thông tin</li>
              <li>• <strong>Bảo mật thanh toán:</strong> Thông tin thẻ tín dụng được xử lý bởi các cổng thanh toán uy tín</li>
              <li>• <strong>Kiểm tra định kỳ:</strong> Thường xuyên kiểm tra và cập nhật hệ thống bảo mật</li>
            </ul>
          </div>
        </section>

        {/* Information Sharing */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Chia sẻ thông tin</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Chúng tôi <strong>KHÔNG</strong> bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba, 
              trừ các trường hợp sau:
            </p>
            <ul className="space-y-2 ml-6">
              <li>• <strong>Đối tác giao hàng:</strong> Chia sẻ thông tin địa chỉ để giao hàng</li>
              <li>• <strong>Đối tác thanh toán:</strong> Chia sẻ thông tin cần thiết để xử lý thanh toán</li>
              <li>• <strong>Yêu cầu pháp lý:</strong> Khi có yêu cầu từ cơ quan nhà nước có thẩm quyền</li>
              <li>• <strong>Bảo vệ quyền lợi:</strong> Để bảo vệ quyền lợi và an toàn của chúng tôi và khách hàng</li>
            </ul>
          </div>
        </section>

        {/* Customer Rights */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quyền của khách hàng</h2>
          <div className="space-y-4 text-gray-700">
            <p>Bạn có quyền:</p>
            <ul className="space-y-2 ml-6">
              <li>• Truy cập và xem thông tin cá nhân của mình</li>
              <li>• Yêu cầu chỉnh sửa thông tin không chính xác</li>
              <li>• Yêu cầu xóa thông tin cá nhân (theo quy định pháp luật)</li>
              <li>• Từ chối nhận email marketing (unsubscribe)</li>
              <li>• Khiếu nại về việc xử lý thông tin cá nhân</li>
            </ul>
          </div>
        </section>

        {/* Cookies */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookies</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Chúng tôi sử dụng cookies để cải thiện trải nghiệm của bạn trên website. 
              Bạn có thể tắt cookies trong cài đặt trình duyệt, nhưng điều này có thể ảnh hưởng đến một số chức năng của website.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-primary text-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Liên hệ về bảo mật</h2>
          <p className="mb-4 opacity-90">
            Nếu bạn có câu hỏi hoặc yêu cầu về chính sách bảo mật, vui lòng liên hệ:
          </p>
          <p className="text-xl font-bold">
            Email: privacy@iuhmobile.com | Hotline: 1900.5301
          </p>
          <p className="mt-4 text-sm opacity-75">
            Chính sách này có thể được cập nhật định kỳ. Vui lòng kiểm tra lại thường xuyên.
          </p>
        </section>
      </div>
    </div>
  )
}

export default Privacy

