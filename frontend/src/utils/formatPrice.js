/**
 * Chuyển đổi số thành định dạng tiền tệ Việt Nam (VNĐ)
 * @param {number} price - Số tiền cần định dạng
 * @returns {string} - Chuỗi tiền tệ đã định dạng (VD: 599.000₫)
 */
export const formatPrice = (price) => {
  if (typeof price !== "number") {
    return "0₫";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(price)
    .replace(/\s/g, "") // Loại bỏ khoảng trắng thừa
    .replace("₫", "đ"); // Chỉnh lại ký tự đ cho đúng phong cách Icon Denim
};

/**
 * Tính toán phần trăm giảm giá
 */
export const calculateDiscount = (oldPrice, currentPrice) => {
  if (!oldPrice || oldPrice <= currentPrice) return 0;
  return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
};
