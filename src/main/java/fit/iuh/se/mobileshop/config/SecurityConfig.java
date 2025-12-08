package fit.iuh.se.mobileshop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer; // Import mới
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration; // Import mới
import org.springframework.web.cors.CorsConfigurationSource; // Import mới
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // Import mới

import java.util.List; // Import mới

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final AuthenticationSuccessHandler successHandler;
	private final AuthenticationFailureHandler failureHandler;
	private final UserDetailsService userDetailsService;

	public SecurityConfig(AuthenticationSuccessHandler successHandler, 
			AuthenticationFailureHandler failureHandler,
			UserDetailsService userDetailsService) {
		this.successHandler = successHandler;
		this.failureHandler = failureHandler;
		this.userDetailsService = userDetailsService;
	}

	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	// --- PHẦN THÊM MỚI QUAN TRỌNG: Cấu hình CORS cho React ---
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		// Dùng allowedOriginPatterns thay vì allowedOrigins để hỗ trợ wildcard và allowCredentials
		configuration.setAllowedOriginPatterns(List.of("*"));
		// Cho phép các method
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
		// Cho phép mọi header (như Authorization, Content-Type...)
		configuration.setAllowedHeaders(List.of("*"));
		// Cho phép gửi Cookie/Credential (quan trọng nếu dùng Session/JWT)
		configuration.setAllowCredentials(true);
		// Cho phép expose headers
		configuration.setExposedHeaders(List.of("*"));

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
	// ---------------------------------------------------------

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				// Sửa dòng này: Sử dụng cấu hình mặc định để nó tự tìm Bean corsConfigurationSource ở trên
				.cors(Customizer.withDefaults())

				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/**").permitAll()
						.requestMatchers(
								"/img/**", "/assets/**", "/static/**", "/css/**", "/js/**",
								"/*.js", "/*.json", "/*.ico", "/*.png", "/*.jpg", "/*.svg",
								"/*.css", "/*.woff", "/*.woff2", "/*.ttf", "/*.eot"
						).permitAll()
						.requestMatchers("/index.html").permitAll()
						.requestMatchers("/register", "/register/**").permitAll()
						// Lưu ý: Đảm bảo các đường dẫn này khớp với controller
						.requestMatchers("/", "/store", "/product/**", "/search", "/contact",
								"/gio-hang/**", "/cart", "/checkout", "/account/**", "/thank-you").permitAll()
						.requestMatchers("/login", "/login/**").permitAll()
						.requestMatchers("/admin/**").hasRole("ADMIN")
						.requestMatchers("/shipper/**").hasRole("SHIPPER")
						.anyRequest().authenticated()
				)
				.formLogin(form -> form
						.loginPage("/login")
						.loginProcessingUrl("/api/login")  // Relative path (context-path sẽ tự động được thêm)
						.usernameParameter("email")
						.passwordParameter("password")
						.successHandler(successHandler)
						.failureHandler(failureHandler)
				)
				.logout(logout -> logout
						.logoutUrl("/logout")
						.logoutSuccessUrl("/")
						.invalidateHttpSession(true)
						.deleteCookies("JSESSIONID")
				)
				.rememberMe(remember -> remember
						.key("uniqueAndSecret")
						.rememberMeParameter("remember-me")
						.userDetailsService(userDetailsService)
				)
				.sessionManagement(session -> session
						.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.IF_REQUIRED)
						.maximumSessions(1)
						.maxSessionsPreventsLogin(false)
				)
				.exceptionHandling(ex -> ex
						.accessDeniedPage("/")
				);

		return http.build();
	}
}