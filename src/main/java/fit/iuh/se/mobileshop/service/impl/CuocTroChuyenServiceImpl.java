package fit.iuh.se.mobileshop.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fit.iuh.se.mobileshop.entities.CuocTroChuyen;
import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.repository.CuocTroChuyenRepository;
import fit.iuh.se.mobileshop.service.CuocTroChuyenService;
import fit.iuh.se.mobileshop.service.NguoiDungService;

@Service
public class CuocTroChuyenServiceImpl implements CuocTroChuyenService {

	@Autowired
	private CuocTroChuyenRepository cuocTroChuyenRepo;

	@Autowired
	private NguoiDungService nguoiDungService;

	@Override
	public CuocTroChuyen findById(long id) {
		return cuocTroChuyenRepo.findById(id).orElse(null);
	}

	@Override
	@Transactional
	public CuocTroChuyen save(CuocTroChuyen cuocTroChuyen) {
		if (cuocTroChuyen.getThoiGianCapNhat() == null) {
			cuocTroChuyen.setThoiGianCapNhat(new Date());
		}
		return cuocTroChuyenRepo.save(cuocTroChuyen);
	}

	@Override
	@Transactional
	public CuocTroChuyen findOrCreateActiveConversation(long khachHangId) {
		// Tìm cuộc trò chuyện đang chờ hoặc đang chat
		List<CuocTroChuyen> activeConversations = cuocTroChuyenRepo
				.findActiveConversationsByKhachHang(khachHangId);

		if (!activeConversations.isEmpty()) {
			// Trả về cuộc trò chuyện đầu tiên (mới nhất)
			return activeConversations.get(0);
		}

		// Tạo cuộc trò chuyện mới
		NguoiDung khachHang = nguoiDungService.findById(khachHangId);
		if (khachHang == null) {
			throw new RuntimeException("Không tìm thấy khách hàng với ID: " + khachHangId);
		}

		CuocTroChuyen cuocTroChuyen = new CuocTroChuyen();
		cuocTroChuyen.setKhachHang(khachHang);
		cuocTroChuyen.setAdmin(null);
		cuocTroChuyen.setTrangThai("dang_cho");
		cuocTroChuyen.setThoiGianTao(new Date());
		cuocTroChuyen.setThoiGianCapNhat(new Date());

		return cuocTroChuyenRepo.save(cuocTroChuyen);
	}

	@Override
	public List<CuocTroChuyen> findPendingConversations() {
		return cuocTroChuyenRepo.findByTrangThaiAndAdminIsNull("dang_cho");
	}

	@Override
	public List<CuocTroChuyen> findByKhachHangId(long khachHangId) {
		return cuocTroChuyenRepo.findByKhachHangIdOrderByThoiGianCapNhatDesc(khachHangId);
	}

	@Override
	public List<CuocTroChuyen> findByAdminId(long adminId) {
		return cuocTroChuyenRepo.findByAdminIdOrderByThoiGianCapNhatDesc(adminId);
	}

	@Override
	@Transactional
	public CuocTroChuyen assignToAdmin(long conversationId, long adminId) {
		CuocTroChuyen cuocTroChuyen = findById(conversationId);
		if (cuocTroChuyen == null) {
			throw new RuntimeException("Không tìm thấy cuộc trò chuyện với ID: " + conversationId);
		}

		NguoiDung admin = nguoiDungService.findById(adminId);
		if (admin == null) {
			throw new RuntimeException("Không tìm thấy admin với ID: " + adminId);
		}

		cuocTroChuyen.setAdmin(admin);
		cuocTroChuyen.setTrangThai("dang_chat");
		cuocTroChuyen.setThoiGianCapNhat(new Date());

		return cuocTroChuyenRepo.save(cuocTroChuyen);
	}

	@Override
	@Transactional
	public CuocTroChuyen endConversation(long conversationId) {
		CuocTroChuyen cuocTroChuyen = findById(conversationId);
		if (cuocTroChuyen == null) {
			throw new RuntimeException("Không tìm thấy cuộc trò chuyện với ID: " + conversationId);
		}

		cuocTroChuyen.setTrangThai("da_ket_thuc");
		cuocTroChuyen.setThoiGianCapNhat(new Date());

		return cuocTroChuyenRepo.save(cuocTroChuyen);
	}

	@Override
	public long countPendingConversations() {
		return cuocTroChuyenRepo.countByTrangThaiAndAdminIsNull("dang_cho");
	}

	@Override
	public List<CuocTroChuyen> findAllActiveConversations() {
		return cuocTroChuyenRepo.findAllActiveConversations();
	}
}

