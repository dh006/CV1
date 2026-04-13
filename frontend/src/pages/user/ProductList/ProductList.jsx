import React from "react";
import { products } from "../../../constants/products";
import ProductCard from "../../../components/Product/ProductCard";

const ProductList = () => {
  return (
    <div style={{ padding: "40px 5%", maxWidth: "1400px", margin: "0 auto" }}>
      <h1
        style={{ textAlign: "center", fontWeight: "900", marginBottom: "40px" }}
      >
        TẤT CẢ SẢN PHẨM
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
