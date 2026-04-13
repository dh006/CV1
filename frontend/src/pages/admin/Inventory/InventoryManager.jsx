import React, { useEffect, useState, useMemo } from "react";
import { productAPI, BASE_URL } from "../../../services/api";
import api from "../../../services/api";

const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return val.split(",").map((s) => s.trim()).filter(Boolean); }
};

const DEFAULT_SIZES = ["S", "M", "L", "XL", "2XL"];

const InventoryManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | low | out
  const [expandedId, setExpandedId] = useState(null);
  const [addQty, setAddQty] = useState({}); // { productId: number }
  const [saving, setSaving] = useState(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const res = await productAPI.getAll({ limit: 200 });
      setProducts(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (p) => {
    const amount = Number(addQty[p.id] || 0);
    if (!amount || amount <= 0) { alert("Nhập số lượng hợp lệ!"); return; }
    setSaving(p.id);
    try {
      const fd = new FormData();
      fd.append("quantity", p.quantity + amount);
      await productAPI.update(p.id, fd);
      setProducts((prev) => prev.map((item) =>
        item.id === p.id ? { ...item, quantity: item.quantity + amount } : item
      ));
      setAddQty((prev) => ({ ...prev, [p.id]: "" }));
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi cập nhật kho!");
    } finally {
      setSaving(null);
    }
  };

  const filtered = useMemo(() => {
    let list = products;
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (filter === "low") list = list.filter((p) => p.quantity > 0 && p.quantity < 10);
    if (filter === "out") list = list.filter((p) => p.quantity === 0);
    return list;
  }, [products, search, filter]);

  const stats = useMemo(() => ({
    total: products.length,
    totalQty: products.reduce((s, p) => s + (p.quantity || 0), 0),
    low: products.filter((p) => p.quantity > 0 && p.quantity < 10).length,
    out: products.filter((p) => p.quantity === 0).length,
  }), [products]);

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.spinner} />
      <p style={{ color: "#6b7280", marginTop: "12px" }}>Đang tải kho hàng...</p>
    </div>
  );

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Quản lý kho hàng</h1>
          <p style={s.subtitle}>Theo dõi tồn kho chi tiết theo size và màu sắc</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={s.statsGrid}>
        {[
          { label: "Tổng sản phẩm", icon: "fa-box",       color: "#dbeafe", textColor: "#1d4ed8", value: stats.total },
          { label: "Tổng tồn kho",  icon: "fa-warehouse",  color: "#d1fae5", textColor: "#059669", value: `${stats.totalQty} cái` },
          { label: "Sắp hết hàng",  icon: "fa-triangle-exclamation", color: "#fef3c7", textColor: "#b45309", value: stats.low },
          { label: "Hết hàng",      icon: "fa-circle-xmark", color: "#fee2e2", textColor: "#dc2626", value: stats.out },
        ].map((c, i) => (
          <div key={i} style={{ ...s.statCard, background: c.color }}>
            <i className={`fa-solid ${c.icon}`} style={{ fontSize: "22px", color: c.textColor, marginBottom: "8px" }} />
            <p style={s.statLabel}>{c.label}</p>
            <p style={{ ...s.statValue, color: c.textColor }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "#9ca3af" }} />
          <input type="text" placeholder="Tìm sản phẩm..." value={search}
            onChange={(e) => setSearch(e.target.value)} style={s.searchInput} />
        </div>
        <div style={s.filterTabs}>
          {[
            ["all", "fa-list", "Tất cả"],
            ["low", "fa-triangle-exclamation", "Sắp hết"],
            ["out", "fa-circle-xmark", "Hết hàng"],
          ].map(([val, icon, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              style={{ ...s.filterTab, ...(filter === val ? s.filterTabActive : {}) }}>
              <i className={`fa-solid ${icon}`} style={{ marginRight: "5px" }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div style={s.tableWrap}>
        {filtered.length === 0 ? (
          <div style={s.empty}>
            <i className="fa-solid fa-box-open" style={{ fontSize: "40px", color: "#d1d5db" }} />
            <p>Không có sản phẩm nào</p>
          </div>
        ) : (
          filtered.map((p) => {
            const sizes = parseList(p.sizes).length > 0 ? parseList(p.sizes) : DEFAULT_SIZES;
            const colors = parseList(p.colors);
            const isExpanded = expandedId === p.id;
            const isOut = p.quantity === 0;
            const isLow = p.quantity > 0 && p.quantity < 10;

            // Tạo bảng size × màu (ước tính đều nhau)
            const totalVariants = sizes.length * Math.max(colors.length, 1);
            const qtyPerVariant = totalVariants > 0 ? Math.floor(p.quantity / totalVariants) : 0;
            const remainder = totalVariants > 0 ? p.quantity % totalVariants : 0;

            return (
              <div key={p.id} style={s.productBlock}>
                {/* ROW CHÍNH */}
                <div style={s.productRow} onClick={() => setExpandedId(isExpanded ? null : p.id)}>
                  <div style={s.productLeft}>
                    <div style={s.imgWrap}>
                      <img
                        src={p.image ? (p.image.startsWith("http") ? p.image : `${BASE_URL}${p.image}`) : "https://via.placeholder.com/52x68"}
                        alt={p.name} style={s.productImg}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/52x68"; }}
                      />
                      {isOut && <div style={s.outBadgeImg}>HẾT</div>}
                    </div>
                    <div>
                      <p style={s.productName}>{p.name}</p>
                      <p style={s.productMeta}>
                        {p.Category?.name || "—"} · ID #{p.id}
                      </p>
                      <div style={s.tagRow}>
                        {sizes.map((sz) => (
                          <span key={sz} style={s.sizeTag}>{sz}</span>
                        ))}
                        {colors.map((c) => (
                          <span key={c} style={{ ...s.colorTag }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={s.productRight}>
                    <div style={s.qtyBlock}>
                      <p style={s.qtyLabel}>Tổng tồn kho</p>
                      <p style={{ ...s.qtyNum, color: isOut ? "#dc2626" : isLow ? "#b45309" : "#059669" }}>
                        {p.quantity} cái
                      </p>
                    </div>
                    <span style={{ ...s.statusBadge, background: isOut ? "#fee2e2" : isLow ? "#fef3c7" : "#d1fae5", color: isOut ? "#dc2626" : isLow ? "#b45309" : "#059669" }}>
                      {isOut ? "Hết hàng" : isLow ? "Sắp hết" : "Còn hàng"}
                    </span>
                    <span style={s.expandIcon}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* CHI TIẾT SIZE × MÀU */}
                {isExpanded && (
                  <div style={s.detailPanel}>
                    <div style={s.detailHeader}>
                      <h4 style={s.detailTitle}>
                        <i className="fa-solid fa-chart-bar" style={{ marginRight: "8px", color: "#6366f1" }} />
                        Chi tiết tồn kho theo Size & Màu
                      </h4>
                      <p style={s.detailNote}>{p.sizeStock ? "✔ Dữ liệu tồn kho thực theo size" : "* Số lượng ước tính đều theo tổng tồn kho"}</p>
                    </div>

                    {/* BẢNG SIZE × MÀU */}
                    <div style={s.variantTable}>
                      <table style={s.table}>
                        <thead>
                          <tr style={s.thead}>
                            <th style={s.th}>Size</th>
                            {colors.length > 0
                              ? colors.map((c) => <th key={c} style={s.th}>{c}</th>)
                              : <th style={s.th}>Tồn kho</th>
                            }
                            <th style={s.th}>Tổng / Size</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizes.map((sz, si) => {
                            // Dùng sizeStock thực nếu có, không thì ước tính
                            let sizeStockData = null;
                            if (p.sizeStock) {
                              try { sizeStockData = JSON.parse(p.sizeStock); } catch {}
                            }
                            const realQty = sizeStockData ? (sizeStockData[sz] ?? 0) : null;
                            const rowTotal = realQty !== null ? realQty
                              : (colors.length > 0
                                ? colors.reduce((sum, _, ci) => {
                                    const idx = si * colors.length + ci;
                                    return sum + qtyPerVariant + (idx < remainder ? 1 : 0);
                                  }, 0)
                                : qtyPerVariant + (si < remainder ? 1 : 0));

                            return (
                              <tr key={sz} style={s.tr}>
                                <td style={s.tdSize}><span style={s.sizePill}>{sz}</span></td>
                                {colors.length > 0
                                  ? colors.map((c, ci) => {
                                      const qty = realQty !== null ? Math.floor(realQty / colors.length) : (qtyPerVariant + (si * colors.length + ci < remainder ? 1 : 0));
                                      return (
                                        <td key={c} style={s.td}>
                                          <span style={{ ...s.qtyCell, color: qty === 0 ? "#dc2626" : qty < 3 ? "#b45309" : "#059669", background: qty === 0 ? "#fee2e2" : qty < 3 ? "#fef3c7" : "#f0fdf4" }}>
                                            {qty}
                                          </span>
                                        </td>
                                      );
                                    })
                                  : (
                                    <td style={s.td}>
                                      <span style={{ ...s.qtyCell, color: rowTotal === 0 ? "#dc2626" : rowTotal < 3 ? "#b45309" : "#059669", background: rowTotal === 0 ? "#fee2e2" : rowTotal < 3 ? "#fef3c7" : "#f0fdf4" }}>
                                        {rowTotal}
                                      </span>
                                    </td>
                                  )
                                }
                                <td style={{ ...s.td, fontWeight: "700" }}>{rowTotal}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr style={{ background: "#f8fafc" }}>
                            <td style={{ ...s.td, fontWeight: "700" }}>TỔNG</td>
                            {colors.length > 0
                              ? colors.map((c, ci) => {
                                  const colTotal = sizes.reduce((sum, _, si) => {
                                    const idx = si * colors.length + ci;
                                    return sum + qtyPerVariant + (idx < remainder ? 1 : 0);
                                  }, 0);
                                  return <td key={c} style={{ ...s.td, fontWeight: "700" }}>{colTotal}</td>;
                                })
                              : <td style={{ ...s.td, fontWeight: "700" }}>{p.quantity}</td>
                            }
                            <td style={{ ...s.td, fontWeight: "800", color: "#001C40", fontSize: "15px" }}>{p.quantity}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* NHẬP THÊM KHO */}
                    <div style={s.addStockRow}>
                      <p style={s.addStockLabel}>Nhập thêm hàng vào kho:</p>
                      <div style={s.addStockInput}>
                        <input
                          type="number"
                          min="1"
                          placeholder="Số lượng"
                          value={addQty[p.id] || ""}
                          onChange={(e) => setAddQty((prev) => ({ ...prev, [p.id]: e.target.value }))}
                          style={s.qtyInput}
                        />
                        <button
                          onClick={() => handleAddStock(p)}
                          style={{ ...s.addBtn, opacity: saving === p.id ? 0.7 : 1 }}
                          disabled={saving === p.id}
                        >
                          <i className="fa-solid fa-plus" style={{ marginRight: "6px" }} />
                          {saving === p.id ? "Đang lưu..." : "Nhập kho"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter',sans-serif" },
  loadingWrap: { minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #001C40", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  header: { marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#1a1a1a", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "20px" },
  statCard: { borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" },
  statIcon: { fontSize: "28px" },
  statLabel: { fontSize: "12px", color: "#6b7280", marginBottom: "4px" },
  statValue: { fontSize: "22px", fontWeight: "800" },
  toolbar: { display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" },
  searchWrap: { position: "relative", flex: 1, minWidth: "200px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" },
  searchInput: { width: "100%", padding: "10px 14px 10px 36px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", background: "#fafafa" },
  filterTabs: { display: "flex", gap: "6px" },
  filterTab: { padding: "8px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#6b7280" },
  filterTabActive: { background: "#001C40", color: "#fff", border: "1.5px solid #001C40" },
  tableWrap: { display: "flex", flexDirection: "column", gap: "10px" },
  empty: { textAlign: "center", padding: "60px", color: "#9ca3af", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },

  productBlock: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" },
  productRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer", transition: "background 0.15s" },
  productLeft: { display: "flex", alignItems: "center", gap: "14px", flex: 1 },
  imgWrap: { position: "relative", width: "52px", height: "68px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, background: "#f3f4f6" },
  productImg: { width: "100%", height: "100%", objectFit: "cover" },
  outBadgeImg: { position: "absolute", inset: 0, background: "rgba(220,38,38,0.7)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "800" },
  productName: { fontSize: "14px", fontWeight: "700", color: "#1a1a1a", marginBottom: "3px" },
  productMeta: { fontSize: "11px", color: "#9ca3af", marginBottom: "6px" },
  tagRow: { display: "flex", gap: "4px", flexWrap: "wrap" },
  sizeTag: { padding: "2px 7px", background: "#f3f4f6", color: "#374151", borderRadius: "4px", fontSize: "10px", fontWeight: "600" },
  colorTag: { padding: "2px 7px", background: "#ede9fe", color: "#7c3aed", borderRadius: "4px", fontSize: "10px", fontWeight: "600" },
  productRight: { display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 },
  qtyBlock: { textAlign: "right" },
  qtyLabel: { fontSize: "11px", color: "#9ca3af", marginBottom: "2px" },
  qtyNum: { fontSize: "20px", fontWeight: "800" },
  statusBadge: { fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "999px" },
  expandIcon: { fontSize: "12px", color: "#9ca3af", width: "20px", textAlign: "center" },

  detailPanel: { borderTop: "1px solid #f3f4f6", padding: "20px", background: "#fafafa" },
  detailHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  detailTitle: { fontSize: "14px", fontWeight: "700", color: "#1a1a1a" },
  detailNote: { fontSize: "11px", color: "#9ca3af", fontStyle: "italic" },
  variantTable: { overflowX: "auto", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden", border: "1px solid #e5e7eb" },
  thead: { background: "#f8fafc" },
  th: { padding: "10px 14px", fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center", borderBottom: "1px solid #e5e7eb" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "10px 14px", fontSize: "13px", textAlign: "center", color: "#374151" },
  tdSize: { padding: "10px 14px", textAlign: "center" },
  sizePill: { display: "inline-block", padding: "4px 12px", background: "#001C40", color: "#fff", borderRadius: "6px", fontSize: "12px", fontWeight: "700" },
  qtyCell: { display: "inline-block", padding: "4px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "700", minWidth: "40px" },

  addStockRow: { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" },
  addStockLabel: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  addStockInput: { display: "flex", gap: "8px", alignItems: "center" },
  qtyInput: { width: "100px", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", textAlign: "center" },
  addBtn: { padding: "9px 20px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" },
};

export default InventoryManager;
