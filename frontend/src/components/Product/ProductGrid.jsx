import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ data, onQuickView }) => {
  return (
    <div className="product-grid-container" style={styles.gridContainer}>
      {data && data.length > 0 ? (
        data.map((item) => (
          <div key={item.id} style={styles.gridItem}>
            <ProductCard product={item} onQuickView={onQuickView} />
          </div>
        ))
      ) : (
        <div style={styles.emptyState}>
          <img
            src="https://theme.hstatic.net/1000360022/1001278307/14/empty-cart.png?v=922"
            alt="empty"
            style={{ width: "80px", opacity: 0.5, marginBottom: "15px" }}
          />
          <p>Rất tiếc, hiện không tìm thấy sản phẩm nào phù hợp.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  gridContainer: {
    display: "grid",
    // PC: 4 cột cố định (giống icondenim), Tablet/Mobile sẽ dùng Media Query phía dưới
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "30px 15px",
    marginTop: "20px",
    width: "100%",
  },
  gridItem: {
    display: "flex",
    flexDirection: "column",
  },
  emptyState: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 0",
    color: "#999",
    fontSize: "14px",
    backgroundColor: "#fcfcfc",
    borderRadius: "8px",
  },
};

export default ProductGrid;
