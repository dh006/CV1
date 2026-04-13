import React, { useEffect, useState } from "react";
import { brandAPI } from "../../../services/api";

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | "edit"
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { loadBrands(); }, []);

  const loadBrands = async () => {
    try {
      const res = await brandAPI.getAll();
      setBrands(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => { setForm({ name: "" }); setEditing(null); setModal("add"); };
  const openEdit = (b) => { setForm({ name: b.name }); setEditing(b); setModal("edit"); };  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (modal === "add") {
        await brandAPI.create({ name: form.name.trim() });
      } else {
        await brandAPI.update(editing.id, { name: form.name.trim() });
      }
      await loadBrands();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi lưu thương hiệu!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa thương hiệu "${name}"?`)) return;
    setDeleting(id);
    try {
      await brandAPI.delete(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Không thể xóa thương hiệu này!");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Quản lý thương hiệu</h1>
          <p style={s.subtitle}>{brands.length} thương hiệu trong hệ thống</p>
        </div>
        <button onClick={openAdd} style={s.addBtn}>
          <i className="fa-solid fa-plus" style={{ marginRight: "6px" }} />
          Thêm thương hiệu
        </button>
      </div>

      {/* TOOLBAR */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={s.searchInput}
          />
        </div>
        <span style={s.count}>{filtered.length} kết quả</span>
      </div>

      {/* GRID CARDS */}
      {loading ? (
        <div style={s.skeletonGrid}>
          {Array(8).fill(0).map((_, i) => <div key={i} style={s.skeleton} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <i className="fa-solid fa-tag" style={{ fontSize: "40px", color: "#d1d5db" }} />
          <p>Chưa có thương hiệu nào</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map((b) => (
            <div key={b.id} style={s.card}>
              <div style={s.cardAvatar}>
                {b.image ? (
                  <img src={b.image} alt={b.name} style={s.cardImg}
                    onError={(e) => { e.target.style.display = "none"; }} />
                ) : (
                  <span style={s.cardInitial}>{b.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div style={s.cardBody}>
                <p style={s.cardName}>{b.name}</p>
                <p style={s.cardId}>ID: #{b.id}</p>
              </div>
              <div style={s.cardActions}>
                <button onClick={() => openEdit(b)} style={s.editBtn}>
                  <i className="fa-solid fa-pen" style={{ marginRight: "4px" }} />Sửa
                </button>
                <button
                  onClick={() => handleDelete(b.id, b.name)}
                  style={{ ...s.deleteBtn, opacity: deleting === b.id ? 0.5 : 1 }}
                  disabled={deleting === b.id}
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div style={s.overlay} onClick={closeModal}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>
                <i className={`fa-solid ${modal === "add" ? "fa-plus" : "fa-pen"}`} style={{ marginRight: "8px" }} />
                {modal === "add" ? "Thêm thương hiệu" : "Sửa thương hiệu"}
              </h3>
              <button onClick={closeModal} style={s.closeBtn}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form onSubmit={handleSave} style={s.modalForm}>
              <div style={s.group}>
                <label style={s.label}>Tên thương hiệu *</label>
                <input
                  style={s.input}
                  type="text"
                  placeholder="VD: Nike, Adidas, Levi's..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoFocus
                  required
                />
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#1a1a1a", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  addBtn: { background: "#001C40", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" },
  toolbar: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
  searchWrap: { position: "relative", flex: 1, maxWidth: "360px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" },
  searchInput: { width: "100%", padding: "10px 14px 10px 36px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", background: "#fafafa" },
  count: { fontSize: "13px", color: "#6b7280" },
  skeletonGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" },
  skeleton: { height: "100px", background: "#f3f4f6", borderRadius: "12px" },
  empty: { textAlign: "center", padding: "80px", color: "#9ca3af", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "14px", transition: "box-shadow 0.2s" },
  cardAvatar: { width: "48px", height: "48px", borderRadius: "10px", background: "linear-gradient(135deg,#001C40,#1890ff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" },
  cardImg: { width: "100%", height: "100%", objectFit: "cover" },
  cardInitial: { color: "#fff", fontWeight: "800", fontSize: "20px" },
  cardBody: { flex: 1, minWidth: 0 },
  cardName: { fontSize: "14px", fontWeight: "700", color: "#1a1a1a", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  cardId: { fontSize: "11px", color: "#9ca3af" },
  cardActions: { display: "flex", gap: "6px", flexShrink: 0 },
  editBtn: { padding: "6px 10px", background: "#dbeafe", color: "#1d4ed8", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  deleteBtn: { padding: "6px 10px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
  // Modal
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  modalBox: { background: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  modalTitle: { fontSize: "16px", fontWeight: "700", color: "#1a1a1a" },
  closeBtn: { background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#6b7280" },
  modalForm: {},
  group: { marginBottom: "16px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit", background: "#fafafa" },
  modalActions: { display: "flex", gap: "10px", marginTop: "20px" },
  cancelBtn: { flex: 1, padding: "11px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#374151" },
  saveBtn: { flex: 2, padding: "11px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" },
};

export default AdminBrands;
