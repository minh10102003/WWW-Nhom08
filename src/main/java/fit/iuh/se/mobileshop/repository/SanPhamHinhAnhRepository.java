package fit.iuh.se.mobileshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import fit.iuh.se.mobileshop.entities.SanPham;
import fit.iuh.se.mobileshop.entities.SanPhamHinhAnh;

public interface SanPhamHinhAnhRepository extends JpaRepository<SanPhamHinhAnh, Long> {
	
	List<SanPhamHinhAnh> findBySanPham(SanPham sanPham);
	
	List<SanPhamHinhAnh> findBySanPhamOrderByThuTuAsc(SanPham sanPham);
	
	List<SanPhamHinhAnh> findBySanPhamAndMauSac(SanPham sanPham, String mauSac);
	
	SanPhamHinhAnh findBySanPhamAndMauSacAndThuTu(SanPham sanPham, String mauSac, int thuTu);
	
	void deleteBySanPham(SanPham sanPham);
}


