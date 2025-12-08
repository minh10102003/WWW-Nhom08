import { useState, useEffect } from 'react'
import { adminProductApi, adminCategoryApi, adminBrandApi, adminProductImageApi } from '../../services/api'
import { getProductImageUrl, getPlaceholderImage, getProductHinhAnhUrl } from '../../utils/imageUtils'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    tenSanPham: '',
    donGia: '',
    donViKho: '',
    thongTinBaoHanh: '',
    thongTinChung: '',
    manHinh: '',
    heDieuHanh: '',
    chip: '',
    dungLuong: '',
    mauSac: '',
    camera: '',
    danhMucId: '',
    nhaSXId: '',
    hinhAnh: null
  })
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    danhMucId: '',
    hangSXId: '',
    donGia: '',
    sapXepTheoGia: 'asc'
  })
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedProductForImage, setSelectedProductForImage] = useState(null)
  const [productImages, setProductImages] = useState([])
  const [imageFormData, setImageFormData] = useState({
    sanPhamId: '',
    mauSac: '',
    thuTu: '0',
    hinhAnh: null
  })
  const [editingImage, setEditingImage] = useState(null)

  useEffect(() => {
    loadCategories()
    loadBrands()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [page, filters])

  const loadCategories = async () => {
    try {
      const response = await adminCategoryApi.getAllForSelect()
      setCategories(response.data || [])
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const loadBrands = async () => {
    try {
      const response = await adminBrandApi.getAllForSelect()
      setBrands(response.data || [])
    } catch (err) {
      console.error('Error loading brands:', err)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await adminProductApi.getAll(
        page,
        filters.danhMucId,
        filters.hangSXId,
        filters.donGia,
        filters.sapXepTheoGia
      )
      // Sắp xếp theo ID giảm dần (mới nhất lên trên - ID lớn hơn = mới hơn)
      const sortedProducts = (response.data.content || []).sort((a, b) => {
        return (b.id || 0) - (a.id || 0) // Giảm dần
      })
      setProducts(sortedProducts)
      setTotalPages(response.data.totalPages || 1)
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'hinhAnh' && formData[key]) {
          formDataToSend.append(key, formData[key])
        } else if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key])
        }
      })
      
      if (editingProduct) {
        formDataToSend.append('id', editingProduct.id.toString())
        console.log('Editing product with ID:', editingProduct.id)
      } else {
        console.log('Creating new product')
      }

      // Log form data để debug
      console.log('Form data being sent:')
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value)
      }

      const response = await adminProductApi.save(formDataToSend)
      console.log('Response:', response.data)
      
      // Kiểm tra response status
      if (response.data?.status === 'success') {
        setShowModal(false)
        setFormData({
          tenSanPham: '',
          donGia: '',
          donViKho: '',
          thongTinBaoHanh: '',
          thongTinChung: '',
          manHinh: '',
          heDieuHanh: '',
          chip: '',
          dungLuong: '',
          mauSac: '',
          camera: '',
          danhMucId: '',
          nhaSXId: '',
          hinhAnh: null
        })
        setEditingProduct(null)
        loadProducts()
      } else {
        // Nếu status là fail, hiển thị lỗi
        const errorMsg = response.data?.errorMessages
        if (errorMsg) {
          setError(Object.values(errorMsg).join(', '))
        } else {
          setError('Không thể lưu sản phẩm')
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errorMessages
      if (errorMsg) {
        setError(Object.values(errorMsg).join(', '))
      } else {
        setError('Có lỗi xảy ra')
      }
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      tenSanPham: product.tenSanPham || '',
      donGia: product.donGia?.toString() || '',
      donViKho: product.donViKho?.toString() || '',
      thongTinBaoHanh: product.thongTinBaoHanh || '',
      thongTinChung: product.thongTinChung || '',
      manHinh: product.manHinh || '',
      heDieuHanh: product.heDieuHanh || '',
      chip: product.chip || '',
      dungLuong: product.dungLuong || '',
      mauSac: product.mauSac || '',
      camera: product.camera || '',
      danhMucId: product.danhMuc?.id?.toString() || '',
      nhaSXId: product.hangSanXuat?.id?.toString() || '',
      hinhAnh: null
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return
    
    try {
      const response = await adminProductApi.delete(id)
      if (response.data.status === 'success') {
        loadProducts()
        setError('')
      } else {
        const errorMsg = response.data.errorMessages?.message || 'Không thể xóa sản phẩm'
        setError(errorMsg)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errorMessages?.message || 'Không thể xóa sản phẩm'
      setError(errorMsg)
    }
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData({
      tenSanPham: '',
      donGia: '',
      donViKho: '',
      thongTinBaoHanh: '',
      thongTinChung: '',
      manHinh: '',
      heDieuHanh: '',
      chip: '',
      dungLuong: '',
      mauSac: '',
      camera: '',
      danhMucId: '',
      nhaSXId: '',
      hinhAnh: null
    })
    setShowModal(true)
  }

  const handleManageImages = async (product) => {
    setSelectedProductForImage(product)
    setImageFormData({
      sanPhamId: product.id.toString(),
      mauSac: '',
      thuTu: '0',
      hinhAnh: null
    })
    setEditingImage(null)
    setShowImageModal(true)
    await loadProductImages(product.id)
  }

  const loadProductImages = async (sanPhamId) => {
    try {
      const response = await adminProductImageApi.getByProductId(sanPhamId)
      if (response.data.status === 'success') {
        setProductImages(response.data.data || [])
      }
    } catch (err) {
      console.error('Error loading product images:', err)
      setProductImages([])
    }
  }

  const handleImageSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const dataToSend = {
        ...imageFormData,
        id: editingImage ? editingImage.id.toString() : undefined
      }
      
      const response = await adminProductImageApi.save(dataToSend)
      
      if (response.data.status === 'success') {
        setImageFormData({
          sanPhamId: selectedProductForImage.id.toString(),
          mauSac: '',
          thuTu: '0',
          hinhAnh: null
        })
        setEditingImage(null)
        await loadProductImages(selectedProductForImage.id)
      } else {
        const errorMsg = response.data.errorMessages?.message || 'Không thể lưu hình ảnh'
        setError(errorMsg)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errorMessages?.message || 'Có lỗi xảy ra'
      setError(errorMsg)
    }
  }

  const handleEditImage = (image) => {
    setEditingImage(image)
    setImageFormData({
      sanPhamId: image.sanPham.id.toString(),
      mauSac: image.mauSac || '',
      thuTu: image.thuTu?.toString() || '0',
      hinhAnh: null
    })
  }

  const handleDeleteImage = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) return
    
    try {
      const response = await adminProductImageApi.delete(id)
      if (response.data.status === 'success') {
        await loadProductImages(selectedProductForImage.id)
      } else {
        const errorMsg = response.data.errorMessages?.message || 'Không thể xóa hình ảnh'
        setError(errorMsg)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errorMessages?.message || 'Không thể xóa hình ảnh'
      setError(errorMsg)
    }
  }


  if (loading && products.length === 0) {
    return <div className="p-8 text-center">Đang tải...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Sản Phẩm</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Thêm Sản Phẩm
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-4 gap-4">
        <select
          value={filters.danhMucId}
          onChange={(e) => setFilters({ ...filters, danhMucId: e.target.value })}
          className="px-3 py-2 border rounded"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.tenDanhMuc}</option>
          ))}
        </select>
        <select
          value={filters.hangSXId}
          onChange={(e) => setFilters({ ...filters, hangSXId: e.target.value })}
          className="px-3 py-2 border rounded"
        >
          <option value="">Tất cả nhãn hiệu</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.id}>{brand.tenHangSanXuat}</option>
          ))}
        </select>
        <select
          value={filters.sapXepTheoGia}
          onChange={(e) => setFilters({ ...filters, sapXepTheoGia: e.target.value })}
          className="px-3 py-2 border rounded"
        >
          <option value="asc">Giá tăng dần</option>
          <option value="desc">Giá giảm dần</option>
        </select>
        <button
          onClick={() => setFilters({ danhMucId: '', hangSXId: '', donGia: '', sapXepTheoGia: 'asc' })}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Reset
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Sản Phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={getProductImageUrl(product)}
                    alt={product.tenSanPham}
                    className="h-16 w-16 object-contain rounded"
                    onError={(e) => {
                      e.target.src = getPlaceholderImage(64, 64, 'No Image')
                    }}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.tenSanPham}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Intl.NumberFormat('vi-VN').format(product.donGia)} đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.donViKho}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleManageImages(product)}
                    className="text-green-600 hover:text-green-900 mr-2"
                  >
                    Hình ảnh
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 py-2">Trang {page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Sản Phẩm *
                  </label>
                  <input
                    type="text"
                    value={formData.tenSanPham}
                    onChange={(e) => setFormData({ ...formData, tenSanPham: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá *
                  </label>
                  <input
                    type="number"
                    value={formData.donGia}
                    onChange={(e) => setFormData({ ...formData, donGia: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tồn Kho *
                  </label>
                  <input
                    type="number"
                    value={formData.donViKho}
                    onChange={(e) => setFormData({ ...formData, donViKho: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh Mục *
                  </label>
                  <select
                    value={formData.danhMucId}
                    onChange={(e) => setFormData({ ...formData, danhMucId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.tenDanhMuc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhãn Hiệu *
                  </label>
                  <select
                    value={formData.nhaSXId}
                    onChange={(e) => setFormData({ ...formData, nhaSXId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Chọn nhãn hiệu</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.tenHangSanXuat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.files[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màn hình
                </label>
                <input
                  type="text"
                  value={formData.manHinh}
                  onChange={(e) => setFormData({ ...formData, manHinh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hệ điều hành
                  </label>
                  <input
                    type="text"
                    value={formData.heDieuHanh}
                    onChange={(e) => setFormData({ ...formData, heDieuHanh: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chip
                  </label>
                  <input
                    type="text"
                    value={formData.chip}
                    onChange={(e) => setFormData({ ...formData, chip: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dung lượng
                  </label>
                  <input
                    type="text"
                    value={formData.dungLuong}
                    onChange={(e) => setFormData({ ...formData, dungLuong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu sắc
                  </label>
                  <input
                    type="text"
                    value={formData.mauSac}
                    onChange={(e) => setFormData({ ...formData, mauSac: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Camera
                  </label>
                  <input
                    type="text"
                    value={formData.camera}
                    onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thông tin chung
                </label>
                <textarea
                  value={formData.thongTinChung}
                  onChange={(e) => setFormData({ ...formData, thongTinChung: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thông tin bảo hành
                </label>
                <textarea
                  value={formData.thongTinBaoHanh}
                  onChange={(e) => setFormData({ ...formData, thongTinBaoHanh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduct(null)
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingProduct ? 'Cập Nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Management Modal */}
      {showImageModal && selectedProductForImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Quản lý hình ảnh: {selectedProductForImage.tenSanPham}
              </h2>
              <button
                onClick={() => {
                  setShowImageModal(false)
                  setSelectedProductForImage(null)
                  setProductImages([])
                  setEditingImage(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Form thêm/sửa hình ảnh */}
            <form onSubmit={handleImageSubmit} className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-4">
                {editingImage ? 'Sửa hình ảnh' : 'Thêm hình ảnh mới'}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu sắc *
                  </label>
                  <input
                    type="text"
                    value={imageFormData.mauSac}
                    onChange={(e) => setImageFormData({ ...imageFormData, mauSac: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    placeholder="VD: Titanium Natural"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thứ tự
                  </label>
                  <input
                    type="number"
                    value={imageFormData.thuTu}
                    onChange={(e) => setImageFormData({ ...imageFormData, thuTu: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFormData({ ...imageFormData, hinhAnh: e.target.files[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required={!editingImage}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                {editingImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingImage(null)
                      setImageFormData({
                        sanPhamId: selectedProductForImage.id.toString(),
                        mauSac: '',
                        thuTu: '0',
                        hinhAnh: null
                      })
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Hủy
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingImage ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>

            {/* Danh sách hình ảnh */}
            <div>
              <h3 className="font-semibold mb-4">Danh sách hình ảnh</h3>
              {productImages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có hình ảnh nào</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {productImages.map((img) => {
                    const imageUrl = getProductHinhAnhUrl(img) || getPlaceholderImage(200, 200, 'No Image')
                    return (
                      <div key={img.id} className="border rounded-lg p-3">
                        <img
                          src={imageUrl}
                          alt={img.mauSac || 'Product image'}
                          className="w-full h-32 object-contain mb-2 rounded"
                          onError={(e) => {
                            e.target.src = getPlaceholderImage(200, 200, 'No Image')
                          }}
                        />
                        <div className="text-sm">
                          <p className="font-semibold">Màu: {img.mauSac || 'N/A'}</p>
                          <p className="text-gray-600">Thứ tự: {img.thuTu}</p>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEditImage(img)}
                            className="flex-1 px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteImage(img.id)}
                            className="flex-1 px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts

