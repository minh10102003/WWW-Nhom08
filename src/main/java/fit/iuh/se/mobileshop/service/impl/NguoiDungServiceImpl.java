package fit.iuh.se.mobileshop.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import fit.iuh.se.mobileshop.dto.TaiKhoanDTO;
import fit.iuh.se.mobileshop.entities.ChiMucGioHang;
import fit.iuh.se.mobileshop.entities.DonHang;
import fit.iuh.se.mobileshop.entities.GioHang;
import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.entities.VaiTro;
import fit.iuh.se.mobileshop.repository.ChiMucGioHangRepository;
import fit.iuh.se.mobileshop.repository.DonHangRepository;
import fit.iuh.se.mobileshop.repository.GioHangRepository;
import fit.iuh.se.mobileshop.repository.NguoiDungRepository;
import fit.iuh.se.mobileshop.repository.VaiTroRepository;
import fit.iuh.se.mobileshop.service.NguoiDungService;

@Service
@Transactional
public class NguoiDungServiceImpl implements NguoiDungService {

	@Autowired
	private NguoiDungRepository nguoiDungRepo;

	@Autowired
	private VaiTroRepository vaiTroRepo;

	@Autowired
	private DonHangRepository donHangRepo;

	@Autowired
	private GioHangRepository gioHangRepo;

	@Autowired
	private ChiMucGioHangRepository chiMucGioHangRepo;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Override
	public NguoiDung findByEmail(String email) {
		return nguoiDungRepo.findByEmail(email);
	}

	@Override
	public NguoiDung findByConfirmationToken(String confirmationToken) {
		return null;
	}

	@Override
	public NguoiDung saveUserForMember(NguoiDung nd) {
		nd.setPassword(bCryptPasswordEncoder.encode(nd.getPassword()));
		Set<VaiTro> setVaiTro = new HashSet<>();
		setVaiTro.add(vaiTroRepo.findByTenVaiTro("ROLE_MEMBER"));
		nd.setVaiTro(setVaiTro);
		return nguoiDungRepo.save(nd);
	}

	@Override
	public NguoiDung findById(long id) {
		NguoiDung nd = nguoiDungRepo.findById(id).get();
		return nd;
	}

	@Override
	public NguoiDung updateUser(NguoiDung nd) {
		return nguoiDungRepo.save(nd);
	}

	@Override
	public void changePass(NguoiDung nd, String newPass) {
		nd.setPassword(bCryptPasswordEncoder.encode(newPass));
		nguoiDungRepo.save(nd);
	}

	@Override
	public Page<NguoiDung> getNguoiDungByVaiTro(Set<VaiTro> vaiTro, int page) {
		try {
			if (vaiTro == null || vaiTro.isEmpty()) {
				System.out.println("WARNING: vaiTro Set is null or empty");
				return org.springframework.data.domain.Page.empty();
			}
			int pageIndex = Math.max(0, page - 1);
			System.out.println("Service: Querying with " + vaiTro.size() + " roles, page: " + pageIndex);
			Page<NguoiDung> result = nguoiDungRepo.findByVaiTro(vaiTro, PageRequest.of(pageIndex, 6));
			System.out.println("Service: Query returned " + result.getTotalElements() + " total elements");
			return result;
		} catch (Exception e) {
			System.err.println("ERROR in NguoiDungServiceImpl.getNguoiDungByVaiTro:");
			e.printStackTrace();
			throw e;
		}
	}

	@Override
	public List<NguoiDung> getNguoiDungByVaiTro(Set<VaiTro> vaiTro) {
		return nguoiDungRepo.findByVaiTro(vaiTro);
	}

	@Override
	public NguoiDung saveUserForAdmin(TaiKhoanDTO dto) {
		NguoiDung nd = new NguoiDung();
		nd.setHoTen(dto.getHoTen());
		nd.setDiaChi(dto.getDiaChi());
		nd.setEmail(dto.getEmail());
		nd.setSoDienThoai(dto.getSdt());
		nd.setPassword(bCryptPasswordEncoder.encode(dto.getPassword()));
		
		Set<VaiTro> vaiTro = new HashSet<>();
		
		// Ưu tiên sử dụng danh sách vai trò mới (mảng)
		if (dto.getDanhSachVaiTro() != null && !dto.getDanhSachVaiTro().isEmpty()) {
			for (String tenVaiTro : dto.getDanhSachVaiTro()) {
				VaiTro role = vaiTroRepo.findByTenVaiTro(tenVaiTro);
				if (role != null) {
					vaiTro.add(role);
				}
			}
		} else if (dto.getTenVaiTro() != null && !dto.getTenVaiTro().isEmpty()) {
			// Tương thích ngược: nếu không có mảng thì dùng giá trị đơn
			VaiTro role = vaiTroRepo.findByTenVaiTro(dto.getTenVaiTro());
			if (role != null) {
				vaiTro.add(role);
			}
		}
		
		nd.setVaiTro(vaiTro);
		
		return nguoiDungRepo.save(nd);
	}

	@Override
	public void deleteById(long id) {
		try {
			System.out.println("=== Deleting user with id: " + id + " ===");
			
			// Tìm user cần xóa
			NguoiDung user = nguoiDungRepo.findById(id).orElse(null);
			if (user == null) {
				System.out.println("User not found with id: " + id);
				return;
			}
			
			// 1. Xóa hoặc set null các DonHang liên quan (nguoiDat và shipper)
			List<DonHang> donHangList = donHangRepo.findByNguoiDat(user);
			for (DonHang dh : donHangList) {
				dh.setNguoiDat(null);
				donHangRepo.save(dh);
				System.out.println("Set nguoiDat to null for DonHang id: " + dh.getId());
			}
			
			// Xóa các DonHang mà user là shipper
			List<DonHang> donHangShipperList = donHangRepo.findByShipper(user);
			for (DonHang dh : donHangShipperList) {
				dh.setShipper(null);
				donHangRepo.save(dh);
				System.out.println("Set shipper to null for DonHang id: " + dh.getId());
			}
			
			// 2. Xóa GioHang và ChiMucGioHang liên quan
			GioHang gioHang = gioHangRepo.findByNguoiDung(user);
			if (gioHang != null) {
				// Xóa tất cả ChiMucGioHang trước
				List<ChiMucGioHang> chiMucGioHangList = chiMucGioHangRepo.findByGioHang(gioHang);
				if (chiMucGioHangList != null && !chiMucGioHangList.isEmpty()) {
					chiMucGioHangRepo.deleteAll(chiMucGioHangList);
					System.out.println("Deleted " + chiMucGioHangList.size() + " ChiMucGioHang records");
				}
				// Sau đó mới xóa GioHang
				gioHangRepo.delete(gioHang);
				System.out.println("Deleted GioHang id: " + gioHang.getId());
			}
			
			// 3. Xóa các quan hệ ManyToMany (nguoidung_vaitro) - Hibernate sẽ tự xóa khi xóa user
			// Chỉ cần clear set trước khi xóa
			user.setVaiTro(new HashSet<>());
			nguoiDungRepo.save(user);
			
			// 4. Cuối cùng mới xóa user
			nguoiDungRepo.deleteById(id);
			System.out.println("Successfully deleted user with id: " + id);
			
		} catch (Exception e) {
			System.err.println("ERROR in deleteById:");
			System.err.println("Exception type: " + e.getClass().getName());
			System.err.println("Exception message: " + e.getMessage());
			e.printStackTrace();
			if (e.getCause() != null) {
				System.err.println("Cause: " + e.getCause().getMessage());
				e.getCause().printStackTrace();
			}
			throw new RuntimeException("Error deleting user: " + e.getMessage(), e);
		}
	}

}
