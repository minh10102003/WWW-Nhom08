package fit.iuh.se.mobileshop.service;

import java.util.List;

import fit.iuh.se.mobileshop.entities.CuocTroChuyen;

public interface CuocTroChuyenService {

	CuocTroChuyen findById(long id);

	CuocTroChuyen save(CuocTroChuyen cuocTroChuyen);

	// Tìm hoặc tạo cuộc trò chuyện đang chờ của khách hàng
	CuocTroChuyen findOrCreateActiveConversation(long khachHangId);

	// Lấy tất cả cuộc trò chuyện đang chờ (chưa có admin nhận)
	List<CuocTroChuyen> findPendingConversations();

	// Lấy tất cả cuộc trò chuyện của khách hàng
	List<CuocTroChuyen> findByKhachHangId(long khachHangId);

	// Lấy tất cả cuộc trò chuyện của admin
	List<CuocTroChuyen> findByAdminId(long adminId);

	// Admin nhận cuộc trò chuyện
	CuocTroChuyen assignToAdmin(long conversationId, long adminId);

	// Kết thúc cuộc trò chuyện
	CuocTroChuyen endConversation(long conversationId);

	// Đếm số cuộc trò chuyện đang chờ
	long countPendingConversations();

	// Lấy tất cả cuộc trò chuyện đang hoạt động (cho admin xem tất cả)
	List<CuocTroChuyen> findAllActiveConversations();
}

