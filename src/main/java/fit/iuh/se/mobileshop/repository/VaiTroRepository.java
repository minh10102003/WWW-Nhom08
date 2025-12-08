package fit.iuh.se.mobileshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fit.iuh.se.mobileshop.entities.VaiTro;

public interface VaiTroRepository extends JpaRepository<VaiTro, Long> {

	VaiTro findByTenVaiTro(String tenVaiTro);
}
