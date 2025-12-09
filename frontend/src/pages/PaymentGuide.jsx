const PaymentGuide = () => {
  const paymentMethods = [
    {
      name: 'Thanh toán khi nhận hàng (COD)',
      icon: '💵',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      steps: [
        'Đặt hàng online không cần thanh toán trước',
        'Nhân viên giao hàng sẽ liên hệ trước khi đến',
        'Kiểm tra sản phẩm kỹ lưỡng',
        'Thanh toán bằng tiền mặt cho nhân viên giao hàng',
        'Nhận hóa đơn và giữ lại để bảo hành'
      ],
      note: 'Phí COD: Miễn phí. Áp dụng cho đơn hàng dưới 5 triệu đồng.'
    },
    {
      name: 'Chuyển khoản ngân hàng',
      icon: '🏦',
      description: 'Chuyển khoản qua tài khoản ngân hàng',
      steps: [
        'Chọn phương thức "Chuyển khoản ngân hàng"',
        'Chuyển khoản đến tài khoản của IUH Mobile',
        'Nội dung chuyển khoản: Mã đơn hàng + Số điện thoại',
        'Gửi ảnh biên lai chuyển khoản qua email hoặc Zalo',
        'Chúng tôi sẽ xác nhận và giao hàng trong 24h'
      ],
      note: 'Ưu đãi: Giảm thêm 1% khi thanh toán chuyển khoản. Nhận hàng nhanh hơn.'
    },
    {
      name: 'Thẻ tín dụng / Ghi nợ',
      icon: '💳',
      description: 'Thanh toán online bằng thẻ Visa, Mastercard, JCB',
      steps: [
        'Chọn phương thức "Thẻ tín dụng/Ghi nợ"',
        'Nhập thông tin thẻ: Số thẻ, tên chủ thẻ, ngày hết hạn, CVV',
        'Xác nhận thanh toán qua OTP từ ngân hàng',
        'Thanh toán thành công, đơn hàng được xử lý ngay',
        'Nhận email xác nhận đơn hàng'
      ],
      note: 'Bảo mật: Thông tin thẻ được mã hóa SSL, không lưu trữ trên hệ thống.'
    },
    {
      name: 'Ví điện tử',
      icon: '📱',
      description: 'Thanh toán qua MoMo, ZaloPay, VNPay',
      steps: [
        'Chọn phương thức "Ví điện tử"',
        'Chọn ví điện tử bạn muốn sử dụng',
        'Quét mã QR hoặc chuyển hướng đến app',
        'Xác nhận thanh toán trên app',
        'Hoàn tất đơn hàng'
      ],
      note: 'Tiện lợi: Thanh toán nhanh chóng, không cần nhập thông tin thẻ.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Hướng dẫn thanh toán
          </h1>
          <p className="text-xl text-gray-600">
            Nhiều phương thức thanh toán linh hoạt, an toàn và tiện lợi
          </p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-6 mb-8">
          {paymentMethods.map((method, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="text-5xl">{method.icon}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{method.name}</h2>
                  <p className="text-gray-600">{method.description}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <h3 className="font-bold text-lg mb-4">Các bước thanh toán:</h3>
                <ol className="space-y-3">
                  {method.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {stepIndex + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>💡 Lưu ý:</strong> {method.note}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bank Accounts */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Thông tin tài khoản ngân hàng</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Vietcombank</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Số tài khoản:</strong> 1234567890</p>
                <p><strong>Chủ tài khoản:</strong> CÔNG TY TNHH IUH MOBILE</p>
                <p><strong>Chi nhánh:</strong> TP.HCM</p>
              </div>
            </div>
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">BIDV</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Số tài khoản:</strong> 9876543210</p>
                <p><strong>Chủ tài khoản:</strong> CÔNG TY TNHH IUH MOBILE</p>
                <p><strong>Chi nhánh:</strong> TP.HCM</p>
              </div>
            </div>
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Techcombank</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Số tài khoản:</strong> 1122334455</p>
                <p><strong>Chủ tài khoản:</strong> CÔNG TY TNHH IUH MOBILE</p>
                <p><strong>Chi nhánh:</strong> TP.HCM</p>
              </div>
            </div>
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Vietinbank</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Số tài khoản:</strong> 5566778899</p>
                <p><strong>Chủ tài khoản:</strong> CÔNG TY TNHH IUH MOBILE</p>
                <p><strong>Chi nhánh:</strong> TP.HCM</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Bảo mật thanh toán</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold mb-2">Mã hóa SSL</h3>
              <p className="text-sm text-gray-600">Tất cả giao dịch được mã hóa bảo mật</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-bold mb-2">Không lưu thông tin</h3>
              <p className="text-sm text-gray-600">Không lưu trữ thông tin thẻ trên hệ thống</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold mb-2">Xác thực OTP</h3>
              <p className="text-sm text-gray-600">Xác thực qua OTP từ ngân hàng</p>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lưu ý quan trọng</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span>Khi chuyển khoản, vui lòng ghi rõ mã đơn hàng và số điện thoại trong nội dung chuyển khoản</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span>Sau khi chuyển khoản, vui lòng gửi ảnh biên lai để chúng tôi xác nhận nhanh chóng</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span>Không chuyển khoản vào bất kỳ tài khoản cá nhân nào, chỉ chuyển vào tài khoản công ty</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span>Nếu thanh toán online, vui lòng kiểm tra kỹ thông tin trước khi xác nhận</span>
            </li>
          </ul>
        </section>

        {/* Support */}
        <section className="bg-gradient-primary text-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ thanh toán?</h2>
          <p className="mb-4 opacity-90">
            Nếu bạn gặp vấn đề trong quá trình thanh toán, vui lòng liên hệ ngay với chúng tôi
          </p>
          <p className="text-xl font-bold">
            Hotline: 1900.5301 | Email: thanhtoan@iuhmobile.com
          </p>
        </section>
      </div>
    </div>
  )
}

export default PaymentGuide

