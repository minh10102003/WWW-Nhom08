package fit.iuh.se.mobileshop.api;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import fit.iuh.se.mobileshop.entities.CuocTroChuyen;
import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.entities.TinNhan;
import fit.iuh.se.mobileshop.service.CuocTroChuyenService;
import fit.iuh.se.mobileshop.service.NguoiDungService;
import fit.iuh.se.mobileshop.service.TinNhanService;

@Controller
public class ChatWebSocketController {

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Autowired
	private TinNhanService tinNhanService;

	@Autowired
	private CuocTroChuyenService cuocTroChuyenService;

	@Autowired
	private NguoiDungService nguoiDungService;

	/**
	 * Xử lý tin nhắn từ client
	 * Client gửi đến: /app/chat.sendMessage
	 * Server gửi về: /topic/conversation.{conversationId}
	 */
	@MessageMapping("/chat.sendMessage")
	public void sendMessage(@Payload Map<String, Object> payload, Principal principal) {
		try {
			// Lấy thông tin người gửi từ Principal
			String email = principal.getName();
			NguoiDung nguoiGui = nguoiDungService.findByEmail(email);
			if (nguoiGui == null) {
				return;
			}

			// Parse payload
			Long conversationId = Long.parseLong(payload.get("conversationId").toString());
			String noiDung = payload.get("content").toString();
			String loaiTinNhan = payload.getOrDefault("type", "text").toString();

			// Lấy cuộc trò chuyện
			CuocTroChuyen cuocTroChuyen = cuocTroChuyenService.findById(conversationId);
			if (cuocTroChuyen == null) {
				return;
			}

			// Nếu admin gửi tin nhắn và conversation chưa có admin, tự động assign
			boolean isAdmin = nguoiGui.getVaiTro().stream()
					.anyMatch(vt -> vt.getTenVaiTro().equals("ADMIN") || vt.getTenVaiTro().equals("ROLE_ADMIN"));
			if (isAdmin && cuocTroChuyen.getAdmin() == null && cuocTroChuyen.getTrangThai().equals("dang_cho")) {
				cuocTroChuyen = cuocTroChuyenService.assignToAdmin(conversationId, nguoiGui.getId());
			}

			// Tạo tin nhắn
			TinNhan tinNhan = tinNhanService.createMessage(conversationId, nguoiGui.getId(), noiDung, loaiTinNhan);

			// Tạo response
			Map<String, Object> response = new HashMap<>();
			response.put("id", tinNhan.getId());
			response.put("conversationId", conversationId);
			response.put("senderId", nguoiGui.getId());
			response.put("senderName", nguoiGui.getHoTen());
			response.put("content", noiDung);
			response.put("type", loaiTinNhan);
			response.put("timestamp", tinNhan.getThoiGianGui().getTime());
			response.put("read", tinNhan.isDaDoc());

			// Gửi tin nhắn đến tất cả người tham gia cuộc trò chuyện
			// Topic: /topic/conversation.{conversationId}
			messagingTemplate.convertAndSend("/topic/conversation." + conversationId, response);

			// Gửi thông báo cập nhật unread count đến tất cả admin
			// (để cập nhật badge trong header)
			messagingTemplate.convertAndSend("/topic/admin.unread-update", 
				Map.of("conversationId", conversationId, "messageId", tinNhan.getId()));

			// Nếu admin chưa nhận cuộc trò chuyện, gửi thông báo đến tất cả admin
			if (cuocTroChuyen.getAdmin() == null) {
				messagingTemplate.convertAndSend("/topic/admin.notifications", response);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Xử lý typing indicator
	 * Client gửi đến: /app/chat.typing
	 * Server gửi về: /topic/conversation.{conversationId}.typing
	 */
	@MessageMapping("/chat.typing")
	public void handleTyping(@Payload Map<String, Object> payload, Principal principal) {
		try {
			String email = principal.getName();
			NguoiDung nguoiGui = nguoiDungService.findByEmail(email);
			if (nguoiGui == null) {
				return;
			}

			Long conversationId = Long.parseLong(payload.get("conversationId").toString());
			Boolean isTyping = Boolean.parseBoolean(payload.getOrDefault("isTyping", "false").toString());

			Map<String, Object> response = new HashMap<>();
			response.put("conversationId", conversationId);
			response.put("userId", nguoiGui.getId());
			response.put("userName", nguoiGui.getHoTen());
			response.put("isTyping", isTyping);

			// Gửi typing indicator đến tất cả người tham gia (trừ người gửi)
			messagingTemplate.convertAndSend("/topic/conversation." + conversationId + ".typing", response);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Xử lý đánh dấu đã đọc
	 * Client gửi đến: /app/chat.read
	 */
	@MessageMapping("/chat.read")
	public void markAsRead(@Payload Map<String, Object> payload, Principal principal) {
		try {
			String email = principal.getName();
			NguoiDung nguoiDung = nguoiDungService.findByEmail(email);
			if (nguoiDung == null) {
				return;
			}

			Long conversationId = Long.parseLong(payload.get("conversationId").toString());

			// Đánh dấu đã đọc
			tinNhanService.markAsRead(conversationId, nguoiDung.getId());

			// Thông báo cho người kia biết đã đọc
			Map<String, Object> response = new HashMap<>();
			response.put("conversationId", conversationId);
			response.put("readBy", nguoiDung.getId());
			response.put("readAt", System.currentTimeMillis());

			messagingTemplate.convertAndSend("/topic/conversation." + conversationId + ".read", response);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

