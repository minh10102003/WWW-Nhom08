import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../services/api'

const VNPayReturn = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshCart } = useCart()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Đang xử lý...')
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Lấy các tham số từ URL và chuyển thành object
        const params = {}
        searchParams.forEach((value, key) => {
          params[key] = value
        })
        
        console.log('VNPay Return - URL Params:', params)
        console.log('VNPay Return - Full URL:', window.location.href)
        
        // Kiểm tra xem có status trong URL không (từ backend redirect)
        const statusFromUrl = searchParams.get('status')
        const messageFromUrl = searchParams.get('message')
        const orderIdFromUrl = searchParams.get('orderId')
        
        if (statusFromUrl) {
          // Đã được xử lý bởi backend, chỉ cần hiển thị kết quả
          console.log('Status from URL (already processed by backend):', statusFromUrl)
          console.log('Message from URL:', messageFromUrl)
          console.log('OrderId from URL:', orderIdFromUrl)
          
          // Decode message nếu có (URL đã được encode)
          const decodedMessage = messageFromUrl ? decodeURIComponent(messageFromUrl) : 'Đã xử lý thanh toán'
          
          setStatus(statusFromUrl)
          setMessage(decodedMessage)
          setOrderId(orderIdFromUrl)
          
          if (statusFromUrl === 'success') {
            // Xóa cart sau khi thanh toán thành công
            try {
              await refreshCart()
            } catch (cartError) {
              console.warn('Error refreshing cart:', cartError)
            }
            
            // Chuyển đến trang cảm ơn sau 2 giây
            setTimeout(() => {
              navigate('/thank-you')
            }, 2000)
          }
          return
        }
        
        // Nếu không có status, có nghĩa là VNPay redirect trực tiếp về đây
        // Cần gọi API để xử lý
        if (Object.keys(params).length === 0) {
          console.warn('No params found in URL')
          setStatus('error')
          setMessage('Không tìm thấy thông tin thanh toán. Vui lòng kiểm tra lại.')
          return
        }
        
        // Gọi API backend để xử lý callback
        console.log('Calling API /api/vnpay/return with params:', params)
        const response = await api.get('/api/vnpay/return', {
          params: params,
          timeout: 30000 // 30 seconds timeout
        })
        
        console.log('VNPay Return API Response:', response)
        const data = response.data
        console.log('VNPay Return Response Data:', data)
        
        if (data && data.status === 'success') {
          // Thanh toán thành công
          setStatus('success')
          setMessage(data.message || 'Thanh toán thành công!')
          setOrderId(data.orderId)
          
          // Xóa cart sau khi thanh toán thành công
          try {
            await refreshCart()
          } catch (cartError) {
            console.warn('Error refreshing cart:', cartError)
          }
          
          // Chuyển đến trang cảm ơn sau 2 giây
          setTimeout(() => {
            navigate('/thank-you')
          }, 2000)
        } else if (data && data.status === 'failed') {
          // Thanh toán thất bại
          setStatus('failed')
          setMessage(data.message || 'Thanh toán không thành công')
        } else {
          // Lỗi khác
          setStatus('error')
          setMessage(data?.message || 'Có lỗi xảy ra khi xử lý thanh toán')
        }
      } catch (error) {
        console.error('Error processing payment:', error)
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          request: error.request,
          config: error.config
        })
        
        let errorMessage = 'Có lỗi xảy ra khi xử lý thanh toán'
        
        if (error.response) {
          // Server responded with error
          errorMessage = error.response.data?.message || error.response.data?.error || errorMessage
          console.error('Server error response:', error.response.data)
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = 'Không nhận được phản hồi từ server. Vui lòng thử lại.'
          console.error('No response received:', error.request)
        } else {
          // Something else happened
          errorMessage = error.message || errorMessage
        }
        
        setStatus('error')
        setMessage(errorMessage)
      }
    }

    processPayment()
  }, [searchParams, navigate, refreshCart])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang xử lý thanh toán...</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Thanh toán thành công!</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              {orderId && (
                <p className="text-sm text-gray-500">Mã đơn hàng: #{orderId}</p>
              )}
              <p className="text-sm text-gray-500 mt-4">Đang chuyển đến trang cảm ơn...</p>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Thanh toán thất bại</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Quay lại giỏ hàng
                </button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-yellow-600 mb-2">Có lỗi xảy ra</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Quay lại trang thanh toán
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VNPayReturn

