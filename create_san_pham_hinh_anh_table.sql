-- Tạo bảng san_pham_hinh_anh
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

-- Tìm ID của sản phẩm "iPhone 17 Pro Max 512GB" (hoặc tạo mới nếu chưa có)
-- Giả sử sản phẩm có ID = 23 (bạn cần kiểm tra ID thực tế trong database)

-- Lưu ý: Hình ảnh sẽ được upload qua Admin UI hoặc API
-- File sẽ được lưu vào: src/main/webapp/resources/images/
-- Tên file: {sanPhamId}_{mauSac}_{id}.png
-- URL trong database: /iphoneshop/img/{sanPhamId}_{mauSac}_{id}.png

-- Ví dụ: Nếu muốn insert thủ công (sau khi đã upload file):
-- INSERT INTO `san_pham_hinh_anh` (`san_pham_id`, `mau_sac`, `hinh_anh_url`, `thu_tu`) 
-- SELECT id, 'Titanium Natural', '/iphoneshop/img/23_Titanium_Natural_1.png', 0
-- FROM `san_pham` WHERE `ten_san_pham` LIKE '%iPhone 17 Pro Max 512GB%' LIMIT 1;

