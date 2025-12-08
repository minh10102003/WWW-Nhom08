package fit.iuh.se.mobileshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fit.iuh.se.mobileshop.entities.GioHang;
import fit.iuh.se.mobileshop.entities.NguoiDung;

public interface GioHangRepository extends JpaRepository<GioHang, Long>{
	
	GioHang findByNguoiDung(NguoiDung n);
	
}
