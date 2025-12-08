package fit.iuh.se.mobileshop.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import fit.iuh.se.mobileshop.dto.SearchDonHangObject;
import fit.iuh.se.mobileshop.entities.DonHang;
import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.entities.QDonHang;
import fit.iuh.se.mobileshop.repository.DonHangRepository;
import fit.iuh.se.mobileshop.service.DonHangService;
import com.querydsl.core.BooleanBuilder;

@Service
public class DonHangServiceImpl implements DonHangService {

	@Autowired
	private DonHangRepository donHangRepo;

	@Override
	public Page<DonHang> getAllDonHangByFilter(SearchDonHangObject object, int page) throws ParseException {
		BooleanBuilder builder = new BooleanBuilder();

		String trangThaiDon = object.getTrangThaiDon();
		String tuNgay = object.getTuNgay();
		String denNgay = object.getDenNgay();
		SimpleDateFormat formatDate = new SimpleDateFormat("dd-MM-yyyy");

		if (!trangThaiDon.equals("")) {
			builder.and(QDonHang.donHang.trangThaiDonHang.eq(trangThaiDon));
		}

		if (!tuNgay.equals("") && tuNgay != null) {
			if (trangThaiDon.equals("") || trangThaiDon.equals("Đang chờ giao") || trangThaiDon.equals("Đã hủy")) {
				builder.and(QDonHang.donHang.ngayDatHang.goe(formatDate.parse(tuNgay)));
			} else if (trangThaiDon.equals("Đang giao")) {
				builder.and(QDonHang.donHang.ngayGiaoHang.goe(formatDate.parse(tuNgay)));
			} else { // hoàn thành
				builder.and(QDonHang.donHang.ngayNhanHang.goe(formatDate.parse(tuNgay)));
			}
		}

		if (!denNgay.equals("") && denNgay != null) {
			if (trangThaiDon.equals("") || trangThaiDon.equals("Đang chờ giao") || trangThaiDon.equals("Đã hủy")) {
				builder.and(QDonHang.donHang.ngayDatHang.loe(formatDate.parse(denNgay)));
			} else if (trangThaiDon.equals("Đang giao")) {
				builder.and(QDonHang.donHang.ngayGiaoHang.loe(formatDate.parse(denNgay)));
			} else { // hoàn thành
				builder.and(QDonHang.donHang.ngayNhanHang.loe(formatDate.parse(denNgay)));
			}
		}

		// Sắp xếp theo ngày đặt hàng giảm dần (mới nhất lên trên)
		Sort sort = Sort.by(Sort.Direction.DESC, "ngayDatHang");
		return donHangRepo.findAll(builder, PageRequest.of(page - 1, 6, sort));
	}

	@Override
	public DonHang update(DonHang dh) {
		return donHangRepo.save(dh);
	}

	@Override
	public DonHang findById(long id) {
		return donHangRepo.findById(id).get();
	}

	@Override
	public List<DonHang> findByTrangThaiDonHangAndShipper(String trangThai, NguoiDung shipper) {
		return donHangRepo.findByTrangThaiDonHangAndShipper(trangThai, shipper);
	}

	@Override
	public DonHang save(DonHang dh) {
		return donHangRepo.save(dh);
	}

	@Override
	public List<Object> layDonHangTheoThangVaNam() {
		return donHangRepo.layDonHangTheoThangVaNam();
	}
	
	@Override
	public List<DonHang> getDonHangByNguoiDung(NguoiDung ng) {
		return donHangRepo.findByNguoiDat(ng);
	}

	@Override
	public Page<DonHang> findDonHangByShipper(SearchDonHangObject object, int page, int size, NguoiDung shipper) throws ParseException {
		BooleanBuilder builder = new BooleanBuilder();

		String trangThaiDon = object.getTrangThaiDon();
		String tuNgay = object.getTuNgay();
		String denNgay = object.getDenNgay();
		SimpleDateFormat formatDate = new SimpleDateFormat("dd-MM-yyyy");
		
		builder.and(QDonHang.donHang.shipper.eq(shipper));

		if (!trangThaiDon.equals("")) {
			builder.and(QDonHang.donHang.trangThaiDonHang.eq(trangThaiDon));
		}

		if (!tuNgay.equals("") && tuNgay != null) {
			if (trangThaiDon.equals("Đang giao")) {
				builder.and(QDonHang.donHang.ngayGiaoHang.goe(formatDate.parse(tuNgay)));
			} else { // hoàn thành
				builder.and(QDonHang.donHang.ngayNhanHang.goe(formatDate.parse(tuNgay)));
			}
		}

		if (!denNgay.equals("") && denNgay != null) {
			if (trangThaiDon.equals("Đang giao")) {
				builder.and(QDonHang.donHang.ngayGiaoHang.loe(formatDate.parse(denNgay)));
			} else { // hoàn thành
				builder.and(QDonHang.donHang.ngayNhanHang.loe(formatDate.parse(denNgay)));
			}
		}

		// Sắp xếp theo ngày đặt hàng giảm dần (mới nhất lên trên)
		Sort sort = Sort.by(Sort.Direction.DESC, "ngayDatHang");
		return donHangRepo.findAll(builder, PageRequest.of(page - 1, size, sort));
	}

	@Override
	public int countByTrangThaiDonHang(String trangThaiDonHang) {
		return donHangRepo.countByTrangThaiDonHang(trangThaiDonHang);
	}

}
