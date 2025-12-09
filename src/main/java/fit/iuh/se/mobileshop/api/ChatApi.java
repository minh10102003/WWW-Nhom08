package fit.iuh.se.mobileshop.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.iuh.se.mobileshop.entities.CuocTroChuyen;
import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.entities.ResponseObject;
import fit.iuh.se.mobileshop.entities.TinNhan;
import fit.iuh.se.mobileshop.service.CuocTroChuyenService;
import fit.iuh.se.mobileshop.service.NguoiDungService;
import fit.iuh.se.mobileshop.service.TinNhanService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class ChatApi {

	@Autowired
	private CuocTroChuyenService cuocTroChuyenService;

	@Autowired
	private TinNhanService tinNhanService;

	@Autowired
	private NguoiDungService nguoiDungService;

	/**
	 * Lấy hoặc tạo cuộc trò chuyện cho khách hàng
	 */
	@GetMapping("/conversation")
	public ResponseEntity<ResponseObject> getOrCreateConversation() {
		ResponseObject ro = new ResponseObject();
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
				ro.setStatus("fail");
				ro.setData("Bạn cần đăng nhập để sử dụng chat");
				return ResponseEntity.ok(ro);
			}

			String email = auth.getName();
			NguoiDung user = nguoiDungService.findByEmail(email);
			if (user == null) {
				ro.setStatus("fail");
				ro.setData("Không tìm thấy người dùng");
				return ResponseEntity.ok(ro);
			}

			// Kiểm tra nếu user là admin thì không cho tạo conversation
			boolean isAdmin = user.getVaiTro().stream()
					.anyMatch(vt -> vt.getTenVaiTro().equals("ADMIN") || vt.getTenVaiTro().equals("ROLE_ADMIN"));
			if (isAdmin) {
				ro.setStatus("fail");
				ro.setData("Admin không thể tạo cuộc trò chuyện. Vui lòng sử dụng trang admin chat.");
				return ResponseEntity.ok(ro);
			}

			CuocTroChuyen conversation = cuocTroChuyenService.findOrCreateActiveConversation(user.getId());
			ro.setStatus("success");
			ro.setData(conversation);
			return ResponseEntity.ok(ro);

		} catch (Exception e) {
			ro.setStatus("fail");
			ro.setData("Lỗi: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.ok(ro);
		}
	}

	/**
	 * Lấy tất cả cuộc trò chuyện của khách hàng
	 */
	@GetMapping("/conversations")
	public ResponseEntity<ResponseObject> getConversations() {
		ResponseObject ro = new ResponseObject();
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
				ro.setStatus("fail");
				ro.setData("Bạn cần đăng nhập");
				return ResponseEntity.ok(ro);
			}

			String email = auth.getName();
			NguoiDung user = nguoiDungService.findByEmail(email);
			if (user == null) {
				ro.setStatus("fail");
				ro.setData("Không tìm thấy người dùng");
				return ResponseEntity.ok(ro);
			}

			List<CuocTroChuyen> conversations;
			// Kiểm tra role: nếu là admin thì lấy TẤT CẢ conversations, nếu không thì chỉ lấy của user
			boolean isAdmin = user.getVaiTro().stream()
					.anyMatch(vt -> vt.getTenVaiTro().equals("ADMIN") || vt.getTenVaiTro().equals("ROLE_ADMIN"));
			if (isAdmin) {
				// Admin thấy TẤT CẢ conversations (không chỉ của mình)
				conversations = cuocTroChuyenService.findAllActiveConversations();
			} else {
				// Khách hàng chỉ thấy conversations của mình
				conversations = cuocTroChuyenService.findByKhachHangId(user.getId());
			}

			ro.setStatus("success");
			ro.setData(conversations);
			return ResponseEntity.ok(ro);

		} catch (Exception e) {
			ro.setStatus("fail");
			ro.setData("Lỗi: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.ok(ro);
		}
	}

	/**
	 * Lấy tin nhắn của cuộc trò chuyện
	 */
	@GetMapping("/conversations/{conversationId}/messages")
	public ResponseEntity<ResponseObject> getMessages(@PathVariable Long conversationId) {
		ResponseObject ro = new ResponseObject();
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
				ro.setStatus("fail");
				ro.setData("Bạn cần đăng nhập");
				return ResponseEntity.ok(ro);
			}

			String email = auth.getName();
			NguoiDung user = nguoiDungService.findByEmail(email);
			if (user == null) {
				ro.setStatus("fail");
				ro.setData("Không tìm thấy người dùng");
				return ResponseEntity.ok(ro);
			}

			CuocTroChuyen conversation = cuocTroChuyenService.findById(conversationId);
			if (conversation == null) {
				ro.setStatus("fail");
				ro.setData("Không tìm thấy cuộc trò chuyện");
				return ResponseEntity.ok(ro);
			}

			// Kiểm tra quyền truy cập
			boolean isAdmin = user.getVaiTro().stream()
					.anyMatch(vt -> vt.getTenVaiTro().equals("ADMIN") || vt.getTenVaiTro().equals("ROLE_ADMIN"));
			// Admin có thể xem tất cả conversations, khách hàng chỉ xem của mình
			if (!isAdmin && conversation.getKhachHang().getId() != user.getId()) {
				ro.setStatus("fail");
				ro.setData("Bạn không có quyền xem cuộc trò chuyện này");
				return ResponseEntity.ok(ro);
			}

			List<TinNhan> messages = tinNhanService.findByCuocTroChuyenId(conversationId);

			// Đánh dấu đã đọc
			tinNhanService.markAsRead(conversationId, user.getId());

			ro.setStatus("success");
			ro.setData(messages);
			return ResponseEntity.ok(ro);

		} catch (Exception e) {
			ro.setStatus("fail");
			ro.setData("Lỗi: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.ok(ro);
		}
	}

	/**
	 * Admin: Lấy danh sách cuộc trò chuyện đang chờ
	 */
	@GetMapping("/admin/pending")
	public ResponseEntity<ResponseObject> getPendingConversations() {
		ResponseObject ro = new ResponseObject();
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
				ro.setStatus("fail");
				ro.setData("Bạn cần đăng nhập");
				return ResponseEntity.ok(ro);
			}

			String email = auth.getName();
			NguoiDung user = nguoiDungService.findByEmail(email);
			if (user == null) {
				ro.setStatus("fail");
				ro.setData("Không tìm thấy người dùng");
				return ResponseEntity.ok(ro);
			}

			// Kiểm tra role admin
			boolean isAdmin = user.getVaiTro().stream()
					.anyMatch(vt -> vt.getTenVaiTro().equals("ADMIN"));
			if (!isAdmin) {
				ro.setStatus("fail");
				ro.setData("Bạn không có quyền truy cập");
				return ResponseEntity.ok(ro);
			}

			List<CuocTroChuyen> conversations = cuocTroChuyenService.findPendingConversations();
			ro.setStatus("success");
			ro.setData(conversations);
			return ResponseEntity.ok(ro);

		} catch (Exception e) {
			ro.setStatus("fail");
			ro.setData("Lỗi: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.ok(ro);
		}
	}

	/**
	 * Admin: Nhận cuộc trò chuyện
	 */
	@PutMapping("/admin/conversations/{conversationId}/assign")
	public ResponseEntity<ResponseObject> assignConversation(@PathVariable Long conversationId) {
		ResponseObject ro = new ResponseObject();
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
				ro.setStatus("fail");
				ro.setData("Bạn cần đăng nhập");
				return ResponseEntity.ok(ro);
			}

			String email = auth.getName();
			NguoiDung user = nguoiDungService.findByEmail(email);
			if (user == null) {
				ro.setStatus("fail");
				ro.setData("Không tìm thấy người dùng");
				return ResponseEntity.ok(ro);
			}

			// Kiểm tra role admin
			boolean isAdmin = user.getVaiTro().stream()
					.anyMatch(vt -> vt.getTenVaiTro().equals("ADMIN"));
			if (!isAdmin) {
				ro.setStatus("fail");
				ro.setData("Bạn không có quyền truy cập");
				return ResponseEntity.ok(ro);
			}

			CuocTroChuyen conversation = cuocTroChuyenService.assignToAdmin(conversationId, user.getId());
			ro.setStatus("success");
			ro.setData(conversation);
			return ResponseEntity.ok(ro);

		} catch (Exception e) {
			ro.setStatus("fail");
			ro.setData("Lỗi: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.ok(ro);
		}
	}

	/**
	 * Đếm số tin nhắn chưa đọc trong một conversation
	 */
	@GetMapping("/conversations/{conversationId}/unread-count")
	public ResponseEntity<ResponseObject> getUnreadCount(@PathVariable Long conversationId) {
		ResponseObject ro = new ResponseObject();
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
				ro.setStatus("fail");
				ro.setData("Bạn cần đăng nhập");
				return ResponseEntity.ok(ro);
			}

			String email = auth.getName();
			NguoiDung user = nguoiDungService.findByEmail(email);
			if (user == null) {
				ro.setStatus("fail");
				ro.setData("Không tìm thấy người dùng");
				return ResponseEntity.ok(ro);
			}

			long unreadCount = tinNhanService.countUnreadMessages(conversationId, user.getId());
			Map<String, Object> data = new HashMap<>();
			data.put("unreadCount", unreadCount);
			ro.setStatus("success");
			ro.setData(data);
			return ResponseEntity.ok(ro);

		} catch (Exception e) {
			ro.setStatus("fail");
			ro.setData("Lỗi: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.ok(ro);
		}
	}

	/**
	 * Đếm tổng số tin nhắn chưa đọc của user (tất cả conversations)
	 */
	@GetMapping("/unread-count")
	public ResponseEntity<ResponseObject> getTotalUnreadCount() {
		ResponseObject ro = new ResponseObject();
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
				ro.setStatus("fail");
				ro.setData("Bạn cần đăng nhập");
				return ResponseEntity.ok(ro);
			}

			String email = auth.getName();
			NguoiDung user = nguoiDungService.findByEmail(email);
			if (user == null) {
				ro.setStatus("fail");
				ro.setData("Không tìm thấy người dùng");
				return ResponseEntity.ok(ro);
			}

			long totalUnreadCount = tinNhanService.countTotalUnreadMessagesForUser(user.getId());
			Map<String, Object> data = new HashMap<>();
			data.put("unreadCount", totalUnreadCount);
			ro.setStatus("success");
			ro.setData(data);
			return ResponseEntity.ok(ro);

		} catch (Exception e) {
			ro.setStatus("fail");
			ro.setData("Lỗi: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.ok(ro);
		}
	}
}

