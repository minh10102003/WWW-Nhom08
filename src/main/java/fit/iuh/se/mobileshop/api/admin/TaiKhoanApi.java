package fit.iuh.se.mobileshop.api.admin;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fit.iuh.se.mobileshop.dto.TaiKhoanDTO;
import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.entities.ResponseObject;
import fit.iuh.se.mobileshop.entities.VaiTro;
import fit.iuh.se.mobileshop.service.NguoiDungService;
import fit.iuh.se.mobileshop.service.VaiTroService;

@RestController
@RequestMapping("/api/tai-khoan")
public class TaiKhoanApi {

	@Autowired
	private NguoiDungService nguoiDungService;

	@Autowired
	private VaiTroService vaiTroService;

	@GetMapping("/all")
	public Page<NguoiDung> getNguoiDungByVaiTro(@RequestParam("tenVaiTro") String tenVaiTro,
			@RequestParam(defaultValue = "1") int page) {
		try {
			System.out.println("=== API getNguoiDungByVaiTro called ===");
			System.out.println("tenVaiTro: " + tenVaiTro);
			System.out.println("page: " + page);
			
			Set<VaiTro> vaiTro = new HashSet<>();
			VaiTro role = vaiTroService.findByTenVaiTro(tenVaiTro);
			
			if (role != null) {
				System.out.println("Found role: " + role.getTenVaiTro() + " (id: " + role.getId() + ")");
				vaiTro.add(role);
				Page<NguoiDung> result = nguoiDungService.getNguoiDungByVaiTro(vaiTro, page);
				System.out.println("Query successful. Total elements: " + result.getTotalElements());
				return result;
			} else {
				System.out.println("WARNING: Role not found: " + tenVaiTro);
				// Trả về Page rỗng nếu không tìm thấy vai trò
				return new PageImpl<>(new java.util.ArrayList<>(), PageRequest.of(Math.max(0, page - 1), 6), 0);
			}
		} catch (Exception e) {
			System.err.println("ERROR in getNguoiDungByVaiTro:");
			System.err.println("Exception type: " + e.getClass().getName());
			System.err.println("Exception message: " + e.getMessage());
			e.printStackTrace();
			if (e.getCause() != null) {
				System.err.println("Cause type: " + e.getCause().getClass().getName());
				System.err.println("Cause message: " + e.getCause().getMessage());
				e.getCause().printStackTrace();
			}
			// Re-throw để GlobalExceptionHandler xử lý và trả về JSON
			throw new RuntimeException("Error loading users: " + e.getMessage(), e);
		}
	}

	@PostMapping("/save")
	public ResponseObject saveTaiKhoan(@RequestBody @Valid TaiKhoanDTO dto, BindingResult result) {
		
		ResponseObject ro = new ResponseObject();

		if(nguoiDungService.findByEmail(dto.getEmail()) != null) {
			result.rejectValue("email", "error.email","Email đã được đăng ký");
		}
		if(dto.getConfirmPassword() != null && !dto.getConfirmPassword().equals(dto.getPassword())) {
			result.rejectValue("confirmPassword", "error.confirmPassword","Nhắc lại mật khẩu không đúng");
		}

		if (result.hasErrors()) {
			setErrorsForResponseObject(result, ro);
		} else {
			ro.setStatus("success");
			nguoiDungService.saveUserForAdmin(dto);
		}	
		return ro;
	}

	@DeleteMapping("/delete/{id}")
	public ResponseObject deleteTaiKhoan(@PathVariable long id) {
		ResponseObject ro = new ResponseObject();
		try {
			System.out.println("=== API deleteTaiKhoan called with id: " + id + " ===");
			nguoiDungService.deleteById(id);
			ro.setStatus("success");
			return ro;
		} catch (Exception e) {
			System.err.println("ERROR in deleteTaiKhoan:");
			System.err.println("Exception type: " + e.getClass().getName());
			System.err.println("Exception message: " + e.getMessage());
			e.printStackTrace();
			if (e.getCause() != null) {
				System.err.println("Cause: " + e.getCause().getMessage());
				e.getCause().printStackTrace();
			}
			ro.setStatus("error");
			java.util.Map<String, String> errorMap = new java.util.HashMap<>();
			errorMap.put("message", e.getMessage() != null ? e.getMessage() : "Error deleting user");
			ro.setErrorMessages(errorMap);
			throw new RuntimeException("Error deleting user: " + e.getMessage(), e);
		}
	}
	public void setErrorsForResponseObject(BindingResult result, ResponseObject object) {

		Map<String, String> errors = result.getFieldErrors().stream()
				.collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
		object.setErrorMessages(errors);
		object.setStatus("fail");
		
		List<String> keys = new ArrayList<String>(errors.keySet());			
		for (String key: keys) {
		    System.out.println(key + ": " + errors.get(key));
		}
		
		errors = null;
	}
}
