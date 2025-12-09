package fit.iuh.se.mobileshop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import fit.iuh.se.mobileshop.entities.DonHang;
import fit.iuh.se.mobileshop.entities.NguoiDung;

public interface DonHangRepository extends JpaRepository<DonHang, Long>, QuerydslPredicateExecutor<DonHang> {

	@EntityGraph(attributePaths = {"danhSachChiTiet", "danhSachChiTiet.sanPham"})
	Optional<DonHang> findById(Long id);

	public List<DonHang> findByTrangThaiDonHangAndShipper(String trangThai, NguoiDung shipper);

	@Query(value = "select DATE_FORMAT(dh.ngayNhanHang, '%m') as month, "
			+ " DATE_FORMAT(dh.ngayNhanHang, '%Y') as year, sum(ct.soLuongNhanHang * ct.donGia) as total "
			+ " from DonHang dh, ChiTietDonHang ct"
			+ " where dh.id = ct.donHang.id and dh.trangThaiDonHang ='Hoàn thành'"
			+ " group by DATE_FORMAT(dh.ngayNhanHang, '%Y%m')"
			+ " order by year asc" )
	public List<Object> layDonHangTheoThangVaNam();
	
	public List<DonHang> findByNguoiDat(NguoiDung ng);
	
	@Query("SELECT d FROM DonHang d WHERE d.shipper = :shipper")
	public List<DonHang> findByShipper(@org.springframework.data.repository.query.Param("shipper") NguoiDung shipper);
	
	public int countByTrangThaiDonHang(String trangThaiDonHang);
	
}
