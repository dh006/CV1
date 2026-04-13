import React from "react";

const Badge = ({ text, type = "primary", style = {} }) => {
  // Định nghĩa màu sắc theo từng loại trạng thái
  const getTypeStyles = () => {
    switch (type) {
      case "sale":
        return { backgroundColor: "#d71920", color: "#fff" }; // Đỏ giảm giá
      case "new":
        return { backgroundColor: "#000", color: "#fff" }; // Đen hàng mới
      case "soldout":
        return { backgroundColor: "#999", color: "#fff" }; // Xám hết hàng
      case "cart":
        return {
          backgroundColor: "#d71920",
          color: "#fff",
          borderRadius: "50%",
          width: "18px",
          height: "18px",
          fontSize: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "-5px",
          right: "-10px",
          border: "2px solid #fff",
        };
      default:
        return { backgroundColor: "#000", color: "#fff" };
    }
  };

  const finalStyle = {
    ...badgeBaseStyles,
    ...getTypeStyles(),
    ...style,
  };

  return <span style={finalStyle}>{text}</span>;
};

const badgeBaseStyles = {
  padding: "4px 8px",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase",
  borderRadius: "2px",
  pointerEvents: "none", // Để không làm vướng khi click vào sản phẩm
};

export default Badge;
