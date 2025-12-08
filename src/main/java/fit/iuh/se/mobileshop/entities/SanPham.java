package fit.iuh.se.mobileshop.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SanPham {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	private String tenSanPham;
	private long donGia;
	private int donViKho;
	private int donViBan;
	private String thongTinBaoHanh;
	private String thongTinChung;
	private String manHinh;
	private String heDieuHanh;
	private String chip;
	private String dungLuong;
	private String mauSac;
	private String camera;
	private String hinhAnhUrl;
	
	@Transient
	@JsonIgnore
	private MultipartFile hinhAnh;

	@ManyToOne
	@JoinColumn(name = "ma_danh_muc")
	@JsonIgnoreProperties({"listSanPham", "hibernateLazyInitializer", "handler"})
	private DanhMuc danhMuc;

	@ManyToOne
	@JoinColumn(name = "ma_hang_sx")
	@JsonIgnoreProperties({"listSanPham", "hibernateLazyInitializer", "handler"})
	private HangSanXuat hangSanXuat;

	public String getTenSanPham() {
		return tenSanPham;
	}

	public void setTenSanPham(String tenSanPham) {
		this.tenSanPham = tenSanPham;
	}

	public long getDonGia() {
		return donGia;
	}

	public void setDonGia(long donGia) {
		this.donGia = donGia;
	}

	public int getDonViKho() {
		return donViKho;
	}

	public void setDonViKho(int donViKho) {
		this.donViKho = donViKho;
	}

	public int getDonViBan() {
		return donViBan;
	}

	public void setDonViBan(int donViBan) {
		this.donViBan = donViBan;
	}

	public String getThongTinBaoHanh() {
		return thongTinBaoHanh;
	}

	public void setThongTinBaoHanh(String thongTinBaoHanh) {
		this.thongTinBaoHanh = thongTinBaoHanh;
	}

	public String getThongTinChung() {
		return thongTinChung;
	}

	public void setThongTinChung(String thongTinChung) {
		this.thongTinChung = thongTinChung;
	}

	public String getManHinh() {
		return manHinh;
	}

	public void setManHinh(String manHinh) {
		this.manHinh = manHinh;
	}

	public String getHeDieuHanh() {
		return heDieuHanh;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public void setHeDieuHanh(String heDieuHanh) {
		this.heDieuHanh = heDieuHanh;
	}

	public String getChip() {
		return chip;
	}

	public void setChip(String chip) {
		this.chip = chip;
	}

	public String getDungLuong() {
		return dungLuong;
	}

	public void setDungLuong(String dungLuong) {
		this.dungLuong = dungLuong;
	}

	public String getMauSac() {
		return mauSac;
	}

	public void setMauSac(String mauSac) {
		this.mauSac = mauSac;
	}

	public String getCamera() {
		return camera;
	}

	public void setCamera(String camera) {
		this.camera = camera;
	}

	public DanhMuc getDanhMuc() {
		return danhMuc;
	}

	public void setDanhMuc(DanhMuc danhMuc) {
		this.danhMuc = danhMuc;
	}

	public HangSanXuat getHangSanXuat() {
		return hangSanXuat;
	}

	public void setHangSanXuat(HangSanXuat hangSanXuat) {
		this.hangSanXuat = hangSanXuat;
	}
	

	public MultipartFile getHinhAnh() {
		return hinhAnh;
	}

	public void setHinhAnh(MultipartFile hinhAnh) {
		this.hinhAnh = hinhAnh;
	}

	public String getHinhAnhUrl() {
		return hinhAnhUrl;
	}

	public void setHinhAnhUrl(String hinhAnhUrl) {
		this.hinhAnhUrl = hinhAnhUrl;
	}

}
