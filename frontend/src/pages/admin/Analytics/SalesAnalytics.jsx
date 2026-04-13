import React, { useEffect, useState } from "react";
import { statsAPI } from "../../../services/api";

const SalesAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsAPI.getDashboard()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.spinner} />
      <p style={{ color: "#6b7280", marginTop: "12px" }}>Đang phân tích dữ liệu...</p>
    </div>
  );

  const summary = data?.summary || {};
  const topProducts = data?.topProducts || [];
  const revenueByDay = data?.revenueByDay || [];

  // Tính tổng đơn theo trạng thái từ recentOrders (nếu có)
  const totalRevenue = Number(summary.totalRevenue || 0);
  const orderCount = Number(summary.orderCount || 0);
  const avgOrderValue = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;
  const totalSold = topProducts.reduce((s, p) => s + (p.buyTurn || 0), 0);

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>
            <i className="fa-solid fa-chart-pie" style={{ marginRight: "10px", color: "#059669" }} />
            Phân tích Kinh doanh
          </h1>
          <p style={s.subtitle}>Tổng quan hiệu suất bán hàng</p>
        </div>
        <span style={s.updateTime}>
          <i className="fa-solid fa-rotate" style={{ marginRight: "6px" }} />
          {new Date().toLocaleString("vi-VN")}
        </span>
      </div>

      {/* KPI CARDS */}
      <div style={s.kpiGrid}>
        {[
          { label: "Doanh thu (hoàn thành)", value: totalRevenue.toLocaleString() + "đ", icon: "fa-sack-dollar", color: "#2563eb", bg: "#eff6ff" },
          { label: "Tổng đơn hàng", value: orderCount, icon: "fa-bag-shopping", color: "#059669", bg: "#f0fdf4" },
          { label: "Giá trị đơn TB", value: avgOrderValue.toLocaleString() + "đ", icon: "fa-calculator", color: "#d97706", bg: "#fffbeb" },
          { label: "Sản phẩm đã bán", value: totalSold + " cái", icon: "fa-boxes-stacked", color: "#7c3aed", bg: "#faf5ff" },
          { label: "Đơn chờ xử lý", value: summary.pendingOrders || 0, icon: "fa-clock", color: "#dc2626", bg: "#fef2f2" },
          { label: "Tổng thành viên", value: summary.totalUsers || 0, icon: "fa-users", color: "#0891b2", bg: "#ecfeff" },
        ].map((c, i) => (
          <div key={i} style={{ ...s.kpiCard, background: c.bg }}>
            <div style={{ ...s.kpiIcon, color: c.color }}>
              <i className={`fa-solid ${c.icon}`} />
            </div>
            <p style={s.kpiLabel}>{c.label}</p>
            <p style={{ ...s.kpiValue, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={s.twoCol}>
        {/* DOANH THU THEO NGÀY */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>
            <i className="fa-solid fa-chart-area" style={{ marginRight: "8px", color: "#059669" }} />
            Doanh thu 7 ngày (đơn hoàn thành)
          </h3>
          {revenueByDay.length === 0 ? (
            <div style={s.empty}>
              <i className="fa-solid fa-chart-simple" style={{ fontSize: "32px", color: "#d1d5db" }} />
              <p>Chưa có đơn hoàn thành trong 7 ngày qua</p>
            </div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Ngày</th>
                  <th style={{ ...s.th, textAlign: "center" }}>Số đơn</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {revenueByDay.map((d, i) => {
                  const date = new Date(d.day);
                  return (
                    <tr key={i} style={s.tr}>
                      <td style={s.td}>
                        <i className="fa-solid fa-calendar-day" style={{ marginRight: "8px", color: "#9ca3af", fontSize: "11px" }} />
                        {date.toLocaleDateString("vi-VN")}
                      </td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <span style={s.orderBadge}>{d.orders}</span>
                      </td>
                      <td style={{ ...s.td, textAlign: "right", fontWeight: "700", color: "#059669" }}>
                        {Number(d.revenue || 0).toLocaleString()}đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f8fafc" }}>
                  <td style={{ ...s.td, fontWeight: "700" }}>Tổng</td>
                  <td style={{ ...s.td, textAlign: "center", fontWeight: "700" }}>
                    {revenueByDay.reduce((s, d) => s + Number(d.orders || 0), 0)}
                  </td>
                  <td style={{ ...s.td, textAlign: "right", fontWeight: "800", color: "#2563eb", fontSize: "15px" }}>
                    {revenueByDay.reduce((s, d) => s + Number(d.revenue || 0), 0).toLocaleString()}đ
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* TOP SẢN PHẨM */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>
            <i className="fa-solid fa-trophy" style={{ marginRight: "8px", color: "#f59e0b" }} />
            Sản phẩm bán chạy nhất
          </h3>
          {topProducts.length === 0 ? (
            <div style={s.empty}>
              <i className="fa-solid fa-box-open" style={{ fontSize: "32px", color: "#d1d5db" }} />
              <p>Chưa có dữ liệu</p>
            </div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>#</th>
                  <th style={s.th}>Sản phẩm</th>
                  <th style={{ ...s.th, textAlign: "center" }}>Đã bán</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Giá</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={p.id} style={s.tr}>
                    <td style={{ ...s.td, fontWeight: "800", color: i < 3 ? "#f59e0b" : "#9ca3af" }}>
                      {i < 3 ? <i className="fa-solid fa-medal" /> : i + 1}
                    </td>
                    <td style={s.td}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a1a" }}>{p.name}</span>
                    </td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <span style={s.soldBadge}>{p.buyTurn || 0}</span>
                    </td>
                    <td style={{ ...s.td, textAlign: "right", fontWeight: "600", color: "#374151" }}>
                      {Number(p.price).toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter',sans-serif" },
  loadingWrap: { minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #059669", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#1a1a1a", marginBottom: "4px", display: "flex", alignItems: "center" },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  updateTime: { fontSize: "12px", color: "#9ca3af", display: "flex", alignItems: "center" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "24px" },
  kpiCard: { borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "6px" },
  kpiIcon: { fontSize: "20px" },
  kpiLabel: { fontSize: "12px", color: "#6b7280" },
  kpiValue: { fontSize: "20px", fontWeight: "800" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" },
  cardTitle: { fontSize: "14px", fontWeight: "700", color: "#1a1a1a", marginBottom: "16px", display: "flex", alignItems: "center" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "40px 0", color: "#9ca3af", fontSize: "13px" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "10px 12px", fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left", borderBottom: "1px solid #e5e7eb" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "11px 12px", fontSize: "13px", color: "#374151", verticalAlign: "middle" },
  orderBadge: { display: "inline-block", background: "#dbeafe", color: "#2563eb", padding: "2px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "700" },
  soldBadge: { display: "inline-block", background: "#fef3c7", color: "#d97706", padding: "2px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "700" },
};

export default SalesAnalytics;
