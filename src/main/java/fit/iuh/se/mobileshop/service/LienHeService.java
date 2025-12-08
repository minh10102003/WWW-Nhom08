package fit.iuh.se.mobileshop.service;

import java.text.ParseException;

import org.springframework.data.domain.Page;

import fit.iuh.se.mobileshop.dto.SearchLienHeObject;
import fit.iuh.se.mobileshop.entities.LienHe;

public interface LienHeService {

	Page<LienHe> getLienHeByFilter(SearchLienHeObject object, int page) throws ParseException;

	LienHe findById(long id);
	
	LienHe save(LienHe lh);
	
	int countByTrangThai(String trangThai);

}
