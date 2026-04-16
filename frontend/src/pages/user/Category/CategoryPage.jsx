import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";
import ProductCard from "../../../components/Product/ProductCard";
import QuickViewModal from "../../../components/Product/QuickViewModal";
import { useCart } from "../../../hooks/useCart";

const CategoryPage = () => {
  const { category } = useParams();
  const { addToCart } = useCart() || {};
  const { products: ALL_PRODUCTS, loading } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("default");
  const itemsPerPage = 20;

  // 1. Dữ liệu các nhóm sản phẩm - Đảm bảo PATH khớp với Route trong App.js
  const categoryGroups = [
    {
      name: "Nhóm áo",
      img: "https://file.hstatic.net/1000360022/file/ao_.jpg",
      slug: "ao-nam",
      path: "/collections/ao-nam", // Link này sẽ thoát CategoryPage để sang AoNamPage.jsx
    },
    {
      name: "Nhóm Quần",
      img: "https://file.hstatic.net/1000360022/file/quan.jpg",
      slug: "quan-nam",
      path: "/collections/quan-nam", // Link này sẽ sang QuanNamPage.jsx
    },
    {
      name: "Nhóm Phụ Kiện",
      img: "https://file.hstatic.net/1000360022/file/phu_kien.jpg",
      slug: "phu-kien",
      path: "/collections/phu-kien",
    },
  ];

  // 2. Logic Lọc theo Category (Dùng cho trường hợp ở lại trang này)
  const categoryFiltered = useMemo(() => {
    if (!category || category === "tat-ca-san-pham") return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter(
      (p) => (p.categoryName || "").toLowerCase().includes(category.replace(/-/g, " "))
        || p.categorySlug === category || p.category === category,
    );
  }, [category, ALL_PRODUCTS]);

  // 3. Logic Sắp xếp
  const sortedProducts = useMemo(() => {
    let result = [...categoryFiltered];
    if (sortOrder === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }
    return result;
  }, [categoryFiltered, sortOrder]);

  // 4. Logic Phân trang
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const lastIdx = currentPage * itemsPerPage;
    return sortedProducts.slice(lastIdx - itemsPerPage, lastIdx);
  }, [sortedProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  // Xác định tiêu đề hiển thị dựa trên URL params
  const displayTitle =
    category === "tat-ca-san-pham" || !category
      ? "TẤT CẢ SẢN PHẨM"
      : category.replace("-", " ").toUpperCase();

  return (
    <div style={styles.container}>
      {/* SECTION 1: HERO BANNER */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <nav style={styles.breadcrumb}>
            Trang chủ / Danh mục / <strong>{displayTitle}</strong>
          </nav>
          <h1 style={styles.heroTitle}>{displayTitle}</h1>
          <h2 style={styles.heroSubtitle}>COLLECTIONS</h2>
        </div>
        <div style={styles.heroImgBox}>
          <img
            src="https://cdn.hstatic.net/files/1000360022/collection/tat-ca-san-pham_d10058b25cec4a56bb7e2b500088b67b.jpg"
            alt="Hero"
            style={styles.heroImg}
          />
        </div>
      </div>

      {/* SECTION 2: NHÓM SẢN PHẨM & TOOLBAR */}
      <div style={styles.groupContainer}>
        <div style={styles.groupRow}>
          {categoryGroups.map((group, i) => (
            <Link
              key={i}
              to={group.path} // Chuyển hướng theo path đã định nghĩa
              style={styles.groupItem}
            >
              <div style={styles.groupImgBox}>
                <img src={group.img} alt={group.name} style={styles.groupImg} />
              </div>
              <span style={styles.groupName}>{group.name}</span>
            </Link>
          ))}
        </div>

        <div style={styles.sortTool}>
          <div style={styles.sortWrapper}>
            <select
              style={styles.selectSort}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">Sản phẩm nổi bật</option>
              <option value="price-asc">Giá: Tăng dần</option>
              <option value="price-desc">Giá: Giảm dần</option>
            </select>
            <span style={styles.sortIcon}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: LƯỚI SẢN PHẨM */}
      <div style={styles.productGrid}>
        {currentItems.length > 0 ? (
          currentItems.map((p) => (
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
          <p
            style={{ gridColumn: "1/-1", textAlign: "center", padding: "50px" }}
          >
            Không tìm thấy sản phẩm nào trong danh mục này.
          </p>
        )}
      </div>

      {/* SECTION 4: PHÂN TRANG */}
      {sortedProducts.length > itemsPerPage && (
        <div style={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            style={styles.pageBtn}
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              style={{
                ...styles.pageBtn,
                ...(currentPage === i + 1 ? styles.activePage : {}),
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            style={styles.pageBtn}
          >
            &gt;
          </button>
        </div>
      )}

      {/* SECTION 5: SEO FOOTER */}
      <div style={styles.seoFooter}>
        <div style={styles.seoTopText}>
          Shop quần áo nam cao cấp DIEP COLLECTION ghi điểm tuyệt đối trong lòng khách
          hàng nhờ chất lượng sản phẩm hoàn hảo, tỉ mỉ trong từng khâu chọn chất
          liệu đến thiết kế.
        </div>
        <h3 style={styles.seoHeading}>
          Quần Áo Nam Đẹp, Shop Thời Trang Nam Hàng Hiệu
        </h3>
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

// Styles giữ nguyên như cũ
const styles = {
  container: { width: "100%", backgroundColor: "#fff" },
  heroSection: {
    display: "flex",
    width: "100%",
    height: "450px",
    backgroundColor: "#f8f9fb",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  heroContent: { paddingLeft: "8%", flex: 1 },
  breadcrumb: { fontSize: "12px", color: "#888", marginBottom: "20px" },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "900",
    color: "#001C40",
    margin: 0,
  },
  heroSubtitle: {
    fontSize: "32px",
    fontWeight: "300",
    color: "#001C40",
    opacity: 0.6,
    marginTop: "5px",
  },
  heroImgBox: {
    flex: 1,
    height: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  heroImg: { height: "100%", objectFit: "cover" },
  groupContainer: { padding: "40px 5%", textAlign: "center" },
  groupRow: {
    display: "flex",
    justifyContent: "center",
    gap: "50px",
    marginBottom: "30px",
  },
  groupItem: {
    textDecoration: "none",
    color: "#000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  groupImgBox: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "1px solid #eee",
    marginBottom: "10px",
  },
  groupImg: { width: "100%", height: "100%", objectFit: "cover" },
  groupName: { fontSize: "14px", fontWeight: "bold" },
  sortTool: {
    display: "flex",
    justifyContent: "flex-end",
    borderTop: "1px solid #eee",
    paddingTop: "20px",
  },
  sortWrapper: { position: "relative", display: "flex", alignItems: "center" },
  selectSort: {
    padding: "10px 35px 10px 15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    appearance: "none",
    backgroundColor: "#fff",
    fontSize: "13px",
    minWidth: "180px",
    outline: "none",
  },
  sortIcon: {
    position: "absolute",
    right: "12px",
    pointerEvents: "none",
    display: "flex",
    color: "#666",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "25px 15px",
    padding: "0 5%",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    margin: "50px 0",
  },
  pageBtn: {
    width: "35px",
    height: "35px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  activePage: { background: "#000", color: "#fff", borderColor: "#000" },
  seoFooter: {
    backgroundColor: "#f4f4f4",
    padding: "60px 10%",
    textAlign: "center",
    borderTop: "1px solid #eee",
  },
  seoTopText: {
    fontSize: "14px",
    color: "#333",
    borderBottom: "1px solid #ccc",
    paddingBottom: "20px",
    marginBottom: "20px",
  },
  seoHeading: {
    fontSize: "22px",
    color: "#888",
    fontWeight: "400",
    marginBottom: "25px",
  },
};

export default CategoryPage;
