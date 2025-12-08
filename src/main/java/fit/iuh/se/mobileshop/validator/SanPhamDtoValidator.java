package fit.iuh.se.mobileshop.validator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import fit.iuh.se.mobileshop.dto.SanPhamDto;
import fit.iuh.se.mobileshop.service.DanhMucService;

@Component
public class SanPhamDtoValidator implements Validator{
	
	@Autowired
	private DanhMucService dmService;

	@Override
	public boolean supports(Class<?> clazz) {
		return SanPhamDto.class.isAssignableFrom(clazz);
	}

	@Override
	public void validate(Object target, Errors errors) {
		
		SanPhamDto s = (SanPhamDto) target;
		
		ValidationUtils.rejectIfEmpty(errors, "tenSanPham", "error.tenSanPham", "Tên sản phẩm không được trống");
		ValidationUtils.rejectIfEmpty(errors, "donGia", "error.donGia", "Đơn giá không được trống");
		ValidationUtils.rejectIfEmpty(errors, "donViKho", "error.donViKho", "Đơn vị kho không được trống");
		ValidationUtils.rejectIfEmpty(errors, "thongTinBaoHanh", "error.thongTinBaoHanh", "Thông tin bảo hành không được trống");
		ValidationUtils.rejectIfEmpty(errors, "thongTinChung", "error.thongTinChung", "Thông tin chung không được trống");
		
		// Kiểm tra giá trị số hợp lệ
		if (s.getDonGia() != null && !s.getDonGia().trim().isEmpty()) {
			try {
				if (Long.parseLong(s.getDonGia()) < 0) {
					errors.rejectValue("donGia", "error.donGia", "Đơn giá không được âm");
				}
			} catch (NumberFormatException e) {
				errors.rejectValue("donGia", "error.donGia", "Đơn giá phải là số hợp lệ");
			}
		}
		
		if (s.getDonViKho() != null && !s.getDonViKho().trim().isEmpty()) {
			try {
				if (Integer.parseInt(s.getDonViKho()) < 0) {
					errors.rejectValue("donViKho", "error.donViKho", "Đơn vị kho không được âm");
				}
			} catch (NumberFormatException e) {
				errors.rejectValue("donViKho", "error.donViKho", "Đơn vị kho phải là số hợp lệ");
			}
		}
		
		// Kiểm tra danh mục tồn tại và validate các trường cho iPhone
		try {
			fit.iuh.se.mobileshop.entities.DanhMuc danhMuc = dmService.getDanhMucById(s.getDanhMucId());
			if (danhMuc != null) {
				String tenDanhMuc = danhMuc.getTenDanhMuc().toLowerCase();
				
				if(tenDanhMuc.contains("iPhone".toLowerCase()) || tenDanhMuc.contains("iphone")) {
					ValidationUtils.rejectIfEmpty(errors, "manHinh", "error.manHinh", "Màn hình không được trống");
					ValidationUtils.rejectIfEmpty(errors, "heDieuHanh", "error.heDieuHanh", "Hệ điều hành không được trống");
					ValidationUtils.rejectIfEmpty(errors, "chip", "error.chip", "Chip không được trống");
					ValidationUtils.rejectIfEmpty(errors, "dungLuong", "error.dungLuong", "Dung lượng không được trống");
					ValidationUtils.rejectIfEmpty(errors, "mauSac", "error.mauSac", "Màu sắc không được trống");
					ValidationUtils.rejectIfEmpty(errors, "camera", "error.camera", "Camera không được trống");			
				}
			}
		} catch (Exception e) {
			// Nếu không tìm thấy danh mục, bỏ qua validation cho iPhone
		}
	}

}
