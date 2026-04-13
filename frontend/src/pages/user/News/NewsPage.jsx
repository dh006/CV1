import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { newsAPI, BASE_URL } from "../../../services/api";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    newsAPI.getAll()
      .then((res) => setNews(res.data || []))
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  const getImg = (img) => {
    if (!img) return "https://via.placeholder.com/600x300?text=News";
    return img.startsWith("http") ? img : `${BASE_URL}${img}`;
  };

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.spinner} />
    </div>
  );

  return (
    <div style={s.page}>
      {/* HERO */}
      <div style={s.hero}>
        <h1 style={s.heroTitle}>TIN TỨC & XU HƯỚNG</h1>
        <p style={s.heroSub}>Cập nhật những xu hướng thời trang mới nhất từ DIEP COLLECTION</p>
      </div>

      <div style={s.container}>
        {news.length === 0 ? (
          <div style={s.empty}>
            <i className="fa-solid fa-newspaper" style={{ fontSize: "52px", color: "#d1d5db" }} />
            <p style={{ color: "#9ca3af", marginTop: "16px" }}>Chưa có tin tức nào</p>
            <Link to="/" style={s.backBtn}>Về trang chủ</Link>
          </div>
        ) : (
          <div style={s.grid}>
            {news.map((n) => (
              <div key={n.id} style={s.card} onClick={() => setSelected(n)}>
                <div style={s.imgWrap}>
                  <img src={getImg(n.image)} alt={n.title} style={s.img}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x220?text=News"; }} />
                </div>
                <div style={s.info}>
                  <p style={s.date}>
                    <i className="fa-regular fa-calendar" style={{ marginRight: "5px" }} />
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString("vi-VN") : ""}
                  </p>
                  <h3 style={s.title}>{n.title}</h3>
                  {n.content && (
                    <p style={s.excerpt}>{n.content.substring(0, 120)}{n.content.length > 120 ? "..." : ""}</p>
                  )}
                  <span style={s.readMore}>
                    Đọc thêm <i className="fa-solid fa-arrow-right" style={{ marginLeft: "4px", fontSize: "11px" }} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL XEM CHI TIẾT */}
      {selected && (
        <div style={s.overlay} onClick={() => setSelected(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={() => setSelected(null)}>
              <i className="fa-solid fa-xmark" />
            </button>
            {selected.image && (
              <img src={getImg(selected.image)} alt={selected.title} style={s.modalImg}
                onError={(e) => { e.target.style.display = "none"; }} />
            )}
            <div style={s.modalBody}>
              <p style={s.modalDate}>
                <i className="fa-regular fa-calendar" style={{ marginRight: "5px" }} />
                {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString("vi-VN") : ""}
              </p>
              <h2 style={s.modalTitle}>{selected.title}</h2>
              <div style={s.modalContent}>
                {selected.content || "Chưa có nội dung."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter',sans-serif", backgroundColor: "#fff", minHeight: "80vh" },
  loadingWrap: { minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #001C40", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  hero: { background: "linear-gradient(135deg,#001C40,#003080)", color: "#fff", padding: "60px 20px", textAlign: "center" },
  heroTitle: { fontSize: "36px", fontWeight: "900", letterSpacing: "2px", marginBottom: "12px" },
  heroSub: { fontSize: "15px", opacity: 0.75, maxWidth: "500px", margin: "0 auto" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "50px 20px" },
  empty: { textAlign: "center", padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  backBtn: { display: "inline-block", padding: "12px 28px", background: "#001C40", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "700", fontSize: "13px", marginTop: "8px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" },
  card: { borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s" },
  imgWrap: { height: "200px", overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" },
  info: { padding: "18px" },
  date: { fontSize: "11px", color: "#9ca3af", marginBottom: "8px", display: "flex", alignItems: "center" },
  title: { fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "8px", lineHeight: "1.4" },
  excerpt: { fontSize: "13px", color: "#6b7280", lineHeight: "1.6", marginBottom: "12px" },
  readMore: { fontSize: "12px", fontWeight: "700", color: "#001C40", display: "flex", alignItems: "center" },
  // Modal
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  modal: { background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "680px", maxHeight: "85vh", overflowY: "auto", position: "relative" },
  closeBtn: { position: "absolute", top: "14px", right: "14px", background: "#f3f4f6", border: "none", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", zIndex: 10 },
  modalImg: { width: "100%", height: "260px", objectFit: "cover", borderRadius: "16px 16px 0 0" },
  modalBody: { padding: "24px 28px" },
  modalDate: { fontSize: "12px", color: "#9ca3af", marginBottom: "10px", display: "flex", alignItems: "center" },
  modalTitle: { fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "16px", lineHeight: "1.3" },
  modalContent: { fontSize: "15px", color: "#374151", lineHeight: "1.8", whiteSpace: "pre-wrap" },
};

export default NewsPage;
