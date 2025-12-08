package fit.iuh.se.mobileshop.config;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Component
public class SimpleAuthenticationFailureHandler implements AuthenticationFailureHandler {

	private ObjectMapper objectMapper = new ObjectMapper();

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		
		System.out.println("=== SimpleAuthenticationFailureHandler.onAuthenticationFailure called ===");
		System.out.println("Request URI: " + request.getRequestURI());
		System.out.println("Exception: " + exception.getMessage());
		
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.setContentType("application/json;charset=UTF-8");
		
		Map<String, String> errorResponse = new HashMap<>();
		
		// Xác định loại lỗi dựa trên exception message
		String errorMessage = exception.getMessage();
		String userMessage;
		
		if (errorMessage != null) {
			if (errorMessage.contains("Bad credentials") || errorMessage.contains("password")) {
				userMessage = "Mật khẩu không đúng";
			} else if (errorMessage.contains("User not found") || errorMessage.contains("username")) {
				userMessage = "Email không tồn tại";
			} else {
				userMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu";
			}
		} else {
			userMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu";
		}
		
		errorResponse.put("message", userMessage);
		errorResponse.put("error", exception.getMessage());
		
		response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
	}
}

