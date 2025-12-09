package fit.iuh.se.mobileshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import fit.iuh.se.mobileshop.entities.TinNhan;

public interface TinNhanRepository extends JpaRepository<TinNhan, Long> {

	// Lấy tất cả tin nhắn của cuộc trò chuyện, sắp xếp theo thời gian
	List<TinNhan> findByCuocTroChuyenIdOrderByThoiGianGuiAsc(long cuocTroChuyenId);

	// Đếm số tin nhắn chưa đọc trong cuộc trò chuyện
	long countByCuocTroChuyenIdAndDaDocFalse(long cuocTroChuyenId);

	// Đếm số tin nhắn chưa đọc của người dùng (không phải tin nhắn của họ)
	@Query("SELECT COUNT(t) FROM TinNhan t WHERE t.cuocTroChuyen.id = :cuocTroChuyenId AND t.nguoiGui.id != :nguoiDungId AND t.daDoc = false")
	long countUnreadMessages(@Param("cuocTroChuyenId") long cuocTroChuyenId, @Param("nguoiDungId") long nguoiDungId);

	// Đánh dấu tất cả tin nhắn trong cuộc trò chuyện là đã đọc (trừ tin nhắn của người dùng)
	@Query("UPDATE TinNhan t SET t.daDoc = true WHERE t.cuocTroChuyen.id = :cuocTroChuyenId AND t.nguoiGui.id != :nguoiDungId")
	void markAsRead(@Param("cuocTroChuyenId") long cuocTroChuyenId, @Param("nguoiDungId") long nguoiDungId);

	// Đếm tổng số tin nhắn chưa đọc của user trong tất cả conversations
	@Query("SELECT COUNT(t) FROM TinNhan t WHERE t.cuocTroChuyen.id IN " +
		   "(SELECT c.id FROM CuocTroChuyen c WHERE (c.khachHang.id = :userId OR c.admin.id = :userId)) " +
		   "AND t.nguoiGui.id != :userId AND t.daDoc = false")
	long countTotalUnreadMessagesForUser(@Param("userId") long userId);
}

