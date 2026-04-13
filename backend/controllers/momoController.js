const crypto = require("crypto");
const { Order } = require("../models");

function getConfig() {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const endpoint =
    process.env.MOMO_API_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";
  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
  const backendPublicUrl = (
    process.env.BACKEND_PUBLIC_URL || "http://localhost:5000"
  ).replace(/\/$/, "");
  return { partnerCode, accessKey, secretKey, endpoint, frontendUrl, backendPublicUrl };
}

function signCreate(params) {
  const {
    accessKey,
    amount,
    extraData,
    ipnUrl,
    orderId,
    orderInfo,
    partnerCode,
    redirectUrl,
    requestId,
    requestType,
    secretKey,
  } = params;
  const raw = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  return crypto.createHmac("sha256", secretKey).update(raw).digest("hex");
}

function signIpn(body, accessKey, secretKey) {
  const amount = body.amount;
  const extraData = body.extraData ?? "";
  const message = body.message ?? "";
  const orderId = body.orderId;
  const orderInfo = body.orderInfo ?? "";
  const orderType = body.orderType ?? "";
  const partnerCode = body.partnerCode;
  const payType = body.payType ?? "";
  const requestId = body.requestId;
  const responseTime = body.responseTime;
  const resultCode = body.resultCode;
  const transId = body.transId;
  const raw = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
  return crypto.createHmac("sha256", secretKey).update(raw).digest("hex");
}

/**
 * POST /api/payment/momo/create — tạo payUrl (cần đăng nhập, đơn thuộc user)
 */
exports.createPayment = async (req, res) => {
  try {
    const { orderCode } = req.body;
    const cfg = getConfig();
    if (!cfg.partnerCode || !cfg.accessKey || !cfg.secretKey) {
      return res.status(503).json({
        message:
          "MoMo chưa cấu hình. Thêm MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY vào .env (xem tài khoản test tại developers.momo.vn).",
      });
    }
    if (!orderCode) return res.status(400).json({ message: "Thiếu mã đơn hàng." });

    const order = await Order.findOne({ where: { orderCode } });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    if (order.userId !== req.userId) {
      return res.status(403).json({ message: "Không có quyền với đơn hàng này." });
    }
    if (order.paymentMethod !== "MOMO") {
      return res.status(400).json({ message: "Đơn hàng không phải thanh toán ví MoMo." });
    }
    if (order.status !== 0) {
      return res.status(400).json({ message: "Đơn hàng đã được xử lý." });
    }

    const amount = Math.round(Number(order.totalPrice));
    if (amount < 1000) {
      return res.status(400).json({ message: "Số tiền tối thiểu theo MoMo là 1.000đ." });
    }

    const requestId = `${orderCode}_${Date.now()}`;
    const orderId = orderCode;
    const orderInfo = `Thanh toan don hang ${orderCode}`;
    const redirectUrl = `${cfg.frontendUrl}/thank-you?from=momo`;
    const ipnUrl = `${cfg.backendPublicUrl}/api/payment/momo/ipn`;
    const requestType = "captureWallet";
    const extraData = "";

    const signature = signCreate({
      accessKey: cfg.accessKey,
      secretKey: cfg.secretKey,
      amount,
      extraData,
      ipnUrl,
      orderId,
      orderInfo,
      partnerCode: cfg.partnerCode,
      redirectUrl,
      requestId,
      requestType,
    });

    const payload = {
      partnerCode: cfg.partnerCode,
      requestType,
      ipnUrl,
      redirectUrl,
      orderId,
      amount,
      orderInfo,
      requestId,
      extraData,
      lang: "vi",
      signature,
    };

    const momoRes = await fetch(cfg.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await momoRes.json();

    if (data.resultCode !== 0 || !data.payUrl) {
      console.error("MoMo create error:", data);
      return res.status(400).json({
        message: data.message || "Không tạo được link thanh toán MoMo.",
        momo: data,
      });
    }

    return res.json({
      payUrl: data.payUrl,
      deeplink: data.deeplink || null,
      qrCodeUrl: data.qrCodeUrl || null,
    });
  } catch (err) {
    console.error("momo createPayment:", err);
    return res.status(500).json({ message: err.message || "Lỗi máy chủ." });
  }
};

/**
 * POST /api/payment/momo/ipn — MoMo gọi server-to-server (cần URL công khai, ví dụ ngrok)
 * Phản hồi HTTP 204 theo tài liệu MoMo.
 */
exports.handleIpn = async (req, res) => {
  try {
    const body = req.body;
    const cfg = getConfig();
    if (!cfg.secretKey || !cfg.accessKey) {
      console.error("MoMo IPN: thiếu cấu hình");
      return res.status(500).end();
    }

    if (body.partnerCode !== cfg.partnerCode) {
      return res.status(204).end();
    }

    const expectedSig = signIpn(body, cfg.accessKey, cfg.secretKey);
    if (expectedSig !== body.signature) {
      console.error("MoMo IPN: chữ ký không hợp lệ");
      return res.status(400).json({ message: "Bad signature" });
    }

    if (body.resultCode === 0) {
      const order = await Order.findOne({ where: { orderCode: body.orderId } });
      if (order && order.paymentMethod === "MOMO" && order.status === 0) {
        const expectedAmount = Math.round(Number(order.totalPrice));
        const paidAmount = Math.round(Number(body.amount));
        if (paidAmount === expectedAmount) {
          await order.update({ status: 1 });
          console.log(`✅ MoMo IPN: đơn ${body.orderId} đã thanh toán.`);
        } else {
          console.warn(`MoMo IPN: lệch số tiền order=${expectedAmount} momo=${paidAmount}`);
        }
      }
    }

    return res.status(204).end();
  } catch (err) {
    console.error("MoMo IPN:", err);
    return res.status(500).end();
  }
};
