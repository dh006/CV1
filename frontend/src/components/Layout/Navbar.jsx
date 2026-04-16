import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";
import { productAPI, BASE_URL } from "../../services/api";

// 1. Component Icon (Giữ nguyên)
const Icon = ({ name }) => {
  const icons = {
    search: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    user: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    map: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    cart: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    chevronDown: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ marginLeft: 4 }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
  };
  return icons[name] || null;
};

// 2. Component TooltipBtn (Giữ nguyên)
const TooltipBtn = ({ iconName, label, badge, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      style={styles.iconBtn}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <Icon name={iconName} />
      {badge !== undefined && badge > 0 && (
        <span style={styles.cartBadge}>{badge}</span>
      )}
      {isHovered && (
        <div style={styles.tooltip}>
          {label}
          <div style={styles.tooltipArrow}></div>
        </div>
      )}
    </div>
  );
};

// 3. MegaMenuLink — đồng màu navy
const MegaMenuLink = ({ to, children, isRed }) => {
  const [hover, setHover] = useState(false);
  const linkStyle = {
    textDecoration: "none",
    color: isRed ? (hover ? "#a01015" : "#d71920") : hover ? "#001C40" : "#555",
    fontSize: "13px",
    transition: "all 0.15s ease",
    fontWeight: hover ? "600" : "400",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    paddingLeft: hover ? "6px" : "0",
  };
  return (
    <Link
      to={to}
      style={linkStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && <span style={{ color: "#001C40", fontSize: "10px" }}>›</span>}
      {children}
    </Link>
  );
};

// 4. NavMenuLink — underline animation khi hover
const NavMenuLink = ({ to, children, isRed, hasArrow }) => {
  const [hover, setHover] = useState(false);
  const style = {
    textDecoration: "none",
    color: isRed ? "#d71920" : hover ? "#001C40" : "#333",
    display: "flex",
    alignItems: "center",
    height: "64px",
    borderBottom: hover ? "2px solid #001C40" : "2px solid transparent",
    transition: "all 0.2s ease",
    fontWeight: hover ? "700" : "600",
    paddingBottom: "0",
  };
  return (
    <Link
      to={to}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      {hasArrow && <Icon name="chevronDown" />}
    </Link>
  );
};

// ── UserDropdown: hiện khi đã đăng nhập ──────────────────────────────────────
const UserDropdown = ({ user, onLogout, navigate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = (user?.fullName || user?.name || "U").charAt(0).toUpperCase();
  const displayName = user?.fullName || user?.name || "Tài khoản";

  // Nhấp vào avatar → vào profile ngay
  const handleClick = () => {
    navigate("/profile");
  };

  return (
    <div ref={ref} style={ud.wrap}>
      {/* AVATAR BUTTON — nhấp → profile, hover → dropdown */}
      <div
        style={ud.trigger}
        onClick={handleClick}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        title={displayName}
      >
        {/* Avatar tròn đẹp thay icon user */}
        <div style={ud.avatar}>
          {user?.avatar ? (
            <img src={user.avatar} alt={displayName} style={ud.avatarImg} />
          ) : (
            <span style={ud.avatarInitial}>{initial}</span>
          )}
        </div>
        {/* Chấm xanh online */}
        <span style={ud.onlineDot} />
      </div>

      {/* DROPDOWN — chỉ hiện khi hover */}
      {open && (
        <div
          style={ud.panel}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {/* HEADER */}
          <div style={ud.panelHeader}>
            <div style={ud.bigAvatar}>
              {user?.avatar ? (
                <img src={user.avatar} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              ) : (
                initial
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={ud.panelName}>{displayName}</p>
              <p style={ud.panelEmail}>{user?.email || ""}</p>
            </div>
          </div>

          <div style={ud.divider} />

          <Link to="/profile" style={ud.item} onClick={() => setOpen(false)}>
            <span style={ud.itemIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            Thông tin tài khoản
          </Link>
          <Link to="/my-orders" style={ud.item} onClick={() => setOpen(false)}>
            <span style={ud.itemIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </span>
            Đơn hàng của tôi
          </Link>
          {(user?.role === 1 || user?.role === 2) && (
            <Link
              to={user?.role === 2 ? "/admin/orders" : "/admin/dashboard"}
              style={{ ...ud.item, color: "#1d4ed8" }}
              onClick={() => setOpen(false)}
            >
              <span style={{ ...ud.itemIcon, color: "#1d4ed8" }}>
                {user?.role === 2 ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                )}
              </span>
              {user?.role === 2 ? "Khu vực Sale (đơn hàng)" : "Trang quản trị Admin"}
            </Link>
          )}

          <div style={ud.divider} />

          <button style={ud.logoutBtn} onClick={() => { setOpen(false); onLogout(); }}>
            <span style={ud.itemIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </span>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

const ud = {
  wrap: { position: "relative", display: "flex", alignItems: "center" },
  trigger: { cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  // Avatar tròn đẹp
  avatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "linear-gradient(135deg, #001C40 0%, #1890ff 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,28,64,0.25)",
    transition: "transform 0.2s, box-shadow 0.2s",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarInitial: { color: "#fff", fontWeight: "800", fontSize: "15px", letterSpacing: "0.5px" },
  onlineDot: {
    position: "absolute", bottom: "0px", right: "0px",
    width: "10px", height: "10px", borderRadius: "50%",
    background: "#10b981", border: "2px solid #fff",
  },
  // Dropdown panel
  panel: {
    position: "absolute", top: "calc(100% + 12px)", right: "-8px",
    width: "230px", background: "#fff",
    borderRadius: "14px", boxShadow: "0 8px 30px rgba(0,0,0,0.13)",
    border: "1px solid #f0f0f0", zIndex: 9999,
    overflow: "hidden",
  },
  panelHeader: {
    padding: "14px 16px", display: "flex", alignItems: "center", gap: "11px",
    background: "linear-gradient(135deg,#001C40,#003080)",
  },
  bigAvatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "rgba(255,255,255,0.2)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "800", fontSize: "17px", flexShrink: 0,
    border: "2px solid rgba(255,255,255,0.3)",
  },
  panelName: { fontSize: "13px", fontWeight: "700", color: "#fff", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  panelEmail: { fontSize: "11px", color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  divider: { height: "1px", background: "#f3f4f6" },
  item: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "11px 16px", fontSize: "13px", fontWeight: "500",
    color: "#374151", textDecoration: "none",
    transition: "background 0.15s",
  },
  itemIcon: { color: "#6b7280", display: "flex", alignItems: "center", width: "18px" },
  logoutBtn: {
    width: "100%", display: "flex", alignItems: "center", gap: "10px",
    padding: "11px 16px", fontSize: "13px", fontWeight: "500",
    color: "#dc2626", background: "none", border: "none",
    cursor: "pointer", textAlign: "left",
  },
};

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // Lấy dữ liệu từ CartContext
  const {
    totalCount,
    showCartNotification,
    lastAddedProduct,
    setShowCartNotification,
  } = useContext(CartContext);

  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showDenimMenu, setShowDenimMenu] = useState(false);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounce search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await productAPI.getAll({ name: searchQuery.trim(), limit: 8 });
        setSearchResults(res.data?.data || res.data || []);
      } catch { setSearchResults([]); }
      finally { setSearchLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleResultClick = (slug) => {
    navigate(`/products/${slug}`);
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const getImg = (img) => img ? (img.startsWith("http") ? img : `${BASE_URL}${img}`) : "https://via.placeholder.com/50x66";

  return (
    <div style={{ width: "100%" }}>
      {/* ===== TOP BAR ===== */}
      <div style={styles.topBar}>
        <div className="marquee">
          <div className="marquee-track">
            <span>
              🔥 Mua 02 sản phẩm quần Jeans tặng 1 set quà | VOUCHER 10% TỐI ĐA
              10K | VOUCHER 20K ĐƠN TỪ 499K | 🚛 Freeship đơn từ 399k
            </span>
            <span>
              🔥 Mua 02 sản phẩm quần Jeans tặng 1 set quà | VOUCHER 10% TỐI ĐA
              10K | VOUCHER 20K ĐƠN TỪ 499K | 🚛 Freeship đơn từ 399k
            </span>
            <span>
              🔥 Mua 02 sản phẩm quần Jeans tặng 1 set quà | VOUCHER 10% TỐI ĐA
              10K | VOUCHER 20K ĐƠN TỪ 499K | 🚛 Freeship đơn từ 399k
            </span>
            <span>
              🔥 Mua 02 sản phẩm quần Jeans tặng 1 set quà | VOUCHER 10% TỐI ĐA
              10K | VOUCHER 20K ĐƠN TỪ 499K | 🚛 Freeship đơn từ 399k
            </span>
          </div>
        </div>
      </div>

      {/* ===== NAV ===== */}
      <nav
        style={{
          ...styles.nav,
          boxShadow: isScrolled ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <Link to="/" style={styles.logoLink}>
          <div style={styles.logo}>∂ιєρ ¢σℓℓє¢тιση</div>
        </Link>

        {/* MENU */}
        <ul style={styles.menu}>
          {/* 1. SẢN PHẨM */}
          <li
            style={styles.menuItem}
            onMouseEnter={() => setShowProductMenu(true)}
            onMouseLeave={() => setShowProductMenu(false)}
          >
            <NavMenuLink to="/products" hasArrow={true}>Sản phẩm</NavMenuLink>
            {showProductMenu && (
              <div style={styles.megaMenuContainer}>
                <div style={styles.megaMenuContent}>
                  <div style={styles.megaColumn}>
                    <h4 style={styles.megaTitle}>TẤT CẢ</h4>
                    <MegaMenuLink to="/new">✦ Sản Phẩm Mới</MegaMenuLink>
                    <MegaMenuLink to="/best-seller">🔥 Bán Chạy Nhất</MegaMenuLink>
                    <MegaMenuLink to="/outlet" isRed={true}>💸 OUTLET — Sale 50%</MegaMenuLink>
                  </div>
                  <div style={styles.megaColumn}>
                    <Link to="/collections/ao-nam" style={{ textDecoration: "none" }}>
                      <h4 style={styles.megaTitle}>ÁO NAM</h4>
                    </Link>
                    <MegaMenuLink to="/collections/ao-thun">Áo Thun</MegaMenuLink>
                    <MegaMenuLink to="/collections/ao-polo">Áo Polo</MegaMenuLink>
                    <MegaMenuLink to="/collections/somi">Áo Sơ mi</MegaMenuLink>
                    <MegaMenuLink to="/collections/ao-khoac">Áo Khoác</MegaMenuLink>
                    <MegaMenuLink to="/collections/ao-ni-len">Áo Nỉ & Len</MegaMenuLink>
                    <MegaMenuLink to="/collections/ao-hoodie">Áo Hoodie</MegaMenuLink>
                    <MegaMenuLink to="/collections/ao-balo">Tank Top</MegaMenuLink>
                    <MegaMenuLink to="/collections/setdo">Set Đồ</MegaMenuLink>
                  </div>
                  <div style={styles.megaColumn}>
                    <Link to="/collections/quan-nam" style={{ textDecoration: "none" }}>
                      <h4 style={styles.megaTitle}>QUẦN NAM</h4>
                    </Link>
                    <MegaMenuLink to="/collections/quan-jeans">Quần Jean</MegaMenuLink>
                    <MegaMenuLink to="/collections/quan-short">Quần Short</MegaMenuLink>
                    <MegaMenuLink to="/collections/quan-kaki">Quần Kaki</MegaMenuLink>
                    <MegaMenuLink to="/collections/quan-jogger">Quần Jogger</MegaMenuLink>
                    <MegaMenuLink to="/collections/quan-tay">Quần Tây</MegaMenuLink>
                    <MegaMenuLink to="/collections/quan-boxer">Quần Boxer</MegaMenuLink>
                    <MegaMenuLink to="/collections/set-do-quan">Set Đồ</MegaMenuLink>
                  </div>
                  <div style={styles.megaColumn}>
                    <Link to="/collections/phu-kien" style={{ textDecoration: "none" }}>
                      <h4 style={styles.megaTitle}>PHỤ KIỆN</h4>
                    </Link>
                    <MegaMenuLink to="/collections/giay-dep">Giày & Dép</MegaMenuLink>
                    <MegaMenuLink to="/collections/balo-tui">Balo & Túi</MegaMenuLink>
                    <MegaMenuLink to="/collections/non">Nón</MegaMenuLink>
                    <MegaMenuLink to="/collections/that-lung">Thắt Lưng</MegaMenuLink>
                    <MegaMenuLink to="/collections/vo">Vớ</MegaMenuLink>
                    <MegaMenuLink to="/collections/mat-kinh">Mắt Kính</MegaMenuLink>
                  </div>
                  <div style={styles.megaImages}>
                    <Link to="/collections/thu-dong" style={styles.imageWrapper}>
                      <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400" alt="Autumn" style={styles.promoImg} />
                      <span style={styles.imageText}>Đồ Thu Đông</span>
                    </Link>
                    <Link to="/gioi-thieu" style={styles.imageWrapper}>
                      <img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400" alt="Sports" style={styles.promoImg} />
                      <span style={styles.imageText}>Retro Sports</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* 2. HÀNG MỚI */}
          <li style={styles.menuItem}>
            <NavMenuLink to="/new">Hàng Mới</NavMenuLink>
            <span style={styles.badgeNew}>NEW</span>
          </li>

          {/* 3. HÀNG BÁN CHẠY */}
          <li style={styles.menuItem}>
            <NavMenuLink to="/best-seller">Bán Chạy</NavMenuLink>
          </li>

          {/* 4. DENIM */}
          <li
            style={styles.menuItem}
            onMouseEnter={() => setShowDenimMenu(true)}
            onMouseLeave={() => setShowDenimMenu(false)}
          >
            <NavMenuLink to="/denim" hasArrow={true}>Denim</NavMenuLink>
            {showDenimMenu && (
              <div style={styles.megaMenuContainer}>
                <div style={styles.megaMenuContent}>
                  <div style={styles.megaColumn}>
                    <h4 style={styles.megaTitle}>JEANS</h4>
                    <MegaMenuLink to="/collections/quan-jeans">Quần Jeans</MegaMenuLink>
                    <MegaMenuLink to="/collections/quan-short">Quần Short Jeans</MegaMenuLink>
                    <MegaMenuLink to="/collections/ao-khoac-jeans">Áo Khoác Jeans</MegaMenuLink>
                  </div>
                  <div style={styles.megaColumn}>
                    <h4 style={styles.megaTitle}>SIGNATURE</h4>
                    <MegaMenuLink to="/collections/airflex">AIRFLEX™</MegaMenuLink>
                    <MegaMenuLink to="/collections/procool">ProCOOL++™</MegaMenuLink>
                    <MegaMenuLink to="/collections/smart-jeans">SMART JEANS™</MegaMenuLink>
                  </div>
                  <div style={styles.megaColumn}>
                    <h4 style={styles.megaTitle}>FORM DÁNG</h4>
                    <MegaMenuLink to="/form/smart-fit">Smart-Fit</MegaMenuLink>
                    <MegaMenuLink to="/form/straight">Straight</MegaMenuLink>
                    <MegaMenuLink to="/form/slim-fit">Slim-Fit</MegaMenuLink>
                  </div>
                  <div style={styles.denimImages}>
                    <div style={styles.denimImageRow}>
                      <Link to="/collections/airflex" style={styles.denimImageWrapper}>
                        <img src="https://file.hstatic.net/1000360022/file/icon105_41765d0f214240598bd4a71ddbc24557.jpg" alt="Airflex" style={styles.promoImg} />
                        <span style={styles.imageTextSmall}>AIRFLEX</span>
                      </Link>
                      <Link to="/collections/procool" style={styles.denimImageWrapper}>
                        <img src="https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=300" alt="Procool" style={styles.promoImg} />
                        <span style={styles.imageTextSmall}>ProCOOL</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* 5. OUTLET */}
          <li style={styles.menuItem}>
            <NavMenuLink to="/outlet" isRed={true}>Outlet</NavMenuLink>
            <span style={styles.badgeSale}>-50%</span>
          </li>

          {/* 6. COLLECTION */}
          <li
            style={styles.menuItem}
            onMouseEnter={() => setShowCollectionMenu(true)}
            onMouseLeave={() => setShowCollectionMenu(false)}
          >
            <NavMenuLink to="/collections" hasArrow={true}>Collection</NavMenuLink>
            {showCollectionMenu && (
              <div style={styles.megaMenuContainer}>
                <div style={styles.collectionContainer}>
                  <div style={styles.collectionMenuContent}>
                    <div style={styles.collectionItem}>
                      <Link to="/collections/airflex" style={styles.collectionImgWrapper}>
                        <img src="https://cdn.hstatic.net/files/1000360022/file/thumbnail_-_airflex_collection.jpg" alt="Airflex" style={styles.collectionImg} />
                      </Link>
                      <h4 style={styles.collectionTitle}>AIRFLEX™</h4>
                      <Link to="/collections/airflex" style={styles.collectionLink}>Xem ngay</Link>
                    </div>
                    <div style={styles.collectionItem}>
                      <Link to="/collections/retro-sports" style={styles.collectionImgWrapper}>
                        <img src="https://cdn.hstatic.net/files/1000360022/file/_nh_menu_m_i_ngang_-_1500x100__3_.jpg" alt="Retro Sports" style={styles.collectionImg} />
                      </Link>
                      <h4 style={styles.collectionTitle}>Retro Sports</h4>
                      <Link to="/collections/retro-sports" style={styles.collectionLink}>Xem ngay</Link>
                    </div>
                    <div style={styles.collectionItem}>
                      <Link to="/collections/snoopy" style={styles.collectionImgWrapper}>
                        <img src="https://cdn.hstatic.net/files/1000360022/file/snoopy_6af2e5a7afa843f6be70b5dc668c9554.jpg" alt="Snoopy" style={styles.collectionImg} />
                      </Link>
                      <h4 style={styles.collectionTitle}>Snoopy</h4>
                      <Link to="/collections/snoopy" style={styles.collectionLink}>Xem ngay</Link>
                    </div>
                  </div>
                  <div style={styles.collectionFooter}>
                    <Link to="/collections" style={styles.viewAllBtn}>Xem tất cả →</Link>
                    <Link to="/gioi-thieu" style={{ ...styles.viewAllBtn, background: "#001C40", color: "#fff", border: "none", marginLeft: "10px" }}>Về DIEP COLLECTION</Link>
                  </div>
                </div>
              </div>
            )}
          </li>
        </ul>

        {/* ICONS */}
        <div style={styles.actions}>
          <TooltipBtn
            iconName="search"
            label="Tìm kiếm"
            onClick={() => setShowSearch(!showSearch)}
          />

          {/* USER ICON — đã đăng nhập: dropdown, chưa: link login */}
          {user ? (
            <UserDropdown user={user} onLogout={logout} navigate={navigate} />
          ) : (
            <Link to="/login" style={{ textDecoration: "none" }}>
              <TooltipBtn iconName="user" label="Đăng nhập" />
            </Link>
          )}

          <Link to="/he-thong-cua-hang" style={{ textDecoration: "none" }}>
            <TooltipBtn iconName="map" label="Cửa hàng" />
          </Link>

          <div style={{ position: "relative" }}>
            {/* Nhấn icon cart → chuyển thẳng trang /cart */}
            <div onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>
              <TooltipBtn iconName="cart" label="Giỏ hàng" badge={totalCount} />
            </div>
          </div>
        </div>

        {/* THANH TÌM KIẾM TRƯỢT XUỐNG */}
        {showSearch && (
          <div style={styles.searchDropdown}>
            <div style={styles.searchContent}>
              <form onSubmit={handleSearchSubmit} style={styles.searchField}>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  style={styles.searchInput}
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" style={styles.searchIconBtn}>
                  <Icon name="search" />
                </button>
              </form>

              {/* KẾT QUẢ TÌM KIẾM */}
              {searchQuery.trim() ? (
                <div style={styles.searchResultsWrap}>
                  {searchLoading ? (
                    <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", padding: "16px" }}>Đang tìm...</p>
                  ) : searchResults.length > 0 ? (
                    <>
                      <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "10px" }}>{searchResults.length} kết quả cho "<strong>{searchQuery}</strong>"</p>
                      <div style={styles.resultList}>
                        {searchResults.map((p) => (
                          <div key={p.id} style={styles.resultItem} onClick={() => handleResultClick(p.slug || String(p.id))}>
                            <img src={getImg(p.image)} alt={p.name} style={styles.resultImg} onError={(e) => { e.target.src = "https://via.placeholder.com/50x66"; }} />
                            <div style={styles.resultInfo}>
                              <p style={styles.resultName}>{p.name}</p>
                              <p style={styles.resultCat}>{p.Category?.name || ""}</p>
                              <p style={styles.resultPrice}>{Number(p.price).toLocaleString()}đ</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", padding: "16px" }}>Không tìm thấy sản phẩm nào</p>
                  )}
                </div>
              ) : (
                <div style={styles.quickSearch}>
                  <p style={styles.quickTitle}>Từ khóa nổi bật hôm nay</p>
                  <div style={styles.tagGroup}>
                    {["Áo thun", "Áo polo", "Quần short", "Áo khoác", "Quần tây", "Smartjean"].map((tag) => (
                      <span key={tag} style={styles.tag} onClick={() => setSearchQuery(tag)}
                        onMouseEnter={(e) => { e.target.style.borderColor = "#001C40"; e.target.style.color = "#001C40"; }}
                        onMouseLeave={(e) => { e.target.style.borderColor = "#ddd"; e.target.style.color = "#333"; }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button style={styles.closeSearch} onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchResults([]); }}>✕</button>
          </div>
        )}
      </nav>
    </div>
  );
};

// ===== STYLES =====
const styles = {
  topBar: {
    backgroundColor: "#001C40",
    color: "#fff",
    padding: "10px 0",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    overflow: "hidden",
    letterSpacing: "0.3px",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "0 40px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e8e8e8",
    position: "relative",
    height: "64px",
  },
  logoLink: { textDecoration: "none" },
  logo: {
    fontSize: "1.6rem",
    fontWeight: "800",
    color: "#001C40",
    letterSpacing: "1px",
  },
  menu: {
    display: "flex",
    listStyle: "none",
    gap: "32px",
    margin: 0,
    padding: 0,
    alignItems: "center",
    height: "100%",
  },
  menuItem: {
    position: "relative",
    fontWeight: "600",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  // Badge NEW — navy nhỏ gọn
  badgeNew: {
    position: "absolute",
    top: "10px",
    right: "-22px",
    backgroundColor: "#001C40",
    color: "#fff",
    fontSize: "8px",
    padding: "2px 5px",
    borderRadius: "3px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    pointerEvents: "none",
  },
  // Badge SALE — đỏ nhỏ
  badgeSale: {
    position: "absolute",
    top: "10px",
    right: "-28px",
    backgroundColor: "#d71920",
    color: "#fff",
    fontSize: "8px",
    padding: "2px 5px",
    borderRadius: "3px",
    fontWeight: "800",
    pointerEvents: "none",
  },
  actions: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  iconBtn: {
    cursor: "pointer",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#001C40",
    transition: "opacity 0.2s",
  },
  tooltip: {
    position: "absolute",
    top: "130%",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#001C40",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    whiteSpace: "nowrap",
    zIndex: 200,
    boxShadow: "0 4px 12px rgba(0,28,64,0.2)",
    fontWeight: "500",
  },
  tooltipArrow: {
    position: "absolute",
    top: "-4px",
    left: "50%",
    marginLeft: "-4px",
    borderWidth: "4px",
    borderStyle: "solid",
    borderColor: "transparent transparent #001C40 transparent",
  },
  cartBadge: {
    backgroundColor: "#d71920",
    color: "#fff",
    borderRadius: "50%",
    width: "17px",
    height: "17px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "9px",
    position: "absolute",
    top: "-6px",
    right: "-6px",
    fontWeight: "800",
    border: "1.5px solid white",
  },
  // Mega menu
  megaMenuContainer: {
    position: "fixed",
    top: "100px", // topbar(36px) + nav(64px)
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(1100px, 96vw)",
    backgroundColor: "#fff",
    boxShadow: "0 8px 32px rgba(0,28,64,0.12)",
    zIndex: 9998,
    borderTop: "3px solid #001C40",
    padding: "28px 32px",
    borderRadius: "0 0 12px 12px",
  },
  megaMenuContent: { display: "flex", gap: "0", justifyContent: "space-between" },
  megaColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: "160px",
  },
  megaTitle: {
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "8px",
    color: "#001C40",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: "2px solid #001C40",
    paddingBottom: "8px",
  },
  megaImages: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "220px",
  },
  imageWrapper: {
    position: "relative",
    borderRadius: "8px",
    overflow: "hidden",
    height: "110px",
    display: "block",
    cursor: "pointer",
  },
  promoImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s",
  },
  imageText: {
    position: "absolute",
    bottom: "8px",
    left: "10px",
    color: "white",
    fontWeight: "700",
    fontSize: "12px",
    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
  },
  denimImages: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "260px",
  },
  denimImageRow: { display: "flex", gap: "10px" },
  denimImageWrapper: {
    position: "relative",
    borderRadius: "8px",
    overflow: "hidden",
    height: "90px",
    width: "120px",
    display: "block",
    cursor: "pointer",
  },
  imageTextSmall: {
    position: "absolute",
    bottom: "5px",
    left: "6px",
    color: "white",
    fontWeight: "700",
    fontSize: "10px",
    textShadow: "0 1px 2px rgba(0,0,0,0.8)",
  },
  collectionContainer: { display: "flex", flexDirection: "column" },
  collectionMenuContent: {
    display: "flex",
    gap: "24px",
    padding: "8px",
    justifyContent: "space-between",
  },
  collectionItem: {
    flex: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  collectionImgWrapper: {
    width: "100%",
    height: "260px",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "12px",
    display: "block",
  },
  collectionImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  collectionTitle: {
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "6px",
    color: "#001C40",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  collectionLink: {
    fontSize: "12px",
    color: "#001C40",
    textDecoration: "underline",
    fontWeight: "600",
    cursor: "pointer",
  },
  collectionFooter: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    borderTop: "1px solid #f0f0f0",
    paddingTop: "16px",
  },
  viewAllBtn: {
    padding: "10px 36px",
    border: "1.5px solid #001C40",
    backgroundColor: "#fff",
    color: "#001C40",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderRadius: "6px",
    transition: "all 0.2s",
    display: "inline-block",
    cursor: "pointer",
  },
  searchDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    padding: "30px 0",
    zIndex: 999,
    borderTop: "1px solid #eee",
  },
  searchContent: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  searchField: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #000",
    borderRadius: "25px",
    padding: "5px 20px",
    marginBottom: "20px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "10px",
    fontSize: "16px",
  },
  searchIconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  quickSearch: {
    textAlign: "left",
  },
  quickTitle: {
    fontSize: "15px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#000",
  },
  tagGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  tag: {
    padding: "5px 15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "13px",
    cursor: "pointer",
    backgroundColor: "#fff",
    color: "#333",
    transition: "0.2s",
  },
  closeSearch: {
    position: "absolute",
    right: "40px",
    top: "20px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#999",
  },
  searchResultsWrap: { textAlign: "left", maxHeight: "360px", overflowY: "auto" },
  resultList: { display: "flex", flexDirection: "column", gap: "2px" },
  resultItem: { display: "flex", gap: "12px", padding: "10px 8px", borderRadius: "8px", cursor: "pointer", transition: "background 0.15s", alignItems: "center" },
  resultImg: { width: "44px", height: "58px", objectFit: "cover", borderRadius: "6px", flexShrink: 0, background: "#f3f4f6" },
  resultInfo: { flex: 1, minWidth: 0 },
  resultName: { fontSize: "13px", fontWeight: "600", color: "#1a1a1a", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  resultCat: { fontSize: "11px", color: "#9ca3af", marginBottom: "3px" },
  resultPrice: { fontSize: "13px", fontWeight: "700", color: "#d71920" },
  // --- STYLE CHO THÔNG BÁO POPUP THÊM VÀO GIỎ ---
  notificationPopup: {
    position: "absolute",
    top: "140%",
    right: "-50px",
    width: "350px",
    backgroundColor: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    borderRadius: "8px",
    padding: "16px",
    zIndex: 10000,
    border: "1px solid #eee",
    animation: "slideDown 0.3s ease-out",
  },
  popHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #f0f0f0",
  },
  checkIcon: {
    backgroundColor: "#e8f5e9",
    color: "#4caf50",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    marginRight: "8px",
  },
  popHeaderText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2e7d32",
    flex: 1,
  },
  closeNotify: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#999",
  },
  popBody: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
  },
  popImg: {
    width: "70px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  popInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  popName: {
    fontSize: "13px",
    fontWeight: "bold",
    margin: 0,
    color: "#333",
    textTransform: "uppercase",
  },
  popOption: {
    fontSize: "12px",
    color: "#888",
    margin: 0,
  },
  popPrice: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#001C40",
    margin: 0,
  },
  viewCartAction: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#001C40",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default Navbar;
