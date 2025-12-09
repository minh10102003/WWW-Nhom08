package fit.iuh.se.mobileshop.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fit.iuh.se.mobileshop.entities.CuocTroChuyen;
import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.entities.TinNhan;
import fit.iuh.se.mobileshop.repository.TinNhanRepository;
import fit.iuh.se.mobileshop.service.CuocTroChuyenService;
import fit.iuh.se.mobileshop.service.NguoiDungService;
import fit.iuh.se.mobileshop.service.TinNhanService;

@Service
public class TinNhanServiceImpl implements TinNhanService {

	@Autowired
	private TinNhanRepository tinNhanRepo;

	@Autowired
	private CuocTroChuyenService cuocTroChuyenService;

	@Autowired
	private NguoiDungService nguoiDungService;

	@Override
	public TinNhan findById(long id) {
		return tinNhanRepo.findById(id).orElse(null);
	}

	@Override
	@Transactional
	public TinNhan save(TinNhan tinNhan) {
		return tinNhanRepo.save(tinNhan);
	}

	@Override
	public List<TinNhan> findByCuocTroChuyenId(long cuocTroChuyenId) {
		return tinNhanRepo.findByCuocTroChuyenIdOrderByThoiGianGuiAsc(cuocTroChuyenId);
	}

	@Override
	@Transactional
	public TinNhan createMessage(long cuocTroChuyenId, long nguoiGuiId, String noiDung, String loaiTinNhan) {
		CuocTroChuyen cuocTroChuyen = cuocTroChuyenService.findById(cuocTroChuyenId);
		if (cuocTroChuyen == null) {
			throw new RuntimeException("Không tìm thấy cuộc trò chuyện với ID: " + cuocTroChuyenId);
		}

		NguoiDung nguoiGui = nguoiDungService.findById(nguoiGuiId);
		if (nguoiGui == null) {
			throw new RuntimeException("Không tìm thấy người dùng với ID: " + nguoiGuiId);
		}

		TinNhan tinNhan = new TinNhan();
		tinNhan.setCuocTroChuyen(cuocTroChuyen);
		tinNhan.setNguoiGui(nguoiGui);
		tinNhan.setNoiDung(noiDung);
		tinNhan.setLoaiTinNhan(loaiTinNhan != null ? loaiTinNhan : "text");
		tinNhan.setThoiGianGui(new Date());
		tinNhan.setDaDoc(false);

		// Lưu tin nhắn
		TinNhan savedMessage = tinNhanRepo.save(tinNhan);

		// Cập nhật tin nhắn cuối cùng và thời gian trong cuộc trò chuyện
		cuocTroChuyen.setTinNhanCuoiCung(noiDung);
		cuocTroChuyen.setThoiGianTinNhanCuoi(new Date());
		cuocTroChuyen.setThoiGianCapNhat(new Date());
		cuocTroChuyenService.save(cuocTroChuyen);

		return savedMessage;
	}

	@Override
	@Transactional
	public void markAsRead(long cuocTroChuyenId, long nguoiDungId) {
		// Đánh dấu tất cả tin nhắn trong cuộc trò chuyện là đã đọc (trừ tin nhắn của người dùng)
		List<TinNhan> messages = tinNhanRepo.findByCuocTroChuyenIdOrderByThoiGianGuiAsc(cuocTroChuyenId);
		for (TinNhan message : messages) {
			if (message.getNguoiGui().getId() != nguoiDungId && !message.isDaDoc()) {
				message.setDaDoc(true);
				tinNhanRepo.save(message);
			}
		}
	}

	@Override
	public long countUnreadMessages(long cuocTroChuyenId, long nguoiDungId) {
		return tinNhanRepo.countUnreadMessages(cuocTroChuyenId, nguoiDungId);
	}

	@Override
	public long countTotalUnreadMessagesForUser(long userId) {
		return tinNhanRepo.countTotalUnreadMessagesForUser(userId);
	}
}

