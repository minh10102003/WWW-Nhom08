package fit.iuh.se.mobileshop.config;

import org.springframework.context.annotation.Configuration;

/**
 * Cấu hình VNPay
 */
@Configuration
public class VNPayConfig {
	
	public static String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
	// QUAN TRỌNG: Return URL phải là backend URL để backend xử lý callback trước
	// Backend sẽ xử lý callback, cập nhật database, sau đó redirect về frontend
	public static String vnp_ReturnUrl = "http://localhost:8080/iphoneshop/vnpay/return";
	public static String vnp_TmnCode = "4YUP19I4";
	public static String secretKey = "MDUIFDCRAKLNBPOFIAFNEKFRNMFBYEPX";
	public static String vnp_ApiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
	
	public String getTmnCode() {
		return vnp_TmnCode;
	}
	
	public String getSecretKey() {
		return secretKey;
	}
	
	public String getPayUrl() {
		return vnp_PayUrl;
	}
	
	public String getReturnUrl() {
		return vnp_ReturnUrl;
	}
	
	public String getApiUrl() {
		return vnp_ApiUrl;
	}
}

