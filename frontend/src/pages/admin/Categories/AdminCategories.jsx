import React, { useEffect, useState } from "react";
import { categoryAPI } from "../../../services/api";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | "edit"
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { loadCats(); }, []);

  const loadCats = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => { setForm({ name: "" }); setEditing(null); setModal("add"); };
  const openEdit = (c) => { setForm({ name: c.name }); setEditing(c); setModal("edit"); };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (modal === "add") {
        await categoryAPI.create({ name: form.name.trim() });
      } else {
        await categoryAPI.update(editing.id, { name: form.name.trim() });
      }
      await loadCats();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi lưu danh mục!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa danh mục "${name}"?`)) return;
    setDeleting(id);
    try {
      await categoryAPI.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Không thể xóa danh mục này!");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.spinner} />
      <p style={{ color: "#6b7280", marginTop: "12px" }}>Đang tải...</p>
    </div>
  );

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Quản lý danh mục</h1>
          <p style={s.subtitle}>{categories.length} danh mục trong hệ thống</p>
        </div>
        <button onClick={openAdd} style={s.addBtn}>
          <i className="fa-solid fa-plus" style={{ marginRight: "6px" }} />
          Thêm danh mục
        </button>
      </div>

      {/* STATS */}
      <div style={s.statsGrid}>
        {[
          { label: "Tổng danh mục", value: categories.length, icon: "fa-folder", color: "#dbeafe", iconColor: "#2563eb" },
          { label: "Áo Nam", value: categories.filter(c => ["Áo Thun","Áo Polo","Áo Sơ Mi","Áo Khoác","Áo Nỉ & Len","Áo Hoodie","Tank Top - Áo Ba Lỗ"].includes(c.name)).length, icon: "fa-shirt", color: "#d1fae5", iconColor: "#059669" },
          { label: "Quần Nam", value: categories.filter(c => ["Quần Jean","Quần Short","Quần Kaki","Quần Jogger - Quần Dài","Quần Tây","Quần Boxer"].includes(c.name)).length, icon: "fa-person", color: "#fef3c7", iconColor: "#d97706" },
          { label: "Phụ Kiện", value: categories.filter(c => ["Giày & Dép","Balo & Túi","Nón","Thắt Lưng","Vớ","Mắt Kính"].includes(c.name)).length, icon: "fa-bag-shopping", color: "#ede9fe", iconColor: "#7c3aed" },
        ].map((c, i) => (
          <div key={i} style={{ ...s.statCard, background: c.color }}>
            <i className={`fa-solid ${c.icon}`} style={{ fontSize: "22px", color: c.iconColor, marginBottom: "8px" }} />
            <p style={s.statLabel}>{c.label}</p>
            <p style={{ ...s.statValue, color: c.iconColor }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <i className="fa-solid fa-magnifying-glass" style={s.searchIcon} />
          <input type="text" placeholder="Tìm kiếm danh mục..."
            value={search} onChange={(e) => setSearch(e.target.value)} style={s.searchInput} />
        </div>
        <span style={s.count}>{filtered.length} kết quả</span>
      </div>

      {/* TABLE */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>ID</th>
              <th style={s.th}>Danh mục</th>
              <th style={{ ...s.th, textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>
                  <i className="fa-solid fa-folder-open" style={{ fontSize: "36px", color: "#d1d5db", display: "block", marginBottom: "10px" }} />
                  Không tìm thấy danh mục nào
                </td>
              </tr>
            ) : filtered.map((c) => (
              <tr key={c.id} style={s.tr}>
                <td style={{ ...s.td, color: "#9ca3af", fontSize: "12px", width: "60px" }}>#{c.id}</td>
                <td style={s.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={s.avatar}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ ...s.td, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <button onClick={() => openEdit(c)} style={s.editBtn}>
                      <i className="fa-solid fa-pen" style={{ marginRight: "4px" }} />Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      style={{ ...s.deleteBtn, opacity: deleting === c.id ? 0.5 : 1 }}
                      disabled={deleting === c.id}
                    >
                      <i className="fa-solid fa-trash" style={{ marginRight: "4px" }} />Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
                {modal === "add" ? "Thêm danh mục" : "Sửa danh mục"}
              </h3>
              <button onClick={closeModal} style={s.closeBtn}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div style={s.group}>
                <label style={s.label}>Tên danh mục *</label>
                <input style={s.input} type="text"
                  placeholder="VD: Áo Thun, Quần Jean..."
                  value={form.name}
                  onChange={(e) => setForm({ name: e.target.value })}
                  autoFocus required />
              </div>
              <div style={s.modalActions}>
                <button type="button" onClick={closeModal} style={s.cancelBtn}>Hủy</button>
                <button type="submit" style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  {saving ? "Đang lưu..." : modal === "add" ? "Thêm mới" : "Lưu thay đổi"}
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
  loadingWrap: { minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #001C40", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#1a1a1a", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  addBtn: { background: "#001C40", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "20px" },
  statCard: { borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column" },
  statLabel: { fontSize: "12px", color: "#6b7280", marginBottom: "4px" },
  statValue: { fontSize: "22px", fontWeight: "800" },
  toolbar: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" },
  searchWrap: { position: "relative", flex: 1, maxWidth: "400px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "#9ca3af" },
  searchInput: { width: "100%", padding: "10px 14px 10px 36px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", background: "#fafafa" },
  count: { fontSize: "13px", color: "#6b7280" },
  tableWrap: { background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "12px 16px", fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left", borderBottom: "1px solid #e5e7eb" },
  tr: { borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" },
  td: { padding: "14px 16px", verticalAlign: "middle" },
  avatar: { width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg,#001C40,#1890ff)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px", flexShrink: 0 },
  editBtn: { padding: "6px 12px", background: "#dbeafe", color: "#1d4ed8", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", display: "inline-flex", alignItems: "center" },
  deleteBtn: { padding: "6px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", display: "inline-flex", alignItems: "center" },
  // Modal
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  modalBox: { background: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  modalTitle: { fontSize: "16px", fontWeight: "700", color: "#1a1a1a", display: "flex", alignItems: "center" },
  closeBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#6b7280", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px" },
  group: { marginBottom: "16px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit", background: "#fafafa" },
  modalActions: { display: "flex", gap: "10px", marginTop: "20px" },
  cancelBtn: { flex: 1, padding: "11px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#374151" },
  saveBtn: { flex: 2, padding: "11px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" },
};

export default AdminCategories;
