const db = require("../models");
const { Order, Product, User, Order_Detail, Category, Brand } = db;
const sequelize = db.sequelize || require("../config/db");
const { Op } = require("sequelize");

// ── Dashboard Stats ───────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    // Nhận filter ngày từ query: ?from=2026-01-01&to=2026-01-31
    const { from, to } = req.query;

    // Xác định khoảng thời gian
    const now = new Date();
    let startDate, endDate;

    if (from && to) {
      startDate = new Date(from);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Mặc định: 7 ngày gần nhất
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
    }

    const dateFilter = { createdAt: { [Op.between]: [startDate, endDate] } };
    const completedFilter = { status: 2, ...dateFilter };

    const [
      totalRevenue,
      orderCount,
      productCount,
      userCount,
      pendingOrders,
      recentOrders,
      topProducts,
      revenueByDay,
    ] = await Promise.all([
      // Tổng doanh thu đơn hoàn thành trong khoảng thời gian
      Order.sum("totalPrice", { where: completedFilter }).then((v) => v || 0),

      // Tổng đơn hàng trong khoảng thời gian
      Order.count({ where: dateFilter }),

      // Tổng sản phẩm (không filter theo ngày)
      Product.count(),

      // Tổng người dùng (không filter theo ngày)
      User.count(),

      // Đơn chờ xử lý trong khoảng thời gian
      Order.count({ where: { status: 0, ...dateFilter } }),

      // 5 đơn hàng gần nhất trong khoảng thời gian
      Order.findAll({
        where: dateFilter,
        order: [["createdAt", "DESC"]],
        limit: 5,
        attributes: ["id", "orderCode", "fullName", "phone", "totalPrice", "status", "createdAt"],
      }),

      // Top 5 sản phẩm bán chạy (không filter theo ngày)
      Product.findAll({
        order: [["buyTurn", "DESC"]],
        limit: 5,
        attributes: ["id", "name", "price", "buyTurn", "image", "quantity"],
      }),

      // Doanh thu theo ngày trong khoảng thời gian
      Order.findAll({
        attributes: [
          [sequelize.fn("DATE", sequelize.col("createdAt")), "day"],
          [sequelize.fn("SUM", sequelize.col("totalPrice")), "revenue"],
          [sequelize.fn("COUNT", sequelize.col("id")), "orders"],
        ],
        where: completedFilter,
        group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
        order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
      }),
    ]);

    res.json({
      summary: {
        totalRevenue,
        orderCount,
        totalProducts: productCount,
        totalUsers: userCount,
        pendingOrders,
      },
      recentOrders,
      topProducts,
      revenueByDay,
      filter: {
        from: startDate.toISOString().slice(0, 10),
        to: endDate.toISOString().slice(0, 10),
      },
    });
  } catch (error) {
    console.error("Lỗi Dashboard Stats:", error);
    res.status(500).json({ message: error.message });
  }
};

// ── Lấy danh sách Users (Admin) ───────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const { name, email, page = 1, limit = 20 } = req.query;
    const where = {};
    if (name) where.fullName = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    res.json({ data: rows, total: count, page: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Cập nhật User (Admin) ─────────────────────────────────────────────────────
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, role } = req.body;
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) {
      const r = Number(role);
      if (![0, 1, 2].includes(r)) {
        return res.status(400).json({ message: "Vai trò không hợp lệ (0: Khách, 1: Admin, 2: Sale)." });
      }
      updateData.role = r;
    }

    await User.update(updateData, { where: { id } });
    res.json({ message: "Cập nhật người dùng thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Xóa User (Admin) ──────────────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    if (user.role === 1) return res.status(403).json({ message: "Không thể xóa tài khoản Admin!" });

    await user.destroy();
    res.json({ message: "Đã xóa người dùng!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
