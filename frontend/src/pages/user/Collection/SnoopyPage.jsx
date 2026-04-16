import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProductsByCategory } from "../../../hooks/useProducts";
import ProductCard from "../../../components/Product/ProductCard";
import QuickViewModal from "../../../components/Product/QuickViewModal";
import { useCart } from "../../../hooks/useCart";

const SnoopyPage = () => {
  const { addToCart } = useCart() || {};
  const { products, loading } = useProductsByCategory("thun", "polo");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={s.page}>
      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroOverlay} />
        <img
          src="https://cdn.hstatic.net/files/1000360022/file/snoopy_6af2e5a7afa843f6be70b5dc668c9554.jpg"
          alt="Snoopy Collection"
          style={s.heroImg}
        />
        <div style={s.heroContent}>
          <p style={s.heroTag}>✦ LIMITED EDITION ✦</p>
          <h1 style={s.heroTitle}>SNOOPY<br />COLLECTION</h1>
          <p style={s.heroDesc}>Chính thức mở bán — DIEP COLLECTION × Peanuts</p>
          <div style={s.heroBtns}>
            <a href="#products" style={s.btnYellow}>Mua ngay</a>
            <Link to="/gioi-thieu" style={s.btnOutline}>Về DIEP COLLECTION</Link>
          </div>
        </div>
        {/* Badge limited */}
        <div style={s.limitedBadge}>
          <span style={s.limitedText}>LIMITED</span>
          <span style={s.limitedSub}>Số lượng có hạn</span>
        </div>
      </div>

      {/* GIỚI THIỆU */}
      <div style={s.intro}>
        <div style={s.container}>
          <div style={s.introGrid}>
            <div style={s.introImgWrap}>
              <img
                src="https://cdn.hstatic.net/files/1000360022/file/snoopy_6af2e5a7afa843f6be70b5dc668c9554.jpg"
                alt="Snoopy"
                style={s.introImg}
              />
              <div style={s.introBadge}>
                <span>© 2025 Peanuts Worldwide</span>
              </div>
            </div>
            <div>
              <p style={s.label}>Bộ sưu tập đặc biệt</p>
              <h2 style={s.introTitle}>DIEP COLLECTION<br />× Snoopy</h2>
              <p style={s.introText}>
                Lần đầu tiên DIEP COLLECTION hợp tác cùng thương hiệu hoạt hình huyền thoại <strong>Peanuts</strong>
                để ra mắt bộ sưu tập giới hạn mang tên <strong>Snoopy Collection</strong>.
              </p>
              <p style={s.introText}>
                Những chú chó Snoopy đáng yêu được in trực tiếp lên các sản phẩm áo thun, áo polo và túi tote
                với kỹ thuật in cao cấp, bền màu, không phai sau nhiều lần giặt.
              </p>
              <p style={s.introText}>
                Đây là cơ hội hiếm có để sở hữu những thiết kế độc đáo, kết hợp giữa
                phong cách thời trang nam và nét dễ thương của nhân vật hoạt hình yêu thích.
              </p>
              <div style={s.collab}>
                <div style={s.collabItem}>
                  <i className="fa-solid fa-certificate" style={{ color: "#f59e0b", fontSize: "20px" }} />
                  <span>Bản quyền chính thức</span>
                </div>
                <div style={s.collabItem}>
                  <i className="fa-solid fa-fire" style={{ color: "#dc2626", fontSize: "20px" }} />
                  <span>Số lượng giới hạn</span>
                </div>
                <div style={s.collabItem}>
                  <i className="fa-solid fa-gem" style={{ color: "#7c3aed", fontSize: "20px" }} />
                  <span>Chất liệu cao cấp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BANNER GIỮA */}
      <div style={s.midBanner}>
        <div style={s.container}>
          <div style={s.midBannerContent}>
            <h3 style={s.midTitle}>🐾 Snoopy đã đến DIEP COLLECTION!</h3>
            <p style={s.midDesc}>Bộ sưu tập giới hạn — Một khi hết hàng sẽ không sản xuất thêm</p>
            <a href="#products" style={s.btnYellow}>Xem ngay trước khi hết</a>
          </div>
        </div>
      </div>

      {/* SẢN PHẨM */}
      <div id="products" style={s.products}>
        <div style={s.container}>
          <div style={s.productsHead}>
            <h2 style={s.productsTitle}>Sản phẩm Snoopy Collection</h2>
            <p style={s.productsDesc}>Số lượng có hạn — Đặt hàng ngay hôm nay</p>
          </div>
          {loading ? (
            <div style={s.loadingWrap}><div style={s.spinner} /></div>
          ) : products.length === 0 ? (
            <div style={s.empty}>
              <span style={{ fontSize: "48px" }}>🐾</span>
              <p>Sản phẩm đang được cập nhật...</p>
              <Link to="/collections/ao-thun" style={s.btnYellow}>Xem áo thun</Link>
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
            <Link to="/new" style={s.btnYellow}>Xem thêm hàng mới →</Link>
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
  hero: { position: "relative", height: "540px", overflow: "hidden" },
  heroImg: { width: "100%", height: "100%", objectFit: "cover" },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(0,0,0,0.8),rgba(0,0,0,0.2))", zIndex: 1 },
  heroContent: { position: "absolute", top: "50%", left: "8%", transform: "translateY(-50%)", zIndex: 2, color: "#fff", maxWidth: "500px" },
  heroTag: { fontSize: "12px", fontWeight: "800", letterSpacing: "2px", color: "#fbbf24", marginBottom: "14px" },
  heroTitle: { fontSize: "60px", fontWeight: "900", letterSpacing: "3px", marginBottom: "14px", lineHeight: "1.05" },
  heroDesc: { fontSize: "15px", opacity: 0.85, marginBottom: "28px" },
  heroBtns: { display: "flex", gap: "12px", flexWrap: "wrap" },
  btnYellow: { display: "inline-block", padding: "13px 28px", background: "#fbbf24", color: "#111", textDecoration: "none", borderRadius: "8px", fontWeight: "800", fontSize: "13px" },
  btnOutline: { display: "inline-block", padding: "13px 28px", background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.6)", textDecoration: "none", borderRadius: "8px", fontWeight: "700", fontSize: "13px" },
  limitedBadge: { position: "absolute", top: "24px", right: "24px", zIndex: 2, background: "#dc2626", color: "#fff", padding: "10px 16px", borderRadius: "8px", textAlign: "center" },
  limitedText: { display: "block", fontSize: "14px", fontWeight: "900", letterSpacing: "2px" },
  limitedSub: { display: "block", fontSize: "10px", opacity: 0.85, marginTop: "2px" },
  intro: { padding: "72px 20px" },
  container: { maxWidth: "1200px", margin: "0 auto" },
  introGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" },
  introImgWrap: { position: "relative", borderRadius: "12px", overflow: "hidden", height: "500px" },
  introImg: { width: "100%", height: "100%", objectFit: "cover" },
  introBadge: { position: "absolute", bottom: "12px", right: "12px", background: "rgba(0,0,0,0.6)", color: "#fff", padding: "6px 12px", borderRadius: "6px", fontSize: "10px" },
  label: { fontSize: "11px", fontWeight: "700", color: "#dc2626", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" },
  introTitle: { fontSize: "34px", fontWeight: "900", color: "#111", lineHeight: "1.2", marginBottom: "20px" },
  introText: { fontSize: "15px", color: "#555", lineHeight: "1.8", marginBottom: "14px" },
  collab: { display: "flex", gap: "20px", marginTop: "24px", flexWrap: "wrap" },
  collabItem: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "600", color: "#374151" },
  midBanner: { background: "linear-gradient(135deg,#1a1a1a,#333)", padding: "48px 20px" },
  midBannerContent: { maxWidth: "1200px", margin: "0 auto", textAlign: "center" },
  midTitle: { fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "10px" },
  midDesc: { fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "24px" },
  products: { padding: "72px 20px" },
  productsHead: { textAlign: "center", marginBottom: "40px" },
  productsTitle: { fontSize: "28px", fontWeight: "900", color: "#111", marginBottom: "8px" },
  productsDesc: { fontSize: "14px", color: "#6b7280" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" },
  loadingWrap: { display: "flex", justifyContent: "center", padding: "60px" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #001C40", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  empty: { textAlign: "center", padding: "60px", color: "#9ca3af", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" },
};

export default SnoopyPage;
