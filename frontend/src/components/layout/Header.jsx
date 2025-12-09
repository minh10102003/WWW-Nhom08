import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useChat } from '../../context/ChatContext'
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiMessageCircle } from 'react-icons/fi'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [userMenuTimeout, setUserMenuTimeout] = useState(null)
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const { unreadCount } = useChat()
  const navigate = useNavigate()

  const handleUserMenuEnter = () => {
    if (userMenuTimeout) {
      clearTimeout(userMenuTimeout)
      setUserMenuTimeout(null)
    }
    setUserMenuOpen(true)
  }

  const handleUserMenuLeave = () => {
    const timeout = setTimeout(() => {
      setUserMenuOpen(false)
    }, 200) // Small delay to allow mouse to move to dropdown
    setUserMenuTimeout(timeout)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (userMenuTimeout) {
        clearTimeout(userMenuTimeout)
      }
    }
  }, [userMenuTimeout])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  // Kiểm tra xem user có role ADMIN không
  const isAdmin = () => {
    if (!user) return false
    const roles = user.vaiTro?.map(vt => vt.tenVaiTro || vt) || []
    return roles.includes('ROLE_ADMIN')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-primary text-white py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>Hotline: 1900.5301</span>
            <span>|</span>
            <Link to="/contact" className="hover:underline">Hệ thống Showroom</Link>
            <span>|</span>
            <Link to="/account/orders" className="hover:underline">Tra cứu đơn hàng</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/contact" className="hover:underline">Dịch vụ kỹ thuật tại nhà</Link>
            <span>|</span>
            <Link to="/contact" className="hover:underline">Thu cũ đổi mới</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:from-primary/90 hover:to-primary/70 transition-all duration-300">
            IUH Mobile
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-primary"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary transition"
            >
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user && (
              <Link
                to="/chat"
                className="relative p-2 text-gray-700 hover:text-primary transition"
                title="Chat với chúng tôi"
              >
                <FiMessageCircle size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
            {user ? (
              <div 
                className="relative"
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary transition">
                  <FiUser size={24} />
                  <span className="hidden md:block">{user.hoTen || user.email}</span>
                </button>
                {userMenuOpen && (
                  <div 
                    className="absolute right-0 top-full w-48 z-50 pt-1"
                    onMouseEnter={handleUserMenuEnter}
                    onMouseLeave={handleUserMenuLeave}
                  >
                    <div className="bg-white rounded-md shadow-lg py-1 border border-gray-200">
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Tài khoản
                      </Link>
                      <Link
                        to="/account/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Đơn hàng
                      </Link>
                      {isAdmin() && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition border-t border-gray-200 mt-1 pt-2"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span className="flex items-center">
                            <span className="mr-2">⚙️</span>
                            Trang Admin
                          </span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          handleLogout()
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition border-t border-gray-200 mt-1 pt-2"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary transition"
              >
                <FiUser size={24} />
                <span className="hidden md:block">Đăng nhập</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="py-3 text-gray-700 hover:text-primary transition">
                Trang chủ
              </Link>
              <Link to="/store" className="py-3 text-gray-700 hover:text-primary transition">
                Sản phẩm
              </Link>
              <Link to="/contact" className="py-3 text-gray-700 hover:text-primary transition">
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/store"
              className="block py-2 text-gray-700 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sản phẩm
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-gray-700 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Liên hệ
            </Link>
            {user && (
              <Link
                to="/chat"
                className="block py-2 text-gray-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                💬 Chat
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

