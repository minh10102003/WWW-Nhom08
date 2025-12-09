import axios from 'axios'

// --- CẤU HÌNH ĐƯỜNG DẪN (QUAN TRỌNG) ---
// Sử dụng đường dẫn tương đối để Vite Proxy hoạt động
// React sẽ hiểu là: http://localhost:3000/iphoneshop... -> Proxy chuyển sang 8080

const BACKEND_URL = '/iphoneshop';       // Dùng cho Login, Register, Logout
const API_BASE_URL = '/iphoneshop/api';  // Dùng cho dữ liệu (Sản phẩm, Giỏ hàng...)

// Tạo instance axios cho các API dữ liệu
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Rất quan trọng để gửi Cookie (JSESSIONID) đi kèm
})

// --- 1. REQUEST INTERCEPTOR ---
// Tự động đính kèm Token (nếu bạn dùng JWT)
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
)

// --- 2. RESPONSE INTERCEPTOR ---
// Xử lý khi Token hết hạn hoặc lỗi 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Nếu Server trả về 401 (Unauthorized) -> Đá về trang login
      if (error.response?.status === 401) {
        // Clear localStorage (không dùng cho user, nhưng clear để đảm bảo)
        localStorage.clear()
        // Dùng window.location để reload lại trang sạch sẽ
        window.location.href = '/iphoneshop/login'
      }
      return Promise.reject(error)
    }
)

// --- 3. ĐỊNH NGHĨA CÁC API ---

export const productApi = {
  getAll: (page = 1, danhMucId = '', hangSXId = '', donGia = '', sapXepTheoGia = '') => {
    return api.get('/san-pham/all', {
      params: { page, danhMucId, hangSXId, donGia, sapXepTheoGia }
    })
  },
  getById: (id) => api.get(`/san-pham/${id}`),
  getLatest: () => api.get('/san-pham/latest'),
  search: (tenSanPham, page = 1) => {
    return api.get('/san-pham/', {
      params: { tenSanPham, page }
    })
  },
}

export const categoryApi = {
  getAll: () => api.get('/danh-muc/allForReal'),
  getById: (id) => api.get(`/danh-muc/${id}`),
}

export const brandApi = {
  getAll: () => api.get('/nhan-hieu/allForReal'),
  getById: (id) => api.get(`/nhan-hieu/${id}`),
}

export const cartApi = {
  addToCart: (id, quantity = 1) => {
    // Ensure quantity is always sent as string, even if it's 1
    const qty = quantity != null && quantity !== undefined ? String(quantity) : '1'
    const productId = String(id)
    console.log('addToCart API call - id:', productId, 'quantity:', qty, 'type:', typeof qty)
    // Build URL manually to ensure quantity is always included
    const url = `/gio-hang/addSanPham?id=${encodeURIComponent(productId)}&quantity=${encodeURIComponent(qty)}`
    console.log('Request URL:', url)
    return api.get(url)
  },
  getItems: () => api.get('/gio-hang/items'),
  updateQuantity: (id, value) => {
    return api.get('/gio-hang/changSanPhamQuanity', {
      params: { id, value }
    })
  },
  removeFromCart: (id) => {
    return api.get('/gio-hang/deleteFromCart', {
      params: { id }
    })
  },
}

export const orderApi = {
  create: (data) => api.post('/don-hang/create', data),
  getUserOrders: (page = 1) => api.get('/don-hang/user', { params: { page } }),
  getById: (id) => api.get(`/don-hang/${id}`),
}

export const vnpayApi = {
  createPayment: (amount, orderId, bankCode = '', language = 'vn') => {
    return api.post('/vnpay/create-payment', null, {
      params: { amount, orderId, bankCode, language }
    })
  },
}

export const contactApi = {
  create: (data) => api.post('/createContact', data),
}

export const authApi = {
  // Login: Dùng axios thường + BACKEND_URL (vì nó nằm ngoài /api)
  login: (email, password) => {
    const formData = new URLSearchParams()
    formData.append('email', email)
    formData.append('password', password)

    // Gọi vào /iphoneshop/login
    return api.post('/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    })
  },

  // Register
  register: (data) => {
    return api.post('/register', data)
  },

  // Logout: Dùng instance api (vì nằm trong /api)
  logout: () => api.post('/logout', {}),

  // Profile: Dùng instance api (vì nằm trong /api)
  getProfile: async () => {
    try {
      return await api.get('/profile/current')
    } catch {
      return { data: null }
    }
  },
  updateProfile: (data) => api.put('/profile/update', data),
  changePassword: (data) => api.post('/profile/doiMatKhau', data),
}

// Admin APIs
export const adminProductApi = {
  getAll: (page = 1, danhMucId = '', hangSXId = '', donGia = '', sapXepTheoGia = 'asc', minPrice, maxPrice) => {
    return api.get('/san-pham/all', {
      params: { page, danhMucId, hangSXId, donGia, sapXepTheoGia, minPrice, maxPrice }
    })
  },
  getById: (id) => api.get(`/san-pham/${id}`),
  search: (tenSanPham, page = 1) => {
    return api.get('/san-pham/', {
      params: { tenSanPham, page }
    })
  },
  save: (data) => {
    // Nếu data đã là FormData, dùng trực tiếp
    if (data instanceof FormData) {
      return api.post('/san-pham/save', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    // Nếu là object, tạo FormData mới
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    return api.post('/san-pham/save', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  delete: (id) => api.delete(`/san-pham/delete/${id}`),
}

export const productImageApi = {
  getByProductId: (sanPhamId) => api.get(`/san-pham-hinh-anh/san-pham/${sanPhamId}`),
  getByProductIdAndColor: (sanPhamId, mauSac) => {
    return api.get(`/san-pham-hinh-anh/san-pham/${sanPhamId}/mau-sac`, {
      params: { mauSac }
    })
  },
}

export const adminProductImageApi = {
  getByProductId: (sanPhamId) => api.get(`/admin/san-pham-hinh-anh/san-pham/${sanPhamId}`),
  save: (data) => {
    // Tạo FormData để upload file
    const formData = new FormData()
    if (data.id) formData.append('id', data.id)
    formData.append('sanPhamId', data.sanPhamId)
    formData.append('mauSac', data.mauSac || '')
    formData.append('thuTu', data.thuTu || '0')
    if (data.hinhAnh) {
      formData.append('hinhAnh', data.hinhAnh)
    }
    return api.post('/admin/san-pham-hinh-anh/save', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  delete: (id) => api.delete(`/admin/san-pham-hinh-anh/delete/${id}`),
}

export const adminCategoryApi = {
  getAll: (page = 1) => api.get('/danh-muc/all', { params: { page } }),
  getAllForSelect: () => api.get('/danh-muc/allForReal'),
  getById: (id) => api.get(`/danh-muc/${id}`),
  save: (data) => api.post('/danh-muc/save', data),
  update: (data) => api.put('/danh-muc/update', data),
  delete: (id) => api.delete(`/danh-muc/delete/${id}`),
}

export const adminBrandApi = {
  getAll: (page = 1) => api.get('/nhan-hieu/all', { params: { page } }),
  getAllForSelect: () => api.get('/nhan-hieu/allForReal'),
  getById: (id) => api.get(`/nhan-hieu/${id}`),
  save: (data) => api.post('/nhan-hieu/save', data),
  update: (data) => api.put('/nhan-hieu/update', data),
  delete: (id) => api.delete(`/nhan-hieu/delete/${id}`),
}

export const adminOrderApi = {
  getAll: (page = 1, trangThai = '', tuNgay = '', denNgay = '') => {
    return api.get('/don-hang/all', {
      params: { page, trangThai, tuNgay, denNgay }
    })
  },
  getById: (id) => api.get(`/don-hang/${id}`),
  assign: (donHangId, emailShipper) => {
    return api.post('/don-hang/assign', null, {
      params: { donHangId, shipper: emailShipper }
    })
  },
  update: (donHangId, ghiChuAdmin) => {
    return api.post('/don-hang/update', null, {
      params: { donHangId, ghiChu: ghiChuAdmin }
    })
  },
  cancel: (donHangId) => {
    return api.post('/don-hang/cancel', null, {
      params: { donHangId }
    })
  },
  getReport: () => api.get('/don-hang/report'),
}

export const adminUserApi = {
  getAll: (tenVaiTro, page = 1) => {
    return api.get('/tai-khoan/all', {
      params: { tenVaiTro, page }
    })
  },
  save: (data) => api.post('/tai-khoan/save', data),
  delete: (id) => api.delete(`/tai-khoan/delete/${id}`),
}

export const adminContactApi = {
  getAll: (page = 1, trangThaiLienHe = '', tuNgay = '', denNgay = '') => {
    return api.get('/lien-he/all', {
      params: { page, trangThaiLienHe, tuNgay, denNgay }
    })
  },
  getById: (id) => api.get(`/lien-he/${id}`),
  reply: (data) => api.post('/lien-he/reply', data),
}

// Shipper APIs
export const shipperOrderApi = {
  getAll: (page = 1, trangThai = '', tuNgay = '', denNgay = '', idShipper) => {
    return api.get('/shipper/don-hang/all', {
      params: { page, trangThai, tuNgay, denNgay, idShipper }
    })
  },
  getById: (id) => api.get(`/shipper/don-hang/${id}`),
  update: (data) => api.post('/shipper/don-hang/update', data),
}

export default api