const { Voucher } = require("../models");
const { Op } = require("sequelize");

// ── Kiểm tra voucher (user dùng khi checkout) ─────────────────────────────────
exports.check = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ message: "Vui lòng nhập mã voucher!" });

    const voucher = await Voucher.findOne({
      where: { code: code.toUpperCase().trim(), isActive: true },
    });

    if (!voucher) return res.status(404).json({ message: "Mã voucher không tồn tại hoặc đã bị vô hiệu!" });

    // Kiểm tra hết hạn
    if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Mã voucher đã hết hạn!" });
    }

    // Kiểm tra số lần dùng
    if (voucher.usedCount >= voucher.usageLimit) {
      return res.status(400).json({ message: "Mã voucher đã hết lượt sử dụng!" });
    }

    // Kiểm tra đơn tối thiểu
    if (orderTotal < voucher.minOrder) {
      return res.status(400).json({
        message: `Đơn hàng tối thiểu ${voucher.minOrder.toLocaleString()}đ để dùng mã này!`,
      });
    }

    // Tính giảm giá
    let discount = 0;
    if (voucher.type === "percent") {
      discount = Math.round((orderTotal * voucher.value) / 100);
      if (voucher.maxDiscount > 0) discount = Math.min(discount, voucher.maxDiscount);
    } else {
      discount = voucher.value;
    }
    discount = Math.min(discount, orderTotal); // không giảm quá tổng đơn

    res.json({
      valid: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        type: voucher.type,
        value: voucher.value,
        maxDiscount: voucher.maxDiscount,
      },
      discount,
      message: `Áp dụng thành công! Giảm ${discount.toLocaleString()}đ`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: Lấy tất cả voucher ─────────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const vouchers = await Voucher.findAll({ order: [["createdAt", "DESC"]] });
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: Tạo voucher ────────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { code, type, value, minOrder, maxDiscount, usageLimit, expiresAt } = req.body;
    if (!code || !value) return res.status(400).json({ message: "Mã và giá trị là bắt buộc!" });

    const existing = await Voucher.findOne({ where: { code: code.toUpperCase().trim() } });
    if (existing) return res.status(400).json({ message: "Mã voucher đã tồn tại!" });

    const voucher = await Voucher.create({
      code: code.toUpperCase().trim(),
      type: type || "fixed",
      value: Number(value),
      minOrder: Number(minOrder) || 0,
      maxDiscount: Number(maxDiscount) || 0,
      usageLimit: Number(usageLimit) || 100,
      expiresAt: expiresAt || null,
    });
    res.status(201).json({ message: "Tạo voucher thành công!", voucher });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Admin: Cập nhật voucher ───────────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const voucher = await Voucher.findByPk(req.params.id);
    if (!voucher) return res.status(404).json({ message: "Không tìm thấy voucher!" });
    await voucher.update(req.body);
    res.json({ message: "Cập nhật thành công!", voucher });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Admin: Xóa voucher ────────────────────────────────────────────────────────
exports.delete = async (req, res) => {
  try {
    await Voucher.destroy({ where: { id: req.params.id } });
    res.json({ message: "Đã xóa voucher!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
