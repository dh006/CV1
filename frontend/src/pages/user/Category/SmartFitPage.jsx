import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const SmartFitPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.container}>
      {/* --- 1. MINIMAL HERO SECTION --- */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroTextContainer}>
            <span style={styles.heroTag}>THE NEW STANDARD</span>
            <h1 style={styles.heroTitle}>
              SMART <span style={styles.accentText}>FIT</span>
            </h1>
            <p style={styles.heroSubtitle}>WHERE ELEGANCE MEETS FREEDOM</p>
            <div style={styles.heroScrollGuide}>
              <div style={styles.scrollLine}></div>
              <span>TAILORED FOR YOU</span>
            </div>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1475178626620-a4d074967452?w=1600"
          alt="Smart Fit Hero"
          style={styles.heroImg}
        />
      </section>

      {/* --- 2. PHILOSOPHY SECTION --- */}
      <section style={styles.philosophySection}>
        <div style={styles.philosophyContent}>
          <h2 style={styles.philosophyHeader}>
            Sự vừa vặn thông minh cho quý ông hiện đại.
          </h2>
          <p style={styles.philosophyText}>
            Smart-Fit không chỉ là một thông số đo lường, đó là một triết lý về
            sự cân bằng. Không quá bó sát như Slim-fit, không quá rộng rãi như
            Regular, Smart-Fit ôm nhẹ nhàng theo những đường nét tự nhiên của cơ
            thể. Đây là phom dáng hoàn hảo nhất để bạn chuyển mình linh hoạt từ
            những cuộc họp quan trọng đến những buổi tối thư giãn cùng bạn bè.
          </p>
        </div>
      </section>

      {/* --- 3. VISUAL ANATOMY (Cấu trúc phom dáng) --- */}
      <section style={styles.anatomySection}>
        <div style={styles.anatomyTextSide}>
          <div style={styles.anatomySticky}>
            <span style={styles.label}>CHI TIẾT PHOM DÁNG</span>
            <h3 style={styles.anatomyTitle}>Tối ưu hóa hình thể</h3>
            <ul style={styles.anatomyList}>
              <li className="anatomy-item">
                <strong>Vừa vặn vùng hông:</strong> Cố định chắc chắn nhưng
                không gây áp lực.
              </li>
              <li className="anatomy-item">
                <strong>Ống quần thuôn nhẹ:</strong> Tạo hiệu ứng kéo dài đôi
                chân một cách tinh tế.
              </li>
              <li className="anatomy-item">
                <strong>Độ dài chuẩn mực:</strong> Vừa chạm mắt cá chân, hoàn
                hảo cho mọi loại giày.
              </li>
            </ul>
          </div>
        </div>
        <div style={styles.anatomyImageSide}>
          <img
            src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800"
            alt="Smart Fit Anatomy"
            style={styles.fullImg}
          />
        </div>
      </section>

      {/* --- 4. STYLE CARDS (Hover Effects) --- */}
      <section style={styles.styleGridSection}>
        <h2 style={styles.styleMainTitle}>Why choose Smart-Fit?</h2>
        <div style={styles.styleWrapper}>
          <div style={styles.styleCard} className="hover-card">
            <div style={styles.styleIcon}>👔</div>
            <h4>PROFESSIONAL</h4>
            <p>
              Mang lại vẻ ngoài chuyên nghiệp, chỉn chu như được đo may riêng.
            </p>
          </div>
          <div style={styles.styleCard} className="hover-card">
            <div style={styles.styleIcon}>⚡</div>
            <h4>VERSATILE</h4>
            <p>
              Dễ dàng kết hợp với Sơ mi, Polo hay T-shirt cho mọi hoàn cảnh.
            </p>
          </div>
          <div style={styles.styleCard} className="hover-card">
            <div style={styles.styleIcon}>🕺</div>
            <h4>COMFORTABLE</h4>
            <p>
              Đảm bảo không gian cho bắp đùi và khớp gối vận động thoải mái.
            </p>
          </div>
        </div>
      </section>

      {/* --- 5. CALL TO ACTION --- */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2>Trải nghiệm phom dáng "quốc dân"</h2>
          <p>
            Tìm kiếm phiên bản Smart-Fit hoàn hảo cho riêng bạn tại DIEP
            COLLECTION.
          </p>
          <Link to="/form/smart-fit" style={styles.luxuryBtn}>
            XEM SẢN PHẨM SMART-FIT
          </Link>
        </div>
      </section>

      {/* --- CSS HOVER INLINE --- */}
      <style>
        {`
          .hover-card:hover {
            background-color: #001C40 !important;
            color: #fff !important;
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          }
          .hover-card:hover p {
            color: #ccc !important;
          }
          .hover-card {
            transition: all 0.4s ease !important;
          }
          .anatomy-item {
            margin-bottom: 20px;
            font-size: 18px;
            color: #555;
            list-style: none;
            position: relative;
            padding-left: 20px;
          }
          .anatomy-item::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #001C40;
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: { backgroundColor: "#fff", color: "#111", overflow: "hidden" },

  // Hero
  hero: {
    height: "90vh",
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
    backgroundColor: "rgba(255,255,255,0.1)",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    padding: "0 10%",
  },
  heroTextContainer: { maxWidth: "800px" },
  heroTag: {
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "5px",
    color: "#001C40",
    marginBottom: "20px",
    display: "block",
  },
  heroTitle: {
    fontSize: "140px",
    fontWeight: "900",
    lineHeight: "1",
    margin: 0,
    letterSpacing: "-5px",
    color: "#001C40",
  },
  accentText: { color: "#d71920" },
  heroSubtitle: {
    fontSize: "18px",
    letterSpacing: "8px",
    marginTop: "20px",
    color: "#333",
    fontWeight: "500",
  },
  heroScrollGuide: {
    position: "absolute",
    bottom: "50px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    color: "#666",
  },
  scrollLine: { width: "50px", height: "1px", backgroundColor: "#001C40" },

  // Philosophy
  philosophySection: {
    padding: "120px 20%",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  philosophyHeader: {
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#001C40",
  },
  philosophyText: {
    fontSize: "19px",
    lineHeight: "1.9",
    color: "#555",
    fontWeight: "300",
  },

  // Anatomy
  anatomySection: { display: "flex", minHeight: "80vh" },
  anatomyTextSide: {
    flex: 1,
    padding: "100px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#d71920",
    letterSpacing: "3px",
  },
  anatomyTitle: { fontSize: "36px", margin: "20px 0", color: "#001C40" },
  anatomyList: { padding: 0, marginTop: "40px" },
  anatomyImageSide: { flex: 1.2 },
  fullImg: { width: "100%", height: "100%", objectFit: "cover" },

  // Style Grid
  styleGridSection: { padding: "120px 10%", textAlign: "center" },
  styleMainTitle: {
    fontSize: "32px",
    marginBottom: "60px",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  styleWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "30px",
  },
  styleCard: {
    padding: "60px 40px",
    border: "1px solid #eee",
    borderRadius: "2px",
    backgroundColor: "#fff",
  },
  styleIcon: { fontSize: "40px", marginBottom: "25px" },

  // CTA
  ctaSection: {
    padding: "120px 0",
    textAlign: "center",
    backgroundColor: "#001C40",
    color: "#fff",
  },
  ctaContent: { maxWidth: "700px", margin: "0 auto" },
  luxuryBtn: {
    display: "inline-block",
    marginTop: "40px",
    padding: "18px 45px",
    border: "1px solid #fff",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "0.3s",
    letterSpacing: "1px",
  },
};

export default SmartFitPage;
