const Warranty = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Chính sách bảo hành
          </h1>
          <p className="text-xl text-gray-600">
            Cam kết bảo hành chính hãng Apple cho mọi sản phẩm
          </p>
        </div>

        {/* Warranty Period */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Thời gian bảo hành</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bảo hành chính hãng Apple</h3>
              <p className="text-gray-700 mb-2">
                Tất cả sản phẩm iPhone tại IUH Mobile đều được bảo hành chính hãng từ Apple với thời gian <strong>12 tháng</strong> kể từ ngày mua.
              </p>
              <p className="text-gray-600 text-sm">
                Bảo hành bao gồm: Lỗi phần cứng, lỗi phần mềm, lỗi do nhà sản xuất.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bảo hành mở rộng</h3>
              <p className="text-gray-700">
                Khách hàng có thể mua thêm gói bảo hành mở rộng AppleCare+ để được bảo hành lên đến <strong>24 tháng</strong> 
                và bảo vệ khỏi các sự cố rơi vỡ, vào nước.
              </p>
            </div>
          </div>
        </section>

        {/* Warranty Coverage */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Phạm vi bảo hành</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">✅</span> Được bảo hành
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Lỗi phần cứng do nhà sản xuất</li>
                <li>• Lỗi phần mềm hệ thống</li>
                <li>• Pin xuống cấp nhanh bất thường</li>
                <li>• Màn hình bị lỗi điểm ảnh</li>
                <li>• Lỗi camera, loa, micro</li>
                <li>• Lỗi nút bấm, cảm biến</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">❌</span> Không được bảo hành
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Rơi vỡ, va đập do người dùng</li>
                <li>• Vào nước, ẩm ướt</li>
                <li>• Sửa chữa tại nơi không ủy quyền</li>
                <li>• Hết hạn bảo hành</li>
                <li>• Mất tem bảo hành</li>
                <li>• Hư hỏng do sử dụng sai cách</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Warranty Process */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quy trình bảo hành</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Liên hệ bảo hành</h4>
                <p className="text-gray-600">
                  Gọi hotline <strong>1900.5325</strong> hoặc mang sản phẩm đến showroom gần nhất. 
                  Chuẩn bị hóa đơn mua hàng và sản phẩm cần bảo hành.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Kiểm tra sản phẩm</h4>
                <p className="text-gray-600">
                  Kỹ thuật viên sẽ kiểm tra tình trạng sản phẩm, xác định lỗi và đánh giá có thuộc phạm vi bảo hành hay không.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Xử lý bảo hành</h4>
                <p className="text-gray-600">
                  Nếu thuộc phạm vi bảo hành, sản phẩm sẽ được gửi đến trung tâm bảo hành chính hãng Apple. 
                  Thời gian xử lý: 7-14 ngày làm việc.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Nhận lại sản phẩm</h4>
                <p className="text-gray-600">
                  Sau khi sửa chữa xong, chúng tôi sẽ liên hệ để bạn đến nhận lại sản phẩm. 
                  Sản phẩm được bảo hành tiếp tục theo thời gian còn lại.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exchange Policy */}
        <section className="bg-gradient-primary text-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Chính sách đổi mới</h2>
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3">Đổi mới trong 7 ngày đầu</h3>
              <p className="opacity-90 mb-3">
                Khách hàng được quyền đổi sản phẩm mới trong vòng <strong>7 ngày</strong> kể từ ngày mua nếu:
              </p>
              <ul className="space-y-2 opacity-90">
                <li>• Sản phẩm còn nguyên seal, chưa kích hoạt</li>
                <li>• Còn đầy đủ hộp, phụ kiện, hóa đơn</li>
                <li>• Không có dấu hiệu sử dụng, trầy xước</li>
                <li>• Đổi sang sản phẩm khác cùng hoặc cao hơn giá trị</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3">Đổi mới do lỗi kỹ thuật</h3>
              <p className="opacity-90">
                Nếu sản phẩm bị lỗi kỹ thuật trong <strong>30 ngày</strong> đầu, khách hàng được đổi sản phẩm mới ngay lập tức 
                (không cần chờ sửa chữa).
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            Mọi thắc mắc về bảo hành, vui lòng liên hệ:
          </p>
          <p className="text-xl font-bold text-primary">
            Hotline: 1900.5325 | Email: baohanh@anhhaoiphone.com
          </p>
        </section>
      </div>
    </div>
  )
}

export default Warranty

