package fit.iuh.se.mobileshop.api.admin;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import fit.iuh.se.mobileshop.dto.SanPhamDto;
import fit.iuh.se.mobileshop.dto.SearchSanPhamObject;
import fit.iuh.se.mobileshop.entities.ResponseObject;
import fit.iuh.se.mobileshop.entities.SanPham;
import fit.iuh.se.mobileshop.service.SanPhamService;
import fit.iuh.se.mobileshop.validator.SanPhamDtoValidator;

@RestController
@RequestMapping("api/san-pham")
public class SanPhamApi {

	@Autowired
	private SanPhamDtoValidator validator;

	@Autowired
	private SanPhamService sanPhamService;

	@InitBinder("sanPhamDto")
	protected void initialiseBinder(WebDataBinder binder) {
		binder.setValidator(validator);
	}

	// lấy tất cả san phẩm theo tiêu chí, mặc địch lấy tất cả 
	@GetMapping("/all")
	public Page<SanPham> getAllSanPhamByFilter(
			@RequestParam(defaultValue = "1") int page, 
			@RequestParam(required = false, defaultValue = "") String danhMucId, 
			@RequestParam(required = false, defaultValue = "") String hangSXId, 
			@RequestParam(required = false, defaultValue = "") String donGia, 
			@RequestParam(required = false, defaultValue = "asc") String sapXepTheoGia,
			@RequestParam(required = false) Long minPrice,
			@RequestParam(required = false) Long maxPrice) {
		SearchSanPhamObject searchObject = new SearchSanPhamObject();
		searchObject.setDanhMucId(danhMucId != null ? danhMucId : "");
		searchObject.setHangSXId(hangSXId != null ? hangSXId : "");
		searchObject.setDonGia(donGia != null ? donGia : "");
		searchObject.setSapXepTheoGia(sapXepTheoGia != null ? sapXepTheoGia : "asc");
		searchObject.setMinPrice(minPrice);
		searchObject.setMaxPrice(maxPrice);
		
		Page<SanPham> listSanPham = sanPhamService.getAllSanPhamByFilter(searchObject, page-1, 10);
		return listSanPham;
	}
	
	@GetMapping("/latest")
	public List<SanPham> getLatestSanPham(){
		return sanPhamService.getLatestSanPham();
	}

	// lấy sản phẩm theo id
	@GetMapping("/{id}")
	public SanPham getSanPhamById(@PathVariable long id) {
		return sanPhamService.getSanPhamById(id);
	}
	
	
	// lấy sản phẩm theo tên
	@GetMapping("/")
	public Page<SanPham> getSanPhamById(@RequestParam String tenSanPham, @RequestParam(defaultValue = "1") int page) {
		return sanPhamService.getSanPhamByTenSanPhamForAdmin(tenSanPham, page-1, 10 );
	}

	// lưu sản phẩm vào db
	@PostMapping(value = "/save")
	public ResponseObject addSanPham(@ModelAttribute @Valid SanPhamDto newSanPhamDto, BindingResult result,
			HttpServletRequest request) {

		ResponseObject ro = new ResponseObject();

		try {
			// Log dữ liệu nhận được
			System.out.println("=== SanPhamApi.addSanPham ===");
			System.out.println("ID: " + newSanPhamDto.getId());
			System.out.println("TenSanPham: " + newSanPhamDto.getTenSanPham());
			System.out.println("DonGia: " + newSanPhamDto.getDonGia());
			System.out.println("DanhMucId: " + newSanPhamDto.getDanhMucId());
			System.out.println("NhaSXId: " + newSanPhamDto.getNhaSXId());
			System.out.println("Has image: " + (newSanPhamDto.getHinhAnh() != null && !newSanPhamDto.getHinhAnh().isEmpty()));
			
			// nếu có lỗi xảy ra ( validate)
			if (result.hasErrors()) {
				Map<String, String> errors = result.getFieldErrors().stream()
						.collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
				errors.forEach((k, v) -> System.out.println(" test: Key : " + k + " Value : " + v));
				ro.setErrorMessages(errors);
				ro.setStatus("fail");
			} else {
				// lưu sản phẩm
				SanPham sp = sanPhamService.save(newSanPhamDto);
				ro.setData(sp);
				saveImageForProduct(sp, newSanPhamDto, request);
				ro.setStatus("success");
			}
		} catch (Exception e) {
			System.err.println("=== ERROR in SanPhamApi.addSanPham ===");
			System.err.println("Exception type: " + e.getClass().getName());
			System.err.println("Exception message: " + e.getMessage());
			e.printStackTrace();
			if (e.getCause() != null) {
				System.err.println("Cause: " + e.getCause().getMessage());
				e.getCause().printStackTrace();
			}
			
			ro.setStatus("fail");
			Map<String, String> errorMap = new java.util.HashMap<>();
			errorMap.put("message", e.getMessage() != null ? e.getMessage() : "Có lỗi xảy ra khi lưu sản phẩm");
			ro.setErrorMessages(errorMap);
		}
		return ro;
	}
	
	
	@DeleteMapping("/delete/{id}")
	public ResponseObject deleteSanPham(@PathVariable long id) {
		ResponseObject ro = new ResponseObject();
		try {
			sanPhamService.deleteById(id);
			ro.setStatus("success");
			ro.setData("Xóa sản phẩm thành công");
		} catch (Exception e) {
			System.err.println("=== ERROR in SanPhamApi.deleteSanPham ===");
			System.err.println("Exception type: " + e.getClass().getName());
			System.err.println("Exception message: " + e.getMessage());
			e.printStackTrace();
			if (e.getCause() != null) {
				System.err.println("Cause: " + e.getCause().getMessage());
				e.getCause().printStackTrace();
			}
			
			ro.setStatus("fail");
			Map<String, String> errorMap = new java.util.HashMap<>();
			String errorMessage = "Không thể xóa sản phẩm";
			if (e.getMessage() != null && e.getMessage().contains("foreign key")) {
				errorMessage = "Không thể xóa sản phẩm vì đang được sử dụng trong đơn hàng hoặc giỏ hàng";
			} else if (e.getMessage() != null) {
				errorMessage = "Có lỗi xảy ra: " + e.getMessage();
			}
			errorMap.put("message", errorMessage);
			ro.setErrorMessages(errorMap);
		}
		return ro;
	}

	
	// lưu ảnh của sản phẩm vào thư mục
	public void saveImageForProduct(SanPham sp, SanPhamDto dto, HttpServletRequest request) {

		MultipartFile productImage = dto.getHinhAnh();
		
		// Lưu vào thư mục project (src/main/webapp/resources/images) thay vì thư mục build
		String projectRoot = System.getProperty("user.dir");
		String imagesDirPath = projectRoot + File.separator + "src" + File.separator + "main" + File.separator 
				+ "webapp" + File.separator + "resources" + File.separator + "images";
		
		// Tạo thư mục nếu chưa tồn tại
		File imagesDir = new File(imagesDirPath);
		if (!imagesDir.exists()) {
			imagesDir.mkdirs();
			System.out.println("Created images directory: " + imagesDirPath);
		}
		
		Path path = Paths.get(imagesDirPath + File.separator + sp.getId() + ".png");
		
		System.out.println("Saving image to: " + path.toString());
		System.out.println("Has image file: " + (productImage != null && !productImage.isEmpty()));
		
		if (productImage != null && !productImage.isEmpty()) {
			try {
				// Tạo thư mục cha nếu chưa tồn tại
				File parentDir = path.getParent().toFile();
				if (!parentDir.exists()) {
					parentDir.mkdirs();
				}
				
				productImage.transferTo(path.toFile());
				System.out.println("Image saved successfully: " + path.toString());
			} catch (Exception ex) {
				System.err.println("Error saving image: " + ex.getMessage());
				ex.printStackTrace();
				// Không throw exception để không làm gián đoạn việc lưu sản phẩm
				// Chỉ log lỗi
			}
		} else {
			System.out.println("No image file provided, skipping image save");
		}
	}
}
