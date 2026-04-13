import React from "react";
import { CATEGORIES, SIZES } from "../../../utils/constants";

const SidebarFilter = ({
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  activeSize,
  onSizeChange,
}) => {
  const colors = [
    { name: "Đen", hex: "#000000" },
    { name: "Trắng", hex: "#FFFFFF" },
    { name: "Xanh", hex: "#0000FF" },
    { name: "Xám", hex: "#808080" },
    { name: "Be", hex: "#F5F5DC" },
  ];

  return (
    <div style={styles.sidebar}>
      {/* 1. LỌC THEO DANH MỤC */}
      <div style={styles.filterGroup}>
        <h3 style={styles.groupTitle}>DANH MỤC</h3>
        <ul style={styles.list}>
          {CATEGORIES.map((cat) => (
            <li
              key={cat.id}
              style={{
                ...styles.listItem,
                color: activeCategory === cat.id ? "#000" : "#666",
                fontWeight: activeCategory === cat.id ? "700" : "400",
              }}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </div>

      <hr style={styles.divider} />

      {/* 2. LỌC THEO GIÁ */}
      <div style={styles.filterGroup}>
        <h3 style={styles.groupTitle}>KHOẢNG GIÁ</h3>
        <div style={styles.priceInputs}>
          {[
            { id: "under-500", label: "Dưới 500k" },
            { id: "500-1000", label: "500k - 1 triệu" },
            { id: "over-1000", label: "Trên 1 triệu" },
          ].map((range) => (
            <label key={range.id} style={styles.priceLabel}>
              <input
                type="checkbox"
                checked={priceRange === range.id}
                onChange={() => onPriceChange(range.id)}
                style={styles.checkbox}
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      <hr style={styles.divider} />

      {/* 3. LỌC THEO KÍCH THƯỚC (SIZE) */}
      <div style={styles.filterGroup}>
        <h3 style={styles.groupTitle}>KÍCH THƯỚC</h3>
        <div style={styles.boxGrid}>
          {SIZES.map((size) => (
            <div
              key={size}
              onClick={() => onSizeChange(size)}
              style={{
                ...styles.sizeBox,
                backgroundColor: activeSize === size ? "#000" : "#fff",
                color: activeSize === size ? "#fff" : "#000",
                borderColor: activeSize === size ? "#000" : "#ddd",
              }}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      <hr style={styles.divider} />

      {/* 4. LỌC THEO MÀU SẮC */}
      <div style={styles.filterGroup}>
        <h3 style={styles.groupTitle}>MÀU SẮC</h3>
        <div style={styles.colorGrid}>
          {colors.map((color) => (
            <div
              key={color.hex}
              title={color.name}
              style={{
                ...styles.colorCircle,
                backgroundColor: color.hex,
                outline: color.hex === "#FFFFFF" ? "1px solid #ddd" : "none",
                border: "2px solid #fff", // Tạo vòng trắng bao quanh khi chọn
                boxShadow: "0 0 0 1px #ddd",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  sidebar: { width: "240px", paddingRight: "20px" },
  filterGroup: { marginBottom: "35px" },
  groupTitle: {
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "20px",
    color: "#000",
    textTransform: "uppercase",
  },
  list: { listStyle: "none", padding: 0, margin: 0 },
  listItem: {
    fontSize: "13px",
    marginBottom: "14px",
    cursor: "pointer",
    textTransform: "uppercase",
    transition: "0.2s ease",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #eee",
    marginBottom: "25px",
  },
  priceInputs: { display: "flex", flexDirection: "column", gap: "12px" },
  priceLabel: {
    fontSize: "13px",
    color: "#444",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: "#000",
  },

  // Grid cho Size
  boxGrid: { display: "flex", gap: "8px", flexWrap: "wrap" },
  sizeBox: {
    width: "42px",
    height: "38px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #ddd",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.2s",
  },

  colorGrid: { display: "flex", gap: "10px", flexWrap: "wrap" },
  colorCircle: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "0.2s",
  },
};

export default SidebarFilter;
