import React from "react";
import { Link } from "react-router-dom";
import { useProductsByCategory } from "../../../hooks/useProducts";
import ProductCard from "../../../components/Product/ProductCard";
import QuickViewModal from "../../../components/Product/QuickViewModal";
import { useCart } from "../../../hooks/useCart";
import { useState } from "react";

const RetroSportsPage = () => {
  const { addToCart } = useCart() || {};
  const { products, loading } = useProductsByCategory("thun", "polo", "hoodie", "khoác");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={s.page}>
      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroOverlay} />
        <img
          src="https://cdn.hstatic.net/files/1000360022/file/_nh_menu_m_i_ngang_-_1500x100__3_.jpg"
          alt="Retro Sports"
          style={s.heroImg}
        />
        <div style={s.heroContent}>
          <p style={s.heroTag}>BỘ SƯU TẬP MỚI</p>
          <h1 style={s.heroTitle}>RETRO SPORTS</h1>
          <p style={s.heroDesc}>Phong cách thể thao cổ điển — Năng động hiện đại</p>
          <div style={s.heroBtns}>
            <a href="#products" style={s.btnPrimary}>Xem sản phẩm</a>
            <Link to="/gioi-thieu" style={s.btnOutline}>Về DIEP COLLECTION</Link>
          </div>
        </div>
      </div>

      {/* GIỚI THIỆU */}
      <div style={s.intro}>
        <div style={s.introContainer}>
          <div style={s.introGrid}>
            <div>
              <p style={s.label}>Câu chuyện bộ sưu tập</p>
              <h2 style={s.introTitle}>Retro Sports —<br />Khi thể thao gặp thời trang</h2>
              <p style={s.introText}>
                Lấy cảm hứng từ phong cách thể thao những năm 80-90, bộ sưu tập <strong>Retro Sports</strong> của
                DIEP COLLECTION mang đến sự kết hợp hoàn hảo giữa vẻ đẹp cổ điển và tinh thần năng động hiện đại.
              </p>
              <p style={s.introText}>
                Từ áo hoodie oversized, áo polo phối màu đến áo khoác track jacket —
                mỗi thiết kế đều được chăm chút tỉ mỉ để bạn tự tin thể hiện cá tính riêng.
              </p>
              <div style={s.tags}>
                {["Oversized Fit", "Cotton Premium", "Retro Vibes", "Street Style"].map((t) => (
                  <span key={t} style={s.tag}>{t}</span>
                ))}
              </div>
            </div>
            <div style={s.introImgWrap}>
              <img
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600"
                alt="Retro Sports"
                style={s.introImg}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ĐIỂM NỔI BẬT */}
      <div style={s.features}>
        <div style={s.introContainer}>
          <div style={s.featGrid}>
            {[
              { icon: "fa-shirt", color: "#2563eb", bg: "#dbeafe", title: "Chất liệu cao cấp", desc: "Cotton 220gsm, thoáng mát, bền màu" },
              { icon: "fa-ruler", color: "#059669", bg: "#d1fae5", title: "Form dáng chuẩn", desc: "Oversized & Regular fit, phù hợp mọi vóc dáng" },
              { icon: "fa-palette", color: "#d97706", bg: "#fef3c7", title: "Màu sắc đa dạng", desc: "Tone màu retro: xanh rêu, nâu đất, kem, đen" },
              { icon: "fa-star", color: "#7c3aed", bg: "#ede9fe", title: "Limited Edition", desc: "Số lượng có hạn, sở hữu ngay hôm nay" },
            ].map((f, i) => (
              <div key={i} style={s.featCard}>
                <div style={{ ...s.featIcon, background: f.bg }}>
                  <i className={`fa-solid ${f.icon}`} style={{ color: f.color, fontSize: "20px" }} />
                </div>
                <h4 style={s.featTitle}>{f.title}</h4>
                <p style={s.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SẢN PHẨM */}
      <div id="products" style={s.products}>
        <div style={s.introContainer}>
          <div style={s.productsHead}>
            <h2 style={s.productsTitle}>Sản phẩm Retro Sports</h2>
            <p style={s.productsDesc}>Khám phá các thiết kế mới nhất từ bộ sưu tập</p>
          </div>
          {loading ? (
            <div style={s.loadingWrap}>
              <div style={s.spinner} />
            </div>
          ) : products.length === 0 ? (
            <div style={s.empty}>
              <i className="fa-solid fa-box-open" style={{ fontSize: "40px", color: "#d1d5db" }} />
              <p>Sản phẩm đang được cập nhật...</p>
              <Link to="/collections/ao-nam" style={s.btnPrimary}>Xem áo nam</Link>
            </div>
          ) : (
            <div style={s.grid}>
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p}
                  onQuickView={(prod) => { setSelectedProduct(prod); setIsModalOpen(true); }} />
              ))}
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/collections/ao-nam" style={s.btnPrimary}>Xem thêm sản phẩm →</Link>
          </div>
        </div>
      </div>

      <QuickViewModal isOpen={isModalOpen} product={selectedProduct}
        onClose={() => setIsModalOpen(false)} onAdd={addToCart} />
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter',sans-serif", background: "#fff" },
  hero: { position: "relative", height: "520px", overflow: "hidden" },
  heroImg: { width: "100%", height: "100%", objectFit: "cover" },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(0,0,0,0.75),rgba(0,0,0,0.3))", zIndex: 1 },
  heroContent: { position: "absolute", top: "50%", left: "8%", transform: "translateY(-50%)", zIndex: 2, color: "#fff", maxWidth: "560px" },
  heroTag: { fontSize: "11px", fontWeight: "800", letterSpacing: "3px", textTransform: "uppercase", color: "#fbbf24", marginBottom: "12px" },
  heroTitle: { fontSize: "56px", fontWeight: "900", letterSpacing: "2px", marginBottom: "14px", lineHeight: "1.1" },
  heroDesc: { fontSize: "16px", opacity: 0.85, marginBottom: "28px" },
  heroBtns: { display: "flex", gap: "12px", flexWrap: "wrap" },
  btnPrimary: { display: "inline-block", padding: "13px 28px", background: "#fff", color: "#111", textDecoration: "none", borderRadius: "8px", fontWeight: "700", fontSize: "13px" },
  btnOutline: { display: "inline-block", padding: "13px 28px", background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.6)", textDecoration: "none", borderRadius: "8px", fontWeight: "700", fontSize: "13px" },
  intro: { padding: "72px 20px", background: "#fff" },
  introContainer: { maxWidth: "1200px", margin: "0 auto" },
  introGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" },
  label: { fontSize: "11px", fontWeight: "700", color: "#001C40", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" },
  introTitle: { fontSize: "34px", fontWeight: "900", color: "#111", lineHeight: "1.3", marginBottom: "20px" },
  introText: { fontSize: "15px", color: "#555", lineHeight: "1.8", marginBottom: "14px" },
  tags: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "20px" },
  tag: { padding: "6px 14px", background: "#f3f4f6", color: "#374151", borderRadius: "999px", fontSize: "12px", fontWeight: "600" },
  introImgWrap: { borderRadius: "12px", overflow: "hidden", height: "480px" },
  introImg: { width: "100%", height: "100%", objectFit: "cover" },
  features: { padding: "60px 20px", background: "#f9fafb" },
  featGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" },
  featCard: { background: "#fff", borderRadius: "12px", padding: "24px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  featIcon: { width: "52px", height: "52px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" },
  featTitle: { fontSize: "14px", fontWeight: "700", color: "#111", marginBottom: "8px" },
  featDesc: { fontSize: "12px", color: "#6b7280", lineHeight: "1.6" },
  products: { padding: "72px 20px" },
  productsHead: { textAlign: "center", marginBottom: "40px" },
  productsTitle: { fontSize: "28px", fontWeight: "900", color: "#111", marginBottom: "8px" },
  productsDesc: { fontSize: "14px", color: "#6b7280" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" },
  loadingWrap: { display: "flex", justifyContent: "center", padding: "60px" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #001C40", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  empty: { textAlign: "center", padding: "60px", color: "#9ca3af", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" },
};

export default RetroSportsPage;
