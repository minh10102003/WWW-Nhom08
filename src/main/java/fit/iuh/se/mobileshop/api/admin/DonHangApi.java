package fit.iuh.se.mobileshop.api.admin;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fit.iuh.se.mobileshop.dto.SearchDonHangObject;
import fit.iuh.se.mobileshop.entities.ChiMucGioHang;
import fit.iuh.se.mobileshop.entities.ChiTietDonHang;
import fit.iuh.se.mobileshop.entities.DonHang;
import fit.iuh.se.mobileshop.entities.GioHang;
import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.entities.ResponseObject;
import fit.iuh.se.mobileshop.entities.SanPham;
import fit.iuh.se.mobileshop.service.ChiMucGioHangService;
import fit.iuh.se.mobileshop.service.ChiTietDonHangService;
import fit.iuh.se.mobileshop.service.DonHangService;
import fit.iuh.se.mobileshop.service.GioHangService;
import fit.iuh.se.mobileshop.service.NguoiDungService;
import fit.iuh.se.mobileshop.service.SanPhamService;

@RestController
@RequestMapping("/api/don-hang")
public class DonHangApi {

	@Autowired
	private DonHangService donHangService;

	@Autowired
	private NguoiDungService nguoiDungService;

	@Autowired
	private SanPhamService sanPhamService;

	@Autowired
	private GioHangService gioHangService;

	@Autowired
	private ChiMucGioHangService chiMucGioHangService;

	@Autowired
	private ChiTietDonHangService chiTietDonHangService;

	public NguoiDung getSessionUser(HttpServletRequest request) {
		return (NguoiDung) request.getSession().getAttribute("loggedInUser");
	}

	// lấy danh sách đơn hàng theo search object
	@GetMapping(value = "/all", produces = "application/json; charset=UTF-8")
	public Page<DonHang> getDonHangByFilter(
			@RequestParam(defaultValue = "1") int page,
			@RequestParam(required = false, defaultValue = "") String trangThai,
			@RequestParam(required = false, defaultValue = "") String tuNgay,
			@RequestParam(required = false, defaultValue = "") String denNgay) throws ParseException {

		SearchDonHangObject object = new SearchDonHangObject();
		object.setDenNgay(denNgay != null ? denNgay : "");
		object.setTrangThaiDon(trangThai != null ? trangThai : "");
		object.setTuNgay(tuNgay != null ? tuNgay : "");
		Page<DonHang> listDonHang = donHangService.getAllDonHangByFilter(object, page);
		return listDonHang;
	}

	@GetMapping("/{id}")
	public DonHang getDonHangById(@PathVariable long id) {
		return donHangService.findById(id);
	}

	// Lấy danh sách đơn hàng của user hiện tại
	@GetMapping("/user")
	public List<DonHang> getUserOrders(@RequestParam(defaultValue = "1") int page, HttpServletRequest request) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		NguoiDung currentUser = getSessionUser(request);
		if(currentUser == null) {
			String email = auth.getName();
			if(email != null && !email.equals("anonymousUser")) {
				currentUser = nguoiDungService.findByEmail(email);
				if(currentUser != null) {
					request.getSession().setAttribute("loggedInUser", currentUser);
				}
			}
		}
		if(currentUser != null) {
			return donHangService.getDonHangByNguoiDung(currentUser);
		}
		return new ArrayList<>();
	}

	// phân công đơn hàng
	@PostMapping("/assign")
	public void phanCongDonHang(@RequestParam("shipper") String emailShipper,
			@RequestParam("donHangId") long donHangId) {
		DonHang dh = donHangService.findById(donHangId);
		dh.setTrangThaiDonHang("Đang giao");
		dh.setShipper(nguoiDungService.findByEmail(emailShipper));

		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {

			String dateStr = format.format(new Date());
			Date date = format.parse(dateStr);
			dh.setNgayGiaoHang(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		donHangService.save(dh);
	}

	// xác nhận hoàn thành đơn hàng
	@PostMapping("/update")
	public void xacNhanHoanThanhDon(@RequestParam("donHangId") long donHangId,
			@RequestParam("ghiChu") String ghiChuAdmin) {
		DonHang dh = donHangService.findById(donHangId);

		for(ChiTietDonHang ct : dh.getDanhSachChiTiet()) {
			SanPham sp = ct.getSanPham();
			sp.setDonViBan(sp.getDonViBan() + ct.getSoLuongNhanHang());
			sp.setDonViKho(sp.getDonViKho() - ct.getSoLuongNhanHang() );
		}
		dh.setTrangThaiDonHang("Hoàn thành");
		String ghiChu = dh.getGhiChu();
		if (!ghiChuAdmin.equals("")) {
			ghiChu += "<br> Ghi chú admin:\n" + ghiChuAdmin;
		}
		dh.setGhiChu(ghiChu);
		donHangService.save(dh);
	}

	// xác nhận hoàn thành đơn hàng
	@PostMapping("/cancel")
	public void huyDonHangAdmin(@RequestParam("donHangId") long donHangId) {
		DonHang dh = donHangService.findById(donHangId);
		dh.setTrangThaiDonHang("Đã bị hủy");
		donHangService.save(dh);
	}

	// lấy dữ liệu làm báo cáo thống kê
	@GetMapping("/report")
	public List<Object> test() {
		return donHangService.layDonHangTheoThangVaNam();
	}

	// Tạo đơn hàng mới
	@PostMapping("/create")
	public ResponseObject createDonHang(@RequestBody Map<String, String> orderData, HttpServletRequest request, HttpServletResponse response) {
		ResponseObject ro = new ResponseObject();
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			boolean isAnonymous = (auth == null ||
				auth.getPrincipal() == null ||
				"anonymousUser".equals(auth.getPrincipal().toString()) ||
				!auth.isAuthenticated());

			// Kiểm tra nếu có sản phẩm "mua ngay" (buyNow)
			String buyNowProductId = orderData.get("buyNowProductId");
			String buyNowQuantity = orderData.get("buyNowQuantity");
			boolean isBuyNow = buyNowProductId != null && !buyNowProductId.isEmpty();
			
			// Lấy cart items trước để tính tổng giá trị
			Map<Long, String> quanity = new HashMap<>();
			List<SanPham> listsp = new ArrayList<>();
			List<ChiTietDonHang> listDetailDH = new ArrayList<>();
			long tongGiaTri = 0;

			// Nếu là "mua ngay", chỉ lấy sản phẩm đó
			if (isBuyNow) {
				try {
					Long productId = Long.parseLong(buyNowProductId);
					int quantity = buyNowQuantity != null ? Integer.parseInt(buyNowQuantity) : 1;
					
					SanPham sp = sanPhamService.getSanPhamById(productId);
					if (sp != null) {
						listsp.add(sp);
						quanity.put(productId, String.valueOf(quantity));
						tongGiaTri = quantity * sp.getDonGia();
					} else {
						ro.setStatus("false");
						ro.setData("Sản phẩm không tồn tại");
						return ro;
					}
				} catch (NumberFormatException e) {
					ro.setStatus("false");
					ro.setData("Thông tin sản phẩm không hợp lệ");
					return ro;
				} catch (Exception e) {
					ro.setStatus("false");
					ro.setData("Lỗi khi lấy thông tin sản phẩm: " + e.getMessage());
					return ro;
				}
			} else if(isAnonymous) {
				// Lấy từ cookie
				Cookie cl[] = request.getCookies();
				Set<Long> idList = new HashSet<>();
				if(cl != null) {
					for(int i = 0; i < cl.length; i++) {
						if(cl[i] != null && cl[i].getName() != null && cl[i].getName().matches("[0-9]+")) {
							try {
								idList.add(Long.parseLong(cl[i].getName()));
								quanity.put(Long.parseLong(cl[i].getName()), cl[i].getValue());
							} catch (NumberFormatException e) {
								// Skip invalid cookie
							}
						}
					}
				}
				if(!idList.isEmpty()) {
					listsp = sanPhamService.getAllSanPhamByList(idList);
					if(listsp != null) {
						for(SanPham sp : listsp) {
							if(sp != null) {
								String qtyStr = quanity.get(sp.getId());
								if(qtyStr != null) {
									try {
										int soLuong = Integer.parseInt(qtyStr);
										tongGiaTri += soLuong * sp.getDonGia();
									} catch (NumberFormatException e) {
										// Skip invalid quantity
									}
								}
							}
						}
					}
				}
			} else {
				// Lấy từ database
				NguoiDung currentUser = getSessionUser(request);
				if(currentUser == null) {
					String email = auth.getName();
					if(email != null && !email.equals("anonymousUser")) {
						currentUser = nguoiDungService.findByEmail(email);
						if(currentUser != null) {
							request.getSession().setAttribute("loggedInUser", currentUser);
						}
					}
				}

				if(currentUser != null) {
					GioHang g = gioHangService.getGioHangByNguoiDung(currentUser);
					if(g != null) {
						try {
							List<ChiMucGioHang> listchimuc = chiMucGioHangService.getChiMucGioHangByGioHang(g);
							if(listchimuc != null) {
								for(ChiMucGioHang c : listchimuc) {
									try {
										if(c != null) {
											SanPham sp = c.getSanPham();
											if(sp != null) {
												tongGiaTri += c.getSo_luong() * sp.getDonGia();
												listsp.add(sp);
												quanity.put(sp.getId(), Integer.toString(c.getSo_luong()));
											}
										}
									} catch (org.springframework.orm.jpa.JpaObjectRetrievalFailureException | jakarta.persistence.EntityNotFoundException e) {
										System.err.println("Product not found for cart item, skipping: " + e.getMessage());
										// Skip invalid items (product was deleted)
									} catch (Exception e) {
										System.err.println("Error processing cart item: " + e.getMessage());
										e.printStackTrace();
										// Skip invalid items
									}
								}
							}
						} catch (Exception e) {
							System.err.println("Error loading cart items: " + e.getMessage());
							e.printStackTrace();
						}
					}
				} else {
					ro.setStatus("false");
					ro.setData("User not found");
					return ro;
				}
			}
			
			if(listsp.isEmpty() || tongGiaTri == 0) {
				ro.setStatus("false");
				ro.setData("Cart is empty");
				return ro;
			}
			
			// Kiểm tra phương thức thanh toán
			String paymentMethod = orderData.get("paymentMethod");
			boolean isOnlinePayment = "online".equals(paymentMethod);
			
			// Tạo DonHang với đầy đủ thông tin
			DonHang donHang = new DonHang();
			donHang.setHoTenNguoiNhan(orderData.get("hoTen"));
			donHang.setSdtNhanHang(orderData.get("soDienThoai"));
			donHang.setDiaChiNhan(orderData.get("diaChi"));
			donHang.setGhiChu(orderData.get("ghiChu") != null ? orderData.get("ghiChu") : "");
			donHang.setNgayDatHang(new Date());
			// Lưu phương thức thanh toán
			donHang.setPhuongThucThanhToan(paymentMethod != null ? paymentMethod : "cod");
			// Nếu thanh toán online, đặt trạng thái "Chờ thanh toán" và chưa thanh toán
			// Nếu COD, đặt trạng thái "Đang chờ giao" và đã thanh toán (vì COD thanh toán khi nhận hàng)
			if (isOnlinePayment) {
				donHang.setTrangThaiDonHang("Chờ thanh toán");
				donHang.setDaThanhToan(false);
			} else {
				donHang.setTrangThaiDonHang("Đang chờ giao");
				donHang.setDaThanhToan(false); // COD chưa thanh toán, sẽ thanh toán khi nhận hàng
			}
			donHang.setTongGiaTri(tongGiaTri);
			
			if(!isAnonymous) {
				NguoiDung currentUser = getSessionUser(request);
				if(currentUser == null) {
					String email = auth.getName();
					if(email != null && !email.equals("anonymousUser")) {
						currentUser = nguoiDungService.findByEmail(email);
					}
				}
				if(currentUser != null) {
					donHang.setNguoiDat(currentUser);
				}
			}
			
			// Lưu DonHang
			DonHang savedDonHang = donHangService.save(donHang);
			
			// Tạo ChiTietDonHang
			// Nếu là "mua ngay", chỉ tạo với sản phẩm đó
			if (isBuyNow) {
				for(SanPham sp : listsp) {
					if(sp != null) {
						String qtyStr = quanity.get(sp.getId());
						if(qtyStr != null) {
							try {
								int soLuong = Integer.parseInt(qtyStr);
								ChiTietDonHang detailDH = new ChiTietDonHang();
								detailDH.setSanPham(sp);
								detailDH.setSoLuongDat(soLuong);
								detailDH.setDonGia(soLuong * sp.getDonGia());
								detailDH.setDonHang(savedDonHang);
								listDetailDH.add(detailDH);
							} catch (NumberFormatException e) {
								// Skip invalid quantity
							}
						}
					}
				}
			} else if(isAnonymous) {
				for(SanPham sp : listsp) {
					if(sp != null) {
						String qtyStr = quanity.get(sp.getId());
						if(qtyStr != null) {
							try {
								int soLuong = Integer.parseInt(qtyStr);
								ChiTietDonHang detailDH = new ChiTietDonHang();
								detailDH.setSanPham(sp);
								detailDH.setSoLuongDat(soLuong);
								detailDH.setDonGia(soLuong * sp.getDonGia());
								detailDH.setDonHang(savedDonHang);
								listDetailDH.add(detailDH);
							} catch (NumberFormatException e) {
								// Skip invalid quantity
							}
						}
					}
				}
			} else {
				NguoiDung currentUser = getSessionUser(request);
				if(currentUser != null) {
					GioHang g = gioHangService.getGioHangByNguoiDung(currentUser);
					if(g != null) {
						List<ChiMucGioHang> listchimuc = chiMucGioHangService.getChiMucGioHangByGioHang(g);
						if(listchimuc != null) {
							for(ChiMucGioHang c : listchimuc) {
								try {
									if(c != null && c.getSanPham() != null) {
										SanPham sp = c.getSanPham();
										ChiTietDonHang detailDH = new ChiTietDonHang();
										detailDH.setSanPham(sp);
										detailDH.setDonGia(c.getSo_luong() * sp.getDonGia());
										detailDH.setSoLuongDat(c.getSo_luong());
										detailDH.setDonHang(savedDonHang);
										listDetailDH.add(detailDH);
									}
								} catch (Exception e) {
									System.err.println("Error creating order detail: " + e.getMessage());
									// Skip invalid items
								}
							}
						}
					}
				}
			}
			
			if(listDetailDH.isEmpty()) {
				ro.setStatus("false");
				ro.setData("Failed to create order details - cart is empty");
				return ro;
			}
			
			// Lưu ChiTietDonHang
			chiTietDonHangService.save(listDetailDH);
			
			// Chỉ xóa cart nếu:
			// 1. Không phải "mua ngay" (vì "mua ngay" không ảnh hưởng đến cart)
			// 2. Thanh toán trực tiếp (không phải online)
			// Nếu thanh toán online, sẽ xóa cart sau khi thanh toán thành công
			if (!isBuyNow && !isOnlinePayment) {
				cleanUpAfterCheckOut(request, response);
			}
			
			ro.setStatus("success");
			ro.setData(savedDonHang);
			return ro;
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("Error creating order: " + e.getMessage());
			ro.setStatus("false");
			ro.setData(e.getMessage() != null ? e.getMessage() : "Unknown error");
			return ro;
		}
	}
	
	private void cleanUpAfterCheckOut(HttpServletRequest request, HttpServletResponse response) {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			boolean isAnonymous = (auth == null || 
				auth.getPrincipal() == null || 
				"anonymousUser".equals(auth.getPrincipal().toString()) ||
				!auth.isAuthenticated());
			
			if(isAnonymous) {
				// Xóa cookies
				Cookie clientCookies[] = request.getCookies();
				if(clientCookies != null) {
					for(int i = 0; i < clientCookies.length; i++) {
						if(clientCookies[i] != null && clientCookies[i].getName().matches("[0-9]+")) {
							clientCookies[i].setMaxAge(0);
							clientCookies[i].setPath("/iphoneshop");
							response.addCookie(clientCookies[i]);
						}
					}
				}
			} else {
				// Xóa từ database
				NguoiDung currentUser = getSessionUser(request);
				if(currentUser == null) {
					String email = auth.getName();
					if(email != null && !email.equals("anonymousUser")) {
						currentUser = nguoiDungService.findByEmail(email);
						if(currentUser != null) {
							request.getSession().setAttribute("loggedInUser", currentUser);
						}
					}
				}
				
				if(currentUser != null) {
					GioHang g = gioHangService.getGioHangByNguoiDung(currentUser);
					if(g != null) {
						List<ChiMucGioHang> c = chiMucGioHangService.getChiMucGioHangByGioHang(g);
						if(c != null && !c.isEmpty()) {
							chiMucGioHangService.deleteAllChiMucGiohang(c);
						}
					}
				}
			}
		} catch (Exception e) {
			System.err.println("Error cleaning up cart after checkout: " + e.getMessage());
			e.printStackTrace();
		}
	}
}
