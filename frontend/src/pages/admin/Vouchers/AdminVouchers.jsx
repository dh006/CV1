import React, { useEffect, useState } from "react";
import { voucherAPI } from "../../../services/api";

const AdminVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({
    code: "", type: "fixed", value: "", minOrder: "", maxDiscount: "",
    usageLimit: "100", expiresAt: "", isActive: true,
  });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await voucherAPI.getAll();
      setVouchers(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setForm({ code: "", type: "fixed", value: "", minOrder: "", maxDiscount: "", usageLimit: "100", expiresAt: "", isActive: true });
    setEditing(null); setModal("add");
  };

  const openEdit = (v) => {
    setForm({
      code: v.code, type: v.type, value: String(v.value),
      minOrder: String(v.minOrder || ""), maxDiscount: String(v.maxDiscount || ""),
      usageLimit: String(v.usageLimit), isActive: v.isActive,
      expiresAt: v.expiresAt ? v.expiresAt.slice(0, 10) : "",
    });
    setEditing(v); setModal("edit");
  };

  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        code: form.code.toUpperCase().trim(),
        type: form.type,
        value: Number(form.value),
        minOrder: Number(form.minOrder) || 0,
        maxDiscount: Number(form.maxDiscount) || 0,
        usageLimit: Number(form.usageLimit) || 100,
        isActive: form.isActive,
        expiresAt: form.expiresAt || null,
      };
      if (modal === "add") await voucherAPI.create(data);
      else await voucherAPI.update(editing.id, data);
      await load();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi lưu voucher!");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Xóa voucher "${code}"?`)) return;
    setDeleting(id);
    try {
      await voucherAPI.delete(id);
      setVouchers((prev) => prev.filter((v) => v.id !== id));
    } catch (err) { alert("Không thể xóa!"); }
    finally { setDeleting(null); }
  };

  const toggleActive = async (v) => {
    try {
      await voucherAPI.update(v.id, { isActive: !v.isActive });
      setVouchers((prev) => prev.map((item) => item.id === v.id ? { ...item, isActive: !item.isActive } : item));
    } catch {}
  };

  const isExpired = (v) => v.expiresAt && new Date(v.expiresAt) < new Date();

  if (loading) return (
    <div style={s.loadingWrap}><div style={s.spinner} /></div>
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>
            <i className="fa-solid fa-tag" style={{ marginRight: "10px", color: "#059669" }} />
            Quản lý Voucher
          </h1>
          <p style={s.subtitle}>{vouchers.length} voucher trong hệ thống</p>
        </div>
        <button onClick={openAdd} style={s.addBtn}>
          <i className="fa-solid fa-plus" style={{ marginRight: "6px" }} />
          Tạo voucher
        </button>
      </div>

      {/* STATS */}
      <div style={s.statsGrid}>
        {[
          { label: "Tổng voucher", value: vouchers.length, icon: "fa-tag", color: "#d1fae5", iconColor: "#059669" },
          { label: "Đang hoạt động", value: vouchers.filter(v => v.isActive && !isExpired(v)).length, icon: "fa-circle-check", color: "#dbeafe", iconColor: "#2563eb" },
          { label: "Đã hết hạn", value: vouchers.filter(v => isExpired(v)).length, icon: "fa-clock", color: "#fef3c7", iconColor: "#d97706" },
          { label: "Tổng lượt dùng", value: vouchers.reduce((s, v) => s + (v.usedCount || 0), 0), icon: "fa-chart-bar", color: "#ede9fe", iconColor: "#7c3aed" },
        ].map((c, i) => (
          <div key={i} style={{ ...s.statCard, background: c.color }}>
            <i className={`fa-solid ${c.icon}`} style={{ fontSize: "20px", color: c.iconColor, marginBottom: "8px" }} />
            <p style={s.statLabel}>{c.label}</p>
            <p style={{ ...s.statValue, color: c.iconColor }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>Mã voucher</th>
              <th style={s.th}>Loại giảm</th>
              <th style={{ ...s.th, textAlign: "center" }}>Đơn tối thiểu</th>
              <th style={{ ...s.th, textAlign: "center" }}>Đã dùng</th>
              <th style={{ ...s.th, textAlign: "center" }}>Hết hạn</th>
              <th style={{ ...s.th, textAlign: "center" }}>Trạng thái</th>
              <th style={{ ...s.th, textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>
                <i className="fa-solid fa-tag" style={{ fontSize: "36px", color: "#d1d5db", display: "block", marginBottom: "10px" }} />
                Chưa có voucher nào
              </td></tr>
            ) : vouchers.map((v) => {
              const expired = isExpired(v);
              return (
                <tr key={v.id} style={s.tr}>
                  <td style={s.td}>
                    <span style={s.codeTag}>{v.code}</span>
                  </td>
                  <td style={s.td}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: v.type === "percent" ? "#7c3aed" : "#059669" }}>
                      {v.type === "percent" ? `-${v.value}%` : `-${Number(v.value).toLocaleString()}đ`}
                    </span>
                    {v.type === "percent" && v.maxDiscount > 0 && (
                      <p style={{ fontSize: "11px", color: "#9ca3af" }}>tối đa {Number(v.maxDiscount).toLocaleString()}đ</p>
                    )}
                  </td>
                  <td style={{ ...s.td, textAlign: "center", fontSize: "12px", color: "#6b7280" }}>
                    {v.minOrder > 0 ? Number(v.minOrder).toLocaleString() + "đ" : "Không giới hạn"}
                  </td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700" }}>{v.usedCount}</span>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>/{v.usageLimit}</span>
                  </td>
                  <td style={{ ...s.td, textAlign: "center", fontSize: "12px", color: expired ? "#dc2626" : "#6b7280" }}>
                    {v.expiresAt ? new Date(v.expiresAt).toLocaleDateString("vi-VN") : "Không giới hạn"}
                    {expired && <span style={{ display: "block", fontSize: "10px", color: "#dc2626", fontWeight: "700" }}>HẾT HẠN</span>}
                  </td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <button onClick={() => toggleActive(v)}
                      style={{ ...s.toggleBtn, background: v.isActive && !expired ? "#d1fae5" : "#f3f4f6", color: v.isActive && !expired ? "#059669" : "#9ca3af" }}>
                      <i className={`fa-solid ${v.isActive && !expired ? "fa-circle-check" : "fa-circle-xmark"}`} style={{ marginRight: "4px" }} />
                      {v.isActive && !expired ? "Hoạt động" : "Tắt"}
                    </button>
                  </td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                      <button onClick={() => openEdit(v)} style={s.editBtn}>
                        <i className="fa-solid fa-pen" />
                      </button>
                      <button onClick={() => handleDelete(v.id, v.code)}
                        style={{ ...s.deleteBtn, opacity: deleting === v.id ? 0.5 : 1 }}
                        disabled={deleting === v.id}>
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modal && (
        <div style={s.overlay} onClick={closeModal}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>
                <i className={`fa-solid ${modal === "add" ? "fa-plus" : "fa-pen"}`} style={{ marginRight: "8px" }} />
                {modal === "add" ? "Tạo voucher mới" : "Sửa voucher"}
              </h3>
              <button onClick={closeModal} style={s.closeBtn}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSave}>
              <div style={s.row2}>
                <div style={s.group}>
                  <label style={s.label}>Mã voucher *</label>
                  <input style={s.input} type="text" placeholder="VD: SALE50"
                    value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    required disabled={modal === "edit"} />
                </div>
                <div style={s.group}>
                  <label style={s.label}>Loại giảm *</label>
                  <select style={s.input} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="fixed">Giảm tiền cố định (đ)</option>
                    <option value="percent">Giảm theo % (%)</option>
                  </select>
                </div>
              </div>
              <div style={s.row2}>
                <div style={s.group}>
                  <label style={s.label}>{form.type === "percent" ? "Phần trăm giảm (%)" : "Số tiền giảm (đ)"} *</label>
                  <input style={s.input} type="number" min="1"
                    placeholder={form.type === "percent" ? "VD: 10" : "VD: 50000"}
                    value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
                </div>
                {form.type === "percent" && (
                  <div style={s.group}>
                    <label style={s.label}>Giảm tối đa (đ)</label>
                    <input style={s.input} type="number" min="0" placeholder="0 = không giới hạn"
                      value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
                  </div>
                )}
              </div>
              <div style={s.row2}>
                <div style={s.group}>
                  <label style={s.label}>Đơn tối thiểu (đ)</label>
                  <input style={s.input} type="number" min="0" placeholder="0 = không giới hạn"
                    value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
                </div>
                <div style={s.group}>
                  <label style={s.label}>Số lượt dùng tối đa</label>
                  <input style={s.input} type="number" min="1"
                    value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
                </div>
              </div>
              <div style={s.row2}>
                <div style={s.group}>
                  <label style={s.label}>Ngày hết hạn</label>
                  <input style={s.input} type="date"
                    value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
                </div>
                <div style={s.group}>
                  <label style={s.label}>Trạng thái</label>
                  <select style={s.input} value={form.isActive ? "1" : "0"}
                    onChange={(e) => setForm({ ...form, isActive: e.target.value === "1" })}>
                    <option value="1">Hoạt động</option>
                    <option value="0">Tắt</option>
                  </select>
                </div>
              </div>
              <div style={s.modalActions}>
                <button type="button" onClick={closeModal} style={s.cancelBtn}>Hủy</button>
                <button type="submit" style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  {saving ? "Đang lưu..." : modal === "add" ? "Tạo voucher" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter',sans-serif" },
  loadingWrap: { minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #059669", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#1a1a1a", marginBottom: "4px", display: "flex", alignItems: "center" },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  addBtn: { background: "#001C40", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "20px" },
  statCard: { borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column" },
  statLabel: { fontSize: "12px", color: "#6b7280", marginBottom: "4px" },
  statValue: { fontSize: "22px", fontWeight: "800" },
  tableWrap: { background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "12px 16px", fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left", borderBottom: "1px solid #e5e7eb" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "14px 16px", verticalAlign: "middle" },
  codeTag: { display: "inline-block", padding: "4px 12px", background: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0", borderRadius: "6px", fontSize: "13px", fontWeight: "800", letterSpacing: "1px" },
  toggleBtn: { padding: "5px 12px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "700" },
  editBtn: { padding: "7px 10px", background: "#dbeafe", color: "#1d4ed8", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  deleteBtn: { padding: "7px 10px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  modalBox: { background: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  modalTitle: { fontSize: "16px", fontWeight: "700", color: "#1a1a1a", display: "flex", alignItems: "center" },
  closeBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#6b7280", padding: "4px" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  group: { marginBottom: "14px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit", background: "#fafafa" },
  modalActions: { display: "flex", gap: "10px", marginTop: "8px" },
  cancelBtn: { flex: 1, padding: "11px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#374151" },
  saveBtn: { flex: 2, padding: "11px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" },
};

export default AdminVouchers;
