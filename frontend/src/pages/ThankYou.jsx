import { Link } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Cảm ơn bạn đã đặt hàng!</h1>
        <p className="text-gray-600 mb-6">
          Đơn hàng của bạn đã được tiếp nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
        </p>
        <div className="space-y-3">
          <Link
            to="/account/orders"
            className="block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Xem đơn hàng
          </Link>
          <Link
            to="/store"
            className="block w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ThankYou

