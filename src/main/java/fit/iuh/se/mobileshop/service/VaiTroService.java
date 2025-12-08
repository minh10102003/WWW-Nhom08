package fit.iuh.se.mobileshop.service;

import java.util.List;

import fit.iuh.se.mobileshop.entities.VaiTro;

public interface VaiTroService {

	VaiTro findByTenVaiTro(String tenVaiTro);
	List<VaiTro> findAllVaiTro();
}
