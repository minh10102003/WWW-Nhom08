package fit.iuh.se.mobileshop.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.querydsl.core.BooleanBuilder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import fit.iuh.se.mobileshop.dto.SanPhamDto;
import fit.iuh.se.mobileshop.dto.SearchSanPhamObject;
import fit.iuh.se.mobileshop.entities.ChiMucGioHang;
import fit.iuh.se.mobileshop.entities.ChiTietDonHang;
import fit.iuh.se.mobileshop.entities.QSanPham;
import fit.iuh.se.mobileshop.entities.SanPham;
import fit.iuh.se.mobileshop.repository.ChiMucGioHangRepository;
import fit.iuh.se.mobileshop.repository.ChiTietDonHangRepository;
import fit.iuh.se.mobileshop.repository.DanhMucRepository;
import fit.iuh.se.mobileshop.repository.HangSanXuatRepository;
import fit.iuh.se.mobileshop.repository.SanPhamRepository;
import fit.iuh.se.mobileshop.service.SanPhamService;

@Service
public class SanPhamServiceImpl implements SanPhamService {

	@Autowired
	private SanPhamRepository sanPhamRepo;

	@Autowired
	private DanhMucRepository danhMucRepo;

	@Autowired
	private HangSanXuatRepository hangSanXuatRepo;
	
	@Autowired
	private ChiMucGioHangRepository chiMucGioHangRepo;
	
	@Autowired
	private ChiTietDonHangRepository chiTietDonHangRepo;

	// đổi từ SanPhamDto sang đối tượng SanPham để add vào db
	public SanPham convertFromSanPhamDto(SanPhamDto dto) {
		SanPham sanPham = new SanPham();
		if (dto.getId() != null && !dto.getId().trim().equals("")) {
			sanPham.setId(Long.parseLong(dto.getId()));
		}
		sanPham.setTenSanPham(dto.getTenSanPham());
		sanPham.setChip(dto.getChip());
		sanPham.setDanhMuc(danhMucRepo.findById(dto.getDanhMucId()).get());
		sanPham.setHangSanXuat(hangSanXuatRepo.findById(dto.getNhaSXId()).get());
		sanPham.setDonGia(Long.parseLong(dto.getDonGia()));
		sanPham.setMauSac(dto.getMauSac());
		sanPham.setThongTinBaoHanh(dto.getThongTinBaoHanh());
		sanPham.setThongTinChung(dto.getThongTinChung());
		sanPham.setManHinh(dto.getManHinh());
		sanPham.setDungLuong(dto.getDungLuong());
		sanPham.setCamera(dto.getCamera());
		sanPham.setDonViKho(Integer.parseInt(dto.getDonViKho()));
		sanPham.setHeDieuHanh(dto.getHeDieuHanh());
		sanPham.setHinhAnhUrl(dto.getHinhAnhUrl());

		return sanPham;
	}

	@Override
	public SanPham save(SanPhamDto dto) {
		System.out.println("=== SanPhamServiceImpl.save ===");
		System.out.println("DTO ID: " + dto.getId());
		SanPham sp = convertFromSanPhamDto(dto);
		System.out.println("Converted SanPham ID: " + sp.getId());
		System.out.println("Converted SanPham Name: " + sp.getTenSanPham());
		SanPham saved = sanPhamRepo.save(sp);
		System.out.println("Saved SanPham ID: " + saved.getId());
		return saved;
	}

	@Override
	public SanPham update(SanPhamDto dto) {
		return sanPhamRepo.save(convertFromSanPhamDto(dto));
	}

	@Override
	public void deleteById(long id) {
		try {
			System.out.println("=== Deleting product with id: " + id + " ===");
			
			// Tìm sản phẩm cần xóa
			SanPham sanPham = sanPhamRepo.findById(id).orElse(null);
			if (sanPham == null) {
				System.out.println("Product not found with id: " + id);
				return;
			}
			
			// 1. Xóa tất cả ChiMucGioHang liên quan
			List<ChiMucGioHang> chiMucGioHangList = chiMucGioHangRepo.findBySanPham(sanPham);
			if (chiMucGioHangList != null && !chiMucGioHangList.isEmpty()) {
				chiMucGioHangRepo.deleteAll(chiMucGioHangList);
				System.out.println("Deleted " + chiMucGioHangList.size() + " ChiMucGioHang records");
			}
			
			// 2. Xóa tất cả ChiTietDonHang liên quan
			List<ChiTietDonHang> chiTietDonHangList = chiTietDonHangRepo.findBySanPham(sanPham);
			if (chiTietDonHangList != null && !chiTietDonHangList.isEmpty()) {
				chiTietDonHangRepo.deleteAll(chiTietDonHangList);
				System.out.println("Deleted " + chiTietDonHangList.size() + " ChiTietDonHang records");
			}
			
			// 3. Cuối cùng mới xóa sản phẩm
			sanPhamRepo.deleteById(id);
			System.out.println("Successfully deleted product with id: " + id);
			
		} catch (Exception e) {
			System.err.println("ERROR in deleteById:");
			System.err.println("Exception type: " + e.getClass().getName());
			System.err.println("Exception message: " + e.getMessage());
			e.printStackTrace();
			throw e; // Re-throw để API có thể xử lý
		}
	}

	@Override
	public Page<SanPham> getAllSanPhamByFilter(SearchSanPhamObject object, int page, int limit) {
		BooleanBuilder builder = new BooleanBuilder();
		String price = object.getDonGia();

		// sắp xếp theo giá
		Sort sort = Sort.by(Direction.ASC, "donGia"); // mặc định tăng dần
		if (object.getSapXepTheoGia() != null && !object.getSapXepTheoGia().equals("")) {
			if (object.getSapXepTheoGia().equals("desc") || object.getSapXepTheoGia().equals("giam-dan")) {
				sort = Sort.by(Direction.DESC, "donGia"); // giảm dần
			} else if (object.getSapXepTheoGia().equals("asc") || object.getSapXepTheoGia().equals("tang-dan")) {
				sort = Sort.by(Direction.ASC, "donGia"); // tăng dần
			}
		}

		if (!object.getDanhMucId().equals("") && object.getDanhMucId() != null) {
			builder.and(QSanPham.sanPham.danhMuc.eq(danhMucRepo.findById(Long.parseLong(object.getDanhMucId())).get()));
		}

		if (!object.getHangSXId().equals("") && object.getHangSXId() != null) {
			builder.and(QSanPham.sanPham.hangSanXuat
					.eq(hangSanXuatRepo.findById(Long.parseLong(object.getHangSXId())).get()));
		}

		// Filter by min/max price (priority over old price filter)
		if (object.getMinPrice() != null && object.getMinPrice() > 0) {
			builder.and(QSanPham.sanPham.donGia.goe(object.getMinPrice()));
		}
		if (object.getMaxPrice() != null && object.getMaxPrice() > 0) {
			builder.and(QSanPham.sanPham.donGia.loe(object.getMaxPrice()));
		}

		// tim theo don gia (iPhone) - fallback to old filter if min/max not set
		if ((object.getMinPrice() == null || object.getMinPrice() == 0) &&
				(object.getMaxPrice() == null || object.getMaxPrice() == 0) &&
				price != null && !price.equals("")) {
			switch (price) {
				case "duoi-10-trieu":
					builder.and(QSanPham.sanPham.donGia.lt(10000000));
					break;

				case "10-trieu-den-15-trieu":
					builder.and(QSanPham.sanPham.donGia.between(10000000, 15000000));
					break;

				case "15-trieu-den-20-trieu":
					builder.and(QSanPham.sanPham.donGia.between(15000000, 20000000));
					break;

				case "20-trieu-den-25-trieu":
					builder.and(QSanPham.sanPham.donGia.between(20000000, 25000000));
					break;

				case "tren-25-trieu":
					builder.and(QSanPham.sanPham.donGia.gt(25000000));
					break;

				// Giữ lại các case cũ để tương thích
				case "duoi-2-trieu":
					builder.and(QSanPham.sanPham.donGia.lt(2000000));
					break;

				case "2-trieu-den-4-trieu":
					builder.and(QSanPham.sanPham.donGia.between(2000000, 4000000));
					break;

				case "4-trieu-den-6-trieu":
					builder.and(QSanPham.sanPham.donGia.between(4000000, 6000000));
					break;

				case "6-trieu-den-10-trieu":
					builder.and(QSanPham.sanPham.donGia.between(6000000, 10000000));
					break;

				case "tren-10-trieu":
					builder.and(QSanPham.sanPham.donGia.gt(10000000));
					break;

				default:
					break;
			}
		}
		return sanPhamRepo.findAll(builder, PageRequest.of(page, limit, sort));
	}

	@Override
	public List<SanPham> getLatestSanPham() {
		return sanPhamRepo.findFirst12ByDanhMucTenDanhMucContainingIgnoreCaseOrderByIdDesc("iPhone");
	}

	public Iterable<SanPham> getSanPhamByTenSanPhamWithoutPaginate(SearchSanPhamObject object) {
		BooleanBuilder builder = new BooleanBuilder();
		int resultPerPage = 12;
		String[] keywords = object.getKeyword();
		String sort = object.getSort();
		String price = object.getDonGia();
		// Keyword
		builder.and(QSanPham.sanPham.tenSanPham.like("%" + keywords[0] + "%"));
		if (keywords.length > 1) {
			for (int i = 1; i < keywords.length; i++) {
				builder.and(QSanPham.sanPham.tenSanPham.like("%" + keywords[i] + "%"));
			}
		}
		// Muc gia
		switch (price) {
			case "duoi-2-trieu":
				builder.and(QSanPham.sanPham.donGia.lt(2000000));
				break;

			case "2-trieu-den-4-trieu":
				builder.and(QSanPham.sanPham.donGia.between(2000000, 4000000));
				break;

			case "4-trieu-den-6-trieu":
				builder.and(QSanPham.sanPham.donGia.between(4000000, 6000000));
				break;

			case "6-trieu-den-10-trieu":
				builder.and(QSanPham.sanPham.donGia.between(6000000, 10000000));
				break;

			case "tren-10-trieu":
				builder.and(QSanPham.sanPham.donGia.gt(10000000));
				break;

			default:
				break;
		}
		return sanPhamRepo.findAll(builder);
	}

	@Override
	public SanPham getSanPhamById(long id) {
		return sanPhamRepo.findById(id).get();
	}

	// Tim kiem san pham theo keyword, sap xep, phan trang, loc theo muc gia, lay 12
	// san pham moi trang
	@Override
	public Page<SanPham> getSanPhamByTenSanPham(SearchSanPhamObject object, int page, int resultPerPage) {
		BooleanBuilder builder = new BooleanBuilder();
//		int resultPerPage = 12;
		String[] keywords = object.getKeyword();
		String sort = object.getSort();
		String price = object.getDonGia();
		String brand = object.getBrand();
		String manufactor = object.getManufactor();
		// Keyword
		builder.and(QSanPham.sanPham.tenSanPham.like("%" + keywords[0] + "%"));
		if (keywords.length > 1) {
			for (int i = 1; i < keywords.length; i++) {
				builder.and(QSanPham.sanPham.tenSanPham.like("%" + keywords[i] + "%"));
			}
		}
		// Muc gia
		switch (price) {
			case "duoi-2-trieu":
				builder.and(QSanPham.sanPham.donGia.lt(2000000));
				break;

			case "2-trieu-den-4-trieu":
				builder.and(QSanPham.sanPham.donGia.between(2000000, 4000000));
				break;

			case "4-trieu-den-6-trieu":
				builder.and(QSanPham.sanPham.donGia.between(4000000, 6000000));
				break;

			case "6-trieu-den-10-trieu":
				builder.and(QSanPham.sanPham.donGia.between(6000000, 10000000));
				break;

			case "tren-10-trieu":
				builder.and(QSanPham.sanPham.donGia.gt(10000000));
				break;

			default:
				break;
		}

		// Danh muc va hang san xuat
		if (brand.length()>1) {
			builder.and(QSanPham.sanPham.danhMuc.tenDanhMuc.eq(brand));
		}
		if (manufactor.length()>1) {
			builder.and(QSanPham.sanPham.hangSanXuat.tenHangSanXuat.eq(manufactor));
		}

		// Sap xep
		if (sort.equals("newest")) {
			return sanPhamRepo.findAll(builder, PageRequest.of(page - 1, resultPerPage, Sort.Direction.DESC, "id"));
		} else if (sort.equals("priceAsc")) {
			return sanPhamRepo.findAll(builder, PageRequest.of(page - 1, resultPerPage, Sort.Direction.ASC, "donGia"));
		} else if (sort.equals("priceDes")) {
			return sanPhamRepo.findAll(builder, PageRequest.of(page - 1, resultPerPage, Sort.Direction.DESC, "donGia"));
		}
		return sanPhamRepo.findAll(builder, PageRequest.of(page - 1, resultPerPage));
	}

	public List<SanPham> getAllSanPhamByList(Set<Long> idList) {
		return sanPhamRepo.findByIdIn(idList);
	}

	@Override
	public Page<SanPham> getSanPhamByTenSanPhamForAdmin(String tenSanPham, int page, int size) {
		BooleanBuilder builder = new BooleanBuilder();
		builder.and(QSanPham.sanPham.tenSanPham.like("%" + tenSanPham + "%"));
		return sanPhamRepo.findAll(builder, PageRequest.of(page, size));
	}


	@Override
	public Iterable<SanPham> getSanPhamByTenDanhMuc(String brand) {
		BooleanBuilder builder = new BooleanBuilder();
		builder.and(QSanPham.sanPham.danhMuc.tenDanhMuc.eq(brand));
		return sanPhamRepo.findAll(builder);
	}

	@Override
	public Page<SanPham> getSanPhamByBrand(SearchSanPhamObject object, int page, int resultPerPage) {
		BooleanBuilder builder = new BooleanBuilder();
		String price = object.getDonGia();
		String brand = object.getBrand();
		String manufactor = object.getManufactor();
		String os = object.getOs();
		String dungLuong = object.getRam(); // Map từ ram field trong search object
		String camera = object.getPin(); // Map từ pin field trong search object
		// Muc gia
		switch (price) {
			case "duoi-2-trieu":
				builder.and(QSanPham.sanPham.donGia.lt(2000000));
				break;

			case "2-trieu-den-4-trieu":
				builder.and(QSanPham.sanPham.donGia.between(2000000, 4000000));
				break;

			case "4-trieu-den-6-trieu":
				builder.and(QSanPham.sanPham.donGia.between(4000000, 6000000));
				break;

			case "6-trieu-den-10-trieu":
				builder.and(QSanPham.sanPham.donGia.between(6000000, 10000000));
				break;

			case "tren-10-trieu":
				builder.and(QSanPham.sanPham.donGia.gt(10000000));
				break;

			default:
				break;
		}

		// Danh muc va hang san xuat
		if (brand.length()>1) {
			builder.and(QSanPham.sanPham.danhMuc.tenDanhMuc.eq(brand));
		}
		if (manufactor.length()>1) {
			builder.and(QSanPham.sanPham.hangSanXuat.tenHangSanXuat.eq(manufactor));
		}
		if (os.length()>1) {
			builder.and(QSanPham.sanPham.heDieuHanh.like("%"+os+"%"));
		}
		if (dungLuong != null && dungLuong.length()>1) {
			builder.and(QSanPham.sanPham.dungLuong.like("%"+dungLuong+"%"));
		}
		if (camera != null && camera.length()>1) {
			builder.and(QSanPham.sanPham.camera.like("%"+camera+"%"));
		}

		return sanPhamRepo.findAll(builder, PageRequest.of(page - 1, resultPerPage));
	}
}
