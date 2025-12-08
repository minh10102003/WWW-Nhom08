package fit.iuh.se.mobileshop.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fit.iuh.se.mobileshop.entities.ChiTietDonHang;
import fit.iuh.se.mobileshop.repository.ChiTietDonHangRepository;
import fit.iuh.se.mobileshop.service.ChiTietDonHangService;

@Service
public class ChiTietDonHangServiceImpl implements ChiTietDonHangService{
	
	@Autowired
	private ChiTietDonHangRepository repo;
	
	@Override
	public List<ChiTietDonHang> save(List<ChiTietDonHang> list)
	{	
		return repo.saveAll(list);
	}
}
