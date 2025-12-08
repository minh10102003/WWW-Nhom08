import { Link } from 'react-router-dom'
import { FiFacebook, FiYoutube, FiInstagram } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Về chúng tôi */}
          <div>
            <h3 className="text-lg font-bold mb-4">Về IUH Mobile</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition">
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h3 className="text-lg font-bold mb-4">Chính sách</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/warranty" className="hover:text-white transition">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Thông tin */}
          <div>
            <h3 className="text-lg font-bold mb-4">Thông tin</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/stores" className="hover:text-white transition">
                  Hệ thống cửa hàng
                </Link>
              </li>
              <li>
                <Link to="/guide" className="hover:text-white transition">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link to="/payment" className="hover:text-white transition">
                  Hướng dẫn thanh toán
                </Link>
              </li>
              <li>
                <Link to="/installment" className="hover:text-white transition">
                  Hướng dẫn trả góp
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="text-lg font-bold mb-4">Tổng đài hỗ trợ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Mua hàng: <span className="text-white font-semibold">1900.5301</span></li>
              <li>Bảo hành: <span className="text-white font-semibold">1900.5325</span></li>
              <li>Khiếu nại: <span className="text-white font-semibold">1800.6173</span></li>
              <li className="mt-4">Email: cskh@iphoneshop.com</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FiFacebook size={24} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FiYoutube size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FiInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>Copyright © 2025 IUH Mobile. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

