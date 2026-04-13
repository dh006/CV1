import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Dùng để chuyển trang
import Badge from "../Common/Badge";

const ProductCard = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Tính toán phần trăm giảm giá
  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  // Hàm xử lý khi click vào sản phẩm
  const handleProductClick = () => {
    // Chuyển hướng đến trang chi tiết sản phẩm dựa trên slug
    // Giống link: icondenim.com/products/ten-san-pham
    navigate(`/products/${product.slug}`);
  };

  return (
    <div
      style={{
        ...styles.card,
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // CLICK VÀO CARD SẼ CHUYỂN TRANG
      onClick={handleProductClick}
    >
      <div style={styles.imageContainer}>
        {/* Lớp ảnh 1: Mặc định */}
        <img
          src={product.image}
          alt={product.name}
          style={{
            ...styles.image,
            opacity: isHovered && product.hoverImage ? 0 : 1,
          }}
        />

        {/* Lớp ảnh 2: Hiện khi hover */}
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} hover`}
            style={{
              ...styles.image,
              opacity: isHovered ? 1 : 0,
              zIndex: 1,
            }}
          />
        )}

        {/* Nút Xem nhanh (Icon ở giữa) */}
        <div
          style={{
            ...styles.quickViewIcon,
            opacity: isHovered ? 1 : 0,
            transform: isHovered
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -50%) scale(0.8)",
          }}
          onClick={(e) => {
            e.stopPropagation(); // Chặn việc chuyển trang khi nhấn xem nhanh
            onQuickView(product);
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>

        {/* Badge Wrapper (New/Sale) */}
        <div style={styles.badgeWrapper}>
          {product.label === "NEW" && (
            <Badge text="New" type="new" style={styles.badgeItem} />
          )}
          {discountPercent && (
            <Badge
              text={`-${discountPercent}%`}
              type="sale"
              style={styles.badgeItem}
            />
          )}
        </div>

        {/* Promo Gift Badge */}
        <div style={styles.promoBadge}>
          <p style={styles.promoText}>
            MUA <strong>02 ITEMS</strong>
          </p>
          <p style={styles.promoGift}>
            TẶNG <strong>GIFT BOX</strong>
          </p>
        </div>

        {/* Nút MUA NGAY trượt lên */}
        <div
          style={{
            ...styles.overlay,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(15px)",
          }}
        >
          <button style={styles.overlayBtn}>MUA NGAY +</button>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div style={styles.info}>
        <p style={styles.categoryName}>{product.categoryName || "ICONDENIM"}</p>
        <h3 style={styles.name}>{product.name}</h3>
        <div style={styles.priceContainer}>
          <p style={styles.price}>{product.price.toLocaleString()}đ</p>
          {product.oldPrice && (
            <p style={styles.oldPrice}>{product.oldPrice.toLocaleString()}đ</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: "3/4",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 0.5s ease-in-out",
    position: "absolute",
    top: 0,
    left: 0,
  },
  quickViewIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.3s ease",
    color: "#000",
  },
  badgeWrapper: {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: 5,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  badgeItem: { fontSize: "10px", padding: "3px 8px" },
  promoBadge: {
    position: "absolute",
    bottom: "60px",
    left: "10px",
    zIndex: 2,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "5px 8px",
    borderLeft: "3px solid #000",
  },
  promoText: {
    fontSize: "9px",
    margin: 0,
    color: "#333",
    textTransform: "uppercase",
  },
  promoGift: {
    fontSize: "9px",
    margin: 0,
    color: "#d71920",
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    right: "10px",
    zIndex: 3,
    transition: "all 0.3s ease",
  },
  overlayBtn: {
    width: "100%",
    padding: "12px 0",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    cursor: "pointer",
  },
  info: { padding: "15px 0", textAlign: "left" },
  categoryName: {
    fontSize: "11px",
    color: "#999",
    margin: "0 0 5px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  name: {
    fontSize: "13px",
    fontWeight: "600",
    margin: "0 0 8px 0",
    color: "#000",
    textTransform: "uppercase",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    lineHeight: "1.4",
  },
  priceContainer: { display: "flex", alignItems: "center", gap: "10px" },
  price: { color: "#d71920", fontSize: "14px", fontWeight: "700", margin: 0 },
  oldPrice: {
    fontSize: "12px",
    color: "#999",
    textDecoration: "line-through",
    margin: 0,
  },
};

export default ProductCard;
