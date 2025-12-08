package fit.iuh.se.mobileshop.api.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.iuh.se.mobileshop.dto.PasswordDTO;
import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.entities.ResponseObject;
import fit.iuh.se.mobileshop.service.NguoiDungService;


@RestController
@RequestMapping("/api/profile")
public class ProfileApi {

	@Autowired
	private NguoiDungService nguoiDungService;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@GetMapping("/current")
	public org.springframework.http.ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
		try {
			System.out.println("=== ProfileApi.getCurrentUser called ===");
			
			// Debug: Log all cookies
			jakarta.servlet.http.Cookie[] cookies = request.getCookies();
			if (cookies != null) {
				System.out.println("=== Cookies in request ===");
				for (jakarta.servlet.http.Cookie cookie : cookies) {
					System.out.println("Cookie: " + cookie.getName() + " = " + cookie.getValue());
				}
			} else {
				System.out.println("✗ No cookies in request");
			}
			
			// ƯU TIÊN: Lấy từ session trước (vì có thể đã được lưu trong success handler)
			try {
				jakarta.servlet.http.HttpSession session = request.getSession(false);
				if (session != null) {
					System.out.println("✓ Session exists, ID: " + session.getId());
					System.out.println("✓ Session isNew: " + session.isNew());
					
					// Check SecurityContext in session
					Object securityContext = session.getAttribute("SPRING_SECURITY_CONTEXT");
					if (securityContext != null) {
						System.out.println("✓ SecurityContext found in session");
					} else {
						System.out.println("✗ SecurityContext NOT found in session");
					}
					
					NguoiDung sessionUser = (NguoiDung) session.getAttribute("loggedInUser");
					if (sessionUser != null) {
						System.out.println("✓ Found user from session: " + sessionUser.getEmail());
						// Trả về user trực tiếp (không wrap trong Map) để frontend có thể dùng response.data
						return org.springframework.http.ResponseEntity.ok(sessionUser);
					} else {
						System.out.println("✗ No user found in session (session exists but no loggedInUser attribute)");
						// List all session attributes for debugging
						java.util.Enumeration<String> attributeNames = session.getAttributeNames();
						System.out.println("Session attributes:");
						while (attributeNames.hasMoreElements()) {
							String attrName = attributeNames.nextElement();
							System.out.println("  - " + attrName);
						}
					}
				} else {
					System.out.println("✗ No session found (session is null) - creating new session");
					// Try to create new session
					session = request.getSession(true);
					System.out.println("✓ Created new session, ID: " + session.getId());
				}
			} catch (IllegalStateException e) {
				// Session đã bị invalidate - đây là trường hợp sau logout
				System.out.println("Session invalidated (likely after logout)");
			} catch (Exception e) {
				System.err.println("Error getting session: " + e.getMessage());
				e.printStackTrace();
			}
			
			// Fallback: Lấy user từ SecurityContext (đã được set sau khi login)
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			System.out.println("Authentication: " + (auth != null ? auth.getName() : "null"));
			System.out.println("Is authenticated: " + (auth != null && auth.isAuthenticated()));
			
			if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
				try {
					NguoiDung user = nguoiDungService.findByEmail(auth.getName());
					System.out.println("Found user from SecurityContext: " + (user != null ? user.getEmail() : "null"));
					
					// Lưu vào session để sử dụng sau này
					if (user != null) {
						try {
							jakarta.servlet.http.HttpSession session = request.getSession(true);
							session.setAttribute("loggedInUser", user);
							System.out.println("✓ User saved to session from SecurityContext: " + user.getEmail());
							System.out.println("✓ Session ID: " + session.getId());
						} catch (Exception e) {
							System.err.println("Error setting session attribute: " + e.getMessage());
							e.printStackTrace();
						}
					}
					return org.springframework.http.ResponseEntity.ok(user);
				} catch (Exception e) {
					System.err.println("Error getting user from email: " + e.getMessage());
					e.printStackTrace();
				}
			}
			
			System.out.println("No authenticated user - returning null");
			// Trả về null trong Map để tránh empty string serialization issue
			Map<String, Object> response = new HashMap<>();
			response.put("user", null);
			return org.springframework.http.ResponseEntity.ok(response);
		} catch (Exception e) {
			System.err.println("=== ERROR in getCurrentUser API ===");
			System.err.println("Exception type: " + e.getClass().getName());
			System.err.println("Exception message: " + e.getMessage());
			e.printStackTrace();
			if (e.getCause() != null) {
				System.err.println("Cause: " + e.getCause().getMessage());
				e.getCause().printStackTrace();
			}
			
			// Return null in Map to avoid empty string serialization
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("user", null);
			return org.springframework.http.ResponseEntity.ok(errorResponse);
		}
	}

	@GetMapping("/{id}")
	public NguoiDung getNguoiDungById(@PathVariable long id) {
		NguoiDung nd = nguoiDungService.findById(id);
		return nd;
	}

	@PostMapping("/doiMatKhau")
	public ResponseObject changePass(@RequestBody @Valid PasswordDTO dto, BindingResult result,
			HttpServletRequest request) {
		System.out.println(dto.toString());
		NguoiDung currentUser = getSessionUser(request);

		ResponseObject ro = new ResponseObject();
		
		if (!passwordEncoder.matches( dto.getOldPassword(), currentUser.getPassword())) {
			result.rejectValue("oldPassword", "error.oldPassword", "Mật khẩu cũ không đúng");
		}

		if (!dto.getNewPassword().equals(dto.getConfirmNewPassword())) {
			result.rejectValue("confirmNewPassword", "error.confirmNewPassword", "Nhắc lại mật khẩu mới không đúng");
		}

		if (result.hasErrors()) {
			Map<String, String> errors = new HashMap<>();
		    List<FieldError> errorsList = result.getFieldErrors();
		    for (FieldError error : errorsList ) {
		        errors.put(error.getField(), error.getDefaultMessage());
		    }
			ro.setErrorMessages(errors);
			ro.setStatus("fail");
			errors = null;
		} else {
			nguoiDungService.changePass(currentUser, dto.getNewPassword());
			ro.setStatus("success");
		}
		
		return ro;
	}

	public NguoiDung getSessionUser(HttpServletRequest request) {
		return (NguoiDung) request.getSession().getAttribute("loggedInUser");
	}
}
