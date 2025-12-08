package fit.iuh.se.mobileshop.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.iuh.se.mobileshop.entities.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LogoutApi {

	@PostMapping("/logout")
	public ResponseEntity<ResponseObject> logout(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("=== LogoutApi.logout called ===");
		
		ResponseObject ro = new ResponseObject();
		
		try {
			// Get authentication from SecurityContext
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			
			if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
				System.out.println("Logging out user: " + auth.getName());
			} else {
				System.out.println("No authenticated user to logout (or already logged out)");
			}
			
			// Always invalidate session and clear context, regardless of auth state
			// Invalidate session first
			jakarta.servlet.http.HttpSession session = request.getSession(false);
			if (session != null) {
				session.invalidate();
				System.out.println("✓ Session invalidated");
			}
			
			// Clear SecurityContext
			SecurityContextHolder.clearContext();
			System.out.println("✓ SecurityContext cleared");
			
			// Delete JSESSIONID cookie explicitly
			jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("JSESSIONID", "");
			cookie.setPath("/");
			cookie.setMaxAge(0);
			cookie.setHttpOnly(true);
			response.addCookie(cookie);
			System.out.println("✓ JSESSIONID cookie deleted");
			
			// Use SecurityContextLogoutHandler to properly logout (if auth exists)
			if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
				SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
				logoutHandler.setInvalidateHttpSession(true);
				logoutHandler.setClearAuthentication(true);
				logoutHandler.logout(request, response, auth);
			}
			
			ro.setStatus("success");
			ro.setData("Đăng xuất thành công");
			System.out.println("✓ Logout successful");
			
		} catch (Exception e) {
			System.err.println("✗ Error during logout: " + e.getMessage());
			e.printStackTrace();
			ro.setStatus("error");
			java.util.Map<String, String> errorMap = new java.util.HashMap<>();
			errorMap.put("message", "Lỗi khi đăng xuất");
			ro.setErrorMessages(errorMap);
		}
		
		return ResponseEntity.ok(ro);
	}
}

