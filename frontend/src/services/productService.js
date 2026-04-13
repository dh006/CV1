// Import dữ liệu tĩnh từ constants để làm nguồn dữ liệu mẫu
import { PRODUCTS } from "../constants";

// Hàm bổ trợ để tạo độ trễ (giả lập thời gian phản hồi của Server)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  /**
   * Lấy danh sách tất cả sản phẩm
   */
  getAllProducts: async () => {
    await delay(400); // Giả lập chờ 0.4 giây
    return [...PRODUCTS];
  },

  /**
   * Lấy chi tiết một sản phẩm dựa trên ID
   * Dùng cho trang ProductDetail
   */
  getProductById: async (id) => {
    await delay(300);
    const product = PRODUCTS.find((p) => p.id === parseInt(id));
    if (!product) throw new Error("Sản phẩm không tồn tại");
    return product;
  },

  /**
   * Lấy sản phẩm theo danh mục (category)
   * Dùng cho trang Store hoặc Collection
   */
  getProductsByCategory: async (categoryId) => {
    await delay(400);
    if (!categoryId || categoryId === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === categoryId);
  },

  /**
   * Giả lập tìm kiếm sản phẩm theo tên
   */
  searchProducts: async (query) => {
    await delay(200);
    if (!query) return [];
    return PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()),
    );
  },

  /**
   * Lấy các sản phẩm liên quan (Sản phẩm cùng danh mục)
   */
  getRelatedProducts: async (productId, categoryId) => {
    await delay(300);
    return PRODUCTS.filter(
      (p) => p.category === categoryId && p.id !== parseInt(productId),
    ).slice(0, 4); // Lấy tối đa 4 sản phẩm
  },
};
