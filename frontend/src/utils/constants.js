// 1. Cấu hình chung của hệ thống
export const APP_CONFIG = {
  NAME: "DIEP COLLECTION",
  CURRENCY: "đ",
  SHIPPING_THRESHOLD: 399000, // Ngưỡng miễn phí vận chuyển
  DEFAULT_SHIPPING_FEE: 30000,
};

// 2. Danh mục sản phẩm (Dùng cho SidebarFilter và Store)
export const CATEGORIES = [
  { id: "all", name: "Tất cả sản phẩm" },
  { id: "shirt", name: "Áo Sơ Mi" },
  { id: "polo", name: "Áo Polo" },
  { id: "t-shirt", name: "Áo Thun" },
  { id: "jeans", name: "Quần Jeans" },
  { id: "kaki", name: "Quần Kaki/Tây" },
  { id: "short", name: "Quần Short" },
  { id: "winter", name: "Đồ Đông" },
];

// 3. Danh sách Size tiêu chuẩn
export const SIZES = ["S", "M", "L", "XL", "XXL"];

// 4. Các phương thức thanh toán
export const PAYMENT_METHODS = [
  { id: "cod", name: "Thanh toán khi nhận hàng (COD)" },
  { id: "vnpay", name: "Chuyển khoản QR ngân hàng" },
  { id: "zalopay", name: "ZaloPay" },
];

// 5. Thông tin liên hệ và mạng xã hội
export const CONTACT_INFO = {
  PHONE: "0383 XXX XXX",
  EMAIL: "contact@diepcollection.vn",
  ADDRESS: "114 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
  FACEBOOK: "https://facebook.com/diepcollection",
  INSTAGRAM: "https://instagram.com/diepcollection",
};

// 6. Các trạng thái đơn hàng (Dùng cho trang Profile/Admin sau này)
export const ORDER_STATUS = {
  PENDING: "Chờ xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao hàng",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
};
