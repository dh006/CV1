import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, otpAPI } from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1: form, 2: otp
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    setLoading(true);
    try {
      await otpAPI.send(formData.email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể gửi mã xác thực!");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Xác thực OTP
      await otpAPI.verify(formData.email, otp);
      // Đăng ký
      const res = await authAPI.register(formData);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Xác thực thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.leftPanel}>
        <img
          src="https://cdn.hstatic.net/files/1000360022/file/2500x991_-_banner_web_d_nh_v__jeans_-_ngang.jpg"
          alt="banner"
          style={s.leftImg}
        />
        <div style={s.leftOverlay} />
        <div style={s.brandWrap}>
          <h1 style={s.brandName}>DIEP COLLECTION</h1>
          <p style={s.brandTagline}>Tham gia cộng đồng thời trang nam</p>
          <div style={s.perks}>
            {[
              ["fa-truck", "Miễn phí ship đơn từ 399K"],
              ["fa-rotate-left", "Đổi hàng tận nhà 15 ngày"],
              ["fa-star", "Ưu đãi thành viên độc quyền"],
            ].map(([icon, p], i) => (
              <div key={i} style={s.perk}>
                <i className={`fa-solid ${icon}`} style={{ marginRight: "8px", opacity: 0.8 }} />
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.rightPanel}>
        <div style={s.formCard}>
          <Link to="/" style={s.backLink}>← Về trang chủ</Link>
          <h2 style={s.title}>{step === 1 ? "Tạo tài khoản" : "Xác thực Email"}</h2>
          <p style={s.subtitle}>
            {step === 1 ? "Đăng ký để nhận ưu đãi thành viên độc quyền" : `Mã OTP đã gửi đến ${formData.email}`}
          </p>

          {/* Steps */}
          <div style={s.steps}>
            <div style={s.step}>
              <div style={{ ...s.stepDot, background: "#001C40", color: "#fff" }}>{step > 1 ? "✓" : "1"}</div>
              <span style={{ ...s.stepLabel, color: "#001C40" }}>Thông tin</span>
            </div>
            <div style={s.stepLine} />
            <div style={s.step}>
              <div style={{ ...s.stepDot, background: step === 2 ? "#001C40" : "#e5e7eb", color: step === 2 ? "#fff" : "#9ca3af" }}>2</div>
              <span style={{ ...s.stepLabel, color: step === 2 ? "#001C40" : "#9ca3af" }}>Xác thực</span>
            </div>
          </div>

          {error && (
            <div style={s.errorBox}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: "8px" }} />
              {error}
            </div>
          )}

          <form onSubmit={step === 1 ? handleRequestOTP : handleRegister} style={s.form}>
            {step === 1 ? (
              <>
                <div style={s.field}>
                  <label style={s.label}>Họ và tên</label>
                  <div style={s.inputWrap}>
                    <i className="fa-solid fa-user" style={{ position: "absolute", left: "13px", fontSize: "14px", color: "#9ca3af" }} />
                    <input type="text" style={s.input} placeholder="Nguyễn Văn A"
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Email</label>
                  <div style={s.inputWrap}>
                    <i className="fa-solid fa-envelope" style={{ position: "absolute", left: "13px", fontSize: "14px", color: "#9ca3af" }} />
                    <input type="email" style={s.input} placeholder="example@gmail.com"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Mật khẩu</label>
                  <div style={s.inputWrap}>
                    <i className="fa-solid fa-lock" style={{ position: "absolute", left: "13px", fontSize: "14px", color: "#9ca3af" }} />
                    <input type={showPass ? "text" : "password"} style={{ ...s.input, paddingRight: "44px" }}
                      placeholder="Tối thiểu 6 ký tự"
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    <button type="button" style={s.eyeBtn} onClick={() => setShowPass(!showPass)}>
                      <i className={`fa-solid ${showPass ? "fa-eye-slash" : "fa-eye"}`} style={{ color: "#9ca3af" }} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={s.otpWrap}>
                <p style={s.otpHint}>Nhập mã 6 chữ số được gửi vào hộp thư của bạn</p>
                <input
                  type="text"
                  style={s.otpInput}
                  placeholder="• • • • • •"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                />
                <p style={s.spamNote}>Kiểm tra cả hòm thư Rác (Spam) nếu không thấy.</p>
              </div>
            )}

            <button type="submit" style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Đang xử lý..." : step === 1 ? "NHẬN MÃ XÁC THỰC" : "XÁC NHẬN & ĐĂNG KÝ"}
            </button>

            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} style={s.backBtn}>
                ← Thay đổi thông tin
              </button>
            )}
          </form>

          <p style={s.loginRow}>
            Đã có tài khoản?{" "}
            <Link to="/login" style={s.loginLink}>Đăng nhập →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "'Inter',sans-serif" },
  leftPanel: { flex: 1, position: "relative", overflow: "hidden", minHeight: "100vh" },
  leftImg: { width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 },
  leftOverlay: { position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(0,28,64,.9),rgba(0,28,64,.5))" },
  brandWrap: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", zIndex: 2, color: "#fff", width: "80%" },
  brandName: { fontSize: "28px", fontWeight: "900", letterSpacing: "3px", marginBottom: "10px" },
  brandTagline: { fontSize: "14px", opacity: 0.8, marginBottom: "24px" },
  perks: { display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" },
  perk: { fontSize: "13px", opacity: 0.9 },
  rightPanel: { width: "100%", maxWidth: "500px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#fff" },
  formCard: { width: "100%", maxWidth: "400px" },
  backLink: { display: "inline-block", fontSize: "13px", color: "#6b7280", textDecoration: "none", marginBottom: "24px" },
  title: { fontSize: "26px", fontWeight: "800", color: "#001C40", marginBottom: "6px" },
  subtitle: { fontSize: "14px", color: "#6b7280", marginBottom: "20px" },
  steps: { display: "flex", alignItems: "center", marginBottom: "24px" },
  step: { display: "flex", alignItems: "center", gap: "8px" },
  stepDot: { width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700" },
  stepLabel: { fontSize: "12px", fontWeight: "600" },
  stepLine: { flex: 1, height: "2px", background: "#e5e7eb", margin: "0 10px" },
  errorBox: { background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: {},
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "7px" },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  icon: { position: "absolute", left: "13px", fontSize: "15px", pointerEvents: "none" },
  input: { width: "100%", padding: "12px 14px 12px 40px", border: "1.5px solid #e5e7eb", borderRadius: "9px", fontSize: "14px", outline: "none", background: "#fafafa" },
  eyeBtn: { position: "absolute", right: "11px", background: "none", border: "none", cursor: "pointer", fontSize: "15px" },
  otpWrap: { textAlign: "center" },
  otpHint: { fontSize: "14px", color: "#6b7280", marginBottom: "16px" },
  otpInput: { width: "100%", padding: "16px", textAlign: "center", fontSize: "28px", letterSpacing: "14px", fontWeight: "700", border: "2px solid #001C40", borderRadius: "10px", outline: "none", background: "#f8fafc" },
  spamNote: { fontSize: "12px", color: "#9ca3af", marginTop: "10px" },
  submitBtn: { width: "100%", padding: "14px", background: "#001C40", color: "#fff", border: "none", borderRadius: "9px", fontSize: "14px", fontWeight: "700", cursor: "pointer", letterSpacing: "1px" },
  backBtn: { background: "none", border: "none", color: "#6b7280", textDecoration: "underline", cursor: "pointer", fontSize: "13px", textAlign: "center" },
  loginRow: { textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "20px" },
  loginLink: { color: "#001C40", fontWeight: "700", textDecoration: "none" },
};

export default Register;
