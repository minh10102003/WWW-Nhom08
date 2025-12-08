import { Link } from 'react-router-dom'

const ShipperGuide = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hướng Dẫn Sử Dụng</h1>
        <p className="text-gray-600">Hướng dẫn chi tiết cách sử dụng hệ thống quản lý giao hàng</p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Tổng quan */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Tổng Quan Hệ Thống</h2>
          </div>
          <div className="ml-16 space-y-3 text-gray-700">
            <p>Hệ thống Shipper Hub giúp bạn quản lý và theo dõi các đơn hàng được phân công một cách hiệu quả.</p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-semibold text-blue-900 mb-1">Các chức năng chính:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Xem danh sách đơn hàng được phân công</li>
                <li>Theo dõi trạng thái đơn hàng</li>
                <li>Xác nhận đã giao hàng thành công</li>
                <li>Xem thống kê đơn hàng</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: Xem đơn hàng */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Xem Danh Sách Đơn Hàng</h2>
          </div>
          <div className="ml-16 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Cách xem đơn hàng
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>Nhấp vào menu <strong>"Đơn Hàng"</strong> ở sidebar bên trái</li>
                <li>Danh sách đơn hàng được phân công cho bạn sẽ hiển thị</li>
                <li>Sử dụng bộ lọc để tìm kiếm đơn hàng theo trạng thái hoặc ngày</li>
              </ol>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="font-semibold text-green-900 mb-1">💡 Mẹo:</p>
              <p className="text-green-800">Bạn có thể lọc đơn hàng theo trạng thái "Đang giao" để xem các đơn hàng cần xử lý ngay.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Xác nhận giao hàng */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Xác Nhận Đã Giao Hàng</h2>
          </div>
          <div className="ml-16 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Các bước xác nhận giao hàng
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>
                  <strong>Tìm đơn hàng "Đang giao":</strong> Trong danh sách đơn hàng, tìm đơn hàng có trạng thái "Đang giao"
                </li>
                <li>
                  <strong>Nhấp nút "Xác nhận đã giao":</strong> Nhấp vào nút màu xanh lá ở cột "Thao tác"
                </li>
                <li>
                  <strong>Kiểm tra thông tin:</strong> Xem lại thông tin đơn hàng và người nhận
                </li>
                <li>
                  <strong>Nhập số lượng nhận hàng:</strong> 
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Kiểm tra số lượng sản phẩm thực tế đã giao</li>
                    <li>Nhập số lượng nhận hàng cho từng sản phẩm (nếu có thiếu sót)</li>
                    <li>Số lượng mặc định bằng số lượng đặt hàng</li>
                  </ul>
                </li>
                <li>
                  <strong>Thêm ghi chú (nếu cần):</strong> Nhập ghi chú về việc giao hàng, ví dụ:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                    <li>"Đã giao thành công, khách hàng đã kiểm tra và nhận hàng"</li>
                    <li>"Khách hàng vắng nhà, hẹn giao lại vào ngày mai"</li>
                    <li>"Sản phẩm có vấn đề nhỏ, đã thông báo với khách hàng"</li>
                  </ul>
                </li>
                <li>
                  <strong>Xác nhận:</strong> Nhấp nút "Xác nhận đã giao" để hoàn tất
                </li>
              </ol>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <p className="font-semibold text-purple-900 mb-1">⚠️ Lưu ý quan trọng:</p>
              <ul className="list-disc list-inside space-y-1 text-purple-800">
                <li>Sau khi xác nhận, đơn hàng sẽ chuyển sang trạng thái "Chờ duyệt"</li>
                <li>Admin sẽ xem xét và xác nhận hoàn thành đơn hàng</li>
                <li>Hãy đảm bảo số lượng nhận hàng chính xác trước khi xác nhận</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Trạng thái đơn hàng */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">4</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Hiểu Về Trạng Thái Đơn Hàng</h2>
          </div>
          <div className="ml-16 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                    Đang giao
                  </span>
                </div>
                <p className="text-gray-700 text-sm">
                  Đơn hàng đã được admin phân công cho bạn. Bạn cần giao hàng và xác nhận khi hoàn thành.
                </p>
              </div>
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold border border-purple-200">
                    Chờ duyệt
                  </span>
                </div>
                <p className="text-gray-700 text-sm">
                  Bạn đã xác nhận đã giao hàng. Đơn hàng đang chờ admin xem xét và xác nhận hoàn thành.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Dashboard */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">5</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sử Dụng Dashboard</h2>
          </div>
          <div className="ml-16 space-y-3 text-gray-700">
            <p>Dashboard hiển thị tổng quan về công việc của bạn:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Đơn Hàng Đang Giao:</strong> Số lượng đơn hàng bạn cần xử lý ngay</li>
              <li><strong>Đơn Hàng Chờ Duyệt:</strong> Số lượng đơn hàng đã giao, đang chờ admin xác nhận</li>
              <li><strong>Tổng Đơn Hàng:</strong> Tổng số đơn hàng đã được phân công cho bạn</li>
            </ul>
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded mt-4">
              <p className="font-semibold text-indigo-900 mb-1">💡 Gợi ý:</p>
              <p className="text-indigo-800">Thường xuyên kiểm tra Dashboard để theo dõi tiến độ công việc của bạn.</p>
            </div>
          </div>
        </div>

        {/* Section 6: Lọc và tìm kiếm */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">6</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Lọc Và Tìm Kiếm Đơn Hàng</h2>
          </div>
          <div className="ml-16 space-y-3 text-gray-700">
            <p>Bạn có thể sử dụng các bộ lọc để tìm đơn hàng nhanh chóng:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Lọc theo trạng thái:</strong> Chọn "Đang giao" hoặc "Chờ duyệt"</li>
              <li><strong>Lọc theo ngày:</strong> Chọn khoảng thời gian từ ngày đến ngày</li>
              <li><strong>Reset:</strong> Nhấp nút "Reset" để xóa tất cả bộ lọc</li>
            </ul>
          </div>
        </div>

        {/* Section 7: Câu hỏi thường gặp */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">?</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Câu Hỏi Thường Gặp</h2>
          </div>
          <div className="ml-16 space-y-4">
            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Q: Tôi có thể sửa lại thông tin sau khi đã xác nhận giao hàng không?</h3>
              <p className="text-gray-700">A: Không, sau khi xác nhận giao hàng, đơn hàng sẽ chuyển sang "Chờ duyệt" và chỉ admin mới có thể xử lý. Vui lòng kiểm tra kỹ trước khi xác nhận.</p>
            </div>
            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Q: Nếu số lượng sản phẩm giao thiếu thì sao?</h3>
              <p className="text-gray-700">A: Bạn có thể nhập số lượng nhận hàng thực tế trong form xác nhận. Hãy ghi chú rõ ràng lý do thiếu hàng để admin có thể xử lý.</p>
            </div>
            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Q: Khi nào đơn hàng được coi là hoàn thành?</h3>
              <p className="text-gray-700">A: Sau khi bạn xác nhận đã giao, admin sẽ xem xét và xác nhận hoàn thành. Đơn hàng sẽ chuyển sang trạng thái "Hoàn thành" khi admin xác nhận.</p>
            </div>
            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Q: Tôi không thấy đơn hàng nào trong danh sách?</h3>
              <p className="text-gray-700">A: Có thể bạn chưa được phân công đơn hàng nào, hoặc đang lọc sai trạng thái. Hãy thử reset bộ lọc hoặc liên hệ admin để được phân công đơn hàng.</p>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Sẵn sàng bắt đầu?</h2>
              <p className="opacity-90">Quay lại Dashboard để xem đơn hàng của bạn</p>
            </div>
            <Link
              to="/shipper"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
            >
              Về Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShipperGuide

