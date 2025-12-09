package fit.iuh.se.mobileshop.api.admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

import fit.iuh.se.mobileshop.entities.ChiMucGioHang;
import fit.iuh.se.mobileshop.entities.GioHang;
import fit.iuh.se.mobileshop.entities.NguoiDung;
import fit.iuh.se.mobileshop.entities.ResponseObject;
import fit.iuh.se.mobileshop.entities.SanPham;
import fit.iuh.se.mobileshop.service.ChiMucGioHangService;
import fit.iuh.se.mobileshop.service.GioHangService;
import fit.iuh.se.mobileshop.service.NguoiDungService;
import fit.iuh.se.mobileshop.service.SanPhamService;

@RestController
@RequestMapping("/api/gio-hang")
@SessionAttributes("loggedInUser")
public class GioHangApi  {
	
	@Autowired
	private NguoiDungService nguoiDungService;
	@Autowired
	private GioHangService gioHangService;
	@Autowired
	private SanPhamService sanPhamService;
	@Autowired
	private ChiMucGioHangService chiMucGioHangService;
	
	@ModelAttribute("loggedInUser")
	public NguoiDung loggedInUser() {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
				return nguoiDungService.findByEmail(auth.getName());
			}
		} catch (Exception e) {
			System.err.println("Error in loggedInUser ModelAttribute: " + e.getMessage());
			// Return null for anonymous users or on error
		}
		return null;
	}
	
	public NguoiDung getSessionUser(HttpServletRequest request) {
		return (NguoiDung) request.getSession().getAttribute("loggedInUser");
	}
	
	@GetMapping("/addSanPham")
	public ResponseObject addToCart(@RequestParam String id, @RequestParam(required = false) String quantity, HttpServletRequest request,HttpServletResponse response) {
		ResponseObject ro = new ResponseObject();
		try {
			// Debug: Print all request parameters
			System.out.println("=== addSanPham Debug ===");
			System.out.println("Request URL: " + request.getRequestURL() + "?" + request.getQueryString());
			System.out.println("Product ID parameter: " + id);
			System.out.println("Quantity parameter (raw): " + quantity);
			System.out.println("Quantity parameter is null: " + (quantity == null));
			System.out.println("Quantity parameter isEmpty: " + (quantity != null && quantity.isEmpty()));
			
			SanPham sp = sanPhamService.getSanPhamById(Long.parseLong(id));
			if(sp == null || sp.getDonViKho() == 0)
			{
				ro.setStatus("false");
				return ro;
			}
			
			// Parse quantity, default to 1 if not provided
			int qty = 1;
			if(quantity != null && !quantity.isEmpty()) {
				try {
					qty = Integer.parseInt(quantity);
					if(qty < 1) qty = 1;
				} catch (NumberFormatException e) {
					System.out.println("Error parsing quantity: " + e.getMessage());
					qty = 1;
				}
			} else {
				System.out.println("Quantity parameter is null or empty, using default: 1");
			}
			System.out.println("Final parsed quantity: " + qty);
			
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			boolean isAnonymous = (auth == null || 
				auth.getPrincipal() == null || 
				"anonymousUser".equals(auth.getPrincipal().toString()) ||
				!auth.isAuthenticated());
			
			if(isAnonymous)    //Su dung cookie de luu
			{
				Cookie clientCookies[] = request.getCookies();
				if(clientCookies != null) {
					boolean found = false;
					for(int i=0;i<clientCookies.length;i++)
					{
						if(clientCookies[i].getName().equals(id))     //Neu san pham da co trong cookie tang so luong
						{				
							int currentQty = 1;
							try {
								currentQty = Integer.parseInt(clientCookies[i].getValue());
							} catch (NumberFormatException e) {
								currentQty = 1;
							}
							System.out.println("Updating existing cookie - old quantity: " + currentQty + ", adding: " + qty);
							clientCookies[i].setValue(Integer.toString(currentQty + qty));
							clientCookies[i].setPath("/iphoneshop");
							clientCookies[i].setMaxAge(60*60*24*7);
							response.addCookie(clientCookies[i]);
							System.out.println("Final cookie quantity: " + clientCookies[i].getValue());
							found = true;
							break;
						}
					}
					if(!found)   //Neu san pham ko co trong cookie,them vao cookie
					{
						System.out.println("Creating new cookie with quantity: " + qty);
						Cookie c = new Cookie(id, Integer.toString(qty));
						c.setPath("/iphoneshop");
						c.setMaxAge(60*60*24*7);
						response.addCookie(c);
					}
				} else {
					// No cookies, create new one
					System.out.println("No cookies found, creating new cookie with quantity: " + qty);
					Cookie c = new Cookie(id, Integer.toString(qty));
					c.setPath("/iphoneshop");
					c.setMaxAge(60*60*24*7);
					response.addCookie(c);
				}
			} else {     //Su dung database de luu
				NguoiDung currentUser = getSessionUser(request);
				if(currentUser == null) {
					// Try to get from SecurityContext
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
					if(g==null)
					{
						g = new GioHang();
						g.setNguoiDung(currentUser);
						g = gioHangService.save(g);			
					}
					
					ChiMucGioHang c = chiMucGioHangService.getChiMucGioHangBySanPhamAndGioHang(sp,g);
					if(c== null)     //Neu khong tim chi muc gio hang, tao moi
					{
						System.out.println("Creating new cart item with quantity: " + qty);
						c = new ChiMucGioHang();
						c.setGioHang(g);
						c.setSanPham(sp);
						c.setSo_luong(qty);
					}else       //Neu san pham da co trong database tang so luong
					{
						int oldQty = c.getSo_luong();
						System.out.println("Updating existing cart item - old quantity: " + oldQty + ", adding: " + qty);
						c.setSo_luong(c.getSo_luong() + qty);
					}
					c = chiMucGioHangService.saveChiMucGiohang(c);
					System.out.println("Final cart item quantity: " + c.getSo_luong());
				}
			}
			ro.setStatus("success");
			return ro;
		} catch (Exception e) {
			e.printStackTrace();
			ro.setStatus("false");
			return ro;
		}
	}
	
	@GetMapping("/changSanPhamQuanity")
	public ResponseObject changeQuanity(@RequestParam String id,@RequestParam String value,HttpServletRequest request,HttpServletResponse response) {
		ResponseObject ro = new ResponseObject();
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			boolean isAnonymous = (auth == null || 
				auth.getPrincipal() == null || 
				"anonymousUser".equals(auth.getPrincipal().toString()) ||
				!auth.isAuthenticated());
			
			if(isAnonymous)    //Su dung cookie de luu
			{
				Cookie clientCookies[] = request.getCookies();
				if(clientCookies != null) {
					for(int i=0;i<clientCookies.length;i++)
					{
						if(clientCookies[i].getName().equals(id))
						{						
							clientCookies[i].setValue(value);
							clientCookies[i].setPath("/iphoneshop");
							clientCookies[i].setMaxAge(60*60*24*7);
							response.addCookie(clientCookies[i]);
							break;
						}
					}
				}
			} else //Su dung database de luu
			{
				NguoiDung currentUser = getSessionUser(request);
				if(currentUser == null) {
					// Try to get from SecurityContext
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
						SanPham sp = sanPhamService.getSanPhamById(Long.parseLong(id));
						if(sp != null) {
							ChiMucGioHang c = chiMucGioHangService.getChiMucGioHangBySanPhamAndGioHang(sp,g);
							if(c != null) {
								c.setSo_luong(Integer.parseInt(value));
								c = chiMucGioHangService.saveChiMucGiohang(c);
							}
						}
					}
				}
			}
			ro.setStatus("success");
			return ro;
		} catch (Exception e) {
			e.printStackTrace();
			ro.setStatus("false");
			return ro;
		}
	}
	
	@GetMapping("/deleteFromCart")
	public ResponseObject deleteSanPham(@RequestParam String id,HttpServletRequest request,HttpServletResponse response) {
		ResponseObject ro = new ResponseObject();
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			boolean isAnonymous = (auth == null || 
				auth.getPrincipal() == null || 
				"anonymousUser".equals(auth.getPrincipal().toString()) ||
				!auth.isAuthenticated());
			
			if(isAnonymous)    //Su dung cookie de luu
			{
				Cookie clientCookies[] = request.getCookies();
				if(clientCookies != null) {
					for(int i=0;i<clientCookies.length;i++)
					{
						if(clientCookies[i].getName().equals(id))
						{						
							clientCookies[i].setMaxAge(0);
							clientCookies[i].setPath("/iphoneshop");
							response.addCookie(clientCookies[i]);
							break;
						}
					}
				}
			} else //Su dung database de luu
			{
				NguoiDung currentUser = getSessionUser(request);
				if(currentUser == null) {
					// Try to get from SecurityContext
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
						SanPham sp = sanPhamService.getSanPhamById(Long.parseLong(id));
						if(sp != null) {
							ChiMucGioHang c = chiMucGioHangService.getChiMucGioHangBySanPhamAndGioHang(sp,g);
							if(c != null) {
								chiMucGioHangService.deleteChiMucGiohang(c);
							}
						}
					}
				}
			}
			
			ro.setStatus("success");
			return ro;
		} catch (Exception e) {
			e.printStackTrace();
			ro.setStatus("false");
			return ro;
		}
	}
	
	@GetMapping("/items")
	public org.springframework.http.ResponseEntity<Map<String, Object>> getCartItems(HttpServletRequest request) {
		Map<String, Object> result = new HashMap<>();
		List<Map<String, Object>> cartItems = new ArrayList<>();
		Map<String, String> quantities = new HashMap<>();
		
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			boolean isAnonymous = (auth == null || 
				auth.getPrincipal() == null || 
				"anonymousUser".equals(auth.getPrincipal().toString()) ||
				!auth.isAuthenticated());
			
			if(isAnonymous) {
				// Load from cookies for anonymous users
				Cookie[] cookies = request.getCookies();
				if(cookies != null) {
					Set<Long> productIds = new HashSet<>();
					for(Cookie cookie : cookies) {
						if(cookie != null) {
							String name = cookie.getName();
							if(name != null && name.matches("^\\d+$")) {
								try {
									productIds.add(Long.parseLong(name));
									String value = cookie.getValue();
									if(value != null) {
										quantities.put(name, value);
									}
								} catch (NumberFormatException e) {
									// Skip invalid cookie names
									System.err.println("Invalid cookie name: " + name);
								}
							}
						}
					}
					
					if(!productIds.isEmpty()) {
						try {
							List<SanPham> products = sanPhamService.getAllSanPhamByList(productIds);
							if(products != null) {
								for(SanPham product : products) {
									if(product != null) {
										Map<String, Object> item = new HashMap<>();
										item.put("id", product.getId());
										item.put("tenSanPham", product.getTenSanPham() != null ? product.getTenSanPham() : "");
										item.put("donGia", product.getDonGia());
										item.put("donViKho", product.getDonViKho());
										item.put("hinhAnhUrl", product.getHinhAnhUrl() != null ? product.getHinhAnhUrl() : "");
										item.put("chip", product.getChip() != null ? product.getChip() : "");
										item.put("dungLuong", product.getDungLuong() != null ? product.getDungLuong() : "");
										item.put("mauSac", product.getMauSac() != null ? product.getMauSac() : "");
										cartItems.add(item);
									}
								}
							}
						} catch (Exception e) {
							System.err.println("Error loading products from list: " + e.getMessage());
							e.printStackTrace();
						}
					}
				}
			} else {
				// Load from database for logged in users
				NguoiDung currentUser = getSessionUser(request);
				if(currentUser == null) {
					// Try to get from SecurityContext
					String email = auth.getName();
					if(email != null && !email.equals("anonymousUser")) {
						try {
							currentUser = nguoiDungService.findByEmail(email);
							if(currentUser != null) {
								request.getSession().setAttribute("loggedInUser", currentUser);
							}
						} catch (Exception e) {
							System.err.println("Error getting user from email: " + e.getMessage());
							e.printStackTrace();
						}
					}
				}
				
				if(currentUser != null) {
					try {
						GioHang g = gioHangService.getGioHangByNguoiDung(currentUser);
						if(g != null) {
							List<ChiMucGioHang> chiMucList = null;
							try {
								chiMucList = chiMucGioHangService.getChiMucGioHangByGioHang(g);
							} catch (org.springframework.orm.jpa.JpaObjectRetrievalFailureException | jakarta.persistence.EntityNotFoundException e) {
								// If loading fails due to missing product, try to clean up and retry
								System.err.println("Error loading cart items (likely due to deleted product): " + e.getMessage());
								// Return empty cart for now - cleanup will happen on next successful load
								chiMucList = new ArrayList<>();
							} catch (Exception e) {
								System.err.println("Error loading cart items: " + e.getMessage());
								e.printStackTrace();
								chiMucList = new ArrayList<>();
							}
							
							if(chiMucList != null && !chiMucList.isEmpty()) {
								List<ChiMucGioHang> invalidItems = new ArrayList<>();
								for(ChiMucGioHang chiMuc : chiMucList) {
									if(chiMuc != null) {
										try {
											// Try to access SanPham - this will throw exception if product doesn't exist
											SanPham product = chiMuc.getSanPham();
											if(product != null) {
												// Verify product still exists in database
												SanPham verifiedProduct = sanPhamService.getSanPhamById(product.getId());
												if(verifiedProduct != null) {
													Map<String, Object> item = new HashMap<>();
													item.put("id", product.getId());
													item.put("tenSanPham", product.getTenSanPham() != null ? product.getTenSanPham() : "");
													item.put("donGia", product.getDonGia());
													item.put("donViKho", product.getDonViKho());
													item.put("hinhAnhUrl", product.getHinhAnhUrl() != null ? product.getHinhAnhUrl() : "");
													item.put("chip", product.getChip() != null ? product.getChip() : "");
													item.put("dungLuong", product.getDungLuong() != null ? product.getDungLuong() : "");
													item.put("mauSac", product.getMauSac() != null ? product.getMauSac() : "");
													cartItems.add(item);
													quantities.put(String.valueOf(product.getId()), String.valueOf(chiMuc.getSo_luong()));
												} else {
													// Product doesn't exist, mark for deletion
													invalidItems.add(chiMuc);
												}
											} else {
												// SanPham is null, mark for deletion
												invalidItems.add(chiMuc);
											}
										} catch (org.springframework.orm.jpa.JpaObjectRetrievalFailureException | jakarta.persistence.EntityNotFoundException e) {
											// Product was deleted, mark cart item for deletion
											System.err.println("Product not found for cart item, will be removed: " + chiMuc.getId());
											invalidItems.add(chiMuc);
										} catch (Exception e) {
											// Other errors, skip this item
											System.err.println("Error processing cart item: " + e.getMessage());
											e.printStackTrace();
										}
									}
								}
								// Clean up invalid cart items
								if(!invalidItems.isEmpty()) {
									try {
										chiMucGioHangService.deleteAllChiMucGiohang(invalidItems);
										System.out.println("Cleaned up " + invalidItems.size() + " invalid cart items");
									} catch (Exception e) {
										System.err.println("Error cleaning up invalid cart items: " + e.getMessage());
									}
								}
							}
						}
					} catch (Exception e) {
						System.err.println("Error loading cart from database: " + e.getMessage());
						e.printStackTrace();
					}
				}
			}
		} catch (Exception e) {
			System.err.println("Error in getCartItems: " + e.getMessage());
			e.printStackTrace();
			// Return empty cart on error instead of throwing exception
		}
		
		// Always return valid response, even if empty
		result.put("items", cartItems != null ? cartItems : new ArrayList<>());
		result.put("quantities", quantities != null ? quantities : new HashMap<>());
		
		// Calculate total count from quantities (sum of all quantities)
		int totalCount = 0;
		if(quantities != null && !quantities.isEmpty()) {
			for(String qty : quantities.values()) {
				try {
					totalCount += Integer.parseInt(qty);
				} catch (NumberFormatException e) {
					// Skip invalid quantity values
				}
			}
		}
		// If no quantities, use item count as fallback
		if(totalCount == 0 && cartItems != null) {
			totalCount = cartItems.size();
		}
		result.put("count", totalCount);
		
		// Wrap in ResponseEntity to ensure proper error handling
		try {
			return org.springframework.http.ResponseEntity.ok(result);
		} catch (Exception e) {
			System.err.println("=== ERROR serializing cart items response ===");
			System.err.println("Exception type: " + e.getClass().getName());
			System.err.println("Exception message: " + e.getMessage());
			e.printStackTrace();
			
			// Return empty cart on serialization error
			Map<String, Object> emptyResult = new HashMap<>();
			emptyResult.put("items", new ArrayList<>());
			emptyResult.put("quantities", new HashMap<>());
			emptyResult.put("count", 0);
			return org.springframework.http.ResponseEntity.ok(emptyResult);
		}
	}
}
