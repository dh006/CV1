const { Order_Detail, Product } = require("../models");

// ── Lấy chi tiết đơn hàng ─────────────────────────────────────────────────────
exports.getByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const details = await Order_Detail.findAll({
      where: { orderId },
      include: [
        { model: Product, as: "Product", attributes: ["id", "name", "image", "price"] },
      ],
    });
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const detail = await Order_Detail.create(req.body);
    res.status(201).json(detail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Order_Detail.destroy({ where: { id: req.params.id } });
    res.json({ message: "Đã xóa!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
