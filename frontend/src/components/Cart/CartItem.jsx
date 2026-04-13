import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div style={styles.itemContainer}>
      {/* 1. Ảnh sản phẩm (Tỉ lệ dọc đặc trưng của thời trang) */}
      <div style={styles.imageWrapper}>
        <img src={item.image} alt={item.name} style={styles.image} />
      </div>

      {/* 2. Thông tin chi tiết */}
      <div style={styles.infoWrapper}>
        <div style={styles.headerRow}>
          <h4 style={styles.name}>{item.name}</h4>
          <button
            style={styles.removeBtn}
            onClick={() => onRemoveItem(item.id, item.size)}
            title="Xóa sản phẩm"
          >
            ✕
          </button>
        </div>

        {/* Hiển thị Size - Rất quan trọng với Icon Denim */}
        <p style={styles.variant}>Size: {item.size || "Free Size"}</p>

        <div style={styles.actionRow}>
          {/* Bộ điều khiển số lượng mini */}
          <div style={styles.quantityGroup}>
            <button
              style={styles.qtyBtn}
              onClick={() => onUpdateQuantity(item.id, -1, item.size)}
            >
              −
            </button>
            <span style={styles.qtyValue}>{item.quantity}</span>
            <button
              style={styles.qtyBtn}
              onClick={() => onUpdateQuantity(item.id, 1, item.size)}
            >
              +
            </button>
          </div>

          {/* Giá tiền */}
          <span style={styles.price}>{item.price.toLocaleString()}đ</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  itemContainer: {
    display: "flex",
    gap: "12px",
    padding: "15px 0",
    borderBottom: "1px solid #f1f1f1",
  },
  imageWrapper: {
    width: "85px",
    height: "110px",
    flexShrink: 0,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  infoWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },
  name: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#000",
    margin: 0,
    lineHeight: "1.4",
    textTransform: "uppercase", // Style đặc trưng của Icon Denim
  },
  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    color: "#999",
    padding: "0 5px",
  },
  variant: {
    fontSize: "12px",
    color: "#666",
    margin: "4px 0",
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityGroup: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #e1e1e1",
    borderRadius: "2px",
  },
  qtyBtn: {
    background: "none",
    border: "none",
    width: "25px",
    height: "25px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: {
    fontSize: "12px",
    width: "30px",
    textAlign: "center",
    borderLeft: "1px solid #e1e1e1",
    borderRight: "1px solid #e1e1e1",
  },
  price: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#d71920", // Màu đỏ nhấn mạnh giá của Icon Denim
  },
};

export default CartItem;
