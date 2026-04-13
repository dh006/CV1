const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// ── Đăng ký ──────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: "Email này đã được đăng ký!" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashed,
      phone: phone || null,
      role: 0,
      isVerified: true,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Đăng ký tài khoản thành công!",
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng ký: " + error.message });
  }
};

// ── Đăng nhập ─────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu!" });
    }

    const user = await User.findOne({ where: { email: account } });
    if (!user) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng!" });
    }

    const token = generateToken(user);

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Lấy profile ───────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "fullName", "email", "phone", "role", "avatar", "createdAt"],
    });
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại!" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Cập nhật profile ──────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;

    await User.update(updateData, { where: { id: req.userId } });

    const updated = await User.findByPk(req.userId, {
      attributes: ["id", "fullName", "email", "phone", "role", "avatar"],
    });

    res.json({ message: "Cập nhật thông tin thành công!", user: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Đổi mật khẩu ─────────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ mật khẩu!" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự!" });
    }

    const user = await User.findByPk(req.userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu cũ không đúng!" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashed }, { where: { id: req.userId } });

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
