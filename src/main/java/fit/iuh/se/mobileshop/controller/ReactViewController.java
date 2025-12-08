package fit.iuh.se.mobileshop.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReactViewController {

	/**
	 * Handle root path - serve index.html directly
	 */
	@GetMapping("/")
	public ResponseEntity<Resource> root() {
		return serveIndexHtml();
	}

	/**
	 * Handle login path - serve index.html directly
	 */
	@GetMapping("/login")
	public ResponseEntity<Resource> login() {
		return serveIndexHtml();
	}

	/**
	 * Handle store path - serve index.html directly
	 */
	@GetMapping("/store")
	public ResponseEntity<Resource> store() {
		return serveIndexHtml();
	}

	/**
	 * Handle register path - serve index.html directly
	 */
	@GetMapping("/register")
	public ResponseEntity<Resource> register() {
		return serveIndexHtml();
	}

	/**
	 * Handle cart path - serve index.html directly
	 */
	@GetMapping("/cart")
	public ResponseEntity<Resource> cart() {
		return serveIndexHtml();
	}

	/**
	 * Handle checkout path - serve index.html directly
	 */
	@GetMapping("/checkout")
	public ResponseEntity<Resource> checkout() {
		return serveIndexHtml();
	}

	/**
	 * Handle contact path - serve index.html directly
	 */
	@GetMapping("/contact")
	public ResponseEntity<Resource> contact() {
		return serveIndexHtml();
	}

	/**
	 * Handle search path - serve index.html directly
	 */
	@GetMapping("/search")
	public ResponseEntity<Resource> search() {
		return serveIndexHtml();
	}

	/**
	 * Handle thank-you path - serve index.html directly
	 */
	@GetMapping("/thank-you")
	public ResponseEntity<Resource> thankYou() {
		return serveIndexHtml();
	}

	/**
	 * Handle product detail paths - serve index.html directly
	 */
	@GetMapping("/product/**")
	public ResponseEntity<Resource> product() {
		return serveIndexHtml();
	}

	/**
	 * Handle account paths - serve index.html directly
	 */
	@GetMapping("/account/**")
	public ResponseEntity<Resource> account() {
		return serveIndexHtml();
	}

	/**
	 * Serve index.html from classpath
	 */
	private ResponseEntity<Resource> serveIndexHtml() {
		try {
			Resource resource = new ClassPathResource("static/index.html");
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.TEXT_HTML);
			return new ResponseEntity<>(resource, headers, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}

