package fit.iuh.se.mobileshop.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(HttpMessageNotWritableException.class)
	@ResponseBody
	public ResponseEntity<Map<String, Object>> handleHttpMessageNotWritableException(HttpMessageNotWritableException e) {
		System.err.println("=== GlobalExceptionHandler: JSON Serialization Error ===");
		System.err.println("Exception: " + e.getMessage());
		if (e.getCause() != null) {
			System.err.println("Cause: " + e.getCause().getMessage());
			e.getCause().printStackTrace();
		} else {
			e.printStackTrace();
		}
		
		Map<String, Object> errorResponse = new HashMap<>();
		errorResponse.put("success", false);
		errorResponse.put("status", "error");
		errorResponse.put("message", "Lỗi khi xử lý dữ liệu. Vui lòng thử lại sau.");
		
		// Trả về 200 OK với error message thay vì 500 để frontend có thể xử lý
		return new ResponseEntity<>(errorResponse, HttpStatus.OK);
	}

	@ExceptionHandler(JsonProcessingException.class)
	@ResponseBody
	public ResponseEntity<Map<String, Object>> handleJsonProcessingException(JsonProcessingException e) {
		System.err.println("=== GlobalExceptionHandler: JSON Processing Error ===");
		System.err.println("Exception: " + e.getMessage());
		e.printStackTrace();
		
		Map<String, Object> errorResponse = new HashMap<>();
		errorResponse.put("success", false);
		errorResponse.put("status", "error");
		errorResponse.put("message", "Lỗi khi xử lý dữ liệu JSON. Vui lòng thử lại sau.");
		
		return new ResponseEntity<>(errorResponse, HttpStatus.OK);
	}

	@ExceptionHandler(JsonMappingException.class)
	@ResponseBody
	public ResponseEntity<Map<String, Object>> handleJsonMappingException(JsonMappingException e) {
		System.err.println("=== GlobalExceptionHandler: JSON Mapping Error ===");
		System.err.println("Exception: " + e.getMessage());
		e.printStackTrace();
		
		Map<String, Object> errorResponse = new HashMap<>();
		errorResponse.put("success", false);
		errorResponse.put("status", "error");
		errorResponse.put("message", "Lỗi khi ánh xạ dữ liệu JSON. Vui lòng thử lại sau.");
		
		return new ResponseEntity<>(errorResponse, HttpStatus.OK);
	}

	@ExceptionHandler(Exception.class)
	@ResponseBody
	public ResponseEntity<Map<String, Object>> handleException(Exception e) {
		System.err.println("=== GlobalExceptionHandler: General Exception ===");
		System.err.println("Exception type: " + e.getClass().getName());
		System.err.println("Exception message: " + e.getMessage());
		e.printStackTrace();
		
		if (e.getCause() != null) {
			System.err.println("Cause: " + e.getCause().getMessage());
			e.getCause().printStackTrace();
		}
		
		Map<String, Object> errorResponse = new HashMap<>();
		errorResponse.put("success", false);
		errorResponse.put("status", "error");
		
		// Không trả về chi tiết exception cho client (security)
		String userMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
		
		// Một số exception có thể cung cấp thông tin hữu ích
		if (e.getMessage() != null) {
			if (e.getMessage().contains("LazyInitializationException") || 
				e.getMessage().contains("could not initialize proxy")) {
				userMessage = "Lỗi khi tải dữ liệu. Vui lòng thử lại sau.";
			} else if (e.getMessage().contains("NoSuchElementException") ||
					   e.getMessage().contains("No value present")) {
				userMessage = "Không tìm thấy dữ liệu.";
			}
		}
		
		errorResponse.put("message", userMessage);
		
		// Trả về 200 OK với error message thay vì 500 để frontend có thể xử lý
		return new ResponseEntity<>(errorResponse, HttpStatus.OK);
	}
}

