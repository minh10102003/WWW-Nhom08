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
	public NguoiDung getCurrentUser(HttpServletRequest request) {
		System.out.println("=== ProfileApi.getCurrentUser called ===");
		
		// Lấy user từ SecurityContext (đã được set sau khi login)
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		System.out.println("Authentication: " + (auth != null ? auth.getName() : "null"));
		System.out.println("Is authenticated: " + (auth != null && auth.isAuthenticated()));
		
		if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
			NguoiDung user = nguoiDungService.findByEmail(auth.getName());
			System.out.println("Found user from SecurityContext: " + (user != null ? user.getEmail() : "null"));
			
			// Lưu vào session để sử dụng sau này
			if (user != null) {
				request.getSession().setAttribute("loggedInUser", user);
			}
			return user;
		}
		
		// Fallback: Lấy từ session chỉ khi session còn valid (chưa bị invalidate)
		// Điều này giúp xử lý trường hợp sau login, SecurityContext chưa được persist vào session
		// Nhưng vẫn đảm bảo sau logout (session invalidate) sẽ không trả về user
		try {
			jakarta.servlet.http.HttpSession session = request.getSession(false);
			if (session != null) {
				// Session còn valid - có thể là session mới sau login
				NguoiDung sessionUser = (NguoiDung) session.getAttribute("loggedInUser");
				if (sessionUser != null) {
					System.out.println("Found user from session: " + sessionUser.getEmail());
					return sessionUser;
				}
			}
		} catch (IllegalStateException e) {
			// Session đã bị invalidate - đây là trường hợp sau logout
			System.out.println("Session invalidated (likely after logout)");
		}
		
		System.out.println("No authenticated user - returning null");
		return null;
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
