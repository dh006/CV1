import React, { useState, useMemo, useEffect } from "react";
import { products as ALL_PRODUCTS } from "../../../constants/products";
import ProductCard from "../../../components/Product/ProductCard";
import QuickViewModal from "../../../components/Product/QuickViewModal";

const SetDoQuanPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. Lọc sản phẩm: Chỉ hiện Set Đồ (nhóm Quần)
  const data = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => p.categorySlug === "set-do-quan");
  }, []);

  // 2. Logic sắp xếp
  const sortedProducts = useMemo(() => {
    let result = [...data];
    if (sortOrder === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [data, sortOrder]);

  return (
    <div style={styles.container}>
      {/* SECTION 1: BANNER SET ĐỒ NHÓM QUẦN */}
      <div style={styles.bannerContainer}>
        <img
          src="https://hami.today/wp-content/uploads/2025/01/20210401_RRhGMiO45aFfqXXlU1HaKVxT.png"
          alt="SET ĐỒ NAM"
          style={styles.bannerImg}
        />
        <div style={styles.bannerText}>
          <h1 style={styles.bannerTitle}>SET ĐỒ NAM</h1>
          <p style={styles.bannerSubtitle}>MATCHING SETS</p>
        </div>
      </div>

      {/* SECTION 2: TOOLBAR SẮP XẾP */}
      <div style={styles.toolbar}>
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
          <div style={styles.noProduct}>Hiện chưa có sản phẩm Set Đồ nào.</div>
        )}
      </div>

      {/* SECTION 4: MÔ TẢ SEO CUỐI TRANG */}
      <div style={styles.seoBox}>
        <p style={styles.seoDesc}>
          Tiết kiệm thời gian phối đồ với bộ sưu tập Set đồ nam ICONDENIM. Những
          sự kết hợp hoàn hảo giữa quần và áo được thiết kế đồng bộ về màu sắc
          và chất liệu, giúp bạn luôn tự tin và phong cách trong mọi hoàn cảnh.
        </p>
        <h2 style={styles.seoHeading}>
          Set Đồ Nam Phối Sẵn - Tiện Lợi & Thời Trang
        </h2>
      </div>

      <QuickViewModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const styles = {
  container: { width: "100%", backgroundColor: "#fff" },

  // Banner
  bannerContainer: { width: "100%", position: "relative" },
  bannerImg: { width: "100%", display: "block", objectFit: "cover" },
  bannerText: {
    position: "absolute",
    top: "50%",
    left: "12%",
    transform: "translateY(-50%)",
  },
  bannerTitle: {
    fontSize: "56px",
    fontWeight: "900",
    color: "#001C40",
    margin: 0,
  },
  bannerSubtitle: {
    fontSize: "28px",
    color: "#001C40",
    margin: 0,
    opacity: 0.7,
  },

  // Toolbar
  toolbar: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "20px 5%",
    borderBottom: "1px solid #eee",
  },
  selectSort: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "13px",
  },

  // Grid sản phẩm
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

  // SEO Box
  seoBox: {
    padding: "50px 10%",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    borderTop: "1px solid #eee",
  },
  seoDesc: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.8",
    marginBottom: "15px",
  },
  seoHeading: { fontSize: "20px", fontWeight: "bold", color: "#000" },
};

export default SetDoQuanPage;
