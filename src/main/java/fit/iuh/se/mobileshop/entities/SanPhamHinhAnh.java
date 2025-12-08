package fit.iuh.se.mobileshop.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class SanPhamHinhAnh {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@ManyToOne
	@JoinColumn(name = "san_pham_id")
	@JsonIgnore
	private SanPham sanPham;
	
	private String mauSac;
	private String hinhAnhUrl;
	private int thuTu; // Thứ tự hiển thị (0 = hình chính)
	
	public long getId() {
		return id;
	}
	
	public void setId(long id) {
		this.id = id;
	}
	
	public SanPham getSanPham() {
		return sanPham;
	}
	
	public void setSanPham(SanPham sanPham) {
		this.sanPham = sanPham;
	}
	
	public String getMauSac() {
		return mauSac;
	}
	
	public void setMauSac(String mauSac) {
		this.mauSac = mauSac;
	}
	
	public String getHinhAnhUrl() {
		return hinhAnhUrl;
	}
	
	public void setHinhAnhUrl(String hinhAnhUrl) {
		this.hinhAnhUrl = hinhAnhUrl;
	}
	
	public int getThuTu() {
		return thuTu;
	}
	
	public void setThuTu(int thuTu) {
		this.thuTu = thuTu;
	}
}


