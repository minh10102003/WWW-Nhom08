package fit.iuh.se.mobileshop.api;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.iuh.se.mobileshop.entities.LienHe;
import fit.iuh.se.mobileshop.entities.ResponseObject;
import fit.iuh.se.mobileshop.service.LienHeService;

@RestController
@RequestMapping("/api")
public class ContactApi {

	@Autowired
	private LienHeService lienHeService;

	@PostMapping("/createContact")
	public ResponseObject createContact(@RequestBody Map<String, String> requestData) {
		ResponseObject ro = new ResponseObject();
		
		try {
			// Lấy dữ liệu từ request
			String hoTen = requestData.get("hoTen");
			String email = requestData.get("email");
			String soDienThoai = requestData.get("soDienThoai");
			String noiDung = requestData.get("noiDung");
			
			// Tạo đối tượng LienHe
			LienHe lh = new LienHe();
			lh.setHoTen(hoTen);
			lh.setEmailLienHe(email);
			lh.setSoDienThoai(soDienThoai);
			lh.setTieuDe("Liên hệ từ khách hàng"); // Tiêu đề mặc định
			lh.setNoiDungLienHe(noiDung);
			lh.setNgayLienHe(new Date());
			lh.setTrangThai("Chưa trả lời");
			
			// Lưu vào database
			lienHeService.save(lh);
			
			ro.setStatus("success");
			ro.setData("Gửi liên hệ thành công");
		} catch (Exception e) {
			ro.setStatus("fail");
			Map<String, String> errors = new HashMap<>();
			errors.put("error", "Có lỗi xảy ra khi gửi liên hệ: " + e.getMessage());
			ro.setErrorMessages(errors);
			e.printStackTrace();
		}
		
		return ro;
	}
}

