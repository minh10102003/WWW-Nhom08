package fit.iuh.se.mobileshop.config;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CustomErrorController implements ErrorController {

	@RequestMapping("/error")
	public String handleError(HttpServletRequest request) {
		String requestPath = (String) request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
		
		// Don't forward API requests to React app - let them return proper error responses
		if (requestPath != null && requestPath.startsWith("/api/")) {
			// Return null to let Spring Boot handle API errors normally
			// This allows @RestController to return JSON error responses
			return null;
		}
		
		Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
		
		if (status != null) {
			Integer statusCode = Integer.valueOf(status.toString());
			
			// For 404 errors, forward to React app (index.html)
			// React Router will handle the routing
			if (statusCode == HttpStatus.NOT_FOUND.value()) {
				return "forward:/index.html";
			}
			
			// For 500 errors on non-API paths, forward to React app
			// But API errors should return JSON, not HTML
			if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
				// Only forward if it's NOT an API request
				if (requestPath == null || !requestPath.startsWith("/api/")) {
					return "forward:/index.html";
				}
				// For API requests, return null to let Spring handle it
				return null;
			}
			
			// For 403 Forbidden, forward to React app
			if (statusCode == HttpStatus.FORBIDDEN.value()) {
				return "forward:/index.html";
			}
		}
		
		// Default: forward to React app for all errors (non-API)
		// This ensures no Whitelabel Error Page is shown
		return "forward:/index.html";
	}

	// Deprecated in Spring Boot 2.3+ but still required for compatibility
	@Deprecated
	public String getErrorPath() {
		return "/error";
	}
}

