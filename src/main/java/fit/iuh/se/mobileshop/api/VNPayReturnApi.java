package fit.iuh.se.mobileshop.api;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import fit.iuh.se.mobileshop.config.VNPayConfig;
import fit.iuh.se.mobileshop.entities.ChiMucGioHang;
import fit.iuh.se.mobileshop.entities.ChiTietDonHang;
import fit.iuh.se.mobileshop.entities.DonHang;
import fit.iuh.se.mobileshop.entities.GioHang;
import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.entities.SanPham;
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
@CrossOrigin(origins = "*", allowedHeaders = "*")
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
	
	/**
	 * Xóa các sản phẩm trong đơn hàng khỏi cart (không xóa toàn bộ cart)
	 * Giống logic khi đặt hàng COD từ cart
	 */
	private void cleanUpCartItemsFromOrder(DonHang donHang, HttpServletRequest request, HttpServletResponse response) {
		try {
			if (donHang == null || donHang.getDanhSachChiTiet() == null || donHang.getDanhSachChiTiet().isEmpty()) {
				System.out.println("Order has no items, skipping cart cleanup");
				return;
			}
			
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			boolean isAnonymous = (auth == null || 
				auth.getPrincipal() == null || 
				"anonymousUser".equals(auth.getPrincipal().toString()) ||
				!auth.isAuthenticated());
			
			if(isAnonymous) {
				// Xóa cookies cho các sản phẩm trong đơn hàng
				Cookie clientCookies[] = request.getCookies();
				if(clientCookies != null) {
					for(ChiTietDonHang chiTiet : donHang.getDanhSachChiTiet()) {
						if(chiTiet != null && chiTiet.getSanPham() != null) {
							String productId = String.valueOf(chiTiet.getSanPham().getId());
							for(int i = 0; i < clientCookies.length; i++) {
								if(clientCookies[i] != null && clientCookies[i].getName().equals(productId)) {
									clientCookies[i].setMaxAge(0);
									clientCookies[i].setPath("/iphoneshop");
									response.addCookie(clientCookies[i]);
									System.out.println("Removed product " + productId + " from cart (cookie)");
									break;
								}
							}
						}
					}
				}
			} else {
				// Xóa từ database - chỉ xóa các sản phẩm trong đơn hàng
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
						// Xóa từng sản phẩm trong đơn hàng khỏi cart
						for(ChiTietDonHang chiTiet : donHang.getDanhSachChiTiet()) {
							if(chiTiet != null && chiTiet.getSanPham() != null) {
								SanPham sp = chiTiet.getSanPham();
								ChiMucGioHang c = chiMucGioHangService.getChiMucGioHangBySanPhamAndGioHang(sp, g);
								if(c != null) {
									chiMucGioHangService.deleteChiMucGiohang(c);
									System.out.println("Removed product " + sp.getId() + " from cart (database)");
								}
							}
						}
					}
				}
			}
		} catch (Exception e) {
			System.err.println("Error cleaning up cart items from order: " + e.getMessage());
			e.printStackTrace();
		}
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
	 * Redirect đến frontend page với các params
	 */
	@GetMapping(value = "/vnpay/return")
	public RedirectView vnpayReturn(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("=== VNPay Return Callback (Backend) ===");
		System.out.println("Request URL: " + request.getRequestURL());
		System.out.println("Query String: " + request.getQueryString());
		System.out.println("Request Method: " + request.getMethod());
		
		// Xử lý callback
		PaymentResult paymentResult = processVNPayCallback(request, response);
		
		System.out.println("Payment Result - Success: " + paymentResult.isSuccess);
		System.out.println("Payment Result - Message: " + paymentResult.message);
		System.out.println("Payment Result - OrderId: " + paymentResult.orderId);
		
		// Build redirect URL đến frontend với kết quả
		// Sử dụng absolute URL để đảm bảo redirect đúng
		StringBuilder redirectUrl = new StringBuilder("http://localhost:3003/iphoneshop/vnpay/return?");
		try {
			redirectUrl.append("status=").append(java.net.URLEncoder.encode(paymentResult.isSuccess ? "success" : "failed", "UTF-8"));
			redirectUrl.append("&message=").append(java.net.URLEncoder.encode(paymentResult.message, "UTF-8"));
			if (paymentResult.orderId != null && !paymentResult.orderId.isEmpty()) {
				redirectUrl.append("&orderId=").append(java.net.URLEncoder.encode(paymentResult.orderId, "UTF-8"));
			}
		} catch (Exception e) {
			System.err.println("Error building redirect URL: " + e.getMessage());
			e.printStackTrace();
		}
		
		System.out.println("Redirecting to: " + redirectUrl.toString());
		RedirectView redirectView = new RedirectView(redirectUrl.toString());
		redirectView.setHttp10Compatible(false); // Sử dụng HTTP 1.1
		return redirectView;
	}
	
	/**
	 * API endpoint trả về JSON cho frontend
	 * Frontend sẽ gọi endpoint này để lấy kết quả thanh toán
	 */
	@GetMapping(value = "/api/vnpay/return", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, Object>> vnpayReturnApi(
			@RequestParam Map<String, String> allParams,
			HttpServletRequest request,
			HttpServletResponse response) {
		
		Map<String, Object> result = new HashMap<>();
		
		try {
			System.out.println("=== VNPay Return API Callback ===");
			System.out.println("Request URL: " + request.getRequestURL());
			System.out.println("Query String: " + request.getQueryString());
			System.out.println("All Params: " + allParams);
			
			// Xử lý callback
			PaymentResult paymentResult = processVNPayCallback(request, response);
			
			System.out.println("Payment Result - Success: " + paymentResult.isSuccess);
			System.out.println("Payment Result - Message: " + paymentResult.message);
			System.out.println("Payment Result - OrderId: " + paymentResult.orderId);
			
			result.put("status", paymentResult.isSuccess ? "success" : "failed");
			result.put("message", paymentResult.message);
			result.put("orderId", paymentResult.orderId);
			
			System.out.println("Returning result: " + result);
			return ResponseEntity.ok(result);
			
		} catch (Exception e) {
			System.err.println("Error in VNPay Return API: " + e.getMessage());
			e.printStackTrace();
			result.put("status", "error");
			result.put("message", "Có lỗi xảy ra khi xử lý thanh toán: " + e.getMessage());
			return ResponseEntity.ok(result);
		}
	}
	
	/**
	 * Class để lưu kết quả xử lý thanh toán
	 */
	private static class PaymentResult {
		boolean isSuccess;
		String message;
		String orderId;
		
		PaymentResult(boolean isSuccess, String message, String orderId) {
			this.isSuccess = isSuccess;
			this.message = message;
			this.orderId = orderId;
		}
	}
	
	/**
	 * Xử lý logic callback từ VNPay
	 */
	private PaymentResult processVNPayCallback(HttpServletRequest request, HttpServletResponse response) {
		boolean isSuccess = false;
		String message = "";
		String orderId = "";
		
		try {
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
					
					// Parse orderId từ vnp_TxnRef (có thể có leading zeros, cần trim)
					try {
						// vnp_TxnRef có thể là "00000098", cần parse và loại bỏ leading zeros
						String orderIdStr = vnp_TxnRef.trim();
						// Loại bỏ leading zeros
						while (orderIdStr.startsWith("0") && orderIdStr.length() > 1) {
							orderIdStr = orderIdStr.substring(1);
						}
						long orderIdLong = Long.parseLong(orderIdStr);
						
						System.out.println("Parsed Order ID: " + orderIdLong + " (from: " + vnp_TxnRef + ")");
						
						// Cập nhật trạng thái đơn hàng và đánh dấu đã thanh toán
						DonHang donHang = donHangService.findById(orderIdLong);
						if (donHang != null) {
							System.out.println("Found order: " + orderIdLong);
							System.out.println("Current status: " + donHang.getTrangThaiDonHang());
							System.out.println("Current payment status: " + donHang.isDaThanhToan());
							
							// Kiểm tra ChiTietDonHang trước khi cập nhật
							if (donHang.getDanhSachChiTiet() != null) {
								System.out.println("Order #" + orderIdLong + " has " + donHang.getDanhSachChiTiet().size() + " ChiTietDonHang before update");
							} else {
								System.err.println("WARNING: Order #" + orderIdLong + " has NULL danhSachChiTiet before update!");
							}
							
							donHang.setTrangThaiDonHang("Đang chờ giao");
							donHang.setDaThanhToan(true); // Đánh dấu đã thanh toán
							
							System.out.println("Updating order status to: Đang chờ giao, Payment status: true");
							donHangService.save(donHang);
							System.out.println("Order saved successfully");
							
							// Reload để kiểm tra ChiTietDonHang sau khi cập nhật
							donHang = donHangService.findById(orderIdLong);
							if (donHang != null) {
								System.out.println("Reloaded order - Status: " + donHang.getTrangThaiDonHang());
								System.out.println("Reloaded order - Payment: " + donHang.isDaThanhToan());
								if (donHang.getDanhSachChiTiet() != null) {
									System.out.println("Order #" + orderIdLong + " has " + donHang.getDanhSachChiTiet().size() + " ChiTietDonHang after update");
								} else {
									System.err.println("ERROR: Order #" + orderIdLong + " has NULL danhSachChiTiet after update!");
								}
							}
							
							System.out.println("Order status updated successfully!");
							
							// Chỉ xóa các sản phẩm trong đơn hàng khỏi cart (không xóa toàn bộ cart)
							// Giống logic khi đặt hàng COD từ cart
							try {
								cleanUpCartItemsFromOrder(donHang, request, response);
							} catch (Exception e) {
								System.err.println("Error cleaning up cart: " + e.getMessage());
								e.printStackTrace();
								// Không fail toàn bộ nếu chỉ lỗi cleanup cart
							}
						} else {
							System.err.println("Order not found: " + orderIdLong);
							message = "Thanh toán thành công nhưng không tìm thấy đơn hàng #" + orderIdLong;
							isSuccess = false; // Đánh dấu là lỗi vì không tìm thấy đơn hàng
						}
					} catch (NumberFormatException e) {
						System.err.println("Cannot parse orderId from: " + vnp_TxnRef);
						e.printStackTrace();
						message = "Thanh toán thành công nhưng có lỗi xử lý đơn hàng: " + e.getMessage();
						isSuccess = false;
					} catch (Exception e) {
						System.err.println("Error updating order: " + e.getMessage());
						e.printStackTrace();
						message = "Thanh toán thành công nhưng có lỗi cập nhật đơn hàng: " + e.getMessage();
						isSuccess = false;
					}
				} else {
					// Thanh toán thất bại
					isSuccess = false;
					message = "Thanh toán không thành công. Mã lỗi: " + vnp_ResponseCode + ", Trạng thái: " + vnp_TransactionStatus;
					System.out.println("Payment failed. ResponseCode: " + vnp_ResponseCode + ", TransactionStatus: " + vnp_TransactionStatus);
				}
			} else {
				// Chữ ký không hợp lệ
				isSuccess = false;
				message = "Chữ ký không hợp lệ. Giao dịch có thể không an toàn.";
				System.err.println("Invalid signature! Calculated: " + signValue + ", Received: " + vnp_SecureHash);
			}
			
		} catch (Exception e) {
			System.err.println("Error in processVNPayCallback: " + e.getMessage());
			e.printStackTrace();
			isSuccess = false;
			message = "Có lỗi xảy ra khi xử lý thanh toán: " + e.getMessage();
		}
		
		System.out.println("Final Payment Result - Success: " + isSuccess + ", Message: " + message + ", OrderId: " + orderId);
		return new PaymentResult(isSuccess, message, orderId);
	}
}

