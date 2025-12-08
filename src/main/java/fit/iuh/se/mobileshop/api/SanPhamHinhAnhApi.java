package fit.iuh.se.mobileshop.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fit.iuh.se.mobileshop.entities.SanPham;
import fit.iuh.se.mobileshop.entities.SanPhamHinhAnh;
import fit.iuh.se.mobileshop.service.SanPhamHinhAnhService;
import fit.iuh.se.mobileshop.service.SanPhamService;

@RestController
@RequestMapping("/api/san-pham-hinh-anh")
public class SanPhamHinhAnhApi {
	
	@Autowired
	private SanPhamHinhAnhService hinhAnhService;
	
	@Autowired
	private SanPhamService sanPhamService;
	
	@GetMapping("/san-pham/{sanPhamId}")
	public List<SanPhamHinhAnh> getHinhAnhBySanPham(@PathVariable long sanPhamId) {
		SanPham sanPham = sanPhamService.getSanPhamById(sanPhamId);
		return hinhAnhService.getHinhAnhBySanPham(sanPham);
	}
	
	@GetMapping("/san-pham/{sanPhamId}/mau-sac")
	public List<SanPhamHinhAnh> getHinhAnhBySanPhamAndMauSac(
			@PathVariable long sanPhamId,
			@RequestParam String mauSac) {
		SanPham sanPham = sanPhamService.getSanPhamById(sanPhamId);
		return hinhAnhService.getHinhAnhBySanPhamAndMauSac(sanPham, mauSac);
	}
}


