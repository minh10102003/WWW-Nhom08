package fit.iuh.se.mobileshop.config;

import java.io.File;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Value("${server.servlet.context-path:/}")
	private String contextPath;

	@PostConstruct
	public void init() {
		// Ensure images directory exists
		File imagesDir = new File("src/main/webapp/resources/images");
		if (!imagesDir.exists()) {
			imagesDir.mkdirs();
		}
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// Set order to ensure resource handlers are checked before view controllers
		registry.setOrder(0);
		
		// React static resources - MUST be registered first to have higher priority
		// With JAR packaging, static resources are served from classpath:/static/
		// Note: Context path /iphoneshop is automatically prepended by Spring
		registry.addResourceHandler("/assets/**")
			.addResourceLocations("classpath:/static/assets/")
			.setCachePeriod(3600)
			.resourceChain(true);
		registry.addResourceHandler("/static/**")
			.addResourceLocations("classpath:/static/static/")
			.setCachePeriod(3600);
		registry.addResourceHandler("/index.html")
			.addResourceLocations("classpath:/static/")
			.setCachePeriod(0);
		
		// Product images - serve from multiple locations
		// Priority: 1. File system (development), 2. Classpath (packaged)
		String projectRoot = System.getProperty("user.dir");
		String imagesPath = projectRoot + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "resources" + File.separator + "images" + File.separator;
		// Normalize path for Windows - convert to forward slashes and add file: prefix
		String normalizedPath = imagesPath.replace("\\", "/");
		if (!normalizedPath.startsWith("file:")) {
			normalizedPath = "file:" + normalizedPath;
		}
		
		registry.addResourceHandler("/img/**")
			.addResourceLocations(
				normalizedPath,
				"classpath:/resources/images/",
				"file:" + projectRoot.replace("\\", "/") + "/src/main/webapp/resources/images/"
			)
			.setCachePeriod(3600)
			.resourceChain(true);
		
		// CSS and JS resources - serve from webapp/resources directory
		// Must use file:// prefix for absolute paths
		String resourcesPath = projectRoot + "/src/main/webapp/resources/";
		resourcesPath = resourcesPath.replace("\\", "/");
		if (!resourcesPath.startsWith("file:")) {
			resourcesPath = "file:" + resourcesPath;
		}
		
		registry.addResourceHandler("/css/**")
			.addResourceLocations(
				"classpath:/resources/css/",
				resourcesPath + "css/",
				"/resources/css/"
			)
			.setCachePeriod(3600)
			.resourceChain(true);
		registry.addResourceHandler("/js/**")
			.addResourceLocations(
				"classpath:/resources/js/",
				resourcesPath + "js/",
				"/resources/js/"
			)
			.setCachePeriod(3600)
			.resourceChain(true);
		
		// Frontend resources
		registry.addResourceHandler("/Frontend/img/**").addResourceLocations(resourcesPath + "Frontend/images/");
		registry.addResourceHandler("/Frontend/css/**").addResourceLocations(resourcesPath + "Frontend/css/");
		registry.addResourceHandler("/Frontend/js/**").addResourceLocations(resourcesPath + "Frontend/js/");
		
		// JSP resources - serve from webapp directory in development
		String webappPath = projectRoot + "/src/main/webapp/";
		webappPath = webappPath.replace("\\", "/");
		if (!webappPath.startsWith("file:")) {
			webappPath = "file:" + webappPath;
		}
		registry.addResourceHandler("/WEB-INF/**").addResourceLocations(webappPath + "WEB-INF/");
	}
	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		// Dùng allowedOriginPatterns thay vì allowedOrigins để hỗ trợ wildcard và allowCredentials
		registry.addMapping("/api/**")
			.allowedOriginPatterns("*")
			.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
			.allowedHeaders("*")
			.exposedHeaders("*")
			.allowCredentials(true)
			.maxAge(3600);
	}
	
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		// View controllers are now handled by ReactViewController
		// CustomErrorController handles all 404 errors and forwards to React app
		// This method is kept for potential future use but currently not needed
	}
}
