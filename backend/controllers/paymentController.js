const { Order } = require("../models");

/** Trả về JSON + HTTP status theo chuẩn SePay (201 nếu OAuth2; API Key / không auth: 200 hoặc 201). Dùng 201 để tương thích mọi kiểu chứng thực. */
const webhookOk = (res, payload) => res.status(201).json({ success: true, ...payload });
const webhookFail = (res, message) => res.status(200).json({ success: false, message });

/**
 * Webhook từ SePay/Casso — nhận thông báo khi có tiền vào tài khoản
 * SePay: https://docs.sepay.vn/tich-hop-webhooks.html — nội dung CK thường ở `content`, `description` có thể rỗng
 */
exports.handleWebhook = async (req, res) => {
  try {
    const body = req.body;
    console.log("💰 Payment webhook received:", JSON.stringify(body));

    const apiKey = process.env.SEPAY_WEBHOOK_API_KEY;
    if (apiKey) {
      const auth = (req.headers.authorization || "").trim();
      const expected = `Apikey ${apiKey}`;
      if (auth !== expected && auth.toLowerCase() !== `apikey ${apiKey}`.toLowerCase()) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
    }

    // SePay format: { transferAmount, content, description, transferType, ... }
    // Casso format: { data: [{ amount, description, ... }] }
    let amount, textForOrderCode;

    if (body.transferAmount !== undefined) {
      if (body.transferType && body.transferType !== "in") {
        return webhookFail(res, "Bỏ qua giao dịch tiền ra");
      }
      amount = body.transferAmount;
      // SePay: ưu tiên content (nội dung CK); ghép thêm description (SMS đầy đủ) để không sót mã
      textForOrderCode = [body.content, body.description].filter(Boolean).join(" ").trim();
    } else if (body.data && Array.isArray(body.data) && body.data.length > 0) {
      amount = body.data[0].amount;
      textForOrderCode = (body.data[0].description || "").trim();
    } else {
      amount = body.amount || body.value || 0;
      textForOrderCode = [body.content, body.description, body.memo]
        .filter(Boolean)
        .join(" ")
        .trim();
    }

    console.log(`💵 Amount: ${amount} | Text: "${textForOrderCode}"`);

    if (!textForOrderCode) {
      return webhookFail(res, "Không có nội dung chuyển khoản");
    }

    // Tìm mã đơn hàng trong nội dung chuyển khoản
    // Nội dung dạng: "DIEP ICD12345678" hoặc "ICD12345678"
    const match = textForOrderCode.match(/ICD\d{8,}/i);
    if (!match) {
      console.log("⚠️ Không tìm thấy mã đơn hàng trong:", textForOrderCode);
      return webhookFail(res, "Không tìm thấy mã đơn hàng");
    }

    const orderCode = match[0].toUpperCase();
    console.log(`🔍 Tìm đơn hàng: ${orderCode}`);

    const order = await Order.findOne({ where: { orderCode } });
    if (!order) {
      console.log(`❌ Không tìm thấy đơn hàng: ${orderCode}`);
      return webhookFail(res, `Không tìm thấy đơn hàng ${orderCode}`);
    }

    // Kiểm tra số tiền (cho phép sai lệch 1000đ do phí)
    const orderTotal = Number(order.totalPrice);
    const paidAmount = Number(amount);
    if (Math.abs(paidAmount - orderTotal) > 1000) {
      console.log(`⚠️ Số tiền không khớp: paid=${paidAmount}, order=${orderTotal}`);
      // Vẫn xác nhận nhưng log lại
    }

    // Cập nhật trạng thái đơn hàng → Đã thanh toán (status=1: đang xử lý)
    if (order.status === 0) {
      await order.update({ status: 1, paymentMethod: "VNPAY_QR" });
      console.log(`✅ Đơn hàng ${orderCode} đã được xác nhận thanh toán!`);
    }

    return webhookOk(res, { message: `Đơn hàng ${orderCode} đã xác nhận` });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Frontend polling — kiểm tra trạng thái đơn hàng theo orderCode
 * GET /api/payment/check/:orderCode
 */
exports.checkOrderStatus = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const order = await Order.findOne({
      where: { orderCode },
      attributes: ["id", "orderCode", "status", "paymentMethod", "totalPrice"],
    });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json({
      orderCode: order.orderCode,
      status: order.status,
      paid: order.status >= 1, // status >= 1 = đã thanh toán/xác nhận
      paymentMethod: order.paymentMethod,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
