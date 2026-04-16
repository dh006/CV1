const { Order, Order_Detail, Product, User } = require("../models");
const { Voucher } = require("../models");
const { Op } = require("sequelize");

// ── Tạo đơn hàng ──────────────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const {
      fullName, phone, province, district, ward,
      addressDetail, note, paymentMethod, totalPrice, items,
      voucherCode, usePoints,
    } = req.body;

    if (!fullName || !phone || !province || !district || !ward || !addressDetail) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin giao hàng!" });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống!" });
    }

    // Tính giảm giá voucher
    let voucherDiscount = 0;
    let voucherObj = null;
    if (voucherCode) {
      voucherObj = await Voucher.findOne({
        where: { code: voucherCode.toUpperCase().trim(), isActive: true },
      });
      if (voucherObj && voucherObj.usedCount < voucherObj.usageLimit) {
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        if (subtotal >= voucherObj.minOrder) {
          if (voucherObj.type === "percent") {
            voucherDiscount = Math.round((subtotal * voucherObj.value) / 100);
            if (voucherObj.maxDiscount > 0) voucherDiscount = Math.min(voucherDiscount, voucherObj.maxDiscount);
          } else {
            voucherDiscount = voucherObj.value;
          }
          voucherDiscount = Math.min(voucherDiscount, subtotal);
        }
      }
    }

    // Tính giảm giá từ điểm (1 điểm = 100đ, tối đa 20% đơn hàng)
    let pointsDiscount = 0;
    let pointsUsed = 0;
    if (usePoints && req.userId) {
      const user = await User.findByPk(req.userId);
      if (user && user.points > 0) {
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        const maxPointsDiscount = Math.round(subtotal * 0.2); // tối đa 20%
        pointsDiscount = Math.min(user.points * 100, maxPointsDiscount);
        pointsUsed = Math.ceil(pointsDiscount / 100);
        pointsDiscount = pointsUsed * 100;
      }
    }

    const finalTotal = Math.max(0, (totalPrice || 0) - voucherDiscount - pointsDiscount);

    const orderCode = "ICD" + Date.now().toString().slice(-8);

    const order = await Order.create({
      userId: req.userId || null,
      orderCode, fullName, phone, province, district, ward,
      addressDetail, note: note || "",
      totalPrice: finalTotal,
      paymentMethod: paymentMethod || "COD",
      status: 0,
    });

    // Tạo chi tiết đơn hàng & cập nhật kho
    for (const item of items) {
      await Order_Detail.create({
        orderId: order.id,
        productId: item.productId || item.id,
        price: item.price,
        quantity: item.quantity,
        color: item.color || "",
        size: item.size || "",
      });

      const product = await Product.findByPk(item.productId || item.id);
      if (product) {
        let sizeStockUpdate = {};
        if (product.sizeStock && item.size) {
          try {
            const ss = JSON.parse(product.sizeStock);
            if (ss[item.size] !== undefined) {
              ss[item.size] = Math.max(0, (ss[item.size] || 0) - item.quantity);
              sizeStockUpdate.sizeStock = JSON.stringify(ss);
            }
          } catch {}
        }
        await product.update({
          quantity: Math.max(0, product.quantity - item.quantity),
          buyTurn: (product.buyTurn || 0) + item.quantity,
          ...sizeStockUpdate,
        });
      }
    }

    // Cập nhật voucher usedCount
    if (voucherObj && voucherDiscount > 0) {
      await voucherObj.update({ usedCount: voucherObj.usedCount + 1 });
    }

    // Cộng điểm thưởng (100.000đ = 1 điểm) + trừ điểm đã dùng
    if (req.userId) {
      const user = await User.findByPk(req.userId);
      if (user) {
        const earnedPoints = Math.floor(finalTotal / 100000); // 100.000đ = 1 điểm
        const newPoints = Math.max(0, (user.points || 0) - pointsUsed) + earnedPoints;
        await user.update({ points: newPoints });
      }
    }

    res.status(201).json({
      message: "Đặt hàng thành công!",
      orderCode,
      orderId: order.id,
      voucherDiscount,
      pointsDiscount,
      finalTotal,
    });
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error);
    res.status(500).json({ message: error.message });
  }
};

// ── Lấy đơn hàng của khách theo SĐT ──────────────────────────────────────────
exports.getMyOrders = async (req, res) => {
  try {
    const { phone } = req.params;
    const orders = await Order.findAll({
      where: { phone },
      include: [{ model: Order_Detail, as: "details", include: [{ model: Product, as: "Product", attributes: ["id", "name", "image", "price"] }] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── User: Xác nhận đã chuyển khoản ───────────────────────────────────────────
exports.confirmPaid = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const order = await Order.findOne({ where: { orderCode } });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    // Kiểm tra đơn hàng thuộc về user này
    if (order.userId && order.userId !== req.userId) {
      return res.status(403).json({ message: "Bạn không có quyền xác nhận đơn hàng này!" });
    }
    if (
      order.paymentMethod !== "VNPAY_QR" &&
      order.paymentMethod !== "MOMO" &&
      order.paymentMethod !== "ZALOPAY"
    ) {
      return res.status(400).json({ message: "Đơn hàng này không phải thanh toán online!" });
    }
    await order.update({ status: 1 });
    res.json({ message: "Xác nhận thành công!", orderCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── User: Hủy đơn hàng (chỉ khi status = 0 - chờ xử lý) ─────────────────────
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{ model: Order_Detail, as: "details" }],
    });

    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });

    // Chỉ cho hủy khi đang chờ xử lý (status = 0)
    if (order.status !== 0) {
      return res.status(400).json({ message: "Không thể hủy đơn hàng đang giao hoặc đã hoàn thành!" });
    }

    // Kiểm tra đơn hàng thuộc về user này
    if (order.userId !== req.userId) {
      return res.status(403).json({ message: "Bạn không có quyền hủy đơn hàng này!" });
    }

    // Hoàn lại số lượng kho
    if (order.details) {
      for (const detail of order.details) {
        const product = await Product.findByPk(detail.productId);
        if (product) {
          let sizeStockUpdate = {};
          if (product.sizeStock && detail.size) {
            try {
              const ss = JSON.parse(product.sizeStock);
              if (ss[detail.size] !== undefined) {
                ss[detail.size] = (ss[detail.size] || 0) + detail.quantity;
                sizeStockUpdate.sizeStock = JSON.stringify(ss);
              }
            } catch {}
          }
          await product.update({
            quantity: product.quantity + detail.quantity,
            buyTurn: Math.max(0, (product.buyTurn || 0) - detail.quantity),
            ...sizeStockUpdate,
          });
        }
      }
    }

    await order.update({ status: 3 }); // 3 = Đã hủy
    res.json({ message: "Hủy đơn hàng thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Lấy đơn hàng theo userId (dùng cho trang profile) ────────────────────────
exports.getMyOrdersByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.findAll({
      where: { userId },
      include: [{
        model: Order_Detail,
        as: "details",
        include: [{ model: Product, as: "Product", attributes: ["id", "name", "image", "price"] }],
      }],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: Lấy tất cả đơn hàng (có filter, pagination) ───────────────────────
exports.getAll = async (req, res) => {
  try {
    const { status, phone, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status !== undefined && status !== "") where.status = status;
    if (phone) where.phone = { [Op.like]: `%${phone}%` };

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Order.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    res.json({ data: rows, total: count, page: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: Lấy chi tiết 1 đơn hàng ──────────────────────────────────────────
exports.getById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Order_Detail,
          as: "details",
          include: [{ model: Product, as: "Product", attributes: ["id", "name", "image", "price"] }],
        },
      ],
    });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: Cập nhật trạng thái đơn hàng ──────────────────────────────────────
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status === undefined) {
      return res.status(400).json({ message: "Vui lòng cung cấp trạng thái!" });
    }

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });

    await order.update({ status });
    res.json({ message: "Cập nhật trạng thái thành công!", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
