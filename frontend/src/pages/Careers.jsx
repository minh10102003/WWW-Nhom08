const Careers = () => {
  const positions = [
    {
      title: 'Nhân viên Tư vấn Bán hàng',
      department: 'Bán hàng',
      location: 'TP.HCM, Hà Nội, Đà Nẵng',
      type: 'Full-time',
      description: 'Tư vấn và hỗ trợ khách hàng lựa chọn sản phẩm iPhone phù hợp, chăm sóc khách hàng tại showroom.'
    },
    {
      title: 'Kỹ thuật viên Sửa chữa',
      department: 'Kỹ thuật',
      location: 'TP.HCM',
      type: 'Full-time',
      description: 'Sửa chữa, bảo hành iPhone, kiểm tra và đánh giá tình trạng thiết bị, hỗ trợ kỹ thuật cho khách hàng.'
    },
    {
      title: 'Nhân viên Kho vận',
      department: 'Logistics',
      location: 'TP.HCM',
      type: 'Full-time',
      description: 'Quản lý kho hàng, xuất nhập hàng hóa, đóng gói và chuẩn bị đơn hàng giao cho khách hàng.'
    },
    {
      title: 'Chuyên viên Marketing',
      department: 'Marketing',
      location: 'TP.HCM',
      type: 'Full-time',
      description: 'Xây dựng chiến lược marketing, quản lý mạng xã hội, tạo nội dung quảng cáo và chạy các chiến dịch marketing.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Tuyển dụng
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gia nhập đội ngũ IUH Mobile - Nơi phát triển sự nghiệp của bạn
          </p>
        </div>

        {/* Why Join Us */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Tại sao chọn IUH Mobile?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Mức lương cạnh tranh</h3>
                <p className="text-gray-600">Lương cơ bản + hoa hồng hấp dẫn, thưởng theo hiệu suất công việc.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">📚</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Đào tạo chuyên nghiệp</h3>
                <p className="text-gray-600">Chương trình đào tạo bài bản, cơ hội phát triển kỹ năng và thăng tiến.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🏥</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Phúc lợi đầy đủ</h3>
                <p className="text-gray-600">Bảo hiểm đầy đủ, nghỉ phép có lương, mua sản phẩm với giá ưu đãi.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🌟</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Môi trường làm việc</h3>
                <p className="text-gray-600">Môi trường trẻ trung, năng động, đồng nghiệp thân thiện, hỗ trợ lẫn nhau.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Vị trí đang tuyển dụng</h2>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-3 mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                        {position.department}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        📍 {position.location}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {position.type}
                      </span>
                    </div>
                    <p className="text-gray-600">{position.description}</p>
                  </div>
                  <button className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all whitespace-nowrap">
                    Ứng tuyển ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quy trình ứng tuyển</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold mb-2">Nộp hồ sơ</h4>
              <p className="text-sm text-gray-600">Gửi CV và đơn ứng tuyển qua email hoặc trực tiếp tại showroom</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold mb-2">Sàng lọc</h4>
              <p className="text-sm text-gray-600">Bộ phận HR sẽ xem xét và liên hệ với ứng viên phù hợp</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold mb-2">Phỏng vấn</h4>
              <p className="text-sm text-gray-600">Phỏng vấn trực tiếp với quản lý bộ phận và HR</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h4 className="font-bold mb-2">Nhận việc</h4>
              <p className="text-sm text-gray-600">Ký hợp đồng và bắt đầu công việc mới</p>
            </div>
          </div>
        </section>

        {/* Contact HR */}
        <section className="mt-8 bg-gradient-primary text-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Gửi hồ sơ ứng tuyển</h2>
          <p className="mb-6 opacity-90">
            Gửi CV và thư xin việc đến email: <strong>tuyendung@iuhmobile.com</strong>
          </p>
          <p className="text-sm opacity-75">
            Hotline: <strong>1900.5301</strong> (Phòng Nhân sự)
          </p>
        </section>
      </div>
    </div>
  )
}

export default Careers

