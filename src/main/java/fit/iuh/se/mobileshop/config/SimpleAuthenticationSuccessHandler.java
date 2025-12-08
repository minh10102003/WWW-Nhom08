package fit.iuh.se.mobileshop.config;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public class SimpleAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		// Luôn redirect về "/" để React frontend xử lý
		// React sẽ checkAuth() sau khi login và redirect dựa trên user role
		// Điều này tránh lỗi 404 khi redirect đến /admin (JSP view không tồn tại trong React)
		try {
			redirectStrategy.sendRedirect(request, response, "/");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
