package fit.iuh.se.mobileshop.service;

import java.util.List;

import fit.iuh.se.mobileshop.entities.TinNhan;

public interface TinNhanService {

	TinNhan findById(long id);

	TinNhan save(TinNhan tinNhan);

	// Lấy tất cả tin nhắn của cuộc trò chuyện
	List<TinNhan> findByCuocTroChuyenId(long cuocTroChuyenId);

	// Tạo tin nhắn mới
	TinNhan createMessage(long cuocTroChuyenId, long nguoiGuiId, String noiDung, String loaiTinNhan);

	// Đánh dấu tin nhắn đã đọc
	void markAsRead(long cuocTroChuyenId, long nguoiDungId);

	// Đếm số tin nhắn chưa đọc
	long countUnreadMessages(long cuocTroChuyenId, long nguoiDungId);

	// Đếm tổng số tin nhắn chưa đọc của user trong tất cả conversations
	long countTotalUnreadMessagesForUser(long userId);
}

