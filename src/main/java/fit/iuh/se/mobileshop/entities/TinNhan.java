package fit.iuh.se.mobileshop.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TinNhan {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cuoc_tro_chuyen_id", nullable = false)
	@JsonIgnoreProperties({"danhSachTinNhan"})
	private CuocTroChuyen cuocTroChuyen;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "nguoi_gui_id", nullable = false)
	@JsonIgnoreProperties({"password", "confirmPassword", "vaiTro", "listDonHang"})
	private NguoiDung nguoiGui;

	private String noiDung;

	@DateTimeFormat(pattern = "dd/MM/yyyy HH:mm")
	@JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "GMT+7")
	private Date thoiGianGui;

	private boolean daDoc; // false: chưa đọc, true: đã đọc

	private String loaiTinNhan; // "text", "image", "file"

	// Constructors
	public TinNhan() {
		this.loaiTinNhan = "text";
		this.daDoc = false;
	}

	// Getters and Setters
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public CuocTroChuyen getCuocTroChuyen() {
		return cuocTroChuyen;
	}

	public void setCuocTroChuyen(CuocTroChuyen cuocTroChuyen) {
		this.cuocTroChuyen = cuocTroChuyen;
	}

	public NguoiDung getNguoiGui() {
		return nguoiGui;
	}

	public void setNguoiGui(NguoiDung nguoiGui) {
		this.nguoiGui = nguoiGui;
	}

	public String getNoiDung() {
		return noiDung;
	}

	public void setNoiDung(String noiDung) {
		this.noiDung = noiDung;
	}

	public Date getThoiGianGui() {
		return thoiGianGui;
	}

	public void setThoiGianGui(Date thoiGianGui) {
		this.thoiGianGui = thoiGianGui;
	}

	public boolean isDaDoc() {
		return daDoc;
	}

	public void setDaDoc(boolean daDoc) {
		this.daDoc = daDoc;
	}

	public String getLoaiTinNhan() {
		return loaiTinNhan;
	}

	public void setLoaiTinNhan(String loaiTinNhan) {
		this.loaiTinNhan = loaiTinNhan;
	}
}

