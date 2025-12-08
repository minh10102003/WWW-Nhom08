-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.8.3-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure
CREATE DATABASE IF NOT EXISTS `iphone_shop` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_uca1400_ai_ci */;
USE `iphone_shop`;

-- Dumping structure for table laptop_store.chi_muc_gio_hang
DROP TABLE IF EXISTS `chi_muc_gio_hang`;
CREATE TABLE IF NOT EXISTS `chi_muc_gio_hang` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `so_luong` int(11) NOT NULL,
    `ma_gio_hang` bigint(20) DEFAULT NULL,
    `ma_san_pham` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK49lmmclnjgb7eck20lwhv0cks` (`ma_gio_hang`),
  KEY `FKkd69a7wiulr4xgohxl0rlhth4` (`ma_san_pham`),
  CONSTRAINT `FK49lmmclnjgb7eck20lwhv0cks` FOREIGN KEY (`ma_gio_hang`) REFERENCES `gio_hang` (`id`),
  CONSTRAINT `FKkd69a7wiulr4xgohxl0rlhth4` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- Dumping data for table laptop_store.chi_muc_gio_hang: ~0 rows (approximately)
DELETE FROM iphone_shop.`chi_muc_gio_hang`;

-- Dumping structure for table laptop_store.chi_tiet_don_hang
DROP TABLE IF EXISTS `chi_tiet_don_hang`;
CREATE TABLE IF NOT EXISTS `chi_tiet_don_hang` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `don_gia` bigint(20) NOT NULL,
    `so_luong` int(11) DEFAULT NULL,
    `ma_don_hang` bigint(20) DEFAULT NULL,
    `ma_san_pham` bigint(20) DEFAULT NULL,
    `so_luong_dat` int(11) NOT NULL,
    `so_luong_nhan_hang` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9wl3houbukbxpixsut6uvojhy` (`ma_don_hang`),
  KEY `FK3ry84nmdxgoarx53qjxd671tk` (`ma_san_pham`),
  CONSTRAINT `FK3ry84nmdxgoarx53qjxd671tk` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`id`),
  CONSTRAINT `FK9wl3houbukbxpixsut6uvojhy` FOREIGN KEY (`ma_don_hang`) REFERENCES `don_hang` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- Dumping data for table laptop_store.chi_tiet_don_hang: ~2 rows (approximately)
DELETE FROM `chi_tiet_don_hang`;
INSERT INTO `chi_tiet_don_hang` (`id`, `don_gia`, `so_luong`, `ma_don_hang`, `ma_san_pham`, `so_luong_dat`, `so_luong_nhan_hang`) VALUES
                                                                                                                                      (4, 10300999, NULL, 39, 1, 1, 0),
                                                                                                                                      (5, 16990000, NULL, 40, 22, 1, 0);

-- Dumping structure for table laptop_store.danh_muc
DROP TABLE IF EXISTS `danh_muc`;
CREATE TABLE IF NOT EXISTS `danh_muc` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `ten_danh_muc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- Dumping data for table laptop_store.danh_muc: ~2 rows (approximately)
DELETE FROM `danh_muc`;
INSERT INTO `danh_muc` (`id`, `ten_danh_muc`) VALUES
                                                  (1, 'iPhone'),
                                                  (10, 'Iphone');

-- Dumping structure for table laptop_store.don_hang
DROP TABLE IF EXISTS `don_hang`;
CREATE TABLE IF NOT EXISTS `don_hang` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `dia_chi_nhan` varchar(255) DEFAULT NULL,
    `ghi_chu` varchar(255) DEFAULT NULL,
    `ho_ten_nguoi_nhan` varchar(255) DEFAULT NULL,
    `ngay_dat_hang` datetime DEFAULT NULL,
    `ngay_giao_hang` datetime DEFAULT NULL,
    `ngay_nhan_hang` datetime DEFAULT NULL,
    `sdt_nhan_hang` varchar(255) DEFAULT NULL,
    `trang_thai_don_hang` varchar(255) DEFAULT NULL,
    `ma_nguoi_dat` bigint(20) DEFAULT NULL,
    `ma_shipper` bigint(20) DEFAULT NULL,
    `tong_gia_tri` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKnwjiboxao1uvw1siemkvs1jb9` (`ma_nguoi_dat`),
  KEY `FKgndcrlvetoudr3jaif9b7ay37` (`ma_shipper`),
  CONSTRAINT `FKgndcrlvetoudr3jaif9b7ay37` FOREIGN KEY (`ma_shipper`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `FKnwjiboxao1uvw1siemkvs1jb9` FOREIGN KEY (`ma_nguoi_dat`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- Dumping data for table laptop_store.don_hang: ~10 rows (approximately)
DELETE FROM `don_hang`;
INSERT INTO `don_hang` (`id`, `dia_chi_nhan`, `ghi_chu`, `ho_ten_nguoi_nhan`, `ngay_dat_hang`, `ngay_giao_hang`, `ngay_nhan_hang`, `sdt_nhan_hang`, `trang_thai_don_hang`, `ma_nguoi_dat`, `ma_shipper`, `tong_gia_tri`) VALUES
                                                                                                                                                                                                                             (31, 'bd', 'asdf', 'aaa', '2018-12-01 14:38:26', NULL, NULL, 'dsf', 'Đang chờ duyệt', NULL, NULL, 0),
                                                                                                                                                                                                                             (32, 'fadf', 'asdf', 'aaa', '2018-12-05 21:58:24', NULL, NULL, '13', 'created', 2, NULL, 0),
                                                                                                                                                                                                                             (33, '146/37/5 Vũ Tùng, phường 2, Bình Thạnh, TP. Hồ Chí Minh', '', 'Nguyễn Triệu Minh', '2025-11-27 21:28:57', '2025-11-27 21:39:24', NULL, '0912101003', 'Đang giao', 1, 3, 0),
                                                                                                                                                                                                                             (34, '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh\n', '', 'Nguyễn Triệu Minh', '2025-11-27 21:35:07', NULL, NULL, '0912101003', 'Đang chờ giao', 1, NULL, 0),
                                                                                                                                                                                                                             (35, '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh\n', '', 'Nguyễn Triệu Minh', '2025-11-27 21:35:13', NULL, NULL, '0912101003', 'Đang chờ giao', 1, NULL, 0),
                                                                                                                                                                                                                             (36, '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh\n', '', 'Nguyễn Triệu Vân', '2025-11-27 21:35:23', NULL, NULL, '0912101003', 'Đang chờ giao', 1, NULL, 0),
                                                                                                                                                                                                                             (37, '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', '123', 'Minh Triệu Nguyễn', '2025-11-27 21:36:17', NULL, NULL, '0912101003', 'Đang chờ giao', 1, NULL, 0),
                                                                                                                                                                                                                             (38, '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', '123', 'Minh Triệu Nguyễn', '2025-11-27 21:36:22', NULL, NULL, '0912101003', 'Đang chờ giao', 1, NULL, 0),
                                                                                                                                                                                                                             (39, '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', '123', 'Minh Triệu Nguyễn', '2025-11-27 21:43:28', NULL, NULL, '0912101003', 'Đang chờ giao', 1, NULL, 10300999),
                                                                                                                                                                                                                             (40, '123 Nguyễn Huệ, Quận 1', '', 'Minh Triệu Nguyễn', '2025-12-01 21:56:51', NULL, NULL, '0912101003', 'Đang chờ giao', 1, NULL, 16990000);

-- Dumping structure for table laptop_store.gio_hang
DROP TABLE IF EXISTS `gio_hang`;
CREATE TABLE IF NOT EXISTS `gio_hang` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `tong_tien` varchar(255) DEFAULT NULL,
    `ma_nguoi_dung` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKitverect56puwr47y7tyvy6er` (`ma_nguoi_dung`),
  CONSTRAINT `FKitverect56puwr47y7tyvy6er` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- Dumping data for table laptop_store.gio_hang: ~3 rows (approximately)
DELETE FROM `gio_hang`;
INSERT INTO `gio_hang` (`id`, `tong_tien`, `ma_nguoi_dung`) VALUES
                                                                (1, NULL, 2),
                                                                (2, NULL, 1),
                                                                (3, NULL, NULL);

-- Dumping structure for table laptop_store.hang_san_xuat
DROP TABLE IF EXISTS `hang_san_xuat`;
CREATE TABLE IF NOT EXISTS `hang_san_xuat` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `ten_hang_san_xuat` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- Dumping data for table laptop_store.hang_san_xuat: ~9 rows (approximately)
DELETE FROM `hang_san_xuat`;
INSERT INTO `hang_san_xuat` (`id`, `ten_hang_san_xuat`) VALUES
                                                            (2, 'Apple'),
                                                            (3, 'Asus'),
                                                            (4, 'Acer'),
                                                            (5, 'Dell'),
                                                            (6, 'HP'),
                                                            (7, 'Lenovo'),
                                                            (8, 'MSI'),
                                                            (9, 'Masstel'),
                                                            (10, 'Haier');

-- Dumping structure for table laptop_store.lien_he
DROP TABLE IF EXISTS `lien_he`;
CREATE TABLE IF NOT EXISTS `lien_he` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `email_lien_he` varchar(255) DEFAULT NULL,
    `ngay_lien_he` datetime DEFAULT NULL,
    `ngay_tra_loi` datetime DEFAULT NULL,
    `noi_dung_lien_he` varchar(255) DEFAULT NULL,
    `noi_dung_tra_loi` varchar(255) DEFAULT NULL,
    `trang_thai` varchar(255) DEFAULT NULL,
    `ma_nguoi_tra_loi` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6jm47uh7f94pc3wix0duvedde` (`ma_nguoi_tra_loi`),
  CONSTRAINT `FK6jm47uh7f94pc3wix0duvedde` FOREIGN KEY (`ma_nguoi_tra_loi`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- Dumping data for table laptop_store.lien_he: ~0 rows (approximately)
DELETE FROM `lien_he`;

-- Dumping structure for table laptop_store.nguoidung_vaitro
DROP TABLE IF EXISTS `nguoidung_vaitro`;
CREATE TABLE IF NOT EXISTS `nguoidung_vaitro` (
    `ma_nguoi_dung` bigint(20) NOT NULL,
    `ma_vai_tro` bigint(20) NOT NULL,
  PRIMARY KEY (`ma_nguoi_dung`,`ma_vai_tro`),
  KEY `FKig6jxd861mqv02a8pn68r43fr` (`ma_vai_tro`),
  CONSTRAINT `FKig6jxd861mqv02a8pn68r43fr` FOREIGN KEY (`ma_vai_tro`) REFERENCES `vai_tro` (`id`),
  CONSTRAINT `FKocavcnspu1wcvp2w0s4usfgbf` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- Dumping data for table laptop_store.nguoidung_vaitro: ~5 rows (approximately)
DELETE FROM `nguoidung_vaitro`;
INSERT INTO `nguoidung_vaitro` (`ma_nguoi_dung`, `ma_vai_tro`) VALUES
                                                                   (1, 1),
                                                                   (1, 2),
                                                                   (2, 2),
                                                                   (3, 3),
                                                                   (4, 2);

-- Dumping structure for table laptop_store.nguoi_dung
DROP TABLE IF EXISTS `nguoi_dung`;
CREATE TABLE IF NOT EXISTS `nguoi_dung` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `dia_chi` varchar(255) DEFAULT NULL,
    `email` varchar(255) DEFAULT NULL,
    `ho_ten` varchar(255) DEFAULT NULL,
    `password` varchar(255) DEFAULT NULL,
    `so_dien_thoai` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- Dumping data for table laptop_store.nguoi_dung: ~3 rows (approximately)
DELETE FROM `nguoi_dung`;
INSERT INTO `nguoi_dung` (`id`, `dia_chi`, `email`, `ho_ten`, `password`, `so_dien_thoai`) VALUES
                                                                                               (1, NULL, 'admin@gmail.com', 'Đỗ Minh Hào', '$2a$10$/VFMNUPBKNVRMjxPFCYKZ.lKahoLQda0EaAxdqoun1w3DqwNLa2me', '123456789'),
                                                                                               (2, NULL, 'member@gmail.com', NULL, '$2a$10$j7Upgupou72GBmukz0G6pOATk3wlCAgaoFCEqAhSvLToD/V/1wlpu', NULL),
                                                                                               (3, NULL, 'shipper@gmail.com', NULL, '$2a$10$u2B29HDxuWVYY3fUJ8R2qunNzXngfxij5GpvlFAEtIz3JpK/WFXF2', NULL);

-- Dumping structure for table laptop_store.san_pham
DROP TABLE IF EXISTS `san_pham`;
CREATE TABLE IF NOT EXISTS `san_pham` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `chip` varchar(255) DEFAULT NULL,
    `don_gia` bigint(20) NOT NULL,
    `don_vi_ban` int(11) NOT NULL,
    `don_vi_kho` int(11) NOT NULL,
    `camera` varchar(255) DEFAULT NULL,
    `he_dieu_hanh` varchar(255) DEFAULT NULL,
    `man_hinh` varchar(255) DEFAULT NULL,
    `dung_luong` varchar(255) DEFAULT NULL,
    `ten_san_pham` varchar(255) DEFAULT NULL,
    `mau_sac` varchar(255) DEFAULT NULL,
    `thong_tin_bao_hanh` varchar(255) DEFAULT NULL,
    `thong_tin_chung` varchar(255) DEFAULT NULL,
    `ma_danh_muc` bigint(20) DEFAULT NULL,
    `ma_hang_sx` bigint(20) DEFAULT NULL,
    `hinh_anh_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqss6n6gtx6lhb7flcka9un18t` (`ma_danh_muc`),
  KEY `FKchvjvgjnq8lbt9mjtyfn5pksq` (`ma_hang_sx`),
  CONSTRAINT `FKchvjvgjnq8lbt9mjtyfn5pksq` FOREIGN KEY (`ma_hang_sx`) REFERENCES `hang_san_xuat` (`id`),
  CONSTRAINT `FKqss6n6gtx6lhb7flcka9un18t` FOREIGN KEY (`ma_danh_muc`) REFERENCES `danh_muc` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- Dumping data for table laptop_store.san_pham: ~22 rows (approximately)
DELETE FROM `san_pham`;
INSERT INTO `san_pham` (`id`, `chip`, `don_gia`, `don_vi_ban`, `don_vi_kho`, `camera`, `he_dieu_hanh`, `man_hinh`, `dung_luong`, `ten_san_pham`, `mau_sac`, `thong_tin_bao_hanh`, `thong_tin_chung`, `ma_danh_muc`, `ma_hang_sx`, `hinh_anh_url`) VALUES
                                                                                                                                                                                                                                                      (1, 'Apple A14 Bionic', 10300999, 0, 100, 'Camera chính 12MP, Camera góc siêu rộng 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Liquid Retina HD, 1792 x 828 pixels, 60Hz', '256GB', 'iPhone 12 256GB', 'Hồng', '12 tháng', 'iPhone chính hãng Apple, 256GB dung lượng, Hồng, Apple A16 Bionic, Camera chính 48MP, Camera góc siêu rộng 12MP, Camera selfie 12MP', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-12-thuong-vs-iphone-12-mini-64gb-128gb-256gb-mau-tim-600x600.jpg'),
                                                                                                                                                                                                                                                      (2, 'Apple A15 Bionic', 9800000, 0, 80, 'Camera chính 12MP, Camera góc siêu rộng 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Liquid Retina HD, 1792 x 828 pixels, 60Hz', '128GB', 'iPhone 13 128GB', 'Titan Xanh', '6 tháng', 'iPhone chính hãng Apple, 128GB dung lượng, Titan Xanh, Apple A15 Bionic, Camera chính 12MP, Camera góc siêu rộng 12MP, Camera selfie 12MP', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-13-thuong-vs-iphone-13-mini-128gb-256gb-512gb-mau-xanh-duong-600x600.jpg'),
                                                                                                                                                                                                                                                      (3, 'Apple A17 Pro', 28990000, 0, 50, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera tele 12MP, Camera selfie 12MP', 'iOS 17', '6.7 inch Super Retina XDR OLED, 2796 x 1290 pixels, 120Hz', '256GB', 'iPhone 15 Pro Max 256GB', 'Titan Xanh', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 256GB dung lượng, Titan Xanh, Apple A17 Pro', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-15-pro-vs-iphone-15-pro-max-256gb-512gb-1tb-mau-titan-xanh-duong-600x600.jpg'),
                                                                                                                                                                                                                                                      (4, 'Apple A17 Pro', 32990000, 0, 30, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera tele 12MP, Camera selfie 12MP', 'iOS 17', '6.7 inch Super Retina XDR OLED, 2796 x 1290 pixels, 120Hz', '512GB', 'iPhone 15 Pro Max 512GB', 'Titan Tự Nhiên', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 512GB dung lượng, Titan Tự Nhiên, Apple A17 Pro', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-15-pro-vs-iphone-15-pro-max-256gb-512gb-1tb-mau-titan-tu-nhien-600x600.jpg'),
                                                                                                                                                                                                                                                      (5, 'Apple A17 Pro', 38990000, 0, 20, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera tele 12MP, Camera selfie 12MP', 'iOS 17', '6.7 inch Super Retina XDR OLED, 2796 x 1290 pixels, 120Hz', '1TB', 'iPhone 15 Pro Max 1TB', 'Titan Đen', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 1TB dung lượng, Titan Đen, Apple A17 Pro', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-15-pro-vs-iphone-15-pro-max-256gb-512gb-1tb-mau-titan-den-600x600.jpg'),
                                                                                                                                                                                                                                                      (6, 'Apple A17 Pro', 24990000, 0, 50, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera tele 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Super Retina XDR OLED, 2556 x 1179 pixels, 120Hz', '128GB', 'iPhone 15 Pro 128GB', 'Titan Xanh', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 128GB dung lượng, Titan Xanh, Apple A17 Pro', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-15-pro-vs-iphone-15-pro-max-256gb-512gb-1tb-mau-titan-xanh-duong-600x600.jpg'),
                                                                                                                                                                                                                                                      (7, 'Apple A17 Pro', 26990000, 0, 40, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera tele 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Super Retina XDR OLED, 2556 x 1179 pixels, 120Hz', '256GB', 'iPhone 15 Pro 256GB', 'Titan Tự Nhiên', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 256GB dung lượng, Titan Tự Nhiên, Apple A17 Pro', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-15-pro-vs-iphone-15-pro-max-256gb-512gb-1tb-mau-titan-tu-nhien-600x600.jpg'),
                                                                                                                                                                                                                                                      (8, 'Apple A17 Pro', 30990000, 0, 30, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera tele 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Super Retina XDR OLED, 2556 x 1179 pixels, 120Hz', '512GB', 'iPhone 15 Pro 512GB', 'Titan Trắng', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 512GB dung lượng, Titan Trắng, Apple A17 Pro', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-15-pro-vs-iphone-15-pro-max-256gb-512gb-1tb-mau-titan-trang-600x600.jpg'),
                                                                                                                                                                                                                                                      (9, 'Apple A16 Bionic', 19990000, 0, 60, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Super Retina XDR OLED, 2556 x 1179 pixels, 60Hz', '128GB', 'iPhone 15 128GB', 'Xanh Dương', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 128GB dung lượng, Xanh Dương, Apple A16 Bionic', 1, 2, 'https://taoxinh.vn/wp-content/uploads/2024/11/iphone-15-thuong-vs-iphone-15-plus-128gb-256gb-512gb-mau-xanh-duong-600x600.jpg'),
                                                                                                                                                                                                                                                      (10, 'Apple A16 Bionic', 21990000, 0, 50, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Super Retina XDR OLED, 2556 x 1179 pixels, 60Hz', '256GB', 'iPhone 15 256GB', 'Hồng', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 256GB dung lượng, Hồng, Apple A16 Bionic', 1, 2, 'https://taoxinh.vn/wp-content/uploads/2024/11/iphone-15-thuong-vs-iphone-15-plus-128gb-256gb-512gb-mau-hong-600x600.jpg'),
                                                                                                                                                                                                                                                      (11, 'Apple A16 Bionic', 25990000, 0, 40, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Super Retina XDR OLED, 2556 x 1179 pixels, 60Hz', '512GB', 'iPhone 15 512GB', 'Vàng', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 512GB dung lượng, Vàng, Apple A16 Bionic', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-15-thuong-vs-iphone-15-plus-128gb-256gb-512gb-mau-vang-600x600.jpg'),
                                                                                                                                                                                                                                                      (12, 'Apple A16 Bionic', 24990000, 0, 40, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera tele 12MP, Camera selfie 12MP', 'iOS 17', '6.7 inch Super Retina XDR OLED, 2796 x 1290 pixels, 120Hz', '128GB', 'iPhone 14 Pro Max 128GB', 'Tím', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 128GB dung lượng, Tím, Apple A16 Bionic', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-14-pro-vs-iphone-14-pro-max-128gb-256gb-512gb-1tb-mau-tim-than-600x600.jpg'),
                                                                                                                                                                                                                                                      (13, 'Apple A16 Bionic', 26990000, 0, 35, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera tele 12MP, Camera selfie 12MP', 'iOS 17', '6.7 inch Super Retina XDR OLED, 2796 x 1290 pixels, 120Hz', '256GB', 'iPhone 14 Pro Max 256GB', 'Vàng', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 256GB dung lượng, Vàng, Apple A16 Bionic', 1, 2, 'https://trangthienlong.com.vn/wp-content/uploads/2024/11/iphone-14-pro-vs-iphone-14-pro-max-128gb-256gb-512gb-1tb-mau-vang-600x600.jpg'),
                                                                                                                                                                                                                                                      (14, 'Apple A16 Bionic', 30990000, 0, 25, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera tele 12MP, Camera selfie 12MP', 'iOS 17', '6.7 inch Super Retina XDR OLED, 2796 x 1290 pixels, 120Hz', '512GB', 'iPhone 14 Pro Max 512GB', 'Bạc', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 512GB dung lượng, Bạc, Apple A16 Bionic', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-14-pro-vs-iphone-14-pro-max-128gb-256gb-512gb-1tb-mau-trang-600x600.jpg'),
                                                                                                                                                                                                                                                      (15, 'Apple A16 Bionic', 21990000, 0, 45, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera tele 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Super Retina XDR OLED, 2556 x 1179 pixels, 120Hz', '128GB', 'iPhone 14 Pro 128GB', 'Tím', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 128GB dung lượng, Tím, Apple A16 Bionic', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-14-pro-vs-iphone-14-pro-max-128gb-256gb-512gb-1tb-mau-tim-than-600x600.jpg'),
                                                                                                                                                                                                                                                      (16, 'Apple A16 Bionic', 23990000, 0, 40, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera tele 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Super Retina XDR OLED, 2556 x 1179 pixels, 120Hz', '256GB', 'iPhone 14 Pro 256GB', 'Vàng', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 256GB dung lượng, Vàng, Apple A16 Bionic', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-14-pro-vs-iphone-14-pro-max-128gb-256gb-512gb-1tb-mau-vang-600x600.jpg'),
                                                                                                                                                                                                                                                      (17, 'Apple A16 Bionic', 27990000, 0, 30, 'Camera chính 48MP, Camera góc siêu rộng 12MP, Camera tele 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Super Retina XDR OLED, 2556 x 1179 pixels, 120Hz', '512GB', 'iPhone 14 Pro 512GB', 'Bạc', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 512GB dung lượng, Bạc, Apple A16 Bionic', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-14-pro-vs-iphone-14-pro-max-128gb-256gb-512gb-1tb-mau-trang-600x600.jpg'),
                                                                                                                                                                                                                                                      (18, 'Apple A15 Bionic', 16990000, 0, 55, 'Camera chính 12MP, Camera góc siêu rộng 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Liquid Retina HD, 1792 x 828 pixels, 60Hz', '128GB', 'iPhone 14 128GB', 'Xanh Dương', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 128GB dung lượng, Xanh Dương, Apple A15 Bionic', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-14-thuong-vs-iphone-14-plus-128gb-256gb-512gb-mau-xanh-duong-600x600.jpg'),
                                                                                                                                                                                                                                                      (19, 'Apple A15 Bionic', 18990000, 0, 50, 'Camera chính 12MP, Camera góc siêu rộng 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Liquid Retina HD, 1792 x 828 pixels, 60Hz', '256GB', 'iPhone 14 256GB', 'Tím', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 256GB dung lượng, Tím, Apple A15 Bionic', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-14-thuong-vs-iphone-14-plus-128gb-256gb-512gb-mau-tim-600x600.jpg'),
                                                                                                                                                                                                                                                      (20, 'Apple A15 Bionic', 22990000, 0, 35, 'Camera chính 12MP, Camera góc siêu rộng 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Liquid Retina HD, 1792 x 828 pixels, 60Hz', '512GB', 'iPhone 14 512GB', 'Đỏ', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 512GB dung lượng, Đỏ, Apple A15 Bionic', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-14-thuong-vs-iphone-14-plus-128gb-256gb-512gb-mau-do-600x600.jpg'),
                                                                                                                                                                                                                                                      (21, 'Apple A15 Bionic', 14990000, 0, 60, 'Camera chính 12MP, Camera góc siêu rộng 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Liquid Retina HD, 1792 x 828 pixels, 60Hz', '128GB', 'iPhone 13 128GB', 'Xanh Dương', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 128GB dung lượng, Xanh Dương, Apple A15 Bionic', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-13-thuong-vs-iphone-13-mini-128gb-256gb-512gb-mau-xanh-duong-600x600.jpg'),
                                                                                                                                                                                                                                                      (22, 'Apple A15 Bionic', 16990000, 0, 50, 'Camera chính 12MP, Camera góc siêu rộng 12MP, Camera selfie 12MP', 'iOS 17', '6.1 inch Liquid Retina HD, 1792 x 828 pixels, 60Hz', '256GB', 'iPhone 13 256GB', 'Hồng', '12 tháng chính hãng Apple', 'iPhone chính hãng Apple, 256GB dung lượng, Hồng, Apple A15 Bionic', 1, 2, 'https://tranphumobile.com/wp-content/uploads/2024/11/iphone-13-thuong-vs-iphone-13-mini-128gb-256gb-512gb-mau-hong-600x600.jpg');

-- Dumping structure for table laptop_store.vai_tro
DROP TABLE IF EXISTS `vai_tro`;
CREATE TABLE IF NOT EXISTS `vai_tro` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `ten_vai_tro` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- Dumping data for table laptop_store.vai_tro: ~3 rows (approximately)
DELETE FROM `vai_tro`;
INSERT INTO `vai_tro` (`id`, `ten_vai_tro`) VALUES
                                                (1, 'ROLE_ADMIN'),
                                                (2, 'ROLE_MEMBER'),
                                                (3, 'ROLE_SHIPPER');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
