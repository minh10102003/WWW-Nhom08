package fit.iuh.se.mobileshop.service;

import java.text.ParseException;
import java.util.List;

import org.springframework.data.domain.Page;

import fit.iuh.se.mobileshop.dto.SearchDonHangObject;
import fit.iuh.se.mobileshop.entities.DonHang;
import fit.iuh.se.mobileshop.entities.NguoiDung;

public interface DonHangService {

	Page<DonHang> getAllDonHangByFilter(SearchDonHangObject object, int page) throws ParseException;

	DonHang update(DonHang dh);
	
	DonHang findById(long id);
	
	Page<DonHang> findDonHangByShipper(SearchDonHangObject object, int page, int size, NguoiDung shipper) throws ParseException;

	DonHang save(DonHang dh);
	
	List<Object> layDonHangTheoThangVaNam();

	List<DonHang> findByTrangThaiDonHangAndShipper(String string, NguoiDung shipper);

	
	List<DonHang> getDonHangByNguoiDung(NguoiDung currentUser);
	
	int countByTrangThaiDonHang(String trangThaiDonHang);
}
