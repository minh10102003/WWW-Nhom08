package fit.iuh.se.mobileshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import fit.iuh.se.mobileshop.entities.LienHe;

public interface LienHeRepository extends JpaRepository<LienHe, Long>, QuerydslPredicateExecutor<LienHe>{

	int countByTrangThai(String trangThai);
	
}
