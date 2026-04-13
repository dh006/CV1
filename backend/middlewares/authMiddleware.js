const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

/**
 * Xác thực JWT token từ header x-access-token hoặc Authorization Bearer
 */
const verifyToken = (req, res, next) => {
  const token =
    req.headers["x-access-token"] ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ message: "Bạn cần đăng nhập để thực hiện thao tác này!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!" });
    }
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
};

/**
 * Admin (role 1) — đọc role từ DB để đổi quyền có hiệu lực không cần đăng nhập lại
 */
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, { attributes: ["role"] });
    if (!user || Number(user.role) !== 1) {
      return res.status(403).json({ message: "Từ chối truy cập! Chức năng này chỉ dành cho Admin." });
    }
    next();
  } catch (err) {
    next(err);
  }
};

/** Admin (1) hoặc Sale (2) — xử lý đơn hàng */
const isStaff = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, { attributes: ["role"] });
    if (!user) {
      return res.status(403).json({ message: "Không tìm thấy tài khoản." });
    }
    const r = Number(user.role);
    if (r !== 1 && r !== 2) {
      return res.status(403).json({ message: "Từ chối truy cập! Chỉ Admin hoặc nhân viên Sale." });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyToken, isAdmin, isStaff };
