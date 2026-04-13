import React, { useEffect, useState } from "react";
import { statsAPI, orderAPI } from "../../../services/api";
import { Link } from "react-router-dom";

const STATUS_MAP = {
  0: { label: "Chờ xử lý", color: "#b45309", bg: "#fef3c7", icon: "fa-clock" },
  1: { label: "Đang giao",  color: "#1d4ed8", bg: "#dbeafe", icon: "fa-truck" },
  2: { label: "Hoàn thành", color: "#059669", bg: "#d1fae5", icon: "fa-circle-check" },
  3: { label: "Đã hủy",     color: "#dc2626", bg: "#fee2e2", icon: "fa-circle-xmark" },
};

const STAT_CARDS = [
  { key: "totalRevenue",  label: "Doanh thu",    icon: "fa-sack-dollar",  color: "#dbeafe", iconColor: "#2563eb", fmt: (v) => Number(v).toLocaleString() + "đ" },
  { key: "orderCount",    label: "Đơn hàng",     icon: "fa-bag-shopping", color: "#d1fae5", iconColor: "#059669", fmt: (v) => v },
  { key: "totalProducts", label: "Sản phẩm",     icon: "fa-box",          color: "#fef3c7", iconColor: "#d97706", fmt: (v) => v },
  { key: "totalUsers",    label: "Thành viên",   icon: "fa-users",        color: "#ede9fe", iconColor: "#7c3aed", fmt: (v) => v },
];

const QUICK_ACTIONS = [
  { label: "Thêm sản phẩm mới",  icon: "fa-plus",          to: "/admin/products/add",  color: "#2563eb" },
  { label: "Quản lý đơn hàng",   icon: "fa-bag-shopping",  to: "/admin/orders",        color: "#059669" },
  { label: "Quản lý danh mục",   icon: "fa-folder-open",   to: "/admin/categories",    color: "#d97706" },
  { label: "Báo cáo doanh thu",  icon: "fa-chart-line",    to: "/admin/stats",         color: "#7c3aed" },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ summary: { totalRevenue: 0, orderCount: 0, totalProducts: 0, totalUsers: 0, pendingOrders: 0 } });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, oRes] = await Promise.all([
          statsAPI.getDashboard(),
          orderAPI.getAll({ limit: 6 }),
        ]);
        setStats(sRes.data);
        setTopProducts(sRes.data.topProducts || []);
        setRecentOrders((oRes.data?.data || oRes.data || []).slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.spinner} />
      <p style={{ color: "#6b7280", marginTop: "14px", fontSize: "14px" }}>Đang tải dữ liệu...</p>
    </div>
  );

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Tổng quan</h1>
          <p style={s.subtitle}>
            <i className="fa-solid fa-circle" style={{ color: "#10b981", fontSize: "8px", marginRight: "6px" }} />
            Hệ thống đang hoạt động bình thường
          </p>
        </div>
        <Link to="/admin/products/add" style={s.addBtn}>
          <i className="fa-solid fa-plus" style={{ marginRight: "7px" }} />
          Thêm sản phẩm
        </Link>
      </div>

      {/* STAT CARDS */}
      <div style={s.statsGrid}>
        {STAT_CARDS.map((card) => (
          <div key={card.key} style={{ ...s.statCard, background: card.color }}>
            <div style={s.statTop}>
              <div>
                <p style={s.statLabel}>{card.label}</p>
                <p style={s.statValue}>{card.fmt(stats.summary[card.key] ?? 0)}</p>
              </div>
              <div style={{ ...s.statIconWrap, background: card.iconColor }}>
                <i className={`fa-solid ${card.icon}`} style={{ color: "#fff", fontSize: "16px" }} />
              </div>
            </div>
            {card.key === "orderCount" && stats.summary.pendingOrders > 0 && (
              <p style={s.statNote}>
                <i className="fa-solid fa-clock" style={{ marginRight: "4px", color: "#b45309" }} />
                {stats.summary.pendingOrders} đơn chờ xử lý
              </p>
            )}
          </div>
        ))}
      </div>

      {/* MINI CHART DOANH THU 7 NGÀY */}
      {stats.revenueByDay && stats.revenueByDay.length > 0 && (() => {
        const days = stats.revenueByDay;
        const maxRev = Math.max(...days.map((d) => Number(d.revenue || 0)), 1);
        return (
          <div style={{ ...s.card, marginBottom: "20px" }}>
            <div style={s.cardHead}>
              <div style={s.cardTitleWrap}>
                <i className="fa-solid fa-chart-bar" style={{ color: "#6366f1", marginRight: "8px" }} />
                <h3 style={s.cardTitle}>Doanh thu 7 ngày gần nhất</h3>
              </div>
              <Link to="/admin/stats" style={s.viewAll}>
                Chi tiết <i className="fa-solid fa-arrow-right" style={{ marginLeft: "4px", fontSize: "11px" }} />
              </Link>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "100px", padding: "0 4px" }}>
              {days.map((d, i) => {
                const pct = Math.max(6, (Number(d.revenue || 0) / maxRev) * 100);
                const date = new Date(d.day);
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: "100%", height: `${pct}%`, background: "linear-gradient(180deg,#818cf8,#6366f1)", borderRadius: "4px 4px 0 0" }}
                        title={`${Number(d.revenue || 0).toLocaleString()}đ`} />
                    </div>
                    <span style={{ fontSize: "9px", color: "#9ca3af", fontWeight: "600" }}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* CONTENT */}
      <div style={s.grid}>
        {/* ĐƠN HÀNG GẦN ĐÂY */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitleWrap}>
              <i className="fa-solid fa-clock-rotate-left" style={{ color: "#3b82f6", marginRight: "8px" }} />
              <h3 style={s.cardTitle}>Đơn hàng gần đây</h3>
            </div>
            <Link to="/admin/orders" style={s.viewAll}>
              Xem tất cả <i className="fa-solid fa-arrow-right" style={{ marginLeft: "4px", fontSize: "11px" }} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={s.empty}>
              <i className="fa-solid fa-inbox" style={{ fontSize: "32px", color: "#d1d5db" }} />
              <p style={{ color: "#9ca3af", marginTop: "8px" }}>Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Mã đơn</th>
                  <th style={s.th}>Khách hàng</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Tổng tiền</th>
                  <th style={{ ...s.th, textAlign: "center" }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const st = STATUS_MAP[order.status] || STATUS_MAP[0];
                  return (
                    <tr key={order.id} style={s.tr}>
                      <td style={s.td}>
                        <span style={s.orderCode}>#{order.orderCode}</span>
                      </td>
                      <td style={s.td}>
                        <p style={s.orderName}>{order.fullName}</p>
                        <p style={s.orderPhone}>{order.phone}</p>
                      </td>
                      <td style={{ ...s.td, textAlign: "right", fontWeight: "700" }}>
                        {Number(order.totalPrice).toLocaleString()}đ
                      </td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <span style={{ ...s.badge, color: st.color, background: st.bg }}>
                          <i className={`fa-solid ${st.icon}`} style={{ marginRight: "4px", fontSize: "9px" }} />
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* SIDE PANEL */}
        <div style={s.side}>
          {/* THAO TÁC NHANH */}
          <div style={s.card}>
            <div style={s.cardHead}>
              <div style={s.cardTitleWrap}>
                <i className="fa-solid fa-bolt" style={{ color: "#f59e0b", marginRight: "8px" }} />
                <h3 style={s.cardTitle}>Thao tác nhanh</h3>
              </div>
            </div>
            <div style={s.quickList}>
              {QUICK_ACTIONS.map((a, i) => (
                <Link key={i} to={a.to} style={s.quickItem}>
                  <div style={{ ...s.quickIconWrap, background: a.color + "18", border: `1px solid ${a.color}30` }}>
                    <i className={`fa-solid ${a.icon}`} style={{ color: a.color, fontSize: "13px" }} />
                  </div>
                  <span style={s.quickLabel}>{a.label}</span>
                  <i className="fa-solid fa-chevron-right" style={{ fontSize: "10px", color: "#d1d5db" }} />
                </Link>
              ))}
            </div>
          </div>

          {/* TOP SẢN PHẨM */}
          {topProducts.length > 0 && (
            <div style={{ ...s.card, marginTop: "16px" }}>
              <div style={s.cardHead}>
                <div style={s.cardTitleWrap}>
                  <i className="fa-solid fa-fire" style={{ color: "#ef4444", marginRight: "8px" }} />
                  <h3 style={s.cardTitle}>Bán chạy nhất</h3>
                </div>
              </div>
              <div style={s.topList}>
                {topProducts.slice(0, 4).map((p, i) => (
                  <div key={p.id} style={s.topItem}>
                    <span style={s.topRank}>{i + 1}</span>
                    <div style={s.topInfo}>
                      <p style={s.topName}>{p.name}</p>
                      <p style={s.topSold}>
                        <i className="fa-solid fa-cart-shopping" style={{ marginRight: "4px", fontSize: "10px" }} />
                        {p.buyTurn || 0} lượt mua
                      </p>
                    </div>
                    <span style={s.topPrice}>{Number(p.price).toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter',sans-serif" },
  loadingWrap: { minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#6b7280", display: "flex", alignItems: "center" },
  addBtn: { display: "inline-flex", alignItems: "center", background: "#0f172a", color: "#fff", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "700" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "20px" },
  statCard: { borderRadius: "12px", padding: "18px 20px" },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  statLabel: { fontSize: "11px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" },
  statValue: { fontSize: "22px", fontWeight: "800", color: "#0f172a" },
  statIconWrap: { width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" },
  statNote: { fontSize: "11px", color: "#b45309", marginTop: "8px", display: "flex", alignItems: "center" },
  grid: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "16px" },
  card: { background: "#fff", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb" },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  cardTitleWrap: { display: "flex", alignItems: "center" },
  cardTitle: { fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 },
  viewAll: { fontSize: "12px", color: "#3b82f6", textDecoration: "none", fontWeight: "600", display: "flex", alignItems: "center" },
  empty: { textAlign: "center", padding: "32px", display: "flex", flexDirection: "column", alignItems: "center" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "10px 12px", fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left", borderBottom: "1px solid #e5e7eb" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 12px", fontSize: "13px", color: "#374151", verticalAlign: "middle" },
  orderCode: { fontWeight: "700", color: "#2563eb", fontSize: "12px" },
  orderName: { fontWeight: "600", fontSize: "13px", marginBottom: "2px" },
  orderPhone: { fontSize: "11px", color: "#9ca3af" },
  badge: { fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "999px", display: "inline-flex", alignItems: "center" },
  side: {},
  quickList: { display: "flex", flexDirection: "column", gap: "6px" },
  quickItem: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: "#f8fafc", borderRadius: "8px", textDecoration: "none", transition: "background 0.15s" },
  quickIconWrap: { width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  quickLabel: { flex: 1, fontSize: "13px", fontWeight: "600", color: "#374151" },
  topList: { display: "flex", flexDirection: "column", gap: "10px" },
  topItem: { display: "flex", alignItems: "center", gap: "10px" },
  topRank: { width: "22px", height: "22px", borderRadius: "6px", background: "#f1f5f9", color: "#6b7280", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  topInfo: { flex: 1, minWidth: 0 },
  topName: { fontSize: "12px", fontWeight: "600", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  topSold: { fontSize: "11px", color: "#9ca3af", display: "flex", alignItems: "center" },
  topPrice: { fontSize: "12px", fontWeight: "700", color: "#0f172a", flexShrink: 0 },
};

export default AdminDashboard;
