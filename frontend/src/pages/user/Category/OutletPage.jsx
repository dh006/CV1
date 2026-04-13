import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";
import ProductCard from "../../../components/Product/ProductCard";
import QuickViewModal from "../../../components/Product/QuickViewModal";
import { useCart } from "../../../hooks/useCart";

const OutletPage = () => {
  const { addToCart } = useCart() || {};
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Outlet = sản phẩm có giá gốc (đang giảm giá)
  const outletProducts = useMemo(() =>
    products.filter((p) => p.oldPrice && p.oldPrice > p.price),
    [products]
  );

  return (
    <div style={s.container}>
      <div style={{ ...s.hero, backgroundColor: "#1a1a1a" }}>
        <div style={s.heroContent}>
          <nav style={{ ...s.breadcrumb, color: "#aaa" }}><Link to="/" style={{ color: "#aaa", textDecoration: "none" }}>Trang chủ</Link> / <strong style={{ color: "#fff" }}>OUTLET</strong></nav>
          <h1 style={{ ...s.heroTitle, color: "#fff" }}>OUTLET SALE</h1>
          <h2 style={{ ...s.heroSub, color: "#d71920" }}>GIẢM GIÁ ĐẾN 50%</h2>
        </div>
        <div style={s.heroImgBox}>
          <img src="https://cdn.hstatic.net/files/1000360022/collection/outlet_1cd58c4b42b9419088f85830d5d9527c.jpg" alt="Outlet" style={s.heroImg} />
        </div>
      </div>
      <div style={s.toolbar}>
        <p style={s.count}>{loading ? "Đang tải..." : `${outletProducts.length} sản phẩm đang giảm giá`}</p>
      </div>
      <div style={s.grid}>
        {loading
          ? Array(10).fill(0).map((_, i) => <div key={i} style={s.skeleton} />)
          : outletProducts.length > 0
            ? outletProducts.map((p) => (
              <ProductCard key={p.id} product={p}
                onQuickView={(prod) => { setSelectedProduct(prod); setIsModalOpen(true); }} />
            ))
            : <div style={s.empty}><p>Hiện chưa có sản phẩm outlet.</p></div>
        }
      </div>
      <QuickViewModal isOpen={isModalOpen} product={selectedProduct}
        onClose={() => setIsModalOpen(false)} onAdd={addToCart} />
    </div>
  );
};

const s = {
  container: { width: "100%", backgroundColor: "#fff", fontFamily: "'Inter',sans-serif" },
  hero: { display: "flex", height: "420px", alignItems: "center", overflow: "hidden" },
  heroContent: { paddingLeft: "8%", flex: 1 },
  breadcrumb: { fontSize: "12px", color: "#888", marginBottom: "16px" },
  heroTitle: { fontSize: "52px", fontWeight: "900", color: "#001C40", margin: "0 0 8px" },
  heroSub: { fontSize: "26px", fontWeight: "700", margin: 0 },
  heroImgBox: { flex: 1, height: "100%", display: "flex", justifyContent: "flex-end" },
  heroImg: { height: "100%", objectFit: "cover" },
  toolbar: { padding: "16px 5%", borderBottom: "1px solid #f0f0f0" },
  count: { fontSize: "13px", color: "#6b7280", margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "24px 16px", padding: "32px 5%" },
  skeleton: { aspectRatio: "3/4", background: "#f3f4f6", borderRadius: "8px" },
  empty: { gridColumn: "1/-1", textAlign: "center", padding: "80px", color: "#9ca3af" },
};

export default OutletPage;
