package fit.iuh.se.mobileshop.service;

public interface SecurityService {

	String findLoggedInUsername();

	void autologin(String email, String password);

}
