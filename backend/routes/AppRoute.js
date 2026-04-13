const express = require("express");
const router = express.Router();

// Controllers
const auth = require("../controllers/authController");
const product = require("../controllers/productController");
const category = require("../controllers/categoryController");
const brand = require("../controllers/brandController");
const order = require("../controllers/orderController");
const orderDetail = require("../controllers/orderDetailController");
const news = require("../controllers/newsController");
const banner = require("../controllers/bannerController");
const feedback = require("../controllers/feedbackController");
const otp = require("../controllers/otpController");
const admin = require("../controllers/adminController");
const payment = require("../controllers/paymentController");
const voucher = require("../controllers/voucherController");
const momo = require("../controllers/momoController");

// Middlewares
const { verifyToken, isAdmin, isStaff } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// ════════════════════════════════════════════════════════════════════════════
// PAYMENT WEBHOOK (SePay/Casso gọi khi có tiền vào)
// ════════════════════════════════════════════════════════════════════════════
router.post("/payment/webhook", payment.handleWebhook);
router.get("/payment/check/:orderCode", payment.checkOrderStatus);
router.post("/payment/momo/create", verifyToken, momo.createPayment);
router.post("/payment/momo/ipn", momo.handleIpn);

// ════════════════════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════════════════════
router.post("/auth/register", auth.register);
router.post("/auth/login", auth.login);
router.get("/auth/profile", verifyToken, auth.getProfile);
router.put("/auth/profile", verifyToken, auth.updateProfile);
router.put("/auth/change-password", verifyToken, auth.changePassword);

// ════════════════════════════════════════════════════════════════════════════
// OTP
// ════════════════════════════════════════════════════════════════════════════
router.post("/otp/send", otp.sendOTP);
router.post("/otp/verify", otp.verifyOTP);

// ════════════════════════════════════════════════════════════════════════════
// PUBLIC — Khách hàng không cần đăng nhập
// ════════════════════════════════════════════════════════════════════════════
router.get("/products", product.getAll);
router.get("/products/:id", product.getById);
router.get("/categories", category.getAll);
router.get("/brands", brand.getAll);
router.get("/news", news.getAll);
router.get("/banners", banner.getAll);
router.get("/feedbacks/:productId", feedback.getByProduct);

// ════════════════════════════════════════════════════════════════════════════
// CUSTOMER — Cần đăng nhập
// ════════════════════════════════════════════════════════════════════════════
router.post("/orders", verifyToken, order.createOrder);
// Thêm route lấy đơn hàng theo userId (không cần phone)
router.get("/my-orders/user/me", verifyToken, order.getMyOrdersByUser);
router.put("/my-orders/:id/cancel", verifyToken, order.cancelOrder);
// User xác nhận đã chuyển khoản
router.put("/my-orders/:orderCode/confirm-paid", verifyToken, order.confirmPaid);
router.get("/my-orders/:phone", verifyToken, order.getMyOrders);
router.post("/feedbacks", verifyToken, feedback.create);

// Voucher
router.post("/vouchers/check", verifyToken, voucher.check);

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — Cần đăng nhập + quyền Admin
// ════════════════════════════════════════════════════════════════════════════

// Dashboard
router.get("/admin/stats", [verifyToken, isAdmin], admin.getDashboardStats);

// Users
router.get("/admin/users", [verifyToken, isAdmin], admin.getAllUsers);
router.put("/admin/users/:id", [verifyToken, isAdmin], admin.updateUser);
router.delete("/admin/users/:id", [verifyToken, isAdmin], admin.deleteUser);

// Products
router.post("/admin/products", [verifyToken, isAdmin, upload.array("images", 10)], product.create);
router.put("/admin/products/:id", [verifyToken, isAdmin, upload.array("images", 10)], product.update);
router.delete("/admin/products/:id", [verifyToken, isAdmin], product.delete);

// Orders
router.get("/admin/orders", [verifyToken, isStaff], order.getAll);
router.get("/admin/orders/:id", [verifyToken, isStaff], order.getById);
router.put("/admin/orders/:id", [verifyToken, isStaff], order.updateStatus);
router.get("/admin/order-details/:orderId", [verifyToken, isStaff], orderDetail.getByOrder);
router.delete("/admin/order-details/:id", [verifyToken, isAdmin], orderDetail.delete);

// Categories
router.post("/admin/categories", [verifyToken, isAdmin], category.create);
router.put("/admin/categories/:id", [verifyToken, isAdmin], category.update);
router.delete("/admin/categories/:id", [verifyToken, isAdmin], category.delete);

// Brands
router.post("/admin/brands", [verifyToken, isAdmin], brand.create);
router.put("/admin/brands/:id", [verifyToken, isAdmin], brand.update);
router.delete("/admin/brands/:id", [verifyToken, isAdmin], brand.delete);

// Feedbacks
router.delete("/admin/feedbacks/:id", [verifyToken, isAdmin], feedback.delete);

// Vouchers
router.get("/admin/vouchers", [verifyToken, isAdmin], voucher.getAll);
router.post("/admin/vouchers", [verifyToken, isAdmin], voucher.create);
router.put("/admin/vouchers/:id", [verifyToken, isAdmin], voucher.update);
router.delete("/admin/vouchers/:id", [verifyToken, isAdmin], voucher.delete);

// News
router.post("/admin/news", [verifyToken, isAdmin, upload.single("image")], news.create);
router.put("/admin/news/:id", [verifyToken, isAdmin, upload.single("image")], news.update);
router.delete("/admin/news/:id", [verifyToken, isAdmin], news.delete);

// Banners
router.post("/admin/banners", [verifyToken, isAdmin, upload.single("image")], banner.create);
router.put("/admin/banners/:id", [verifyToken, isAdmin, upload.single("image")], banner.update);
router.delete("/admin/banners/:id", [verifyToken, isAdmin], banner.delete);

// ════════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ════════════════════════════════════════════════════════════════════════════
router.get("/test", (req, res) =>
  res.json({ message: "✅ DIEP COLLECTION API đang hoạt động!", time: new Date() })
);

module.exports = router;
