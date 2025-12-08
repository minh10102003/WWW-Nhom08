package fit.iuh.se.mobileshop.api;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.iuh.se.mobileshop.config.VNPayConfig;
import fit.iuh.se.mobileshop.entities.ChiMucGioHang;
import fit.iuh.se.mobileshop.entities.DonHang;
import fit.iuh.se.mobileshop.entities.GioHang;
import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.service.ChiMucGioHangService;
import fit.iuh.se.mobileshop.service.DonHangService;
import fit.iuh.se.mobileshop.service.GioHangService;
import fit.iuh.se.mobileshop.service.NguoiDungService;
import fit.iuh.se.mobileshop.ulti.VNPayUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * API xử lý callback từ VNPay sau khi thanh toán
 */
@RestController
public class VNPayReturnApi {
	
	@Autowired
	private DonHangService donHangService;
	
	@Autowired
	private NguoiDungService nguoiDungService;
	
	@Autowired
	private GioHangService gioHangService;
	
	@Autowired
	private ChiMucGioHangService chiMucGioHangService;
	
	private NguoiDung getSessionUser(HttpServletRequest request) {
		return (NguoiDung) request.getSession().getAttribute("loggedInUser");
	}
	
	private void cleanUpAfterCheckOut(HttpServletRequest request, HttpServletResponse response) {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			boolean isAnonymous = (auth == null || 
				auth.getPrincipal() == null || 
				"anonymousUser".equals(auth.getPrincipal().toString()) ||
				!auth.isAuthenticated());
			
			if(isAnonymous) {
				// Xóa cookies
				Cookie clientCookies[] = request.getCookies();
				if(clientCookies != null) {
					for(int i = 0; i < clientCookies.length; i++) {
						if(clientCookies[i] != null && clientCookies[i].getName().matches("[0-9]+")) {
							clientCookies[i].setMaxAge(0);
							clientCookies[i].setPath("/iphoneshop");
							response.addCookie(clientCookies[i]);
						}
					}
				}
			} else {
				// Xóa từ database
				NguoiDung currentUser = getSessionUser(request);
				if(currentUser == null) {
					String email = auth.getName();
					if(email != null && !email.equals("anonymousUser")) {
						currentUser = nguoiDungService.findByEmail(email);
						if(currentUser != null) {
							request.getSession().setAttribute("loggedInUser", currentUser);
						}
					}
				}
				
				if(currentUser != null) {
					GioHang g = gioHangService.getGioHangByNguoiDung(currentUser);
					if(g != null) {
						List<ChiMucGioHang> c = chiMucGioHangService.getChiMucGioHangByGioHang(g);
						if(c != null && !c.isEmpty()) {
							chiMucGioHangService.deleteAllChiMucGiohang(c);
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * Xử lý callback từ VNPay sau khi thanh toán
	 * Endpoint này được gọi trực tiếp từ VNPay redirect
	 * Trả về HTML với thông báo kết quả thanh toán
	 */
	@GetMapping(value = "/vnpay/return", produces = MediaType.TEXT_HTML_VALUE)
	public String vnpayReturn(HttpServletRequest request, HttpServletResponse response) {
		String html = "";
		boolean isSuccess = false;
		String message = "";
		String orderId = "";
		
		try {
			System.out.println("=== VNPay Return Callback ===");
			
			// Lấy tất cả các tham số từ VNPay và encode để hash (giống code mẫu)
			Map<String, String> fields = new HashMap<>();
			Enumeration<String> params = request.getParameterNames();
			
			while (params.hasMoreElements()) {
				String fieldName = params.nextElement();
				String fieldValue = request.getParameter(fieldName);
				if ((fieldValue != null) && (fieldValue.length() > 0)) {
					// Encode để hash (giống cách VNPay gửi về)
					String encodedFieldName = URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString());
					String encodedFieldValue = URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString());
					fields.put(encodedFieldName, encodedFieldValue);
					System.out.println("Field: " + fieldName + " = " + fieldValue);
				}
			}
			
			String vnp_SecureHash = request.getParameter("vnp_SecureHash");
			if (fields.containsKey("vnp_SecureHashType")) {
				fields.remove("vnp_SecureHashType");
			}
			if (fields.containsKey("vnp_SecureHash")) {
				fields.remove("vnp_SecureHash");
			}
			
			// Kiểm tra chữ ký
			String signValue = VNPayUtil.hashAllFields(fields, VNPayConfig.secretKey);
			
			System.out.println("Calculated Hash: " + signValue);
			System.out.println("Received Hash: " + vnp_SecureHash);
			
			boolean isValidSignature = signValue.equals(vnp_SecureHash);
			String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
			String vnp_TransactionStatus = request.getParameter("vnp_TransactionStatus");
			String vnp_TxnRef = request.getParameter("vnp_TxnRef");
			orderId = vnp_TxnRef;
			
			System.out.println("ResponseCode: " + vnp_ResponseCode);
			System.out.println("TransactionStatus: " + vnp_TransactionStatus);
			System.out.println("TxnRef: " + vnp_TxnRef);
			System.out.println("IsValidSignature: " + isValidSignature);
			
			// Kiểm tra kết quả thanh toán
			if (isValidSignature) {
				if ("00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus)) {
					// Thanh toán thành công
					isSuccess = true;
					message = "Thanh toán thành công!";
					System.out.println("Payment successful for order: " + vnp_TxnRef);
					
					// Parse orderId từ vnp_TxnRef
					try {
						long orderIdLong = Long.parseLong(vnp_TxnRef);
						
						// Cập nhật trạng thái đơn hàng và đánh dấu đã thanh toán
						DonHang donHang = donHangService.findById(orderIdLong);
						if (donHang != null) {
							donHang.setTrangThaiDonHang("Đang chờ giao");
							donHang.setDaThanhToan(true); // Đánh dấu đã thanh toán
							donHangService.save(donHang);
							System.out.println("Order status updated to: Đang chờ giao, Payment status: Đã thanh toán");
							
							// Xóa cart sau khi thanh toán thành công
							cleanUpAfterCheckOut(request, response);
						} else {
							System.err.println("Order not found: " + orderIdLong);
							message = "Thanh toán thành công nhưng không tìm thấy đơn hàng!";
						}
					} catch (NumberFormatException e) {
						System.err.println("Cannot parse orderId from: " + vnp_TxnRef);
						message = "Thanh toán thành công nhưng có lỗi xử lý đơn hàng!";
					}
				} else {
					// Thanh toán thất bại
					isSuccess = false;
					message = "Thanh toán không thành công. Mã lỗi: " + vnp_ResponseCode;
					System.out.println("Payment failed. ResponseCode: " + vnp_ResponseCode);
				}
			} else {
				// Chữ ký không hợp lệ
				isSuccess = false;
				message = "Chữ ký không hợp lệ. Giao dịch có thể không an toàn.";
				System.err.println("Invalid signature!");
			}
			
		} catch (Exception e) {
			System.err.println("Error in VNPay Return: " + e.getMessage());
			e.printStackTrace();
			isSuccess = false;
			message = "Có lỗi xảy ra khi xử lý thanh toán: " + e.getMessage();
		}
		
		// Tạo HTML response
		if (isSuccess) {
			html = "<!DOCTYPE html>" +
				"<html lang='vi'>" +
				"<head>" +
				"<meta charset='UTF-8'>" +
				"<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
				"<title>Thanh toán thành công</title>" +
				"<style>" +
				"body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }" +
				".container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }" +
				".success-icon { width: 80px; height: 80px; margin: 0 auto 20px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; }" +
				".success-icon svg { width: 50px; height: 50px; color: white; }" +
				"h1 { color: #10b981; margin: 20px 0; }" +
				"p { color: #666; margin: 10px 0; }" +
				".order-id { background: #f3f4f6; padding: 10px; border-radius: 5px; margin: 20px 0; font-weight: bold; }" +
				"button { background: #667eea; color: white; border: none; padding: 15px 30px; font-size: 16px; border-radius: 5px; cursor: pointer; margin-top: 20px; }" +
				"button:hover { background: #5568d3; }" +
				"</style>" +
				"</head>" +
				"<body>" +
				"<div class='container'>" +
				"<div class='success-icon'>" +
				"<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'></path></svg>" +
				"</div>" +
				"<h1>Thanh toán thành công!</h1>" +
				"<p>" + message + "</p>" +
				"<div class='order-id'>Mã đơn hàng: #" + orderId + "</div>" +
				"<p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!</p>" +
				"<button onclick=\"window.location.href='http://localhost:3002/iphoneshop/'\">Quay về trang chủ</button>" +
				"</div>" +
				"</body>" +
				"</html>";
		} else {
			html = "<!DOCTYPE html>" +
				"<html lang='vi'>" +
				"<head>" +
				"<meta charset='UTF-8'>" +
				"<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
				"<title>Thanh toán thất bại</title>" +
				"<style>" +
				"body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }" +
				".container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }" +
				".error-icon { width: 80px; height: 80px; margin: 0 auto 20px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; }" +
				".error-icon svg { width: 50px; height: 50px; color: white; }" +
				"h1 { color: #ef4444; margin: 20px 0; }" +
				"p { color: #666; margin: 10px 0; }" +
				"button { background: #667eea; color: white; border: none; padding: 15px 30px; font-size: 16px; border-radius: 5px; cursor: pointer; margin: 10px; }" +
				"button:hover { background: #5568d3; }" +
				".button-secondary { background: #6b7280; }" +
				".button-secondary:hover { background: #4b5563; }" +
				"</style>" +
				"</head>" +
				"<body>" +
				"<div class='container'>" +
				"<div class='error-icon'>" +
				"<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12'></path></svg>" +
				"</div>" +
				"<h1>Thanh toán thất bại</h1>" +
				"<p>" + message + "</p>" +
				"<div>" +
				"<button onclick=\"window.location.href='http://localhost:3002/iphoneshop/checkout'\">Thử lại</button>" +
				"<button class='button-secondary' onclick=\"window.location.href='http://localhost:3002/iphoneshop/'\">Về trang chủ</button>" +
				"</div>" +
				"</div>" +
				"</body>" +
				"</html>";
		}
		
		return html;
	}
}

