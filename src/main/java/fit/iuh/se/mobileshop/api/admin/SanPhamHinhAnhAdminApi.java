package fit.iuh.se.mobileshop.api.admin;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import fit.iuh.se.mobileshop.dto.SanPhamHinhAnhDto;
import fit.iuh.se.mobileshop.entities.ResponseObject;
import fit.iuh.se.mobileshop.entities.SanPham;
import fit.iuh.se.mobileshop.entities.SanPhamHinhAnh;
import fit.iuh.se.mobileshop.service.SanPhamHinhAnhService;
import fit.iuh.se.mobileshop.service.SanPhamService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/admin/san-pham-hinh-anh")
public class SanPhamHinhAnhAdminApi {
	
	@Autowired
	private SanPhamHinhAnhService hinhAnhService;
	
	@Autowired
	private SanPhamService sanPhamService;
	
	@GetMapping("/san-pham/{sanPhamId}")
	public ResponseObject getHinhAnhBySanPham(@PathVariable long sanPhamId) {
		ResponseObject ro = new ResponseObject();
		try {
			SanPham sanPham = sanPhamService.getSanPhamById(sanPhamId);
			List<SanPhamHinhAnh> hinhAnhList = hinhAnhService.getHinhAnhBySanPham(sanPham);
			ro.setStatus("success");
			ro.setData(hinhAnhList);
		} catch (Exception e) {
			ro.setStatus("fail");
			java.util.Map<String, String> errors = new java.util.HashMap<>();
			errors.put("message", "Không thể lấy danh sách hình ảnh: " + e.getMessage());
			ro.setErrorMessages(errors);
		}
		return ro;
	}
	
	@PostMapping(value = "/save", consumes = {"multipart/form-data"})
	public ResponseObject saveHinhAnh(@ModelAttribute SanPhamHinhAnhDto dto, HttpServletRequest request) {
		ResponseObject ro = new ResponseObject();
		try {
			System.out.println("=== SanPhamHinhAnhAdminApi.saveHinhAnh ===");
			System.out.println("ID: " + dto.getId());
			System.out.println("SanPhamId: " + dto.getSanPhamId());
			System.out.println("MauSac: " + dto.getMauSac());
			System.out.println("Has image: " + (dto.getHinhAnh() != null && !dto.getHinhAnh().isEmpty()));
			
			// Lấy sản phẩm
			SanPham sanPham = sanPhamService.getSanPhamById(Long.parseLong(dto.getSanPhamId()));
			
			// Tạo entity
			SanPhamHinhAnh hinhAnh = new SanPhamHinhAnh();
			if (dto.getId() != null && !dto.getId().trim().equals("")) {
				hinhAnh.setId(Long.parseLong(dto.getId()));
			}
			hinhAnh.setSanPham(sanPham);
			hinhAnh.setMauSac(dto.getMauSac());
			if (dto.getThuTu() != null && !dto.getThuTu().trim().equals("")) {
				hinhAnh.setThuTu(Integer.parseInt(dto.getThuTu()));
			} else {
				hinhAnh.setThuTu(0);
			}
			
			// Lưu entity trước để có ID
			SanPhamHinhAnh saved = hinhAnhService.save(hinhAnh);
			
			// Lưu file hình ảnh
			if (dto.getHinhAnh() != null && !dto.getHinhAnh().isEmpty()) {
				String imageUrl = saveImageForProductHinhAnh(saved, dto.getHinhAnh(), request);
				saved.setHinhAnhUrl(imageUrl);
				// Cập nhật lại với URL
				saved = hinhAnhService.save(saved);
			}
			
			ro.setStatus("success");
			ro.setData(saved);
		} catch (Exception e) {
			ro.setStatus("fail");
			java.util.Map<String, String> errors = new java.util.HashMap<>();
			errors.put("message", "Không thể lưu hình ảnh: " + e.getMessage());
			ro.setErrorMessages(errors);
			e.printStackTrace();
		}
		return ro;
	}
	
	// Lưu ảnh của sản phẩm hình ảnh vào thư mục
	private String saveImageForProductHinhAnh(SanPhamHinhAnh hinhAnh, MultipartFile imageFile, HttpServletRequest request) {
		try {
			// Lưu vào thư mục project (src/main/webapp/resources/images)
			String projectRoot = System.getProperty("user.dir");
			String imagesDirPath = projectRoot + File.separator + "src" + File.separator + "main" + File.separator 
					+ "webapp" + File.separator + "resources" + File.separator + "images";
			
			// Tạo thư mục nếu chưa tồn tại
			File imagesDir = new File(imagesDirPath);
			if (!imagesDir.exists()) {
				imagesDir.mkdirs();
				System.out.println("Created images directory: " + imagesDirPath);
			}
			
			// Tên file: {sanPhamId}_{mauSac}_{id}.png
			String fileName = hinhAnh.getSanPham().getId() + "_" + 
					(hinhAnh.getMauSac() != null ? hinhAnh.getMauSac().replaceAll("[^a-zA-Z0-9]", "_") : "default") + 
					"_" + hinhAnh.getId() + ".png";
			
			Path path = Paths.get(imagesDirPath + File.separator + fileName);
			
			System.out.println("Saving product image to: " + path.toString());
			
			// Tạo thư mục cha nếu chưa tồn tại
			File parentDir = path.getParent().toFile();
			if (!parentDir.exists()) {
				parentDir.mkdirs();
			}
			
			imageFile.transferTo(path.toFile());
			System.out.println("Image saved successfully: " + path.toString());
			
			// Trả về URL để lưu vào database
			return "/iphoneshop/img/" + fileName;
			
		} catch (Exception ex) {
			System.err.println("Error saving product image: " + ex.getMessage());
			ex.printStackTrace();
			return null;
		}
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseObject deleteHinhAnh(@PathVariable long id) {
		ResponseObject ro = new ResponseObject();
		try {
			hinhAnhService.deleteById(id);
			ro.setStatus("success");
			ro.setData("Xóa hình ảnh thành công");
		} catch (Exception e) {
			ro.setStatus("fail");
			java.util.Map<String, String> errors = new java.util.HashMap<>();
			errors.put("message", "Không thể xóa hình ảnh: " + e.getMessage());
			ro.setErrorMessages(errors);
		}
		return ro;
	}
}

