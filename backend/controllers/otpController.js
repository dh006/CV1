const nodemailer = require("nodemailer");
require("dotenv").config();

// In-memory store với TTL 5 phút
const otpStore = new Map();
const OTP_TTL = 5 * 60 * 1000; // 5 phút

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Gửi OTP ───────────────────────────────────────────────────────────────────
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Vui lòng nhập địa chỉ Email!" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP với thời gian hết hạn
    otpStore.set(email, { code: otpCode, expiresAt: Date.now() + OTP_TTL });

    // Tự động xóa sau 5 phút
    setTimeout(() => otpStore.delete(email), OTP_TTL);

    const mailOptions = {
      from: `"DIEP COLLECTION" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mã xác thực đăng ký tài khoản - DIEP COLLECTION",
      html: `
        <div style="font-family:'Inter',Arial,sans-serif;max-width:500px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#001C40;padding:24px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:2px;">DIEP COLLECTION</h1>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#1a1a1a;margin:0 0 16px;">Xác thực tài khoản</h2>
            <p style="color:#6b7280;line-height:1.6;">Mã OTP để hoàn tất đăng ký của bạn:</p>
            <div style="background:#f3f4f6;border-radius:10px;padding:20px;text-align:center;margin:20px 0;">
              <span style="font-size:36px;font-weight:900;color:#001C40;letter-spacing:12px;">${otpCode}</span>
            </div>
            <p style="color:#9ca3af;font-size:13px;">Mã có hiệu lực trong <strong>5 phút</strong>. Không chia sẻ mã này với bất kỳ ai.</p>
          </div>
          <div style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">
            © 2026 DIEP COLLECTION. All rights reserved.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP ${otpCode} → ${email}`);
    res.json({ message: "Mã OTP đã được gửi vào Email của bạn!" });
  } catch (error) {
    console.error("❌ Lỗi gửi Email:", error.message);
    res.status(500).json({ message: "Không thể gửi email. Vui lòng thử lại!" });
  }
};

// ── Xác thực OTP ──────────────────────────────────────────────────────────────
exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Vui lòng cung cấp email và mã OTP!" });
  }

  const stored = otpStore.get(email);

  if (!stored) {
    return res.status(400).json({ message: "Mã OTP không tồn tại hoặc đã hết hạn!" });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới!" });
  }

  if (stored.code !== otp) {
    return res.status(400).json({ message: "Mã OTP không chính xác!" });
  }

  otpStore.delete(email);
  res.json({ success: true, message: "Xác thực OTP thành công!" });
};
