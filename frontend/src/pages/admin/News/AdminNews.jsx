import React, { useEffect, useState } from "react";
import { newsAPI, BASE_URL } from "../../../services/api";
import api from "../../../services/api";

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "view"
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", image: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { loadNews(); }, []);

  const loadNews = async () => {
    try {
      const res = await newsAPI.getAll();
      setNews(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ title: "", content: "", image: "" });
    setFile(null); setPreview(""); setEditing(null); setModal("add");
  };

  const openEdit = (n) => {
    setForm({ title: n.title || "", content: n.content || "", image: n.image || "" });
    setFile(null);
    setPreview(n.image ? (n.image.startsWith("http") ? n.image : `${BASE_URL}${n.image}`) : "");
    setEditing(n); setModal("edit");
  };

  const openView = (n) => { setEditing(n); setModal("view"); };
  const closeModal = () => { setModal(null); setEditing(null); setFile(null); setPreview(""); };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("content", form.content);
      if (form.image && !file) fd.append("image", form.image);
      if (file) fd.append("image", file);

      if (modal === "add") {
        await api.post("/admin/news", fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.put(`/admin/news/${editing.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      await loadNews();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi lưu tin tức!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa bài viết "${title}"?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/news/${id}`);
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert("Không thể xóa bài viết!");
    } finally {
      setDeleting(null);
    }
  };

  const getImgUrl = (img) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${BASE_URL}${img}`;
  };

  const filtered = news.filter((n) =>
    n.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Quản lý Tin tức</h1>
          <p style={s.subtitle}>{news.length} bài viết trong hệ thống</p>
        </div>
        <button onClick={openAdd} style={s.addBtn}>
          <i className="fa-solid fa-plus" style={{ marginRight: "6px" }} />
          Thêm bài viết
        </button>
      </div>

      {/* TOOLBAR */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={s.searchInput}
          />
        </div>
        <span style={s.count}>{filtered.length} bài viết</span>
      </div>

      {/* LIST */}
      {loading ? (
        <div style={s.skeletonList}>
          {Array(5).fill(0).map((_, i) => <div key={i} style={s.skeleton} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <i className="fa-solid fa-newspaper" style={{ fontSize: "40px", color: "#d1d5db" }} />
          <p>Chưa có bài viết nào</p>
        </div>
      ) : (
        <div style={s.list}>
          {filtered.map((n) => (
            <div key={n.id} style={s.card}>
              {/* THUMBNAIL */}
              <div style={s.thumb}>
                {n.image ? (
                  <img src={getImgUrl(n.image)} alt={n.title} style={s.thumbImg}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/120x80?text=News"; }} />
                ) : (
                  <div style={s.noThumb}>
                <i className="fa-solid fa-newspaper" style={{ fontSize: "24px", color: "#9ca3af" }} />
              </div>
                )}
              </div>

              {/* CONTENT */}
              <div style={s.cardContent}>
                <p style={s.cardTitle}>{n.title}</p>
                <p style={s.cardExcerpt}>
                  {n.content ? n.content.substring(0, 120) + (n.content.length > 120 ? "..." : "") : "Chưa có nội dung"}
                </p>
                <p style={s.cardDate}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }) : ""}
                </p>
              </div>

              {/* ACTIONS */}
              <div style={s.cardActions}>
                <button onClick={() => openView(n)} style={s.viewBtn}>
                  <i className="fa-solid fa-eye" style={{ marginRight: "4px" }} />Xem
                </button>
                <button onClick={() => openEdit(n)} style={s.editBtn}>
                  <i className="fa-solid fa-pen" style={{ marginRight: "4px" }} />Sửa
                </button>
                <button
                  onClick={() => handleDelete(n.id, n.title)}
                  style={{ ...s.deleteBtn, opacity: deleting === n.id ? 0.5 : 1 }}
                  disabled={deleting === n.id}
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL ADD/EDIT */}
      {(modal === "add" || modal === "edit") && (
        <div style={s.overlay} onClick={closeModal}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>
                <i className={`fa-solid ${modal === "add" ? "fa-plus" : "fa-pen"}`} style={{ marginRight: "8px" }} />
                {modal === "add" ? "Thêm bài viết" : "Sửa bài viết"}
              </h3>
              <button onClick={closeModal} style={s.closeBtn}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div style={s.group}>
                <label style={s.label}>Tiêu đề *</label>
                <input style={s.input} type="text" placeholder="Tiêu đề bài viết..."
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  autoFocus required />
              </div>

              <div style={s.group}>
                <label style={s.label}>Ảnh bìa</label>
                <div style={s.uploadArea}>
                  {preview ? (
                    <img src={preview} alt="preview" style={s.previewImg}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x150?text=News"; }} />
                  ) : (
                    <div style={s.uploadPlaceholder}>
                    <i className="fa-solid fa-camera" style={{ fontSize: "24px", color: "#9ca3af" }} />
                    <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "6px" }}>Nhấp để chọn ảnh</p>
                  </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} style={s.fileInput} />
                </div>
                <p style={s.hint}>Hoặc nhập URL ảnh:</p>
                <input style={s.input} type="text" placeholder="https://..."
                  value={form.image}
                  onChange={(e) => { setForm({ ...form, image: e.target.value }); if (!file) setPreview(e.target.value); }} />
              </div>

              <div style={s.group}>
                <label style={s.label}>Nội dung</label>
                <textarea
                  style={{ ...s.input, minHeight: "140px", resize: "vertical" }}
                  placeholder="Nội dung bài viết..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>

              <div style={s.modalActions}>
                <button type="button" onClick={closeModal} style={s.cancelBtn}>Hủy</button>
                <button type="submit" style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  {saving ? "Đang lưu..." : modal === "add" ? "Đăng bài" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VIEW */}
      {modal === "view" && editing && (
        <div style={s.overlay} onClick={closeModal}>
          <div style={{ ...s.modalBox, maxWidth: "680px" }} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>
                <i className="fa-solid fa-newspaper" style={{ marginRight: "8px" }} />
                Xem bài viết
              </h3>
              <button onClick={closeModal} style={s.closeBtn}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            {editing.image && (
              <img src={getImgUrl(editing.image)} alt={editing.title}
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "16px" }}
                onError={(e) => { e.target.style.display = "none"; }} />
            )}
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1a1a1a", marginBottom: "12px" }}>{editing.title}</h2>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "16px" }}>
              {editing.createdAt ? new Date(editing.createdAt).toLocaleDateString("vi-VN") : ""}
            </p>
            <div style={{ fontSize: "14px", color: "#374151", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
              {editing.content || "Chưa có nội dung."}
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button onClick={() => { closeModal(); setTimeout(() => openEdit(editing), 50); }} style={s.editBtn}>
                <i className="fa-solid fa-pen" style={{ marginRight: "4px" }} />Chỉnh sửa
              </button>
              <button onClick={closeModal} style={s.cancelBtn}>Đóng</button>
            </div>
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
  searchWrap: { position: "relative", flex: 1, maxWidth: "400px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" },
  searchInput: { width: "100%", padding: "10px 14px 10px 36px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", background: "#fafafa" },
  count: { fontSize: "13px", color: "#6b7280" },
  skeletonList: { display: "flex", flexDirection: "column", gap: "12px" },
  skeleton: { height: "90px", background: "#f3f4f6", borderRadius: "12px" },
  empty: { textAlign: "center", padding: "80px", color: "#9ca3af", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "16px" },
  thumb: { width: "100px", height: "70px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "#f3f4f6" },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  noThumb: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" },
  cardContent: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: "14px", fontWeight: "700", color: "#1a1a1a", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  cardExcerpt: { fontSize: "12px", color: "#6b7280", lineHeight: "1.5", marginBottom: "4px" },
  cardDate: { fontSize: "11px", color: "#9ca3af" },
  cardActions: { display: "flex", gap: "8px", flexShrink: 0 },
  viewBtn: { padding: "6px 10px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  editBtn: { padding: "6px 10px", background: "#dbeafe", color: "#1d4ed8", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  deleteBtn: { padding: "6px 10px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
  // Modal
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  modalBox: { background: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  modalTitle: { fontSize: "16px", fontWeight: "700", color: "#1a1a1a" },
  closeBtn: { background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#6b7280" },
  group: { marginBottom: "16px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit", background: "#fafafa" },
  uploadArea: { position: "relative", borderRadius: "8px", overflow: "hidden", cursor: "pointer", background: "#f9fafb", border: "2px dashed #e5e7eb", height: "110px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  uploadPlaceholder: { textAlign: "center" },
  fileInput: { position: "absolute", inset: 0, opacity: 0, cursor: "pointer" },
  hint: { fontSize: "11px", color: "#9ca3af", marginBottom: "6px" },
  modalActions: { display: "flex", gap: "10px", marginTop: "20px" },
  cancelBtn: { flex: 1, padding: "11px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#374151" },
  saveBtn: { flex: 2, padding: "11px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" },
};

export default AdminNews;
