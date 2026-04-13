import React, { useState, useMemo, useEffect } from "react";
import { products as ALL_PRODUCTS } from "../../../constants/products";
import ProductCard from "../../../components/Product/ProductCard";
import QuickViewModal from "../../../components/Product/QuickViewModal";

const SetDoPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  // Cuộn lên đầu trang khi vào trang mới
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. LOGIC LỌC: Chỉ hiển thị sản phẩm thuộc nhóm Set Đồ
  const data = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => p.categorySlug === "set-do");
  }, []);

  // 2. LOGIC SẮP XẾP SẢN PHẨM
  const sortedProducts = useMemo(() => {
    let result = [...data];
    if (sortOrder === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [data, sortOrder]);

  return (
    <div style={styles.container}>
      {/* SECTION 1: HERO BANNER (Dành cho Set Đồ) */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <nav style={styles.breadcrumb}>
            Trang chủ / Áo Nam / <strong>Set Đồ</strong>
          </nav>
          <h1 style={styles.heroTitle}>SET ĐỒ NAM</h1>
          <h2 style={styles.heroSubtitle}>MATCHING SETS COLLECTION</h2>
        </div>
        <div style={styles.heroImgBox}>
          <img
            src="https://file.hstatic.net/1000360022/collection/banner_setdo_desktop.jpg"
            alt="Set Đồ Banner"
            style={styles.heroImg}
          />
        </div>
      </div>

      {/* SECTION 2: THANH CÔNG CỤ SẮP XẾP */}
      <div style={styles.toolbar}>
        <div style={styles.sortTool}>
          <select
            style={styles.selectSort}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Sắp xếp: Mới nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      {/* SECTION 3: LƯỚI SẢN PHẨM */}
      <div style={styles.productGrid}>
        {sortedProducts.length > 0 ? (
          sortedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={(prod) => {
                setSelectedProduct(prod);
                setIsModalOpen(true);
              }}
            />
          ))
        ) : (
          <div style={styles.noProduct}>Hiện chưa có mẫu Set Đồ nào.</div>
        )}
      </div>

      <QuickViewModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

// BỘ STYLES CHUẨN ĐỒNG BỘ
const styles = {
  container: { width: "100%", backgroundColor: "#fff" },
  heroSection: {
    display: "flex",
    height: "450px",
    backgroundColor: "#f8f9fb",
    alignItems: "center",
    overflow: "hidden",
  },
  heroContent: { paddingLeft: "8%", flex: 1 },
  breadcrumb: { fontSize: "12px", color: "#888", marginBottom: "15px" },
  heroTitle: {
    fontSize: "56px",
    fontWeight: "900",
    color: "#001C40",
    margin: 0,
  },
  heroSubtitle: {
    fontSize: "28px",
    color: "#001C40",
    opacity: 0.6,
    fontWeight: "300",
  },
  heroImgBox: { flex: 1, height: "100%", textAlign: "right" },
  heroImg: { height: "100%", objectFit: "contain" },
  toolbar: { padding: "20px 5%", borderBottom: "1px solid #eee" },
  sortTool: { display: "flex", justifyContent: "flex-end" },
  selectSort: {
    padding: "8px 15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "13px",
    outline: "none",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "25px 15px",
    padding: "40px 5%",
  },
  noProduct: {
    gridColumn: "1/-1",
    textAlign: "center",
    padding: "100px 0",
    color: "#999",
  },
};

export default SetDoPage;
