package fit.iuh.se.mobileshop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import fit.iuh.se.mobileshop.entities.CuocTroChuyen;

public interface CuocTroChuyenRepository extends JpaRepository<CuocTroChuyen, Long> {

	// Tìm cuộc trò chuyện đang chờ của khách hàng
	Optional<CuocTroChuyen> findByKhachHangIdAndTrangThai(long khachHangId, String trangThai);

	// Tìm cuộc trò chuyện đang chờ (chưa có admin nhận)
	List<CuocTroChuyen> findByTrangThaiAndAdminIsNull(String trangThai);

	// Tìm tất cả cuộc trò chuyện của khách hàng
	List<CuocTroChuyen> findByKhachHangIdOrderByThoiGianCapNhatDesc(long khachHangId);

	// Tìm cuộc trò chuyện của admin
	List<CuocTroChuyen> findByAdminIdOrderByThoiGianCapNhatDesc(long adminId);

	// Tìm cuộc trò chuyện đang chat (có admin nhận)
	List<CuocTroChuyen> findByTrangThaiAndAdminIsNotNull(String trangThai);

	// Đếm số cuộc trò chuyện đang chờ
	long countByTrangThaiAndAdminIsNull(String trangThai);

	// Tìm cuộc trò chuyện đang chờ hoặc đang chat của khách hàng
	@Query("SELECT c FROM CuocTroChuyen c WHERE c.khachHang.id = :khachHangId AND (c.trangThai = 'dang_cho' OR c.trangThai = 'dang_chat') ORDER BY c.thoiGianCapNhat DESC")
	List<CuocTroChuyen> findActiveConversationsByKhachHang(@Param("khachHangId") long khachHangId);

	// Tìm tất cả cuộc trò chuyện (cho admin xem tất cả)
	@Query("SELECT c FROM CuocTroChuyen c WHERE c.trangThai = 'dang_cho' OR c.trangThai = 'dang_chat' ORDER BY c.thoiGianCapNhat DESC")
	List<CuocTroChuyen> findAllActiveConversations();
}

