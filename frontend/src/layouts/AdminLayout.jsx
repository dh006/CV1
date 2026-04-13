import React, { useState, useEffect, useMemo } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

/** sale: true = hiện cho nhân viên Sale (role 2); Admin (role 1) thấy tất cả */
const ALL_NAV_ITEMS = [
  { path: "/admin/dashboard", label: "Tổng quan", icon: "fa-chart-pie", sale: false },
  { path: "/admin/products", label: "Sản phẩm", icon: "fa-box", sale: false },
  { path: "/admin/categories", label: "Danh mục", icon: "fa-folder", sale: false },
  { path: "/admin/brands", label: "Thương hiệu", icon: "fa-tag", sale: false },
  { path: "/admin/orders", label: "Đơn hàng", icon: "fa-bag-shopping", sale: true },
  { path: "/admin/users", label: "Người dùng", icon: "fa-users", sale: false },
  { path: "/admin/banners", label: "Banner", icon: "fa-image", sale: false },
  { path: "/admin/news", label: "Tin tức", icon: "fa-newspaper", sale: false },
  { path: "/admin/inventory", label: "Kho hàng", icon: "fa-warehouse", sale: false },
  { path: "/admin/vouchers", label: "Voucher", icon: "fa-tag", sale: false },
  { path: "/admin/stats", label: "Doanh thu", icon: "fa-chart-line", sale: false },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [collapsed, setCollapsed] = useState(false);

  const role = Number(user.role);
  const isSale = role === 2;

  const navItems = useMemo(
    () => (isSale ? ALL_NAV_ITEMS.filter((i) => i.sale) : ALL_NAV_ITEMS),
    [isSale]
  );

  useEffect(() => {
    if (!isSale) return;
    const allowedPrefixes = navItems.map((i) => i.path);
    const path = location.pathname;
    const ok = allowedPrefixes.some((p) => path === p || path.startsWith(`${p}/`));
    if (!ok) navigate("/admin/orders", { replace: true });
  }, [isSale, location.pathname, navigate, navItems]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const initial = (user.fullName || "A").charAt(0).toUpperCase();

  const pageLabel =
    navItems.find((n) => isActive(n.path))?.label || (isSale ? "Sale" : "Admin");

  return (
    <div style={s.wrapper}>
      <aside style={{ ...s.sidebar, width: collapsed ? "68px" : "240px" }}>
        <div style={s.brand}>
          {!collapsed && (
            <div style={s.brandInner}>
              <div style={s.brandLogo}>DC</div>
              <div>
                <p style={s.brandName}>DIEP COLLECTION</p>
                <p style={s.brandSub}>{isSale ? "Khu vực Sale" : "Quản trị Admin"}</p>
              </div>
            </div>
          )}
          {collapsed && <div style={s.brandLogoSm}>DC</div>}
        </div>

        <nav style={s.nav}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : ""}
                style={{
                  ...s.navLink,
                  ...(active ? s.navLinkActive : {}),
                  justifyContent: collapsed ? "center" : "flex-start",
                  padding: collapsed ? "12px" : "11px 14px",
                }}
              >
                <i
                  className={`fa-solid ${item.icon}`}
                  style={{
                    ...s.navIcon,
                    marginRight: collapsed ? 0 : "12px",
                    color: active ? "#fff" : "rgba(255,255,255,0.55)",
                  }}
                />
                {!collapsed && <span style={s.navLabel}>{item.label}</span>}
                {!collapsed && active && <span style={s.activeDot} />}
              </Link>
            );
          })}
        </nav>

        <div style={s.sideBottom}>
          <div style={s.divider} />
          <button
            onClick={handleLogout}
            title={collapsed ? "Đăng xuất" : ""}
            style={{
              ...s.logoutBtn,
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "12px" : "11px 14px",
            }}
          >
            <i
              className="fa-solid fa-right-from-bracket"
              style={{ ...s.navIcon, marginRight: collapsed ? 0 : "12px", color: "#f87171" }}
            />
            {!collapsed && <span style={{ color: "#f87171" }}>Đăng xuất</span>}
          </button>

          <button onClick={() => setCollapsed(!collapsed)} style={s.collapseBtn}>
            <i
              className={`fa-solid ${collapsed ? "fa-chevron-right" : "fa-chevron-left"}`}
              style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}
            />
          </button>
        </div>
      </aside>

      <div style={s.main}>
        <header style={s.topbar}>
          <div style={s.topbarLeft}>
            <span style={s.pageTitle}>{pageLabel}</span>
          </div>
          <div style={s.topbarRight}>
            <Link to="/" target="_blank" style={s.viewSiteBtn}>
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: "6px", fontSize: "11px" }} />
              Xem website bán hàng
            </Link>

            <div style={s.userChip}>
              <div style={s.userAvatar}>{initial}</div>
              <div style={s.userMeta}>
                <span style={s.userName}>{user.fullName || "—"}</span>
                <span style={s.userRole}>
                  <i
                    className={`fa-solid ${isSale ? "fa-headset" : "fa-shield-halved"}`}
                    style={{ marginRight: "3px", fontSize: "9px" }}
                  />
                  {isSale ? "Nhân viên Sale" : "Quản trị viên"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main style={s.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const s = {
  wrapper: { display: "flex", minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Inter',sans-serif" },
  sidebar: {
    background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    height: "100vh",
    transition: "width 0.25s ease",
    overflow: "hidden",
    flexShrink: 0,
    boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
  },
  brand: {
    padding: "20px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    minHeight: "72px",
    display: "flex",
    alignItems: "center",
  },
  brandInner: { display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" },
  brandLogo: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "#fff",
    fontWeight: "800",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  brandLogoSm: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "#fff",
    fontWeight: "800",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  brandName: { fontSize: "13px", fontWeight: "700", color: "#fff", margin: 0, whiteSpace: "nowrap" },
  brandSub: { fontSize: "10px", color: "rgba(255,255,255,0.4)", margin: 0 },
  nav: { flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto" },
  navLink: {
    display: "flex",
    alignItems: "center",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500",
    color: "rgba(255,255,255,0.65)",
    transition: "all 0.15s",
    position: "relative",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  navLinkActive: {
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
  },
  navIcon: { fontSize: "14px", flexShrink: 0, width: "16px", textAlign: "center" },
  navLabel: { flex: 1 },
  activeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.6)",
    flexShrink: 0,
  },
  sideBottom: { padding: "0 10px 12px" },
  divider: { height: "1px", background: "rgba(255,255,255,0.06)", margin: "8px 0" },
  logoutBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    background: "rgba(248,113,113,0.08)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  collapseBtn: {
    width: "100%",
    padding: "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "4px",
  },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" },
  topbar: {
    height: "60px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 28px",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 100,
    flexShrink: 0,
  },
  topbarLeft: { display: "flex", alignItems: "center", gap: "12px" },
  pageTitle: { fontSize: "15px", fontWeight: "700", color: "#1a1a1a" },
  topbarRight: { display: "flex", alignItems: "center", gap: "16px" },
  viewSiteBtn: {
    display: "flex",
    alignItems: "center",
    padding: "7px 14px",
    background: "#f3f4f6",
    color: "#374151",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    transition: "background 0.15s",
  },
  userChip: { display: "flex", alignItems: "center", gap: "10px" },
  userAvatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #001C40, #3b82f6)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userMeta: { display: "flex", flexDirection: "column" },
  userName: { fontSize: "13px", fontWeight: "600", color: "#1a1a1a", lineHeight: "1.3" },
  userRole: { fontSize: "10px", color: "#9ca3af", display: "flex", alignItems: "center" },
  content: { flex: 1, padding: "24px", overflowY: "auto" },
};

export default AdminLayout;
