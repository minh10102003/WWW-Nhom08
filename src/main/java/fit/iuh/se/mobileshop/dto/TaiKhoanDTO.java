package fit.iuh.se.mobileshop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

import org.hibernate.validator.constraints.Length;

public class TaiKhoanDTO {
	
	private String id;
	
	@NotEmpty(message="Phải nhập địa chỉ email")
	@Email(message= "Phải nhập đúng địa chỉ email")
	private String email;

	@Length(min=8, max=32, message="mật khẩu phải dài 8-32 ký tự")
	private String password;
	
	private String confirmPassword;
	
	@NotEmpty(message="Địa chỉ không được trống")
	private String diaChi;
	
	@NotEmpty(message="Họ tên không được trống")
	private String hoTen;
	
	@NotEmpty(message="Số điện thoại không được trống")
	private String sdt;
	
	@com.fasterxml.jackson.annotation.JsonIgnore
	private String tenVaiTro; // Giữ lại để tương thích ngược, nhưng ignore khi deserialize từ JSON
	
	private java.util.List<String> danhSachVaiTro; // Mảng vai trò mới

	public String getTenVaiTro() {
		return tenVaiTro;
	}

	public void setTenVaiTro(String tenVaiTro) {
		this.tenVaiTro = tenVaiTro;
	}

	public java.util.List<String> getDanhSachVaiTro() {
		return danhSachVaiTro;
	}

	public void setDanhSachVaiTro(java.util.List<String> danhSachVaiTro) {
		this.danhSachVaiTro = danhSachVaiTro;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getConfirmPassword() {
		return confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}

	public String getDiaChi() {
		return diaChi;
	}

	public void setDiaChi(String diaChi) {
		this.diaChi = diaChi;
	}

	public String getHoTen() {
		return hoTen;
	}

	public void setHoTen(String hoTen) {
		this.hoTen = hoTen;
	}

	public String getSdt() {
		return sdt;
	}

	public void setSdt(String sdt) {
		this.sdt = sdt;
	}


}
