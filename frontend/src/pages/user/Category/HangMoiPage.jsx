import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";
import ProductCard from "../../../components/Product/ProductCard";
import QuickViewModal from "../../../components/Product/QuickViewModal";
import { useCart } from "../../../hooks/useCart";

const HangMoiPage = () => {
  const { addToCart } = useCart() || {};
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàng mới = label NEW hoặc 10 sản phẩm mới nhất
  const newProducts = useMemo(() => {
    const labeled = products.filter((p) => p.label === "NEW" || p.label === "new");
    return labeled.length > 0 ? labeled : products.slice(0, 20);
  }, [products]);

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div style={s.heroContent}>
          <nav style={s.breadcrumb}><Link to="/" style={s.breadLink}>Trang chủ</Link> / <strong>Hàng Mới</strong></nav>
          <h1 style={s.heroTitle}>HÀNG MỚI VỀ</h1>
          <h2 style={s.heroSub}>NEW ARRIVALS</h2>
        </div>
        <div style={s.heroImgBox}>
          <img src="https://cdn.hstatic.net/files/1000360022/collection/hang-moi_1cd58c4b42b9419088f85830d5d9527c.jpg" alt="Hàng mới" style={s.heroImg} />
        </div>
      </div>

      <div style={s.toolbar}>
        <p style={s.count}>{loading ? "Đang tải..." : `${newProducts.length} sản phẩm mới`}</p>
      </div>

      {loading ? (
        <div style={s.grid}>{Array(10).fill(0).map((_, i) => <div key={i} style={s.skeleton} />)}</div>
      ) : (
        <div style={s.grid}>
          {newProducts.map((p) => (
            <ProductCard key={p.id} product={p}
              onQuickView={(prod) => { setSelectedProduct(prod); setIsModalOpen(true); }} />
          ))}
        </div>
      )}

      <QuickViewModal isOpen={isModalOpen} product={selectedProduct}
        onClose={() => setIsModalOpen(false)} onAdd={addToCart} />
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
  heroImg: { height: "100%", objectFit: "cover" },
  toolbar: { padding: "16px 5%", borderBottom: "1px solid #f0f0f0" },
  count: { fontSize: "13px", color: "#6b7280", margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "24px 16px", padding: "32px 5%" },
  skeleton: { aspectRatio: "3/4", background: "#f3f4f6", borderRadius: "8px" },
};

export default HangMoiPage;
