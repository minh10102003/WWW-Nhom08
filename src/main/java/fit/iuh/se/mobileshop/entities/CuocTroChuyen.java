package fit.iuh.se.mobileshop.entities;

import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CuocTroChuyen {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "khach_hang_id", nullable = false)
	@JsonIgnoreProperties({"password", "confirmPassword", "vaiTro", "listDonHang"})
	private NguoiDung khachHang;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "admin_id", nullable = true)
	@JsonIgnoreProperties({"password", "confirmPassword", "vaiTro", "listDonHang"})
	private NguoiDung admin;

	private String trangThai; // "dang_cho", "dang_chat", "da_ket_thuc"

	@DateTimeFormat(pattern = "dd/MM/yyyy HH:mm")
	@JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "GMT+7")
	private Date thoiGianTao;

	@DateTimeFormat(pattern = "dd/MM/yyyy HH:mm")
	@JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "GMT+7")
	private Date thoiGianCapNhat;

	private String tinNhanCuoiCung; // Preview tin nhắn cuối cùng

	@DateTimeFormat(pattern = "dd/MM/yyyy HH:mm")
	@JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "GMT+7")
	private Date thoiGianTinNhanCuoi;

	@OneToMany(mappedBy = "cuocTroChuyen", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties({"cuocTroChuyen"})
	private List<TinNhan> danhSachTinNhan;

	// Constructors
	public CuocTroChuyen() {
	}

	// Getters and Setters
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public NguoiDung getKhachHang() {
		return khachHang;
	}

	public void setKhachHang(NguoiDung khachHang) {
		this.khachHang = khachHang;
	}

	public NguoiDung getAdmin() {
		return admin;
	}

	public void setAdmin(NguoiDung admin) {
		this.admin = admin;
	}

	public String getTrangThai() {
		return trangThai;
	}

	public void setTrangThai(String trangThai) {
		this.trangThai = trangThai;
	}

	public Date getThoiGianTao() {
		return thoiGianTao;
	}

	public void setThoiGianTao(Date thoiGianTao) {
		this.thoiGianTao = thoiGianTao;
	}

	public Date getThoiGianCapNhat() {
		return thoiGianCapNhat;
	}

	public void setThoiGianCapNhat(Date thoiGianCapNhat) {
		this.thoiGianCapNhat = thoiGianCapNhat;
	}

	public String getTinNhanCuoiCung() {
		return tinNhanCuoiCung;
	}

	public void setTinNhanCuoiCung(String tinNhanCuoiCung) {
		this.tinNhanCuoiCung = tinNhanCuoiCung;
	}

	public Date getThoiGianTinNhanCuoi() {
		return thoiGianTinNhanCuoi;
	}

	public void setThoiGianTinNhanCuoi(Date thoiGianTinNhanCuoi) {
		this.thoiGianTinNhanCuoi = thoiGianTinNhanCuoi;
	}

	public List<TinNhan> getDanhSachTinNhan() {
		return danhSachTinNhan;
	}

	public void setDanhSachTinNhan(List<TinNhan> danhSachTinNhan) {
		this.danhSachTinNhan = danhSachTinNhan;
	}
}

