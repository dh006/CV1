import React from "react";

// 1. Nút bấm chính (Dùng cho Mua ngay, Thanh toán, Đăng nhập)
export const PrimaryButton = ({
  text,
  onClick,
  type = "button",
  disabled = false,
  style = {},
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...btnStyles.primary, ...style }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "#333")}
      onMouseLeave={(e) => (e.target.style.backgroundColor = "#000")}
    >
      {text}
    </button>
  );
};

// 2. Nút bấm phụ (Dùng cho Xem chi tiết, Tiếp tục mua sắm - Viền đen nền trắng)
export const SecondaryButton = ({ text, onClick, style = {} }) => {
  return (
    <button
      onClick={onClick}
      style={{ ...btnStyles.secondary, ...style }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#000";
        e.target.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#fff";
        e.target.style.color = "#000";
      }}
    >
      {text}
    </button>
  );
};

// 3. Nút chọn Size (Ô vuông đặc trưng của Icon Denim)
export const SizeButton = ({ size, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        ...btnStyles.size,
        backgroundColor: isSelected ? "#000" : "#fff",
        color: isSelected ? "#fff" : "#000",
        borderColor: isSelected ? "#000" : "#eee",
      }}
    >
      {size}
    </button>
  );
};

const btnStyles = {
  primary: {
    width: "100%",
    padding: "16px 20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "2px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    borderRadius: "2px",
    display: "block",
  },
  secondary: {
    width: "100%",
    padding: "15px 20px",
    backgroundColor: "#fff",
    color: "#000",
    border: "1px solid #000",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    borderRadius: "2px",
  },
  size: {
    width: "48px",
    height: "48px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #eee",
    marginRight: "8px",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },
};
