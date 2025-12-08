package fit.iuh.se.mobileshop.ulti;

import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class EmailUlti {
	
	@Autowired
	private JavaMailSender mailSender;

	public boolean sendEmail(String diaChiDen, String tieuDe, String noiDung) {
		MimeMessage message = mailSender.createMimeMessage();
		
		try {
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
			helper.setTo(diaChiDen);
			helper.setSubject(tieuDe);
			helper.setText(noiDung);		
			
			mailSender.send(message);
			return true;
		} catch (Exception e) {
			// Log lỗi nhưng không throw exception để không làm gián đoạn quá trình
			System.err.println("Lỗi gửi email: " + e.getMessage());
			e.printStackTrace();
			return false;
		}
		
	}
	

}
