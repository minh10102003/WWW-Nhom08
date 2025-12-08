package fit.iuh.se.mobileshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import fit.iuh.se.mobileshop.entities.ChiMucGioHang;
import fit.iuh.se.mobileshop.entities.GioHang;
import fit.iuh.se.mobileshop.entities.SanPham;

public interface ChiMucGioHangRepository extends JpaRepository<ChiMucGioHang, Long>{
	
	ChiMucGioHang findBySanPhamAndGioHang(SanPham sp,GioHang g);
	
	List<ChiMucGioHang> findByGioHang(GioHang g);
	
	List<ChiMucGioHang> findBySanPham(SanPham sanPham);
}
