import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ChatProvider } from './context/ChatContext'

// Layout Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// Page Components
import Home from './pages/Home'
import Store from './pages/Store'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import VNPayReturn from './pages/VNPayReturn'
import Account from './pages/Account'
import Orders from './pages/Orders'
import Contact from './pages/Contact'
import SearchResult from './pages/SearchResult'
import ThankYou from './pages/ThankYou'
import About from './pages/About'
import Careers from './pages/Careers'
import Warranty from './pages/Warranty'
import Shipping from './pages/Shipping'
import Privacy from './pages/Privacy'
import Stores from './pages/Stores'
import ShoppingGuide from './pages/ShoppingGuide'
import PaymentGuide from './pages/PaymentGuide'
import InstallmentGuide from './pages/InstallmentGuide'
import Admin from './pages/Admin'
import Shipper from './pages/Shipper'
import Chat from './pages/Chat'
import ChatbotWidget from './components/Chatbot'

function AppContent() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')
  const isShipperPage = location.pathname.startsWith('/shipper')

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && !isShipperPage && <Header />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Cart & Order Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/vnpay/return" element={<VNPayReturn />} />
          <Route path="/thank-you" element={<ThankYou />} />

          {/* User Routes */}
          <Route path="/account" element={<Account />} />
          <Route path="/account/orders" element={<Orders />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<Admin />} />

          {/* Shipper Routes */}
          <Route path="/shipper/*" element={<Shipper />} />

          {/* Utility Routes */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/search" element={<SearchResult />} />

          {/* Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/guide" element={<ShoppingGuide />} />
          <Route path="/payment" element={<PaymentGuide />} />
          <Route path="/installment" element={<InstallmentGuide />} />
        </Routes>
      </main>

      {!isAdminPage && !isShipperPage && <Footer />}
      
      {/* Chatbot Widget - chỉ hiển thị ở trang bán hàng */}
      {!isAdminPage && !isShipperPage && <ChatbotWidget />}
    </div>
  )
}

function App() {
  return (
      // 1. Router phải bọc ngoài cùng (quan trọng để AuthProvider dùng được navigate)
      <Router
          basename="/iphoneshop"
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        {/* 2. Các Provider nằm bên trong Router */}
        <AuthProvider>
          <CartProvider>
            <ChatProvider>
              <AppContent />
            </ChatProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
  )
}

export default App