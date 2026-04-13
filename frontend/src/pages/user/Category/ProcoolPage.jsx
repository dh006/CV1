import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const ProcoolPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.container}>
      {/* --- 1. ICY HERO SECTION --- */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroTextContainer}>
            <span style={styles.heroTag}>ADVANCED COOLING SYSTEM</span>
            <h1 style={styles.heroTitle}>
              ProCOOL<span style={{ color: "#00a8ff" }}>++™</span>
            </h1>
            <p style={styles.heroSubtitle}>STAY CHILL IN THE HEAT</p>
            <div style={styles.heroScrollGuide}>
              <div style={styles.scrollLine}></div>
              <span>FEEL THE BREEZE</span>
            </div>
          </div>
        </div>
        <img
          src="https://file.hstatic.net/1000360022/file/procool_banner_921.jpg"
          alt="Procool Visual"
          style={styles.heroImg}
        />
      </section>

      {/* --- 2. THE COLD TRUTH (Triết lý giải nhiệt) --- */}
      <section style={styles.manifestoSection}>
        <div style={styles.manifestoContent}>
          <h2 style={styles.manifestoHeader}>
            Tạm biệt sự bí bách. Chào đón sự sảng khoái.
          </h2>
          <p style={styles.manifestoText}>
            Mùa hè tại Việt Nam không còn là nỗi lo khi bạn khoác lên mình
            ProCOOL++™. Chúng tôi không chỉ may quần áo; chúng tôi kiến tạo một
            hệ thống điều hòa di động. Bằng cách tích hợp các tinh thể làm mát
            vào lõi sợi, ProCOOL++™ chủ động dẫn nhiệt ra khỏi cơ thể, giữ cho
            bạn sự tỉnh táo và phong thái đĩnh đạc nhất dù dưới cái nắng gắt
            40°C.
          </p>
        </div>
      </section>

      {/* --- 3. COOLING TECH SPLIT (Ảnh đan xen chữ) --- */}
      <section style={styles.splitSection}>
        <div style={styles.splitTextSide}>
          <div style={styles.stickyText}>
            <span style={styles.accentNumber}>-2°C</span>
            <h3 style={styles.splitTitle}>Làm mát tức thì</h3>
            <p style={styles.splitDesc}>
              Công nghệ sợi làm mát thông minh giúp hạ nhiệt độ bề mặt da ngay
              khi tiếp xúc. Cấu trúc vải dệt xốp giúp hơi nóng thoát ra ngoài
              nhanh hơn 40% so với vải Denim thông thường, mang lại cảm giác như
              có luồng gió nhẹ luôn bao quanh cơ thể.
            </p>
          </div>
        </div>
        <div style={styles.splitImageSide}>
          <img
            src="https://images.unsplash.com/photo-1516726817505-f5ed17439364?w=800"
            alt="Fresh Denim"
            style={styles.fullImg}
          />
        </div>
      </section>

      {/* --- 4. CORE FEATURES (4 Cột công nghệ) --- */}
      <section style={styles.techGridSection}>
        <h2 style={styles.techMainTitle}>Engineering The Chill</h2>
        <div style={styles.techWrapper}>
          <div style={styles.techCard}>
            <div style={styles.techIcon}>❄</div>
            <h4>ICE-FIBER</h4>
            <p>
              Sợi vải chứa tinh thể khoáng thạch giúp duy trì nhiệt độ ổn định
              cho cơ thể.
            </p>
          </div>
          <div style={styles.techCard}>
            <div style={styles.techIcon}>💧</div>
            <h4>DRY-FAST</h4>
            <p>
              Khả năng đẩy mồ hôi lên bề mặt vải và bay hơi cực nhanh, không gây
              bết dính.
            </p>
          </div>
          <div style={styles.techCard}>
            <div style={styles.techIcon}>⚔</div>
            <h4>ANTI-UV</h4>
            <p>
              Chỉ số UPF 50+ bảo vệ da tuyệt đối khỏi tác hại của tia cực tím.
            </p>
          </div>
          <div style={styles.techCard}>
            <div style={styles.techIcon}>🌀</div>
            <h4>AIR-FLOW</h4>
            <p>
              Kiểu dệt đặc biệt tạo khe hở không khí tối ưu hóa việc thông gió.
            </p>
          </div>
        </div>
      </section>

      {/* --- 5. SHOP THE COLLECTION --- */}
      <section style={styles.shopLook}>
        <div style={styles.shopContent}>
          <div style={styles.productFeature}>
            <img
              src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600"
              alt="Procool Item"
              style={styles.productImg}
            />
            <div style={styles.floatingLabel}>COLD-DENIM SERIES</div>
          </div>
          <div style={styles.shopText}>
            <h2 style={{ fontSize: "40px" }}>
              Trải nghiệm cảm giác mát lạnh chưa từng có.
            </h2>
            <p style={{ margin: "20px 0", color: "#666" }}>
              Dòng sản phẩm ProCOOL++™ hiện đã có mặt tại hệ thống cửa hàng DIEP
              COLLECTION với các phiên bản Jeans, Polo và Sơ mi.
            </p>
            <Link to="/collections/procool" style={styles.luxuryBtn}>
              XEM TOÀN BỘ DÒNG PROCOOL
            </Link>
          </div>
        </div>
      </section>

      {/* --- 6. FOOTER QUOTE --- */}
      <section style={styles.quoteSection}>
        <blockquote style={styles.quote}>
          "Don't let the weather dictate your style. ProCOOL is the ultimate
          solution for the modern urban explorer."
        </blockquote>
      </section>
    </div>
  );
};

const styles = {
  container: { backgroundColor: "#fff", color: "#111", overflow: "hidden" },

  // Hero Section
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
    backgroundColor: "rgba(0,40,80,0.2)",
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
    color: "#00a8ff",
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
    opacity: 0.9,
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
    backgroundColor: "#f0f8ff",
    color: "#001c40",
  },
  manifestoHeader: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "40px",
  },
  manifestoText: {
    fontSize: "20px",
    lineHeight: "2",
    opacity: 0.8,
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
    backgroundColor: "#fff",
  },
  accentNumber: {
    fontSize: "100px",
    fontWeight: "900",
    color: "#eef7ff",
    display: "block",
  },
  splitTitle: { fontSize: "36px", margin: "20px 0", color: "#001c40" },
  splitDesc: { fontSize: "18px", lineHeight: "1.8", color: "#555" },

  // Tech Grid
  techGridSection: { padding: "120px 10%", textAlign: "center" },
  techMainTitle: {
    fontSize: "40px",
    marginBottom: "80px",
    letterSpacing: "5px",
    color: "#001c40",
  },
  techWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "40px",
  },
  techCard: {
    padding: "40px",
    border: "1px solid #eef7ff",
    backgroundColor: "#fbfdff",
    transition: "0.4s",
  },
  techIcon: { fontSize: "35px", marginBottom: "20px", color: "#00a8ff" },

  // Shop Look
  shopLook: { padding: "150px 10%", backgroundColor: "#fff" },
  shopContent: { display: "flex", alignItems: "center", gap: "100px" },
  productFeature: { flex: 1, position: "relative" },
  productImg: { width: "100%", borderRadius: "4px" },
  floatingLabel: {
    position: "absolute",
    top: "20px",
    left: "-20px",
    backgroundColor: "#00a8ff",
    color: "#fff",
    padding: "10px 20px",
    fontWeight: "bold",
    boxShadow: "10px 10px 30px rgba(0,0,0,0.1)",
  },
  shopText: { flex: 1 },
  luxuryBtn: {
    display: "inline-block",
    marginTop: "40px",
    padding: "20px 50px",
    backgroundColor: "#001c40",
    color: "#fff",
    textDecoration: "none",
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
    color: "#001c40",
    opacity: 0.6,
  },
};

export default ProcoolPage;
