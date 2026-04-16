import React, { useEffect, useState, useCallback } from "react";
import { statsAPI, BASE_URL } from "../../../services/api";

const getImgUrl = (img) => {
  if (!img) return null;
  return img.startsWith("http") ? img : `${BASE_URL}${img}`;
};

const toDateStr = (d) => d.toISOString().slice(0, 10);

const PRESETS = [
  { label: "Hôm nay", key: "today" },
  { label: "Hôm qua", key: "yesterday" },
  { label: "7 ngày", key: "7days" },
  { label: "Tuần này", key: "thisweek" },
  { label: "Tháng này", key: "thismonth" },
  { label: "Tháng trước", key: "lastmonth" },
  { label: "Năm nay", key: "thisyear" },
  { label: "Tùy chọn", key: "custom" },
];

const getPresetDates = (key) => {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
  switch (key) {
    case "today":
      return { from: toDateStr(new Date(y, m, d)), to: toDateStr(new Date(y, m, d)) };
    case "yesterday":
      return { from: toDateStr(new Date(y, m, d - 1)), to: toDateStr(new Date(y, m, d - 1)) };
    case "7days":
      return { from: toDateStr(new Date(y, m, d - 6)), to: toDateStr(new Date(y, m, d)) };
    case "thisweek": {
      const day = now.getDay() || 7;
      return { from: toDateStr(new Date(y, m, d - day + 1)), to: toDateStr(new Date(y, m, d)) };
    }
    case "thismonth":
      return { from: toDateStr(new Date(y, m, 1)), to: toDateStr(new Date(y, m, d)) };
    case "lastmonth":
      return { from: toDateStr(new Date(y, m - 1, 1)), to: toDateStr(new Date(y, m, 0)) };
    case "thisyear":
      return { from: toDateStr(new Date(y, 0, 1)), to: toDateStr(new Date(y, m, d)) };
    default:
      return { from: toDateStr(new Date(y, m, d - 6)), to: toDateStr(new Date(y, m, d)) };
  }
};

const RevenueReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState("7days");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const fetchData = useCallback(async (from, to) => {
    setLoading(true);
    try {
      const res = await statsAPI.getDashboard({ from, to });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const { from, to } = getPresetDates("7days");
    setCustomFrom(from);
    setCustomTo(to);
    fetchData(from, to);
  }, [fetchData]);

  const handlePreset = (key) => {
    setPreset(key);
    if (key !== "custom") {
      const { from, to } = getPresetDates(key);
      setCustomFrom(from);
      setCustomTo(to);
      fetchData(from, to);
    }
  };

  const handleCustomApply = () => {
    if (!customFrom || !customTo) return;
    if (customFrom > customTo) { alert("Ngày bắt đầu phải trước ngày kết thúc!"); return; }
    fetchData(customFrom, customTo);
  };

  const summary = data?.summary || {};
  const topProducts = data?.topProducts || [];
  const revenueByDay = data?.revenueByDay || [];
  const maxRevenue = Math.max(...revenueByDay.map((d) => Number(d.revenue || 0)), 1);

  const formatDate = (str) => {
    if (!str) return "";
    const d = new Date(str);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>
            <i className="fa-solid fa-chart-line" style={{ marginRight: "10px", color: "#7c3aed" }} />
            Báo cáo Doanh thu
          </h1>
          <p style={s.subtitle}>
            {data?.filter ? `${formatDate(data.filter.from)} — ${formatDate(data.filter.to)}` : "Đang tải..."}
          </p>
        </div>
        <span style={s.updateTime}>
          <i className="fa-solid fa-clock" style={{ marginRight: "6px" }} />
          {new Date().toLocaleString("vi-VN")}
        </span>
      </div>

      {/* BỘ LỌC THỜI GIAN */}
      <div style={s.filterBox}>
        <div style={s.presetRow}>
          {PRESETS.map((p) => (
            <button key={p.key} onClick={() => handlePreset(p.key)}
              style={{ ...s.presetBtn, ...(preset === p.key ? s.presetBtnActive : {}) }}>
              {p.label}
            </button>
          ))}
        </div>
        {preset === "custom" && (
          <div style={s.customRow}>
            <div style={s.dateGroup}>
              <label style={s.dateLabel}>Từ ngày</label>
              <input type="date" style={s.dateInput} value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)} />
            </div>
            <div style={s.dateGroup}>
              <label style={s.dateLabel}>Đến ngày</label>
              <input type="date" style={s.dateInput} value={customTo}
                onChange={(e) => setCustomTo(e.target.value)} />
            </div>
            <button onClick={handleCustomApply} style={s.applyBtn}>
              <i className="fa-solid fa-magnifying-glass" style={{ marginRight: "6px" }} />
              Xem báo cáo
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div style={s.loadingWrap}>
          <div style={s.spinner} />
          <p style={{ color: "#6b7280", marginTop: "12px" }}>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* STAT CARDS */}
          <div style={s.statsGrid}>
            {[
              { label: "Doanh thu (hoàn thành)", value: Number(summary.totalRevenue || 0).toLocaleString() + "đ", icon: "fa-sack-dollar", color: "#dbeafe", iconColor: "#2563eb" },
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
            {/* BIỂU ĐỒ DOANH THU */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>
                <i className="fa-solid fa-chart-bar" style={{ marginRight: "8px", color: "#2563eb" }} />
                Doanh thu theo ngày
              </h3>
              {revenueByDay.length === 0 ? (
                <div style={s.empty}>
                  <i className="fa-solid fa-chart-simple" style={{ fontSize: "32px", color: "#d1d5db" }} />
                  <p>Không có đơn hoàn thành trong khoảng thời gian này</p>
                </div>
              ) : (
                <>
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
                  {/* Tổng kết */}
                  <div style={s.chartSummary}>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>Tổng doanh thu:</span>
                    <span style={{ fontSize: "16px", fontWeight: "800", color: "#2563eb" }}>
                      {revenueByDay.reduce((s, d) => s + Number(d.revenue || 0), 0).toLocaleString()}đ
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* TOP SẢN PHẨM */}
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
        </>
      )}
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter',sans-serif" },
  loadingWrap: { minHeight: "40vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#1a1a1a", marginBottom: "4px", display: "flex", alignItems: "center" },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  updateTime: { fontSize: "12px", color: "#9ca3af", display: "flex", alignItems: "center" },

  // Filter
  filterBox: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px" },
  presetRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  presetBtn: { padding: "7px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#374151", transition: "all 0.15s" },
  presetBtnActive: { background: "#001C40", color: "#fff", border: "1.5px solid #001C40" },
  customRow: { display: "flex", gap: "12px", alignItems: "flex-end", marginTop: "14px", flexWrap: "wrap" },
  dateGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  dateLabel: { fontSize: "11px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" },
  dateInput: { padding: "8px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit", background: "#fafafa" },
  applyBtn: { padding: "9px 20px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "20px" },
  statCard: { borderRadius: "12px", padding: "18px 20px", display: "flex", flexDirection: "column" },
  statLabel: { fontSize: "12px", color: "#6b7280", marginBottom: "6px" },
  statValue: { fontSize: "22px", fontWeight: "800" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" },
  cardTitle: { fontSize: "14px", fontWeight: "700", color: "#1a1a1a", marginBottom: "18px", display: "flex", alignItems: "center" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "40px 0", color: "#9ca3af", fontSize: "13px" },
  // Bar chart
  chartWrap: { display: "flex", gap: "6px", alignItems: "flex-end", height: "160px", padding: "0 4px", overflowX: "auto" },
  barGroup: { flex: "0 0 auto", minWidth: "36px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" },
  barTrack: { flex: 1, width: "100%", display: "flex", alignItems: "flex-end", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden" },
  bar: { width: "100%", background: "linear-gradient(180deg,#818cf8,#6366f1)", borderRadius: "4px 4px 0 0", transition: "height 0.3s" },
  barLabel: { fontSize: "10px", color: "#6b7280", fontWeight: "600", whiteSpace: "nowrap" },
  barOrders: { fontSize: "9px", color: "#9ca3af" },
  chartSummary: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", padding: "10px 14px", background: "#f0f4ff", borderRadius: "8px" },
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
