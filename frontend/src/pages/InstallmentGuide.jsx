const InstallmentGuide = () => {
  const banks = [
    {
      name: 'Vietcombank',
      logo: '🏦',
      features: ['0% lãi suất', 'Trả góp 6-12 tháng', 'Duyệt nhanh trong 5 phút'],
      requirements: ['CMND/CCCD', 'Hóa đơn lương hoặc sao kê ngân hàng']
    },
    {
      name: 'BIDV',
      logo: '🏦',
      features: ['0% lãi suất', 'Trả góp 6-24 tháng', 'Duyệt tự động'],
      requirements: ['CMND/CCCD', 'Hóa đơn lương hoặc sao kê ngân hàng']
    },
    {
      name: 'Techcombank',
      logo: '🏦',
      features: ['0% lãi suất', 'Trả góp 3-12 tháng', 'Duyệt online'],
      requirements: ['CMND/CCCD', 'Hóa đơn lương hoặc sao kê ngân hàng']
    },
    {
      name: 'VPBank',
      logo: '🏦',
      features: ['0% lãi suất', 'Trả góp 6-18 tháng', 'Duyệt nhanh'],
      requirements: ['CMND/CCCD', 'Hóa đơn lương hoặc sao kê ngân hàng']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Hướng dẫn trả góp
          </h1>
          <p className="text-xl text-gray-600">
            Trả góp 0% lãi suất, mua iPhone ngay không cần chờ đợi
          </p>
        </div>

        {/* Benefits */}
        <section className="bg-gradient-primary text-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-center">Ưu điểm trả góp tại IUH Mobile</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-lg mb-2">0% Lãi suất</h3>
              <p className="text-sm opacity-90">Không phát sinh lãi suất, chỉ trả đúng giá sản phẩm</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-lg mb-2">Duyệt nhanh</h3>
              <p className="text-sm opacity-90">Duyệt hồ sơ trong 5-15 phút, nhận máy ngay</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-bold text-lg mb-2">Linh hoạt</h3>
              <p className="text-sm opacity-90">Chọn kỳ hạn 3, 6, 12, 18, 24 tháng</p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quy trình trả góp</h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-xl text-gray-900 mb-2">Chọn sản phẩm và phương thức trả góp</h4>
                <p className="text-gray-700">
                  Chọn sản phẩm iPhone bạn muốn mua, sau đó chọn phương thức thanh toán "Trả góp 0%". 
                  Chọn ngân hàng và kỳ hạn trả góp phù hợp (3, 6, 12, 18, 24 tháng).
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-xl text-gray-900 mb-2">Điền thông tin và tải giấy tờ</h4>
                <p className="text-gray-700">
                  Điền đầy đủ thông tin cá nhân: Họ tên, CMND/CCCD, số điện thoại, email, địa chỉ. 
                  Tải lên ảnh CMND/CCCD mặt trước và mặt sau, hóa đơn lương hoặc sao kê ngân hàng 3 tháng gần nhất.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-xl text-gray-900 mb-2">Duyệt hồ sơ</h4>
                <p className="text-gray-700">
                  Ngân hàng sẽ xem xét và duyệt hồ sơ của bạn. Thời gian duyệt thường từ 5-15 phút. 
                  Bạn sẽ nhận được thông báo qua SMS và email khi hồ sơ được duyệt.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-xl text-gray-900 mb-2">Ký hợp đồng và nhận máy</h4>
                <p className="text-gray-700">
                  Sau khi được duyệt, bạn sẽ ký hợp đồng trả góp với ngân hàng (có thể ký online hoặc tại showroom). 
                  Sau đó nhận máy ngay và bắt đầu sử dụng. Thanh toán hàng tháng theo kỳ hạn đã chọn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Banks */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ngân hàng hỗ trợ trả góp</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {banks.map((bank, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-xl p-6 hover:border-primary transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{bank.logo}</div>
                  <h3 className="text-xl font-bold text-gray-900">{bank.name}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ưu điểm:</h4>
                    <ul className="space-y-1">
                      {bank.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Giấy tờ cần:</h4>
                    <ul className="space-y-1">
                      {bank.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="text-primary">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Điều kiện trả góp</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-lg text-green-800 mb-4">Điều kiện cơ bản</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Độ tuổi: Từ 18 tuổi trở lên</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Có CMND/CCCD còn hiệu lực</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Có thu nhập ổn định (từ 5 triệu/tháng trở lên)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Có tài khoản ngân hàng</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-bold text-lg text-blue-800 mb-4">Giấy tờ cần chuẩn bị</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">📄</span>
                  <span>CMND/CCCD bản gốc (để đối chiếu)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">📄</span>
                  <span>Ảnh CMND/CCCD mặt trước và mặt sau (rõ nét)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">📄</span>
                  <span>Hóa đơn lương 3 tháng gần nhất HOẶC</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">📄</span>
                  <span>Sao kê ngân hàng 3 tháng gần nhất</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Payment Schedule */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ví dụ thanh toán</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 mb-4">
              <strong>Sản phẩm:</strong> iPhone 15 Pro Max 256GB - Giá: 29.990.000₫
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-bold">Kỳ hạn</th>
                    <th className="text-right py-3 px-4 font-bold">Số tiền/tháng</th>
                    <th className="text-right py-3 px-4 font-bold">Tổng thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4">3 tháng</td>
                    <td className="text-right py-3 px-4 font-semibold">9.996.667₫</td>
                    <td className="text-right py-3 px-4">29.990.000₫</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4">6 tháng</td>
                    <td className="text-right py-3 px-4 font-semibold">4.998.333₫</td>
                    <td className="text-right py-3 px-4">29.990.000₫</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4">12 tháng</td>
                    <td className="text-right py-3 px-4 font-semibold">2.499.167₫</td>
                    <td className="text-right py-3 px-4">29.990.000₫</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">24 tháng</td>
                    <td className="text-right py-3 px-4 font-semibold">1.249.583₫</td>
                    <td className="text-right py-3 px-4">29.990.000₫</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              <strong>Lưu ý:</strong> Tất cả các kỳ hạn đều 0% lãi suất. Tổng số tiền thanh toán = Giá sản phẩm.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu hỏi thường gặp</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-bold text-lg mb-2">Trả góp có mất phí gì không?</h4>
              <p className="text-gray-600">
                Không, trả góp tại IUH Mobile hoàn toàn 0% lãi suất, không phát sinh phí dịch vụ hay phí ẩn nào.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-bold text-lg mb-2">Có thể trả trước một phần không?</h4>
              <p className="text-gray-600">
                Có, bạn có thể trả trước một phần (ví dụ: 30%, 50%) và trả góp phần còn lại. 
                Điều này giúp giảm số tiền trả hàng tháng.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-bold text-lg mb-2">Thanh toán hàng tháng như thế nào?</h4>
              <p className="text-gray-600">
                Số tiền sẽ được tự động trừ từ tài khoản ngân hàng của bạn vào ngày cố định mỗi tháng 
                (theo ngày bạn ký hợp đồng). Bạn cũng có thể thanh toán sớm hoặc trả toàn bộ bất cứ lúc nào.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-bold text-lg mb-2">Nếu không duyệt được thì sao?</h4>
              <p className="text-gray-600">
                Nếu hồ sơ không được duyệt, bạn vẫn có thể mua sản phẩm bằng cách thanh toán toàn bộ 
                hoặc chọn ngân hàng khác để thử lại.
              </p>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="bg-gradient-primary text-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Cần tư vấn về trả góp?</h2>
          <p className="mb-4 opacity-90">
            Đội ngũ tư vấn của chúng tôi sẵn sàng hỗ trợ bạn 24/7
          </p>
          <p className="text-xl font-bold">
            Hotline: 1900.5301 | Email: trago@anhhaoiphone.com
          </p>
          <p className="mt-4 text-sm opacity-75">
            Hoặc đến trực tiếp showroom để được tư vấn và làm thủ tục ngay
          </p>
        </section>
      </div>
    </div>
  )
}

export default InstallmentGuide

