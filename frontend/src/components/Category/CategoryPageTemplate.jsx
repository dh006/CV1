/**
 * Template tái sử dụng cho tất cả trang danh mục
 * Load sản phẩm từ API theo keyword danh mục
 */
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProductsByCategory } from "../../hooks/useProducts";
import ProductCard from "../Product/ProductCard";
import QuickViewModal from "../Product/QuickViewModal";
import { useCart } from "../../hooks/useCart";

const CategoryPageTemplate = ({
  title,           // VD: "ÁO THUN NAM"
  subtitle,        // VD: "T-SHIRTS COLLECTION"
  breadcrumb,      // VD: "Áo Nam / Áo Thun"
  heroImage,       // URL ảnh hero
  categoryKeywords, // VD: ["thun"] — dùng để filter theo categoryName
  emptyText,       // Text khi không có sản phẩm
}) => {
  const { addToCart } = useCart() || {};
  const { products, loading } = useProductsByCategory(...(categoryKeywords || []));
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  const sorted = useMemo(() => {
    const list = [...products];
    if (sortOrder === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortOrder === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [products, sortOrder]);

  return (
    <div style={s.container}>
      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroContent}>
          <nav style={s.breadcrumb}>
            <Link to="/" style={s.breadLink}>Trang chủ</Link>
            {breadcrumb && <> / <span>{breadcrumb}</span></>}
            {" / "}<strong>{title}</strong>
          </nav>
          <h1 style={s.heroTitle}>{title}</h1>
          {subtitle && <h2 style={s.heroSub}>{subtitle}</h2>}
        </div>
        {heroImage && (
          <div style={s.heroImgBox}>
            <img src={heroImage} alt={title} style={s.heroImg} />
          </div>
        )}
      </div>

      {/* TOOLBAR */}
      <div style={s.toolbar}>
        <p style={s.count}>
          {loading ? "Đang tải..." : `${sorted.length} sản phẩm`}
        </p>
        <select style={s.select} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="default">Nổi bật</option>
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá: Thấp → Cao</option>
          <option value="price-desc">Giá: Cao → Thấp</option>
        </select>
      </div>

      {/* GRID */}
      {loading ? (
        <div style={s.skeletonGrid}>
          {Array(10).fill(0).map((_, i) => <div key={i} style={s.skeleton} />)}
        </div>
      ) : sorted.length > 0 ? (
        <div style={s.grid}>
          {sorted.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={(prod) => { setSelectedProduct(prod); setIsModalOpen(true); }}
            />
          ))}
        </div>
      ) : (
        <div style={s.empty}>
          <span style={{ fontSize: "56px" }}>👕</span>
          <p>{emptyText || "Chưa có sản phẩm trong danh mục này."}</p>
          <Link to="/" style={s.backHome}>Về trang chủ</Link>
        </div>
      )}

      <QuickViewModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onAdd={addToCart}
      />
    </div>
  );
};

const s = {
  container: { width: "100%", backgroundColor: "#fff", fontFamily: "'Inter',sans-serif" },
  hero: { display: "flex", height: "420px", backgroundColor: "#f8f9fb", alignItems: "center", overflow: "hidden" },
  heroContent: { paddingLeft: "8%", flex: 1 },
  breadcrumb: { fontSize: "12px", color: "#888", marginBottom: "16px" },
  breadLink: { color: "#888", textDecoration: "none" },
  heroTitle: { fontSize: "52px", fontWeight: "900", color: "#001C40", margin: "0 0 8px" },
  heroSub: { fontSize: "26px", color: "#001C40", opacity: 0.5, fontWeight: "300", margin: 0 },
  heroImgBox: { flex: 1, height: "100%", display: "flex", justifyContent: "flex-end" },
  heroImg: { height: "100%", objectFit: "cover", maxWidth: "100%" },
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 5%", borderBottom: "1px solid #f0f0f0" },
  count: { fontSize: "13px", color: "#6b7280", margin: 0 },
  select: { padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "13px", outline: "none", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "24px 16px", padding: "32px 5%" },
  skeletonGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "24px 16px", padding: "32px 5%" },
  skeleton: { aspectRatio: "3/4", background: "#f3f4f6", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" },
  empty: { textAlign: "center", padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", color: "#9ca3af" },
  backHome: { display: "inline-block", padding: "12px 28px", background: "#001C40", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "700", fontSize: "13px" },
};

export default CategoryPageTemplate;
