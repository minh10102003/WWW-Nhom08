const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Về IUH Mobile
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Địa chỉ tin cậy cho mọi nhu cầu về iPhone chính hãng tại Việt Nam
          </p>
        </div>

        {/* Mission Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sứ mệnh của chúng tôi</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              <strong>IUH Mobile</strong> được thành lập với sứ mệnh mang đến cho khách hàng Việt Nam những sản phẩm iPhone chính hãng chất lượng cao nhất, 
              cùng với dịch vụ chăm sóc khách hàng tận tâm và chuyên nghiệp.
            </p>
            <p>
              Chúng tôi cam kết cung cấp các sản phẩm 100% chính hãng Apple, được nhập khẩu trực tiếp từ các nhà phân phối chính thức, 
              đảm bảo chất lượng và nguồn gốc xuất xứ rõ ràng.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow animate-fade-in">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Chất lượng hàng đầu</h3>
            <p className="text-gray-600">
              Chỉ bán sản phẩm chính hãng 100%, có đầy đủ giấy tờ chứng nhận và bảo hành chính thức từ Apple.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Giá cả hợp lý</h3>
            <p className="text-gray-600">
              Cam kết giá tốt nhất thị trường, hỗ trợ trả góp 0% lãi suất, thanh toán linh hoạt.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Dịch vụ chuyên nghiệp</h3>
            <p className="text-gray-600">
              Đội ngũ tư vấn chuyên nghiệp, giao hàng nhanh chóng, bảo hành 1 đổi 1 trong 7 ngày đầu.
            </p>
          </div>
        </section>

        {/* History Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Lịch sử phát triển</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">2020 - Khởi đầu</h4>
                <p className="text-gray-600">
                  IUH Mobile được thành lập với cửa hàng đầu tiên tại TP.HCM, chuyên cung cấp iPhone chính hãng.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">2022 - Mở rộng</h4>
                <p className="text-gray-600">
                  Mở rộng hệ thống showroom tại Hà Nội và Đà Nẵng, phục vụ khách hàng trên toàn quốc.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">2024 - Hiện tại</h4>
                <p className="text-gray-600">
                  Phát triển nền tảng thương mại điện tử, giao hàng toàn quốc, phục vụ hàng trăm nghìn khách hàng mỗi năm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="bg-gradient-primary text-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Thành tựu nổi bật</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="opacity-90">Khách hàng tin tưởng</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="opacity-90">Showroom trên toàn quốc</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="opacity-90">Đánh giá hài lòng</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="opacity-90">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About

