package fit.iuh.se.mobileshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import fit.iuh.se.mobileshop.entities.ChiTietDonHang;
import fit.iuh.se.mobileshop.entities.SanPham;

public interface ChiTietDonHangRepository extends JpaRepository<ChiTietDonHang, Long>{
	
	List<ChiTietDonHang> findBySanPham(SanPham sanPham);
}
