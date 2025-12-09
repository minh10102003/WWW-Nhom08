package fit.iuh.se.mobileshop.api;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Calendar;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import fit.iuh.se.mobileshop.config.VNPayConfig;
import fit.iuh.se.mobileshop.ulti.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;

/**
 * API xử lý thanh toán VNPay
 */
@RestController
@RequestMapping("/api/vnpay")
public class VNPayApi {
	
	@Autowired
	private VNPayConfig vnPayConfig;
	
	/**
	 * Tạo payment URL cho VNPay
	 */
	@PostMapping("/create-payment")
	public Map<String, Object> createPayment(
			@RequestParam("amount") long amount,
			@RequestParam(value = "bankCode", required = false) String bankCode,
			@RequestParam(value = "language", defaultValue = "vn") String language,
			@RequestParam("orderId") long orderId,
			HttpServletRequest request) {
		
		Map<String, Object> result = new HashMap<>();
		
		try {
			String vnp_Version = "2.1.0";
			String vnp_Command = "pay";
			String orderType = "other";
			
			// Chuyển đổi số tiền (VNPay yêu cầu số tiền * 100)
			long amountInVnd = amount * 100;
			
			// Tạo ngày giờ
			Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
			SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
			String vnp_CreateDate = formatter.format(cld.getTime());
			
			// Tạo mã giao dịch tham chiếu duy nhất: orderId_timestamp
			// Format: {orderId}_{yyyyMMddHHmmss} - ví dụ: 94_20251209162846
			// Điều này đảm bảo mỗi lần tạo link thanh toán đều có vnp_TxnRef khác nhau
			String vnp_TxnRef = orderId + "_" + vnp_CreateDate;
			String vnp_IpAddr = VNPayUtil.getIpAddress(request);
			
			Map<String, String> vnp_Params = new HashMap<>();
			vnp_Params.put("vnp_Version", vnp_Version);
			vnp_Params.put("vnp_Command", vnp_Command);
			vnp_Params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
			vnp_Params.put("vnp_Amount", String.valueOf(amountInVnd));
			vnp_Params.put("vnp_CurrCode", "VND");
			
			if (bankCode != null && !bankCode.isEmpty()) {
				vnp_Params.put("vnp_BankCode", bankCode);
			}
			
			vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
			vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + orderId);
			vnp_Params.put("vnp_OrderType", orderType);
			vnp_Params.put("vnp_Locale", language);
			vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
			vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
			vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
			
			// Thời gian hết hạn (15 phút)
			cld.add(Calendar.MINUTE, 15);
			String vnp_ExpireDate = formatter.format(cld.getTime());
			vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
			
			// Sắp xếp các tham số
			List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
			Collections.sort(fieldNames);
			
			StringBuilder hashData = new StringBuilder();
			StringBuilder query = new StringBuilder();
			
			Iterator<String> itr = fieldNames.iterator();
			while (itr.hasNext()) {
				String fieldName = itr.next();
				String fieldValue = vnp_Params.get(fieldName);
				if ((fieldValue != null) && (fieldValue.length() > 0)) {
					// Build hash data
					hashData.append(fieldName);
					hashData.append('=');
					hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
					// Build query
					query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
					query.append('=');
					query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
					if (itr.hasNext()) {
						query.append('&');
						hashData.append('&');
					}
				}
			}
			
			String queryUrl = query.toString();
			String vnp_SecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData.toString());
			queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
			String paymentUrl = vnPayConfig.getPayUrl() + "?" + queryUrl;
			
			result.put("code", "00");
			result.put("message", "success");
			result.put("data", paymentUrl);
			
		} catch (Exception e) {
			result.put("code", "99");
			result.put("message", "Failed to create payment URL: " + e.getMessage());
			e.printStackTrace();
		}
		
		return result;
	}
}

