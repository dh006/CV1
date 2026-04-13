import React, { useEffect, useState } from "react";
import { bannerAPI, BASE_URL } from "../../../services/api";
import api from "../../../services/api";

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | "edit"
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", image: "", status: 1 });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { loadBanners(); }, []);

  const loadBanners = async () => {
    try {
      const res = await bannerAPI.getAll();
      setBanners(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ name: "", image: "", status: 1 });
    setFile(null); setPreview(""); setEditing(null); setModal("add");
  };

  const openEdit = (b) => {
    setForm({ name: b.name || "", image: b.image || "", status: b.status ?? 1 });
    setFile(null);
    setPreview(b.image ? (b.image.startsWith("http") ? b.image : `${BASE_URL}${b.image}`) : "");
    setEditing(b); setModal("edit");
  };

  const closeModal = () => { setModal(null); setEditing(null); setFile(null); setPreview(""); };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (file) {
        // Upload ảnh qua multipart
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("status", form.status);
        fd.append("image", file);
        if (modal === "add") {
          await api.post("/admin/banners", fd, { headers: { "Content-Type": "multipart/form-data" } });
        } else {
          await api.put(`/admin/banners/${editing.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        }
      } else {
        // Chỉ cập nhật text
        if (modal === "add") {
          await bannerAPI.create ? api.post("/admin/banners", form) : null;
        } else {
          await api.put(`/admin/banners/${editing.id}`, form);
        }
      }
      await loadBanners();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi lưu banner!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa banner "${name || `#${id}`}"?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/banners/${id}`);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert("Không thể xóa banner!");
    } finally {
      setDeleting(null);
    }
  };

  const toggleStatus = async (b) => {
    try {
      await api.put(`/admin/banners/${b.id}`, { status: b.status === 1 ? 0 : 1 });
      setBanners((prev) => prev.map((item) =>
        item.id === b.id ? { ...item, status: item.status === 1 ? 0 : 1 } : item
      ));
    } catch (err) {
      alert("Không thể cập nhật trạng thái!");
    }
  };

  const getImgUrl = (img) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${BASE_URL}${img}`;
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Quản lý Banner</h1>
          <p style={s.subtitle}>{banners.length} banner trong hệ thống</p>
        </div>
        <button onClick={openAdd} style={s.addBtn}>
          <i className="fa-solid fa-plus" style={{ marginRight: "6px" }} />
          Thêm banner
        </button>
      </div>

      {loading ? (
        <div style={s.skeletonGrid}>
          {Array(4).fill(0).map((_, i) => <div key={i} style={s.skeleton} />)}
        </div>
      ) : banners.length === 0 ? (
        <div style={s.empty}>
          <i className="fa-solid fa-image" style={{ fontSize: "40px", color: "#d1d5db" }} />
          <p>Chưa có banner nào</p>
        </div>
      ) : (
        <div style={s.grid}>
          {banners.map((b) => (
            <div key={b.id} style={s.card}>
              {/* ẢNH BANNER */}
              <div style={s.imgWrap}>
                {b.image ? (
                  <img src={getImgUrl(b.image)} alt={b.name} style={s.bannerImg}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/800x300?text=Banner"; }} />
                ) : (
                  <div style={s.noImg}>
                    <i className="fa-solid fa-image" style={{ fontSize: "24px", color: "#9ca3af" }} />
                  </div>
                )}
                <div style={{ ...s.statusBadge, background: b.status === 1 ? "#d1fae5" : "#fee2e2", color: b.status === 1 ? "#059669" : "#dc2626" }}>
                  {b.status === 1 ? "● Hiển thị" : "● Ẩn"}
                </div>
              </div>

              {/* INFO */}
              <div style={s.cardBody}>
                <div style={s.cardInfo}>
                  <p style={s.cardName}>{b.name || `Banner #${b.id}`}</p>
                  <p style={s.cardId}>ID: #{b.id}</p>
                </div>
                <div style={s.cardActions}>
                  <button onClick={() => toggleStatus(b)} style={s.toggleBtn} title="Bật/tắt hiển thị">
                    <i className={`fa-solid ${b.status === 1 ? "fa-eye-slash" : "fa-eye"}`} style={{ marginRight: "4px" }} />
                    {b.status === 1 ? "Ẩn" : "Hiện"}
                  </button>
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
                {modal === "add" ? "Thêm banner" : "Sửa banner"}
              </h3>
              <button onClick={closeModal} style={s.closeBtn}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div style={s.group}>
                <label style={s.label}>Tên banner</label>
                <input style={s.input} type="text" placeholder="VD: Banner Tết 2026"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div style={s.group}>
                <label style={s.label}>Ảnh banner *</label>
                <div style={s.uploadArea}>
                  {preview ? (
                    <img src={preview} alt="preview" style={s.previewImg}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x150?text=Banner"; }} />
                  ) : (
                    <div style={s.uploadPlaceholder}>
                    <i className="fa-solid fa-image" style={{ fontSize: "28px", color: "#9ca3af" }} />
                    <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "8px" }}>Nhấp để chọn ảnh</p>
                  </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} style={s.fileInput} />
                </div>
                <p style={s.hint}>Hoặc nhập URL ảnh:</p>
                <input style={s.input} type="text" placeholder="https://..."
                  value={form.image} onChange={(e) => { setForm({ ...form, image: e.target.value }); if (!file) setPreview(e.target.value); }} />
              </div>

              <div style={s.group}>
                <label style={s.label}>Trạng thái</label>
                <select style={s.input} value={form.status}
                  onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}>
                  <option value={1}>Hiển thị</option>
                  <option value={0}>Ẩn</option>
                </select>
              </div>

              <div style={s.modalActions}>
                <button type="button" onClick={closeModal} style={s.cancelBtn}>Hủy</button>
                <button type="submit" style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  {saving ? "Đang lưu..." : modal === "add" ? "Thêm banner" : "Lưu thay đổi"}
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
  skeletonGrid: { display: "flex", flexDirection: "column", gap: "16px" },
  skeleton: { height: "160px", background: "#f3f4f6", borderRadius: "12px" },
  empty: { textAlign: "center", padding: "80px", color: "#9ca3af", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  grid: { display: "flex", flexDirection: "column", gap: "16px" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" },
  imgWrap: { position: "relative", width: "100%", height: "160px", background: "#f3f4f6" },
  bannerImg: { width: "100%", height: "100%", objectFit: "cover" },
  noImg: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "14px" },
  statusBadge: { position: "absolute", top: "10px", right: "10px", padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "700" },
  cardBody: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px" },
  cardInfo: {},
  cardName: { fontSize: "14px", fontWeight: "700", color: "#1a1a1a", marginBottom: "2px" },
  cardId: { fontSize: "11px", color: "#9ca3af" },
  cardActions: { display: "flex", gap: "8px" },
  toggleBtn: { padding: "6px 12px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  editBtn: { padding: "6px 12px", background: "#dbeafe", color: "#1d4ed8", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  deleteBtn: { padding: "6px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
  // Modal
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  modalBox: { background: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  modalTitle: { fontSize: "16px", fontWeight: "700", color: "#1a1a1a" },
  closeBtn: { background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#6b7280" },
  group: { marginBottom: "16px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit", background: "#fafafa" },
  uploadArea: { position: "relative", borderRadius: "8px", overflow: "hidden", cursor: "pointer", background: "#f9fafb", border: "2px dashed #e5e7eb", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  uploadPlaceholder: { textAlign: "center" },
  fileInput: { position: "absolute", inset: 0, opacity: 0, cursor: "pointer" },
  hint: { fontSize: "11px", color: "#9ca3af", marginBottom: "6px" },
  modalActions: { display: "flex", gap: "10px", marginTop: "20px" },
  cancelBtn: { flex: 1, padding: "11px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#374151" },
  saveBtn: { flex: 2, padding: "11px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" },
};

export default AdminBanners;
