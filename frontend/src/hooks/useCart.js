import { useContext } from "react";
import { CartContext } from "../context/CartContext"; // Kiểm tra kỹ dấu chấm và chữ hoa

export const useCart = () => {
  const context = useContext(CartContext);
  // ĐỪNG dùng throw Error lúc này, hãy dùng console.log để tránh trắng trang
  if (!context) {
    console.warn("useCart đang nằm ngoài Provider");
    return {};
  }
  return context;
};
