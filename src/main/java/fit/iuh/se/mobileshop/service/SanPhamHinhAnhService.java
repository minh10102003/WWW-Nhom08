package fit.iuh.se.mobileshop.service;

import java.util.List;

import fit.iuh.se.mobileshop.entities.SanPham;
import fit.iuh.se.mobileshop.entities.SanPhamHinhAnh;

public interface SanPhamHinhAnhService {
	
	List<SanPhamHinhAnh> getHinhAnhBySanPham(SanPham sanPham);
	
	List<SanPhamHinhAnh> getHinhAnhBySanPhamAndMauSac(SanPham sanPham, String mauSac);
	
	SanPhamHinhAnh save(SanPhamHinhAnh hinhAnh);
	
	void deleteBySanPham(SanPham sanPham);
	
	void deleteById(long id);
}

