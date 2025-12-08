package fit.iuh.se.mobileshop.config;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.service.NguoiDungService;

@Component
public class SimpleAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
	private ObjectMapper objectMapper = new ObjectMapper();
	
	@Autowired
	@Lazy
	private NguoiDungService nguoiDungService;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		System.out.println("=== SimpleAuthenticationSuccessHandler.onAuthenticationSuccess called ===");
		System.out.println("Request URI: " + request.getRequestURI());
		System.out.println("Authentication: " + (authentication != null ? authentication.getName() : "null"));
		
		try {
			// Kiểm tra xem request có phải là AJAX request không
			// AJAX request thường có header "Accept: application/json" hoặc "X-Requested-With: XMLHttpRequest"
			String acceptHeader = request.getHeader("Accept");
			String requestedWith = request.getHeader("X-Requested-With");
			boolean isAjaxRequest = (acceptHeader != null && acceptHeader.contains("application/json")) 
					|| "XMLHttpRequest".equals(requestedWith)
					|| request.getRequestURI().contains("/api/"); // Nếu URL chứa /api/ thì là AJAX

			if (isAjaxRequest) {
				// Trả về JSON response cho AJAX request
				response.setStatus(HttpServletResponse.SC_OK);
				response.setContentType("application/json;charset=UTF-8");
				
				// Lấy thông tin user từ authentication
				String email = authentication.getName();
				NguoiDung user = null;
				try {
					user = nguoiDungService.findByEmail(email);
					
					// QUAN TRỌNG: Lưu user vào session để getProfile có thể lấy được
					// Đảm bảo SecurityContext được persist vào session
					if (user != null) {
						try {
							jakarta.servlet.http.HttpSession session = request.getSession(true);
							
							// Đảm bảo session cookie được set đúng cách
							jakarta.servlet.http.Cookie sessionCookie = new jakarta.servlet.http.Cookie("JSESSIONID", session.getId());
							sessionCookie.setPath("/iphoneshop");
							sessionCookie.setHttpOnly(true);
							sessionCookie.setSecure(false); // Set to true in production with HTTPS
							response.addCookie(sessionCookie);
							System.out.println("✓ Session cookie set in response: " + session.getId());
							session.setAttribute("loggedInUser", user);
							System.out.println("✓ User saved to session in success handler: " + user.getEmail());
							System.out.println("✓ Session ID in success handler: " + session.getId());
							System.out.println("✓ Session isNew: " + session.isNew());
							
							// SecurityContext should be automatically saved by Spring Security
							// But we ensure it's in the session
							org.springframework.security.core.context.SecurityContext securityContext = 
								org.springframework.security.core.context.SecurityContextHolder.getContext();
							if (securityContext != null && securityContext.getAuthentication() != null) {
								System.out.println("✓ SecurityContext has authentication: " + securityContext.getAuthentication().getName());
								// Store in session manually to ensure it's there
								session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
								System.out.println("✓ SecurityContext manually saved to session");
							}
						} catch (Exception e) {
							System.err.println("Error saving user to session: " + e.getMessage());
							e.printStackTrace();
						}
					}
				} catch (Exception e) {
					// Log lỗi nhưng vẫn trả về success response
					System.err.println("Error loading user in success handler: " + e.getMessage());
					e.printStackTrace();
				}
				
				Map<String, Object> successResponse = new HashMap<>();
				successResponse.put("success", true);
				successResponse.put("message", "Đăng nhập thành công");
				if (user != null) {
					successResponse.put("user", user);
				}
				
				response.getWriter().write(objectMapper.writeValueAsString(successResponse));
			} else {
				// Redirect cho form submit thông thường
				redirectStrategy.sendRedirect(request, response, "/");
			}
		} catch (Exception e) {
			// Xử lý mọi exception để tránh lỗi 500
			System.err.println("Error in authentication success handler: " + e.getMessage());
			e.printStackTrace();
			
			// Trả về JSON response an toàn
			try {
				if (!response.isCommitted()) {
					response.setStatus(HttpServletResponse.SC_OK);
					response.setContentType("application/json;charset=UTF-8");
					Map<String, Object> successResponse = new HashMap<>();
					successResponse.put("success", true);
					successResponse.put("message", "Đăng nhập thành công");
					response.getWriter().write(objectMapper.writeValueAsString(successResponse));
				}
			} catch (Exception ex) {
				System.err.println("Error writing error response: " + ex.getMessage());
				ex.printStackTrace();
			}
		}
	}

}
