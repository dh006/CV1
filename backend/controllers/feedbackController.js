const { Feedback, User, Product } = require("../models");

// ── Gửi đánh giá ──────────────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { productId, star, content } = req.body;
    const userId = req.userId;

    if (!productId || !star) {
      return res.status(400).json({ message: "Vui lòng cung cấp sản phẩm và số sao!" });
    }
    if (star < 1 || star > 5) {
      return res.status(400).json({ message: "Số sao phải từ 1 đến 5!" });
    }

    // Kiểm tra đã đánh giá chưa
    const existing = await Feedback.findOne({ where: { productId, userId } });
    if (existing) {
      return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này rồi!" });
    }

    const feedback = await Feedback.create({ productId, userId, star, content });
    res.status(201).json({ message: "Gửi đánh giá thành công!", data: feedback });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Lấy đánh giá theo sản phẩm ───────────────────────────────────────────────
exports.getByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const data = await Feedback.findAll({
      where: { productId },
      include: [{ model: User, attributes: ["fullName", "avatar"] }],
      order: [["createdAt", "DESC"]],
    });

    // Tính điểm trung bình
    const avgStar =
      data.length > 0
        ? (data.reduce((sum, f) => sum + f.star, 0) / data.length).toFixed(1)
        : 0;

    res.json({ data, avgStar, total: data.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Xóa đánh giá (Admin) ──────────────────────────────────────────────────────
exports.delete = async (req, res) => {
  try {
    await Feedback.destroy({ where: { id: req.params.id } });
    res.json({ message: "Đã xóa đánh giá!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
