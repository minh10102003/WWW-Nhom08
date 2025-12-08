package fit.iuh.se.mobileshop.dto;

import org.springframework.web.multipart.MultipartFile;

public class SanPhamHinhAnhDto {
	
	private String id;
	private String sanPhamId;
	private String mauSac;
	private String thuTu;
	private MultipartFile hinhAnh;
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getSanPhamId() {
		return sanPhamId;
	}
	
	public void setSanPhamId(String sanPhamId) {
		this.sanPhamId = sanPhamId;
	}
	
	public String getMauSac() {
		return mauSac;
	}
	
	public void setMauSac(String mauSac) {
		this.mauSac = mauSac;
	}
	
	public String getThuTu() {
		return thuTu;
	}
	
	public void setThuTu(String thuTu) {
		this.thuTu = thuTu;
	}
	
	public MultipartFile getHinhAnh() {
		return hinhAnh;
	}
	
	public void setHinhAnh(MultipartFile hinhAnh) {
		this.hinhAnh = hinhAnh;
	}
}

