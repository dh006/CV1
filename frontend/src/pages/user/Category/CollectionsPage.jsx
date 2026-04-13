import React from "react";
import { Link } from "react-router-dom";

const COLLECTIONS = [
  {
    name: "AIRFLEX™ COLLECTION",
    desc: "Công nghệ co giãn 4 chiều, thoải mái tuyệt đối",
    img: "https://cdn.hstatic.net/files/1000360022/file/thumbnail_-_airflex_collection.jpg",
    to: "/collections/airflex",
    tag: "PREMIUM",
  },
  {
    name: "Retro Sports",
    desc: "Phong cách thể thao cổ điển, năng động hiện đại",
    img: "https://cdn.hstatic.net/files/1000360022/file/_nh_menu_m_i_ngang_-_1500x100__3_.jpg",
    to: "/collections/retro-sports",
    tag: "TRENDING",
  },
  {
    name: "Snoopy Collection",
    desc: "Bộ sưu tập hoạt hình đáng yêu, cá tính",
    img: "https://cdn.hstatic.net/files/1000360022/file/snoopy_6af2e5a7afa843f6be70b5dc668c9554.jpg",
    to: "/collections/snoopy",
    tag: "LIMITED",
  },
  {
    name: "ProCOOL++™",
    desc: "Vải thoáng mát, chống tia UV, lý tưởng cho mùa hè",
    img: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=600",
    to: "/collections/procool",
    tag: "SUMMER",
  },
  {
    name: "Smart Jeans™",
    desc: "Jean thông minh, form chuẩn, phù hợp mọi dịp",
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
    to: "/collections/smart-jeans",
    tag: "SMART",
  },
  {
    name: "Thu Đông Collection",
    desc: "Áo khoác, áo nỉ ấm áp cho mùa lạnh",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
    to: "/collections/ao-ni-len",
    tag: "WINTER",
  },
];

const TAG_COLORS = {
  PREMIUM: { bg: "#fef3c7", color: "#b45309" },
  TRENDING: { bg: "#dbeafe", color: "#1d4ed8" },
  LIMITED: { bg: "#fee2e2", color: "#dc2626" },
  SUMMER: { bg: "#d1fae5", color: "#059669" },
  SMART: { bg: "#ede9fe", color: "#7c3aed" },
  WINTER: { bg: "#f3f4f6", color: "#374151" },
};

const CollectionsPage = () => {
  return (
    <div style={s.page}>
      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroOverlay} />
        <img
          src="https://cdn.hstatic.net/files/1000360022/file/2500x991_-_banner_web_d_nh_v__jeans_-_ngang.jpg"
          alt="Collections"
          style={s.heroImg}
        />
        <div style={s.heroContent}>
          <p style={s.heroSub}>DIEP COLLECTION</p>
          <h1 style={s.heroTitle}>BỘ SƯU TẬP</h1>
          <p style={s.heroDesc}>Khám phá những bộ sưu tập độc đáo, được thiết kế riêng cho phong cách của bạn</p>
        </div>
      </div>

      {/* GRID */}
      <div style={s.container}>
        <div style={s.grid}>
          {COLLECTIONS.map((col, i) => {
            const tagStyle = TAG_COLORS[col.tag] || TAG_COLORS.SMART;
            return (
              <Link key={i} to={col.to} style={s.card}>
                <div style={s.imgWrap}>
                  <img src={col.img} alt={col.name} style={s.img}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Collection"; }} />
                  <div style={s.imgOverlay} />
                  <span style={{ ...s.tag, background: tagStyle.bg, color: tagStyle.color }}>
                    {col.tag}
                  </span>
                </div>
                <div style={s.info}>
                  <h3 style={s.name}>{col.name}</h3>
                  <p style={s.desc}>{col.desc}</p>
                  <span style={s.cta}>
                    Xem ngay
                    <i className="fa-solid fa-arrow-right" style={{ marginLeft: "6px", fontSize: "11px" }} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter',sans-serif", backgroundColor: "#fff" },
  hero: { position: "relative", height: "380px", overflow: "hidden" },
  heroImg: { width: "100%", height: "100%", objectFit: "cover" },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(0,28,64,0.8),rgba(0,28,64,0.4))", zIndex: 1 },
  heroContent: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", color: "#fff", zIndex: 2, width: "80%" },
  heroSub: { fontSize: "12px", letterSpacing: "4px", opacity: 0.7, marginBottom: "10px", textTransform: "uppercase" },
  heroTitle: { fontSize: "52px", fontWeight: "900", letterSpacing: "4px", marginBottom: "14px" },
  heroDesc: { fontSize: "15px", opacity: 0.8, maxWidth: "500px", margin: "0 auto", lineHeight: "1.6" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "60px 20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" },
  card: { textDecoration: "none", borderRadius: "14px", overflow: "hidden", border: "1px solid #e5e7eb", transition: "transform 0.2s, box-shadow 0.2s", display: "block" },
  imgWrap: { position: "relative", height: "220px", overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" },
  imgOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)" },
  tag: { position: "absolute", top: "12px", left: "12px", padding: "4px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: "800", letterSpacing: "0.5px" },
  info: { padding: "18px 20px" },
  name: { fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" },
  desc: { fontSize: "13px", color: "#6b7280", lineHeight: "1.5", marginBottom: "12px" },
  cta: { fontSize: "12px", fontWeight: "700", color: "#001C40", display: "flex", alignItems: "center" },
};

export default CollectionsPage;
