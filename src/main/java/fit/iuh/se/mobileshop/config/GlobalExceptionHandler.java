package fit.iuh.se.mobileshop.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import fit.iuh.se.mobileshop.entities.ResponseObject;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(Exception.class)
	@ResponseBody
	public ResponseEntity<ResponseObject> handleException(Exception e) {
		System.err.println("=== GlobalExceptionHandler caught exception ===");
		e.printStackTrace();
		
		ResponseObject ro = new ResponseObject();
		ro.setStatus("error");
		java.util.Map<String, String> errorMap = new java.util.HashMap<>();
		errorMap.put("message", e.getMessage() != null ? e.getMessage() : "Internal server error");
		if (e.getCause() != null) {
			errorMap.put("cause", e.getCause().getMessage());
		}
		ro.setErrorMessages(errorMap);
		
		return new ResponseEntity<>(ro, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

