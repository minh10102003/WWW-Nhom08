package fit.iuh.se.mobileshop.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fit.iuh.se.mobileshop.entities.SanPham;
import fit.iuh.se.mobileshop.entities.SanPhamHinhAnh;
import fit.iuh.se.mobileshop.repository.SanPhamHinhAnhRepository;
import fit.iuh.se.mobileshop.service.SanPhamHinhAnhService;

@Service
public class SanPhamHinhAnhServiceImpl implements SanPhamHinhAnhService {
	
	@Autowired
	private SanPhamHinhAnhRepository repository;
	
	@Override
	public List<SanPhamHinhAnh> getHinhAnhBySanPham(SanPham sanPham) {
		return repository.findBySanPhamOrderByThuTuAsc(sanPham);
	}
	
	@Override
	public List<SanPhamHinhAnh> getHinhAnhBySanPhamAndMauSac(SanPham sanPham, String mauSac) {
		return repository.findBySanPhamAndMauSac(sanPham, mauSac);
	}
	
	@Override
	public SanPhamHinhAnh save(SanPhamHinhAnh hinhAnh) {
		return repository.save(hinhAnh);
	}
	
	@Override
	public void deleteBySanPham(SanPham sanPham) {
		repository.deleteBySanPham(sanPham);
	}
	
	@Override
	public void deleteById(long id) {
		repository.deleteById(id);
	}
}


