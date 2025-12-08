package fit.iuh.se.mobileshop.api;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.entities.ResponseObject;
import fit.iuh.se.mobileshop.service.NguoiDungService;
import fit.iuh.se.mobileshop.validator.NguoiDungValidator;

@RestController
@RequestMapping("/api")
public class RegisterApi {

	@Autowired
	private NguoiDungService nguoiDungService;

	@Autowired
	private NguoiDungValidator nguoiDungValidator;

	@PostMapping("/register")
	public ResponseObject register(@RequestBody NguoiDung nguoiDung) {
		System.out.println("=== RegisterApi.register called ===");
		System.out.println("Email: " + nguoiDung.getEmail());
		System.out.println("HoTen: " + nguoiDung.getHoTen());
		System.out.println("SoDienThoai: " + nguoiDung.getSoDienThoai());
		System.out.println("DiaChi: " + nguoiDung.getDiaChi());
		System.out.println("Password: " + (nguoiDung.getPassword() != null ? "***" : "NULL"));
		System.out.println("ConfirmPassword: " + (nguoiDung.getConfirmPassword() != null ? "***" : "NULL"));
		
		ResponseObject ro = new ResponseObject();

		try {
			// Tạo một BindingResult giả để validate
			org.springframework.validation.BeanPropertyBindingResult bindingResult = 
				new org.springframework.validation.BeanPropertyBindingResult(nguoiDung, "nguoiDung");

			// Validate
			nguoiDungValidator.validate(nguoiDung, bindingResult);

			if (bindingResult.hasErrors()) {
				System.out.println("Validation errors found");
				Map<String, String> errors = bindingResult.getFieldErrors().stream()
						.collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
				ro.setErrorMessages(errors);
				ro.setStatus("fail");
				return ro;
			}

			// Lưu user
			System.out.println("Saving user...");
			nguoiDungService.saveUserForMember(nguoiDung);
			System.out.println("User saved successfully");
			ro.setStatus("success");
			ro.setData("Đăng ký thành công");
		} catch (Exception e) {
			System.err.println("=== ERROR in RegisterApi.register ===");
			System.err.println("Exception type: " + e.getClass().getName());
			System.err.println("Exception message: " + e.getMessage());
			e.printStackTrace();
			if (e.getCause() != null) {
				System.err.println("Cause: " + e.getCause().getMessage());
				e.getCause().printStackTrace();
			}
			
			ro.setStatus("error");
			Map<String, String> errorMap = new java.util.HashMap<>();
			errorMap.put("message", e.getMessage() != null ? e.getMessage() : "Đăng ký thất bại");
			ro.setErrorMessages(errorMap);
			
			// Re-throw để GlobalExceptionHandler có thể xử lý và trả về HTTP 500
			throw new RuntimeException("Error during registration: " + e.getMessage(), e);
		}

		return ro;
	}
}

