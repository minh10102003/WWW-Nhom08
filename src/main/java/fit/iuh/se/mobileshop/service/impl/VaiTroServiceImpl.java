package fit.iuh.se.mobileshop.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fit.iuh.se.mobileshop.entities.VaiTro;
import fit.iuh.se.mobileshop.repository.VaiTroRepository;
import fit.iuh.se.mobileshop.service.VaiTroService;

@Service
public class VaiTroServiceImpl implements VaiTroService{
	

	@Autowired
	private VaiTroRepository repo;

	@Override
	public VaiTro findByTenVaiTro(String tenVaiTro) {
		return repo.findByTenVaiTro(tenVaiTro);
	}

	@Override
	public List<VaiTro> findAllVaiTro() {
		return repo.findAll();
	}


}
