package fit.iuh.se.mobileshop.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.entities.VaiTro;

public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long>{

	NguoiDung findByEmail(String email);

	@Query("SELECT DISTINCT n FROM NguoiDung n JOIN n.vaiTro v WHERE v IN :vaiTro")
	Page<NguoiDung> findByVaiTro(@Param("vaiTro") Set<VaiTro> vaiTro, Pageable pageable);

	@Query("SELECT DISTINCT n FROM NguoiDung n JOIN n.vaiTro v WHERE v IN :vaiTro")
	List<NguoiDung> findByVaiTro(@Param("vaiTro") Set<VaiTro> vaiTro);
}
