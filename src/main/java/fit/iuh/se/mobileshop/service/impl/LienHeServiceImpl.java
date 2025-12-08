package fit.iuh.se.mobileshop.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import com.querydsl.core.BooleanBuilder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import fit.iuh.se.mobileshop.dto.LienHeDTO;
import fit.iuh.se.mobileshop.dto.SearchLienHeObject;
import fit.iuh.se.mobileshop.entities.LienHe;
import fit.iuh.se.mobileshop.entities.QLienHe;
import fit.iuh.se.mobileshop.repository.LienHeRepository;
import fit.iuh.se.mobileshop.service.LienHeService;


@Service
public class LienHeServiceImpl implements LienHeService {

	@Autowired
	private LienHeRepository lienHeRepo;

	@Override
	public Page<LienHe> getLienHeByFilter(SearchLienHeObject object, int page) throws ParseException {
		BooleanBuilder builder = new BooleanBuilder();

		String trangThai = object.getTrangThaiLienHe();
		String tuNgay = object.getTuNgay();
		String denNgay = object.getDenNgay();
		SimpleDateFormat formatDate = new SimpleDateFormat("dd-MM-yyyy");

		if (!trangThai.equals("")) {
			builder.and(QLienHe.lienHe.trangThai.eq(trangThai));
		}

		if (!tuNgay.equals("") && tuNgay != null) {
			builder.and(QLienHe.lienHe.ngayLienHe.goe(formatDate.parse(tuNgay)));
		}

		if (!denNgay.equals("") && denNgay != null) {
			builder.and(QLienHe.lienHe.ngayLienHe.loe(formatDate.parse(denNgay)));
		}

		return lienHeRepo.findAll(builder, PageRequest.of(page - 1, 2));
	}

	@Override
	public LienHe findById(long id) {
		return lienHeRepo.findById(id).get();
	}

	@Override
	public LienHe save(LienHe lh) {
		return lienHeRepo.save(lh);
	}

	@Override
	public int countByTrangThai(String trangThai) {
		return lienHeRepo.countByTrangThai(trangThai);
	}

}
