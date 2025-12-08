package fit.iuh.se.mobileshop.controller;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.*;

import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.service.DanhMucService;
import fit.iuh.se.mobileshop.service.DonHangService;
import fit.iuh.se.mobileshop.service.HangSanXuatService;
import fit.iuh.se.mobileshop.service.LienHeService;
import fit.iuh.se.mobileshop.service.NguoiDungService;
import fit.iuh.se.mobileshop.service.VaiTroService;

@Controller
@RequestMapping("/admin")
@SessionAttributes("loggedInUser")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminController {

	@Autowired
	private DanhMucService danhMucService;

	@Autowired
	private HangSanXuatService hangSXService;

	@Autowired
	private NguoiDungService nguoiDungService;

	@Autowired
	private VaiTroService vaiTroService;
	
	@Autowired
	private LienHeService lienHeService;

	@Autowired
	private DonHangService donHangService;

	@ModelAttribute("loggedInUser")
	public NguoiDung loggedInUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return nguoiDungService.findByEmail(auth.getName());
	}

	@GetMapping
	public ResponseEntity<Resource> adminPage(Model model) {
		// Return React app (index.html) - React Router will handle routing
		return serveIndexHtml();
	}

	@GetMapping("/danh-muc")
	public ResponseEntity<Resource> quanLyDanhMucPage() {
		return serveIndexHtml();
	}

	@GetMapping("/nhan-hieu")
	public ResponseEntity<Resource> quanLyNhanHieuPage() {
		return serveIndexHtml();
	}

	@GetMapping("/lien-he")
	public ResponseEntity<Resource> quanLyLienHePage() {
		return serveIndexHtml();
	}
	
	@GetMapping("/san-pham")
	public ResponseEntity<Resource> quanLySanPhamPage(Model model) {
		return serveIndexHtml();
	}

	@GetMapping("/profile")
	public ResponseEntity<Resource> profilePage(Model model, HttpServletRequest request) {
		return serveIndexHtml();
	}

	@PostMapping("/profile/update")
	public String updateNguoiDung(@ModelAttribute NguoiDung nd, HttpServletRequest request) {
		NguoiDung currentUser = getSessionUser(request);
		currentUser.setDiaChi(nd.getDiaChi());
		currentUser.setHoTen(nd.getHoTen());
		currentUser.setSoDienThoai(nd.getSoDienThoai());
		nguoiDungService.updateUser(currentUser);
		return "redirect:/admin/profile";
	}

	@GetMapping("/don-hang")
	public ResponseEntity<Resource> quanLyDonHangPage(Model model) {
		return serveIndexHtml();
	}

	@GetMapping("/tai-khoan")
	public ResponseEntity<Resource> quanLyTaiKhoanPage(Model model) {
		return serveIndexHtml();
	}
	
	@GetMapping("/thong-ke")
	public ResponseEntity<Resource> thongKePage(Model model) {
		return serveIndexHtml();
	}
	
	/**
	 * Catch-all handler for any other admin paths - serve React app
	 * React Router will handle the routing
	 */
	@GetMapping("/**")
	public ResponseEntity<Resource> catchAllAdminPaths() {
		return serveIndexHtml();
	}
	
	/**
	 * Serve index.html from classpath for React SPA
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
	
	public NguoiDung getSessionUser(HttpServletRequest request) {
		return (NguoiDung) request.getSession().getAttribute("loggedInUser");
	}
	
	

}
