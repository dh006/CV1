import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.login({ account, password });
      const { token, user } = res.data;
      login(user, token);
      if (user.role === 1) {
        navigate("/admin/dashboard");
      } else if (user.role === 2) {
        navigate("/admin/orders");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Tài khoản hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.leftPanel}>
        <img
          src="https://cdn.hstatic.net/files/1000360022/file/2048x813_-_banner_web_fall_winter_25_-_ngang.jpg"
          alt="banner"
          style={s.leftImg}
        />
        <div style={s.leftOverlay} />
        <div style={s.brandWrap}>
          <h1 style={s.brandName}>DIEP COLLECTION</h1>
          <p style={s.brandTagline}>Phong cách tự tin — Chất lượng vượt trội</p>
        </div>
      </div>

      <div style={s.rightPanel}>
        <div style={s.formCard}>
          <Link to="/" style={s.backLink}>← Về trang chủ</Link>
          <h2 style={s.title}>Đăng nhập</h2>
          <p style={s.subtitle}>Chào mừng bạn quay lại với DIEP COLLECTION</p>

          {error && (
            <div style={s.errorBox}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: "8px" }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Email</label>
              <div style={s.inputWrap}>
                <i className="fa-solid fa-envelope" style={{ position: "absolute", left: "13px", fontSize: "14px", color: "#9ca3af" }} />
                <input
                  type="email"
                  style={s.input}
                  placeholder="example@gmail.com"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={s.field}>
              <div style={s.labelRow}>
                <label style={s.label}>Mật khẩu</label>
                <Link to="/forgot-password" style={s.forgotLink}>Quên mật khẩu?</Link>
              </div>
              <div style={s.inputWrap}>
                <i className="fa-solid fa-lock" style={{ position: "absolute", left: "13px", fontSize: "14px", color: "#9ca3af" }} />
                <input
                  type={showPass ? "text" : "password"}
                  style={{ ...s.input, paddingRight: "44px" }}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" style={s.eyeBtn} onClick={() => setShowPass(!showPass)}>
                  <i className={`fa-solid ${showPass ? "fa-eye-slash" : "fa-eye"}`} style={{ color: "#9ca3af" }} />
                </button>
              </div>
            </div>

            <button type="submit" style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
            </button>
          </form>

          <div style={s.divider}><span style={s.divLine} /><span style={s.divText}>hoặc</span><span style={s.divLine} /></div>
          <p style={s.registerRow}>
            Chưa có tài khoản?{" "}
            <Link to="/register" style={s.registerLink}>Đăng ký ngay →</Link>
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
  leftOverlay: { position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(0,28,64,.88),rgba(0,28,64,.45))" },
  brandWrap: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", zIndex: 2, color: "#fff", width: "80%" },
  brandName: { fontSize: "30px", fontWeight: "900", letterSpacing: "3px", marginBottom: "10px" },
  brandTagline: { fontSize: "14px", opacity: 0.8 },
  rightPanel: { width: "100%", maxWidth: "500px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#fff" },
  formCard: { width: "100%", maxWidth: "400px" },
  backLink: { display: "inline-block", fontSize: "13px", color: "#6b7280", textDecoration: "none", marginBottom: "28px" },
  title: { fontSize: "28px", fontWeight: "800", color: "#001C40", marginBottom: "6px" },
  subtitle: { fontSize: "14px", color: "#6b7280", marginBottom: "28px" },
  errorBox: { background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  field: {},
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "7px" },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  icon: { position: "absolute", left: "13px", fontSize: "15px", pointerEvents: "none" },
  input: { width: "100%", padding: "12px 14px 12px 40px", border: "1.5px solid #e5e7eb", borderRadius: "9px", fontSize: "14px", outline: "none", background: "#fafafa" },
  eyeBtn: { position: "absolute", right: "11px", background: "none", border: "none", cursor: "pointer", fontSize: "15px" },
  forgotLink: { fontSize: "12px", color: "#6b7280", textDecoration: "none" },
  submitBtn: { width: "100%", padding: "14px", background: "#001C40", color: "#fff", border: "none", borderRadius: "9px", fontSize: "14px", fontWeight: "700", cursor: "pointer", letterSpacing: "1px", marginTop: "4px" },
  divider: { display: "flex", alignItems: "center", gap: "10px", margin: "24px 0" },
  divLine: { flex: 1, height: "1px", background: "#e5e7eb" },
  divText: { fontSize: "12px", color: "#9ca3af" },
  registerRow: { textAlign: "center", fontSize: "14px", color: "#6b7280" },
  registerLink: { color: "#001C40", fontWeight: "700", textDecoration: "none" },
};

export default Login;
