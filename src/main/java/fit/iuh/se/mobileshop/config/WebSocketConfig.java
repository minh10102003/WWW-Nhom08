package fit.iuh.se.mobileshop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		// Enable a simple in-memory message broker to carry messages back to the client
		// on destinations prefixed with "/topic" and "/queue"
		config.enableSimpleBroker("/topic", "/queue");
		
		// Prefix for messages bound to methods annotated with @MessageMapping
		// Clients will send messages to destinations prefixed with "/app"
		config.setApplicationDestinationPrefixes("/app");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// Register the "/ws" endpoint, enabling SockJS fallback options
		// This allows clients to connect using WebSocket or SockJS
		registry.addEndpoint("/ws")
				.setAllowedOriginPatterns("*") // Allow all origins (adjust for production)
				.withSockJS(); // Enable SockJS fallback options
		
		// Also register without SockJS for native WebSocket clients
		registry.addEndpoint("/ws")
				.setAllowedOriginPatterns("*");
	}
}

