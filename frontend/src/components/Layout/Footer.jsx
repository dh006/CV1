import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <footer style={s.footer}>
      {/* TOP BANNER */}
      <div style={s.topBanner}>
        <div style={s.bannerGrid}>
          {[
            { icon: "🚚", title: "Miễn phí vận chuyển", desc: "Đơn hàng từ 399.000đ" },
            { icon: "🔄", title: "Đổi hàng tận nhà", desc: "Trong vòng 15 ngày" },
            { icon: "💳", title: "Thanh toán COD", desc: "Kiểm tra trước khi nhận" },
            { icon: "🛡️", title: "Bảo hành chất lượng", desc: "Cam kết 100% chính hãng" },
          ].map((item, i) => (
            <div key={i} style={s.bannerItem}>
              <span style={s.bannerIcon}>{item.icon}</span>
              <div>
                <p style={s.bannerTitle}>{item.title}</p>
                <p style={s.bannerDesc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div style={s.main}>
        <div style={s.container}>
          {/* COL 1: BRAND */}
          <div style={s.col}>
            <h3 style={s.brand}>DIEP COLLECTION</h3>
            <p style={s.brandDesc}>
              Thương hiệu thời trang nam hiện đại, mang đến phong cách tự tin và cá tính.
              Chúng tôi cam kết chất lượng trên từng sợi vải.
            </p>
            <div style={s.socials}>
              {[
                { label: "Facebook", icon: "f", href: "#", color: "#1877f2" },
                { label: "Instagram", icon: "in", href: "#", color: "#e1306c" },
                { label: "TikTok", icon: "tt", href: "#", color: "#000" },
                { label: "YouTube", icon: "▶", href: "#", color: "#ff0000" },
              ].map((s2, i) => (
                <a key={i} href={s2.href} style={{ ...s.socialBtn, backgroundColor: s2.color }} title={s2.label}>
                  {s2.icon}
                </a>
              ))}
            </div>
          </div>

          {/* COL 2: CHÍNH SÁCH */}
          <div style={s.col}>
            <h4 style={s.colTitle}>CHÍNH SÁCH</h4>
            <ul style={s.list}>
              {[
                ["Chính sách đổi trả 15 ngày", "/policy"],
                ["Chính sách bảo mật", "/policy"],
                ["Chính sách vận chuyển", "/policy"],
                ["Chính sách thanh toán", "/policy"],
                ["Điều khoản sử dụng", "/policy"],
              ].map(([label, to], i) => (
                <li key={i}>
                  <Link to={to} style={s.link}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3: HỖ TRỢ */}
          <div style={s.col}>
            <h4 style={s.colTitle}>HỖ TRỢ KHÁCH HÀNG</h4>
            <ul style={s.list}>
              <li style={s.contactItem}>
                <span>📞</span>
                <span>Hotline: <strong>1900 xxxx</strong></span>
              </li>
              <li style={s.contactItem}>
                <span>✉️</span>
                <span>support@diepcollection.com</span>
              </li>
              <li style={s.contactItem}>
                <span>🕐</span>
                <span>8:00 – 22:00 (Thứ 2 – CN)</span>
              </li>
              <li style={{ marginTop: "12px" }}>
                <Link to="/he-thong-cua-hang" style={s.link}>🏪 Hệ thống cửa hàng</Link>
              </li>
              <li>
                <Link to="/gioi-thieu" style={s.link}>ℹ️ Giới thiệu về chúng tôi</Link>
              </li>
              <li>
                <Link to="/news" style={s.link}>📰 Tin tức & Xu hướng</Link>
              </li>
              <li>
                <Link to="/faq" style={s.link}>❓ Câu hỏi thường gặp</Link>
              </li>
            </ul>
          </div>

          {/* COL 4: ĐĂNG KÝ */}
          <div style={s.col}>
            <h4 style={s.colTitle}>ĐĂNG KÝ NHẬN TIN</h4>
            <p style={s.subDesc}>
              Nhận thông báo về bộ sưu tập mới nhất và ưu đãi độc quyền dành riêng cho thành viên.
            </p>
            {subscribed ? (
              <div style={s.successMsg}>
                ✅ Cảm ơn bạn đã đăng ký!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={s.subForm}>
                <input
                  type="email"
                  placeholder="Email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={s.subInput}
                  required
                />
                <button type="submit" style={s.subBtn}>GỬI</button>
              </form>
            )}
            <div style={s.payIcons}>
              <span style={s.payIcon}>VISA</span>
              <span style={s.payIcon}>MC</span>
              <span style={s.payIcon}>COD</span>
              <span style={s.payIcon}>ATM</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={s.bottomBar}>
        <div style={s.bottomContent}>
          <p>© 2026 DIEP COLLECTION. All rights reserved.</p>
          <div style={s.bottomLinks}>
            <Link to="/policy" style={s.bottomLink}>Điều khoản</Link>
            <span style={s.dot}>·</span>
            <Link to="/policy" style={s.bottomLink}>Bảo mật</Link>
            <span style={s.dot}>·</span>
            <Link to="/sitemap" style={s.bottomLink}>Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const s = {
  footer: { backgroundColor: "#fff", borderTop: "1px solid #e5e7eb", fontFamily: "'Inter', sans-serif" },
  topBanner: { backgroundColor: "#001C40", padding: "20px 0" },
  bannerGrid: { maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
  bannerItem: { display: "flex", alignItems: "center", gap: "12px", color: "#fff" },
  bannerIcon: { fontSize: "24px", flexShrink: 0 },
  bannerTitle: { fontSize: "13px", fontWeight: "700", marginBottom: "2px" },
  bannerDesc: { fontSize: "11px", opacity: 0.7 },
  main: { padding: "50px 0 40px" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr", gap: "40px" },
  col: {},
  brand: { fontSize: "20px", fontWeight: "900", color: "#001C40", marginBottom: "14px", letterSpacing: "1px" },
  brandDesc: { fontSize: "13px", color: "#6b7280", lineHeight: "1.7", marginBottom: "20px" },
  socials: { display: "flex", gap: "10px" },
  socialBtn: {
    width: "34px", height: "34px", borderRadius: "8px",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: "700", textDecoration: "none",
    transition: "transform 0.2s, opacity 0.2s",
  },
  colTitle: { fontSize: "13px", fontWeight: "800", color: "#1a1a1a", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" },
  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" },
  link: { fontSize: "13px", color: "#6b7280", textDecoration: "none", transition: "color 0.2s" },
  contactItem: { display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#6b7280" },
  subDesc: { fontSize: "13px", color: "#6b7280", lineHeight: "1.6", marginBottom: "16px" },
  subForm: { display: "flex", marginBottom: "16px" },
  subInput: { flex: 1, padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRight: "none", outline: "none", fontSize: "13px", borderRadius: "8px 0 0 8px", backgroundColor: "#fafafa" },
  subBtn: { padding: "10px 18px", backgroundColor: "#001C40", color: "#fff", border: "none", fontWeight: "700", cursor: "pointer", fontSize: "12px", borderRadius: "0 8px 8px 0" },
  successMsg: { background: "#d1fae5", color: "#059669", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", marginBottom: "16px" },
  payIcons: { display: "flex", gap: "8px", flexWrap: "wrap" },
  payIcon: { padding: "4px 10px", border: "1px solid #e5e7eb", borderRadius: "4px", fontSize: "10px", fontWeight: "700", color: "#6b7280" },
  bottomBar: { borderTop: "1px solid #e5e7eb", padding: "16px 0", backgroundColor: "#f9fafb" },
  bottomContent: { maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" },
  bottomLinks: { display: "flex", alignItems: "center", gap: "8px" },
  bottomLink: { fontSize: "12px", color: "#9ca3af", textDecoration: "none" },
  dot: { color: "#d1d5db", fontSize: "12px" },
};

export default Footer;
