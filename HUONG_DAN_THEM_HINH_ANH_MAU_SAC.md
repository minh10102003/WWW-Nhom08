# Hướng dẫn thêm hình ảnh theo màu sắc cho sản phẩm

## Đã triển khai

### 1. Backend
- ✅ Entity: `SanPhamHinhAnh` - Lưu trữ hình ảnh theo màu sắc
- ✅ Repository: `SanPhamHinhAnhRepository` - Truy vấn hình ảnh
- ✅ Service: `SanPhamHinhAnhService` - Logic xử lý
- ✅ API: 
  - `/api/san-pham-hinh-anh/san-pham/{id}` - Lấy tất cả hình ảnh
  - `/api/san-pham-hinh-anh/san-pham/{id}/mau-sac?mauSac=...` - Lấy hình ảnh theo màu
  - `/api/admin/san-pham-hinh-anh/san-pham/{id}` - Admin: Lấy hình ảnh
  - `/api/admin/san-pham-hinh-anh/save` - Admin: Lưu hình ảnh
  - `/api/admin/san-pham-hinh-anh/delete/{id}` - Admin: Xóa hình ảnh

### 2. Frontend
- ✅ API client: `productImageApi`, `adminProductImageApi`
- ✅ ProductDetail: Hiển thị option chọn màu và cập nhật hình ảnh

## Các bước thực hiện

### Bước 1: Tạo bảng trong database

Chạy file SQL: `create_san_pham_hinh_anh_table.sql`

Hoặc chạy trực tiếp:
```sql
CREATE TABLE IF NOT EXISTS `san_pham_hinh_anh` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `san_pham_id` BIGINT NOT NULL,
    `mau_sac` VARCHAR(50) DEFAULT NULL,
    `hinh_anh_url` VARCHAR(500) DEFAULT NULL,
    `thu_tu` INT DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `FK_san_pham_hinh_anh_san_pham` (`san_pham_id`),
    CONSTRAINT `FK_san_pham_hinh_anh_san_pham` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;
```

### Bước 2: Tìm ID sản phẩm "iPhone 17 Pro Max 512GB"

```sql
SELECT id, ten_san_pham FROM san_pham WHERE ten_san_pham LIKE '%iPhone 17 Pro Max 512GB%';
```

### Bước 3: Thêm hình ảnh cho các màu sắc

**Cách 1: Sử dụng Admin UI (Khuyến nghị)**
- Mở trang quản lý sản phẩm
- Chọn sản phẩm "iPhone 17 Pro Max 512GB"
- Click "Quản lý hình ảnh" hoặc tương tự
- Upload file hình ảnh cho từng màu sắc

**Cách 2: Upload qua API**
- Sử dụng API `/api/admin/san-pham-hinh-anh/save` với FormData
- Gửi: `sanPhamId`, `mauSac`, `hinhAnh` (file), `thuTu`

**Lưu ý:** Hình ảnh sẽ được lưu vào `src/main/webapp/resources/images/` với tên file: `{sanPhamId}_{mauSac}_{id}.png`

### Bước 4: Test

1. Restart backend server
2. Mở trang chi tiết sản phẩm "iPhone 17 Pro Max 512GB"
3. Kiểm tra:
   - Có hiển thị các button chọn màu không?
   - Khi click vào màu, hình ảnh có thay đổi không?
   - Zoom có hoạt động với hình ảnh mới không?

## Lưu ý

- Nếu sản phẩm chưa có trong database, cần tạo sản phẩm trước
- URL hình ảnh có thể thay đổi tùy theo nguồn
- Có thể thêm nhiều hình ảnh cho cùng 1 màu (dùng `thu_tu` để sắp xếp)

