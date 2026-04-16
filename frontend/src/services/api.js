/**
 * Axios instance tập trung — tất cả API calls đều đi qua đây
 * Tự động gắn token, xử lý lỗi 401/403 toàn cục
 */
import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: tự động gắn token ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: xử lý lỗi toàn cục ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn → logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

// ── OTP ──────────────────────────────────────────────────────────────────────
export const otpAPI = {
  send: (email) => api.post("/otp/send", { email }),
  verify: (email, otp) => api.post("/otp/verify", { email, otp }),
};

// ── Products ─────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (formData) =>
    api.post("/admin/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/admin/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/admin/products/${id}`),
};
// ── Categories ───────────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll: () => api.get("/categories"),
  create: (data) => api.post("/admin/categories", data),
  update: (id, data) => api.put(`/admin/categories/${id}`, data),
  delete: (id) => api.delete(`/admin/categories/${id}`),
};

// ── Brands ───────────────────────────────────────────────────────────────────
export const brandAPI = {
  getAll: () => api.get("/brands"),
  create: (data) => api.post("/admin/brands", data),
  update: (id, data) => api.put(`/admin/brands/${id}`, data),
  delete: (id) => api.delete(`/admin/brands/${id}`),
};

// ── Orders ───────────────────────────────────────────────────────────────────
export const orderAPI = {
  create: (data) => api.post("/orders", data),
  getMyOrders: (phone) => api.get(`/my-orders/${phone}`),
  getMyOrdersByUser: () => api.get("/my-orders/user/me"),
  cancelOrder: (id) => api.put(`/my-orders/${id}/cancel`),
  // Admin
  getAll: (params) => api.get("/admin/orders", { params }),
  getById: (id) => api.get(`/admin/orders/${id}`),
  updateStatus: (id, status) => api.put(`/admin/orders/${id}`, { status }),
  getDetails: (orderId) => api.get(`/admin/order-details/${orderId}`),
};

// ── Users (Admin) ─────────────────────────────────────────────────────────────
export const userAPI = {
  getAll: (params) => api.get("/admin/users", { params }),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
};

// ── Feedbacks ─────────────────────────────────────────────────────────────────
export const feedbackAPI = {
  getByProduct: (productId) => api.get(`/feedbacks/${productId}`),
  create: (data) => api.post("/feedbacks", data),
  delete: (id) => api.delete(`/admin/feedbacks/${id}`),
};

// ── Stats (Admin) ─────────────────────────────────────────────────────────────
export const statsAPI = {
  getDashboard: (params) => api.get("/admin/stats", { params }),
};

// ── Payment ───────────────────────────────────────────────────────────────────
export const paymentAPI = {
  checkStatus: (orderCode) => api.get(`/payment/check/${orderCode}`),
  momoCreate: (orderCode) => api.post("/payment/momo/create", { orderCode }),
};

// ── Vouchers (Admin) ──────────────────────────────────────────────────────────
export const voucherAPI = {
  check: (code, orderTotal) => api.post("/vouchers/check", { code, orderTotal }),
  getAll: () => api.get("/admin/vouchers"),
  create: (data) => api.post("/admin/vouchers", data),
  update: (id, data) => api.put(`/admin/vouchers/${id}`, data),
  delete: (id) => api.delete(`/admin/vouchers/${id}`),
};
export const bannerAPI = {
  getAll: () => api.get("/banners"),
  create: (data) => api.post("/admin/banners", data),
  update: (id, data) => api.put(`/admin/banners/${id}`, data),
  delete: (id) => api.delete(`/admin/banners/${id}`),
};

// ── News ──────────────────────────────────────────────────────────────────────
export const newsAPI = {
  getAll: () => api.get("/news"),
  create: (data) => api.post("/admin/news", data),
  update: (id, data) => api.put(`/admin/news/${id}`, data),
  delete: (id) => api.delete(`/admin/news/${id}`),
};
