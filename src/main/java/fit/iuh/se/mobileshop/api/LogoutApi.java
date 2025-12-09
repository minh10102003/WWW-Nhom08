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
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class LogoutApi {

	@PostMapping("/logout")
	public ResponseEntity<ResponseObject> logout(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("=== LogoutApi.logout called ===");
		
		ResponseObject ro = new ResponseObject();
		
		try {
			// Get authentication from SecurityContext BEFORE clearing it
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			
			// Xóa giỏ hàng TRƯỚC KHI invalidate session
			try {
				clearCartOnLogout(auth, request, response);
			} catch (Exception e) {
				System.err.println("Error clearing cart on logout: " + e.getMessage());
				e.printStackTrace();
				// Continue with logout even if cart clearing fails
			}
			
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
			
			// Delete JSESSIONID cookie explicitly with both paths to ensure complete deletion
			// Xóa với path "/iphoneshop"
			jakarta.servlet.http.Cookie cookie1 = new jakarta.servlet.http.Cookie("JSESSIONID", "");
			cookie1.setPath("/iphoneshop");
			cookie1.setMaxAge(0);
			cookie1.setHttpOnly(true);
			response.addCookie(cookie1);
			
			// Xóa với path "/" để đảm bảo
			jakarta.servlet.http.Cookie cookie2 = new jakarta.servlet.http.Cookie("JSESSIONID", "");
			cookie2.setPath("/");
			cookie2.setMaxAge(0);
			cookie2.setHttpOnly(true);
			// Thêm domain nếu cần (để xóa cookie trên localhost)
			response.addCookie(cookie2);
			
			System.out.println("✓ JSESSIONID cookie deleted (both paths)");
			
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
	
	/**
	 * Xóa cookies giỏ hàng khi logout
	 * - KHÔNG xóa giỏ hàng từ database (để giữ lại khi user login lại)
	 * - CHỈ xóa cookies giỏ hàng (cookies có tên là số - productId) vì cookies là của anonymous user
	 */
	private void clearCartOnLogout(Authentication auth, HttpServletRequest request, HttpServletResponse response) {
		System.out.println("=== Clearing cart cookies on logout ===");
		System.out.println("Note: Cart in database is preserved for when user logs back in");
		
		// CHỈ xóa cookies giỏ hàng (không xóa từ database)
		// Cookies giỏ hàng là của anonymous user, nên cần xóa khi logout
		// Giỏ hàng trong database sẽ được giữ lại để khi user login lại vẫn còn
		try {
			Cookie[] cookies = request.getCookies();
			if (cookies != null) {
				int deletedCount = 0;
				for (Cookie cookie : cookies) {
					if (cookie != null && cookie.getName().matches("[0-9]+")) {
						// Đây là cookie giỏ hàng (productId) - xóa với cả 2 path để đảm bảo
						// Xóa với path "/iphoneshop"
						Cookie deleteCookie1 = new Cookie(cookie.getName(), "");
						deleteCookie1.setMaxAge(0);
						deleteCookie1.setPath("/iphoneshop");
						response.addCookie(deleteCookie1);
						
						// Xóa với path "/" để đảm bảo
						Cookie deleteCookie2 = new Cookie(cookie.getName(), "");
						deleteCookie2.setMaxAge(0);
						deleteCookie2.setPath("/");
						response.addCookie(deleteCookie2);
						
						deletedCount++;
						System.out.println("✓ Deleted cart cookie: " + cookie.getName() + " (both paths)");
					}
				}
				if (deletedCount > 0) {
					System.out.println("✓ Deleted " + deletedCount + " cart cookies");
				} else {
					System.out.println("✓ No cart cookies to delete");
				}
			}
		} catch (Exception e) {
			System.err.println("Error deleting cart cookies: " + e.getMessage());
			e.printStackTrace();
		}
		
		System.out.println("=== Cart cookies clearing completed ===");
	}
}

