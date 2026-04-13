import React, { useEffect, useState } from "react";
import { statsAPI, BASE_URL } from "../../../services/api";
import { Link } from "react-router-dom";

const getImgUrl = (img) => {
  if (!img) return null;
  return img.startsWith("http") ? img : `${BASE_URL}${img}`;
};

const RevenueReport = () => {
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
      <p style={{ color: "#6b7280", marginTop: "12px" }}>Đang tổng hợp báo cáo...</p>
    </div>
  );

  const summary = data?.summary || {};
  const topProducts = data?.topProducts || [];
  const revenueByDay = data?.revenueByDay || [];
  const maxRevenue = Math.max(...revenueByDay.map((d) => Number(d.revenue || 0)), 1);

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>
            <i className="fa-solid fa-chart-line" style={{ marginRight: "10px", color: "#7c3aed" }} />
            Báo cáo Doanh thu
          </h1>
          <p style={s.subtitle}>Tổng hợp dữ liệu kinh doanh thực tế</p>
        </div>
        <span style={s.updateTime}>
          <i className="fa-solid fa-clock" style={{ marginRight: "6px" }} />
          {new Date().toLocaleString("vi-VN")}
        </span>
      </div>

      {/* STAT CARDS */}
      <div style={s.statsGrid}>
        {[
          { label: "Doanh thu (đơn hoàn thành)", value: Number(summary.totalRevenue || 0).toLocaleString() + "đ", icon: "fa-sack-dollar", color: "#dbeafe", iconColor: "#2563eb" },
          { label: "Tổng đơn hàng", value: summary.orderCount || 0, icon: "fa-bag-shopping", color: "#d1fae5", iconColor: "#059669" },
          { label: "Đơn chờ xử lý", value: summary.pendingOrders || 0, icon: "fa-clock", color: "#fef3c7", iconColor: "#d97706" },
          { label: "Tổng sản phẩm", value: summary.totalProducts || 0, icon: "fa-box", color: "#ede9fe", iconColor: "#7c3aed" },
        ].map((c, i) => (
          <div key={i} style={{ ...s.statCard, background: c.color }}>
            <i className={`fa-solid ${c.icon}`} style={{ fontSize: "24px", color: c.iconColor, marginBottom: "10px" }} />
            <p style={s.statLabel}>{c.label}</p>
            <p style={{ ...s.statValue, color: c.iconColor }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={s.twoCol}>
        {/* BIỂU ĐỒ DOANH THU 7 NGÀY */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>
            <i className="fa-solid fa-chart-bar" style={{ marginRight: "8px", color: "#2563eb" }} />
            Doanh thu 7 ngày gần nhất
          </h3>
          {revenueByDay.length === 0 ? (
            <div style={s.empty}>
              <i className="fa-solid fa-chart-simple" style={{ fontSize: "32px", color: "#d1d5db" }} />
              <p>Chưa có dữ liệu doanh thu</p>
            </div>
          ) : (
            <div style={s.chartWrap}>
              {revenueByDay.map((d, i) => {
                const pct = Math.max(4, (Number(d.revenue || 0) / maxRevenue) * 100);
                const date = new Date(d.day);
                const label = `${date.getDate()}/${date.getMonth() + 1}`;
                return (
                  <div key={i} style={s.barGroup}>
                    <div style={s.barTrack}>
                      <div style={{ ...s.bar, height: `${pct}%` }}
                        title={`${Number(d.revenue || 0).toLocaleString()}đ`} />
                    </div>
                    <span style={s.barLabel}>{label}</span>
                    <span style={s.barOrders}>{d.orders} đơn</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TOP SẢN PHẨM BÁN CHẠY */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>
            <i className="fa-solid fa-fire" style={{ marginRight: "8px", color: "#f59e0b" }} />
            Top sản phẩm bán chạy
          </h3>
          {topProducts.length === 0 ? (
            <div style={s.empty}>
              <i className="fa-solid fa-box-open" style={{ fontSize: "32px", color: "#d1d5db" }} />
              <p>Chưa có dữ liệu</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {topProducts.map((p, i) => {
                const maxBuy = topProducts[0]?.buyTurn || 1;
                const pct = Math.max(4, ((p.buyTurn || 0) / maxBuy) * 100);
                const imgUrl = getImgUrl(p.image);
                return (
                  <div key={p.id} style={s.topItem}>
                    <span style={s.topRank}>{i + 1}</span>
                    <div style={s.topImgWrap}>
                      {imgUrl ? (
                        <img src={imgUrl} alt={p.name} style={s.topImg}
                          onError={(e) => { e.target.style.display = "none"; }} />
                      ) : (
                        <i className="fa-solid fa-image" style={{ color: "#d1d5db", fontSize: "16px" }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={s.topName}>{p.name}</p>
                      <div style={s.progressTrack}>
                        <div style={{ ...s.progressBar, width: `${pct}%` }} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={s.topSold}>{p.buyTurn || 0} đã bán</p>
                      <p style={s.topPrice}>{Number(p.price).toLocaleString()}đ</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter',sans-serif" },
  loadingWrap: { minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#1a1a1a", marginBottom: "4px", display: "flex", alignItems: "center" },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  updateTime: { fontSize: "12px", color: "#9ca3af", display: "flex", alignItems: "center" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" },
  statCard: { borderRadius: "12px", padding: "18px 20px", display: "flex", flexDirection: "column" },
  statLabel: { fontSize: "12px", color: "#6b7280", marginBottom: "6px" },
  statValue: { fontSize: "22px", fontWeight: "800" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" },
  cardTitle: { fontSize: "14px", fontWeight: "700", color: "#1a1a1a", marginBottom: "18px", display: "flex", alignItems: "center" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "40px 0", color: "#9ca3af", fontSize: "13px" },
  // Bar chart
  chartWrap: { display: "flex", gap: "8px", alignItems: "flex-end", height: "180px", padding: "0 4px" },
  barGroup: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" },
  barTrack: { flex: 1, width: "100%", display: "flex", alignItems: "flex-end", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden" },
  bar: { width: "100%", background: "linear-gradient(180deg,#6366f1,#4f46e5)", borderRadius: "4px 4px 0 0", transition: "height 0.3s" },
  barLabel: { fontSize: "10px", color: "#6b7280", fontWeight: "600" },
  barOrders: { fontSize: "9px", color: "#9ca3af" },
  // Top products
  topItem: { display: "flex", alignItems: "center", gap: "10px" },
  topRank: { width: "22px", height: "22px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: "#374151", flexShrink: 0 },
  topImgWrap: { width: "40px", height: "52px", borderRadius: "6px", overflow: "hidden", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  topImg: { width: "100%", height: "100%", objectFit: "cover" },
  topName: { fontSize: "12px", fontWeight: "600", color: "#1a1a1a", marginBottom: "5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  progressTrack: { height: "5px", background: "#f3f4f6", borderRadius: "999px", overflow: "hidden" },
  progressBar: { height: "100%", background: "linear-gradient(90deg,#f59e0b,#d97706)", borderRadius: "999px", transition: "width 0.3s" },
  topSold: { fontSize: "12px", fontWeight: "700", color: "#1a1a1a" },
  topPrice: { fontSize: "11px", color: "#9ca3af" },
};

export default RevenueReport;
