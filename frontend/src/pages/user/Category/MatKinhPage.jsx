import React, { useState, useMemo, useEffect, useContext } from "react";
import { products as ALL_PRODUCTS } from "../../../constants/products";
import ProductCard from "../../../components/Product/ProductCard";
import QuickViewModal from "../../../components/Product/QuickViewModal";
import { CartContext } from "../../../context/CartContext";

// --- CẤU HÌNH RIÊNG CHO DANH MỤC MẮT KÍNH ---
const CATEGORY_NAME = "";
const CATEGORY_SUBTITLE = "";
const CATEGORY_SLUG = "mat-kinh";
// Link banner cho Mắt kính nam
const BANNER_IMG =
  "https://cdn.hstatic.net/files/1000360022/collection/mat-kinh_722d09178d0d4faba00df9722785a5a5.jpg";

const MatKinhPage = () => {
  const { addToCart } = useContext(CartContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. Lọc sản phẩm theo Slug danh mục mat-kinh
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => p.categorySlug === CATEGORY_SLUG);
  }, []);

  // 2. Logic sắp xếp
  const sortedProducts = useMemo(() => {
    let result = [...filteredProducts];
    if (sortOrder === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [filteredProducts, sortOrder]);

  return (
    <div style={styles.container}>
      {/* SECTION 1: BREADCRUMB */}
      <div style={styles.breadcrumb}>
        Trang chủ / Phụ kiện /{" "}
        <span style={{ color: "#000", fontWeight: "bold" }}>
          {CATEGORY_NAME}
        </span>
      </div>

      {/* SECTION 2: BANNER DANH MỤC */}
      <div style={styles.bannerContainer}>
        <img src={BANNER_IMG} alt={CATEGORY_NAME} style={styles.bannerImg} />
        <div style={styles.bannerOverlay}>
          <h1 style={styles.bannerTitle}>{CATEGORY_NAME}</h1>
          <p style={styles.bannerSubtitle}>{CATEGORY_SUBTITLE}</p>
        </div>
      </div>

      {/* SECTION 3: TOOLBAR */}
      <div style={styles.toolbar}>
        <div style={styles.countText}>
          Tìm thấy <strong>{sortedProducts.length}</strong> mẫu mắt kính thời
          trang
        </div>
        <div style={styles.sortWrapper}>
          <span
            style={{ fontSize: "13px", marginRight: "10px", color: "#666" }}
          >
            Sắp xếp:
          </span>
          <select
            style={styles.selectSort}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Sản phẩm nổi bật</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      {/* SECTION 4: LƯỚI SẢN PHẨM 5 CỘT */}
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
          <div style={styles.noProduct}>
            Đang cập nhật các mẫu kính mới nhất.
          </div>
        )}
      </div>

      {/* SECTION 5: SEO BOX */}
      <div style={styles.seoBox}>
        <h2 style={styles.seoHeading}>
          Mắt Kính Nam Thời Trang - Bảo Vệ & Phong Cách
        </h2>
        <p style={styles.seoDesc}>
          Nâng tầm diện mạo với bộ sưu tập mắt kính nam từ DIEP COLLECTION.
          Thiết kế gọng kính đa dạng từ cổ điển đến hiện đại, tròng kính chống
          tia UV400 bảo vệ mắt tối ưu, là phụ kiện không thể thiếu cho phái mạnh
          khi ra phố.
        </p>
      </div>

      <QuickViewModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onAdd={addToCart}
      />
    </div>
  );
};

const styles = {
  container: { width: "100%", backgroundColor: "#fff" },
  breadcrumb: { padding: "15px 5%", fontSize: "13px", color: "#888" },

  bannerContainer: {
    width: "100%",
    position: "relative",
    marginBottom: "40px",
  },
  bannerImg: {
    width: "100%",
    display: "block",
    objectFit: "cover",
    minHeight: "350px",
  },
  bannerOverlay: {
    position: "absolute",
    top: "50%",
    left: "8%",
    transform: "translateY(-50%)",
  },
  bannerTitle: {
    fontSize: "65px",
    fontWeight: "900",
    color: "#001C40",
    margin: "0 0 5px 0",
    letterSpacing: "-1px",
  },
  bannerSubtitle: {
    fontSize: "28px",
    color: "#001C40",
    fontWeight: "500",
    margin: 0,
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 5% 30px",
    padding: "20px 0",
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
  },
  countText: { fontSize: "14px", color: "#333" },
  selectSort: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    outline: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "30px 15px",
    padding: "0 5% 80px",
  },
  noProduct: {
    gridColumn: "1/-1",
    textAlign: "center",
    padding: "100px 0",
    color: "#999",
  },

  seoBox: {
    padding: "50px 10%",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  seoHeading: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
  },
  seoDesc: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.8",
    maxWidth: "850px",
    margin: "0 auto",
  },
};

export default MatKinhPage;
