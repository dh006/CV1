import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const AirflexPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.container}>
      {/* --- 1. PRESTIGE HERO SECTION --- */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroTextContainer}>
            <span style={styles.heroTag}>PREMIUM DENIM LINE</span>
            <h1 style={styles.heroTitle}>
              AIRFLEX<span style={{ color: "#d71920" }}>™</span>
            </h1>
            <p style={styles.heroSubtitle}>DEFINING THE NEW LIMIT OF FREEDOM</p>
            <div style={styles.heroScrollGuide}>
              <div style={styles.scrollLine}></div>
              <span>SCROLL TO EXPLORE</span>
            </div>
          </div>
        </div>
        <img
          src="https://file.hstatic.net/1000360022/file/banner_airflex_ccb.jpg"
          alt="Airflex Prestige"
          style={styles.heroImg}
        />
      </section>

      {/* --- 2. THE MANIFESTO (Giới thiệu triết lý) --- */}
      <section style={styles.manifestoSection}>
        <div style={styles.manifestoContent}>
          <h2 style={styles.manifestoHeader}>
            Khi công nghệ hòa quyện cùng nghệ thuật cắt may.
          </h2>
          <p style={styles.manifestoText}>
            Airflex không ra đời để thay thế những giá trị cũ. Nó ra đời để định
            nghĩa lại cách chúng ta mặc Denim trong kỷ nguyên mới. Không còn
            những chiếc quần Jean thô cứng gây cản trở, Airflex là lớp da thứ
            hai, mềm mại nhưng kiêu hãnh, giúp bạn chinh phục mọi hành trình từ
            bình minh nơi phố thị đến hoàng hôn trên những cung đường xa.
          </p>
        </div>
      </section>

      {/* --- 3. SPLIT VISUAL SECTION (Ảnh đan xen chữ) --- */}
      <section style={styles.splitSection}>
        <div style={styles.splitImageSide}>
          <img
            src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"
            alt="Detail"
            style={styles.fullImg}
          />
        </div>
        <div style={styles.splitTextSide}>
          <div style={styles.stickyText}>
            <span style={styles.accentNumber}>01</span>
            <h3 style={styles.splitTitle}>Cấu trúc sợi Hyper-Stretch</h3>
            <p style={styles.splitDesc}>
              Bí mật nằm ở lõi sợi vải. Chúng tôi sử dụng các sợi siêu mảnh đan
              xen theo cấu trúc tổ ong, cho phép bề mặt vải co giãn 4 chiều
              nhưng ngay lập tức trở về trạng thái ban đầu mà không gây biến
              dạng form dáng.
            </p>
          </div>
        </div>
      </section>

      {/* --- 4. TECHNOLOGY GRID (Nâng cấp cực đẹp) --- */}
      <section style={styles.techGridSection}>
        <h2 style={styles.techMainTitle}>The Science of Comfort</h2>
        <div style={styles.techWrapper}>
          <div style={styles.techCard}>
            <div style={styles.techIcon}>✦</div>
            <h4>FLEX-TECH 360</h4>
            <p>
              Khả năng co giãn không giới hạn, ôm sát theo từng nhóm cơ vận
              động.
            </p>
          </div>
          <div style={styles.techCard}>
            <div style={styles.techIcon}>⚓</div>
            <h4>SHAPE RETAIN</h4>
            <p>
              Công nghệ khóa form giúp quần không bị giãn gối hay chảy xệ sau
              100 lần giặt.
            </p>
          </div>
          <div style={styles.techCard}>
            <div style={styles.techIcon}>☁</div>
            <h4>OXY-BREATH</h4>
            <p>
              Hàng triệu lỗ li ti trên bề mặt sợi giúp thoát nhiệt nhanh gấp 3
              lần Jean thường.
            </p>
          </div>
          <div style={styles.techCard}>
            <div style={styles.techIcon}>🌿</div>
            <h4>SOFT-TOUCH</h4>
            <p>
              Mặt trong được xử lý bằng enzyme sinh học tạo độ mịn như lụa khi
              chạm vào da.
            </p>
          </div>
        </div>
      </section>

      {/* --- 5. CINEMATIC LOOKBOOK (Tràn viền) --- */}
      <section style={styles.cinematicSection}>
        <div style={styles.cinemaOverlay}>
          <h3>URBAN NOMAD LOOKBOOK</h3>
          <p>
            Dành cho những tâm hồn tự do, không chịu trói buộc bởi những quy tắc
            cũ kỹ.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1475178626620-a4d074967452?w=1600"
          alt="Cinema"
          style={styles.cinemaImg}
        />
      </section>

      {/* --- 6. SHOP THE LOOK (Gợi ý mua sắm) --- */}
      <section style={styles.shopLook}>
        <div style={styles.shopContent}>
          <div style={styles.shopText}>
            <h2>Sẵn sàng trải nghiệm sự khác biệt?</h2>
            <p>
              Chọn phiên bản Airflex phù hợp với cá tính của bạn ngay hôm nay.
            </p>
            <Link to="/collections/quan-jeans" style={styles.luxuryBtn}>
              XEM BỘ SƯU TẬP
            </Link>
          </div>
          <div style={styles.productFeature}>
            <img
              src="https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600"
              alt="Product"
              style={styles.productImg}
            />
            <div style={styles.floatingPrice}>Premium Line / 650.000đ</div>
          </div>
        </div>
      </section>

      {/* --- 7. QUOTE SECTION --- */}
      <section style={styles.quoteSection}>
        <blockquote style={styles.quote}>
          "Fashion is about comfort and feeling good. Airflex is the bridge
          between looking sharp and being comfortable."
        </blockquote>
        <cite>— DIEP COLLECTION Design Team</cite>
      </section>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#fff",
    color: "#111",
    fontFamily: "'Inter', sans-serif",
  },

  // Hero Prestige
  hero: {
    height: "100vh",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    zIndex: 1,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    padding: "0 10%",
  },
  heroTextContainer: { color: "#fff", maxWidth: "800px" },
  heroTag: {
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "5px",
    color: "#d71920",
    display: "block",
    marginBottom: "20px",
  },
  heroTitle: {
    fontSize: "140px",
    fontWeight: "900",
    lineHeight: "1",
    margin: 0,
    letterSpacing: "-8px",
  },
  heroSubtitle: {
    fontSize: "18px",
    letterSpacing: "10px",
    marginTop: "20px",
    opacity: 0.8,
  },
  heroScrollGuide: {
    position: "absolute",
    bottom: "50px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  scrollLine: { width: "50px", height: "1px", backgroundColor: "#fff" },

  // Manifesto
  manifestoSection: {
    padding: "150px 20%",
    textAlign: "center",
    backgroundColor: "#000",
    color: "#fff",
  },
  manifestoHeader: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "40px",
    lineHeight: "1.2",
  },
  manifestoText: {
    fontSize: "20px",
    lineHeight: "2",
    opacity: 0.7,
    fontWeight: "300",
  },

  // Split Visual
  splitSection: { display: "flex", minHeight: "80vh" },
  splitImageSide: { flex: 1.2 },
  fullImg: { width: "100%", height: "100%", objectFit: "cover" },
  splitTextSide: {
    flex: 1,
    padding: "100px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  accentNumber: {
    fontSize: "80px",
    fontWeight: "900",
    color: "#e0e0e0",
    display: "block",
  },
  splitTitle: { fontSize: "36px", margin: "20px 0" },
  splitDesc: { fontSize: "18px", lineHeight: "1.8", color: "#555" },

  // Tech Grid
  techGridSection: { padding: "120px 10%", textAlign: "center" },
  techMainTitle: {
    fontSize: "40px",
    marginBottom: "80px",
    textTransform: "uppercase",
    letterSpacing: "5px",
  },
  techWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "40px",
  },
  techCard: {
    padding: "40px",
    border: "1px solid #eee",
    transition: "0.4s",
    cursor: "default",
  },
  techIcon: { fontSize: "30px", marginBottom: "20px", color: "#d71920" },

  // Cinematic
  cinematicSection: {
    height: "70vh",
    position: "relative",
    overflow: "hidden",
  },
  cinemaImg: { width: "100%", height: "100%", objectFit: "cover" },
  cinemaOverlay: {
    position: "absolute",
    bottom: "100px",
    left: "10%",
    color: "#fff",
    zIndex: 2,
  },

  // Shop Look
  shopLook: { padding: "150px 10%", backgroundColor: "#fff" },
  shopContent: { display: "flex", alignItems: "center", gap: "100px" },
  shopText: { flex: 1 },
  luxuryBtn: {
    display: "inline-block",
    marginTop: "40px",
    padding: "20px 50px",
    backgroundColor: "#000",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "0.3s",
  },
  productFeature: { flex: 1, position: "relative" },
  productImg: { width: "100%", borderRadius: "10px" },
  floatingPrice: {
    position: "absolute",
    bottom: "-20px",
    right: "-20px",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    fontWeight: "bold",
  },

  // Quote
  quoteSection: {
    padding: "100px 20%",
    textAlign: "center",
    borderTop: "1px solid #eee",
  },
  quote: {
    fontSize: "28px",
    fontStyle: "italic",
    marginBottom: "20px",
    color: "#333",
  },
};

export default AirflexPage;
