import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div style={s.page}>

      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroOverlay} />
        <img
          src="https://cdn.hstatic.net/files/1000360022/file/2500x991_-_banner_web_d_nh_v__jeans_-_ngang.jpg"
          alt="DIEP COLLECTION"
          style={s.heroImg}
        />
        <div style={s.heroContent}>
          <p style={s.heroSub}>Thương hiệu thời trang nam</p>
          <h1 style={s.heroTitle}>DIEP COLLECTION</h1>
          <p style={s.heroDesc}>Phong cách tự tin — Chất lượng vượt trội</p>
        </div>
      </div>

      {/* GIỚI THIỆU */}
      <div style={s.section}>
        <div style={s.container}>
          <div style={s.introGrid}>
            <div style={s.introImg}>
              <img
                src="https://cdn.hstatic.net/files/1000360022/file/08_-_nh_m_s_n_ph_m_h_ng_m_i_-_600x1000.jpg"
                alt="About"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
              />
            </div>
            <div style={s.introText}>
              <p style={s.sectionLabel}>Về chúng tôi</p>
              <h2 style={s.sectionTitle}>Câu chuyện của<br />DIEP COLLECTION</h2>
              <p style={s.introDesc}>
                DIEP COLLECTION được thành lập với sứ mệnh mang đến những sản phẩm thời trang nam chất lượng cao,
                phong cách hiện đại nhưng vẫn giữ được nét trẻ trung, năng động.
              </p>
              <p style={s.introDesc}>
                Chúng tôi tin rằng mỗi người đàn ông đều xứng đáng được mặc những bộ trang phục tốt nhất —
                không chỉ đẹp về hình thức mà còn thoải mái trong từng chuyển động.
              </p>
              <p style={s.introDesc}>
                Từ áo thun cotton cao cấp, quần jean denim chuẩn form đến các phụ kiện thời trang —
                tất cả đều được chọn lọc kỹ càng để đảm bảo chất lượng và phong cách.
              </p>
              <Link to="/new" style={s.ctaBtn}>
                Khám phá bộ sưu tập →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* GIÁ TRỊ CỐT LÕI */}
      <div style={{ ...s.section, background: "#f9fafb" }}>
        <div style={s.container}>
          <div style={s.centerHead}>
            <p style={s.sectionLabel}>Giá trị cốt lõi</p>
            <h2 style={s.sectionTitle}>Tại sao chọn DIEP COLLECTION?</h2>
          </div>
          <div style={s.valuesGrid}>
            {[
              {
                icon: "fa-gem",
                color: "#2563eb",
                bg: "#dbeafe",
                title: "Chất lượng cao cấp",
                desc: "Mỗi sản phẩm được làm từ chất liệu cao cấp, qua kiểm định nghiêm ngặt trước khi đến tay khách hàng.",
              },
              {
                icon: "fa-shirt",
                color: "#059669",
                bg: "#d1fae5",
                title: "Thiết kế hiện đại",
                desc: "Cập nhật xu hướng thời trang mới nhất, phù hợp với phong cách sống năng động của người trẻ.",
              },
              {
                icon: "fa-tag",
                color: "#d97706",
                bg: "#fef3c7",
                title: "Giá cả hợp lý",
                desc: "Cam kết mang đến sản phẩm chất lượng với mức giá phải chăng, xứng đáng với từng đồng bạn bỏ ra.",
              },
              {
                icon: "fa-headset",
                color: "#7c3aed",
                bg: "#ede9fe",
                title: "Dịch vụ tận tâm",
                desc: "Đội ngũ tư vấn nhiệt tình, hỗ trợ 24/7, đổi trả trong 15 ngày nếu không hài lòng.",
              },
            ].map((v, i) => (
              <div key={i} style={s.valueCard}>
                <div style={{ ...s.valueIcon, background: v.bg }}>
                  <i className={`fa-solid ${v.icon}`} style={{ color: v.color, fontSize: "24px" }} />
                </div>
                <h3 style={s.valueTitle}>{v.title}</h3>
                <p style={s.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CON SỐ ẤN TƯỢNG */}
      <div style={s.statsSection}>
        <div style={s.container}>
          <div style={s.statsGrid}>
            {[
              { num: "10.000+", label: "Khách hàng tin tưởng" },
              { num: "500+", label: "Sản phẩm đa dạng" },
              { num: "15", label: "Ngày đổi trả miễn phí" },
              { num: "4.8★", label: "Đánh giá trung bình" },
            ].map((s2, i) => (
              <div key={i} style={s.statItem}>
                <p style={s.statNum}>{s2.num}</p>
                <p style={s.statLabel}>{s2.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CAM KẾT */}
      <div style={s.section}>
        <div style={s.container}>
          <div style={s.centerHead}>
            <p style={s.sectionLabel}>Cam kết của chúng tôi</p>
            <h2 style={s.sectionTitle}>Mua sắm an tâm tại DIEP COLLECTION</h2>
          </div>
          <div style={s.commitGrid}>
            {[
              { icon: "fa-truck", color: "#059669", title: "Miễn phí vận chuyển", desc: "Đơn hàng từ 399.000đ" },
              { icon: "fa-rotate-left", color: "#2563eb", title: "Đổi hàng tận nhà", desc: "Trong vòng 15 ngày" },
              { icon: "fa-shield-halved", color: "#7c3aed", title: "Hàng chính hãng 100%", desc: "Cam kết không hàng giả" },
              { icon: "fa-money-bill-wave", color: "#d97706", title: "Thanh toán linh hoạt", desc: "COD, QR, ZaloPay" },
            ].map((c, i) => (
              <div key={i} style={s.commitItem}>
                <i className={`fa-solid ${c.icon}`} style={{ fontSize: "28px", color: c.color, marginBottom: "12px" }} />
                <h4 style={s.commitTitle}>{c.title}</h4>
                <p style={s.commitDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIÊN HỆ */}
      <div style={{ ...s.section, background: "#001C40" }}>
        <div style={s.container}>
          <div style={s.contactGrid}>
            <div>
              <h2 style={{ ...s.sectionTitle, color: "#fff", marginBottom: "16px" }}>Liên hệ với chúng tôi</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: "1.8", marginBottom: "24px" }}>
                Bạn có câu hỏi về sản phẩm hoặc cần tư vấn phong cách?<br />
                Đội ngũ DIEP COLLECTION luôn sẵn sàng hỗ trợ bạn.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { icon: "fa-phone", text: "Hotline: 1900 xxxx (8:00 – 22:00)" },
                  { icon: "fa-envelope", text: "support@diepcollection.com" },
                  { icon: "fa-location-dot", text: "114 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <i className={`fa-solid ${c.icon}`} style={{ color: "#60a5fa", fontSize: "16px", width: "20px" }} />
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px" }}>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.contactCta}>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginBottom: "20px", textAlign: "center" }}>
                Bắt đầu mua sắm ngay hôm nay
              </p>
              <Link to="/" style={s.ctaBtnWhite}>Xem sản phẩm</Link>
              <Link to="/he-thong-cua-hang" style={s.ctaBtnOutline}>Hệ thống cửa hàng</Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter',sans-serif", background: "#fff" },

  // Hero
  hero: { position: "relative", height: "500px", overflow: "hidden" },
  heroImg: { width: "100%", height: "100%", objectFit: "cover" },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(0,28,64,0.85),rgba(0,28,64,0.4))", zIndex: 1 },
  heroContent: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", zIndex: 2, color: "#fff", width: "90%" },
  heroSub: { fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase", opacity: 0.8, marginBottom: "12px" },
  heroTitle: { fontSize: "52px", fontWeight: "900", letterSpacing: "4px", marginBottom: "12px" },
  heroDesc: { fontSize: "16px", opacity: 0.85 },

  // Sections
  section: { padding: "72px 20px" },
  container: { maxWidth: "1200px", margin: "0 auto" },
  centerHead: { textAlign: "center", marginBottom: "48px" },
  sectionLabel: { fontSize: "12px", fontWeight: "700", color: "#001C40", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" },
  sectionTitle: { fontSize: "32px", fontWeight: "900", color: "#111", lineHeight: "1.3" },

  // Intro
  introGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" },
  introImg: { height: "500px", borderRadius: "12px", overflow: "hidden" },
  introText: {},
  introDesc: { fontSize: "15px", color: "#555", lineHeight: "1.8", marginBottom: "16px" },
  ctaBtn: { display: "inline-block", marginTop: "8px", padding: "14px 32px", background: "#001C40", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "700", fontSize: "14px", letterSpacing: "0.5px" },

  // Values
  valuesGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "24px" },
  valueCard: { background: "#fff", borderRadius: "12px", padding: "28px 24px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  valueIcon: { width: "60px", height: "60px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" },
  valueTitle: { fontSize: "15px", fontWeight: "700", color: "#111", marginBottom: "10px" },
  valueDesc: { fontSize: "13px", color: "#6b7280", lineHeight: "1.7" },

  // Stats
  statsSection: { background: "#001C40", padding: "60px 20px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px", maxWidth: "1200px", margin: "0 auto" },
  statItem: { textAlign: "center" },
  statNum: { fontSize: "40px", fontWeight: "900", color: "#fff", marginBottom: "8px" },
  statLabel: { fontSize: "13px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "1px" },

  // Commit
  commitGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "24px" },
  commitItem: { textAlign: "center", padding: "24px 16px" },
  commitTitle: { fontSize: "15px", fontWeight: "700", color: "#111", marginBottom: "8px" },
  commitDesc: { fontSize: "13px", color: "#6b7280" },

  // Contact
  contactGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" },
  contactCta: { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  ctaBtnWhite: { display: "block", width: "100%", padding: "14px 32px", background: "#fff", color: "#001C40", textDecoration: "none", borderRadius: "8px", fontWeight: "700", fontSize: "14px", textAlign: "center" },
  ctaBtnOutline: { display: "block", width: "100%", padding: "14px 32px", background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", textDecoration: "none", borderRadius: "8px", fontWeight: "700", fontSize: "14px", textAlign: "center" },
};

export default AboutPage;
