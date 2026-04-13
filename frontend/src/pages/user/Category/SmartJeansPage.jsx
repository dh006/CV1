import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const SmartJeansPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.container}>
      {/* --- 1. LUXURY HERO SECTION --- */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroTextContainer}>
            <span style={styles.heroTag}>THE INTELLIGENT CHOICE</span>
            <h1 style={styles.heroTitle}>
              SMART <span style={styles.goldText}>JEANS™</span>
            </h1>
            <p style={styles.heroSubtitle}>ENGINEERED FOR PERFECTION</p>
            <div style={styles.heroScrollGuide}>
              <div style={styles.scrollLine}></div>
              <span>DURABILITY DEFINED</span>
            </div>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1600"
          alt="Smart Jeans Hero"
          style={styles.heroImg}
        />
      </section>

      {/* --- 2. DARK MANIFESTO (Triết lý sản phẩm) --- */}
      <section style={styles.manifestoSection}>
        <div style={styles.manifestoContent}>
          <h2 style={styles.manifestoHeader}>
            Thông minh hơn. Bền bỉ hơn. Đẳng cấp hơn.
          </h2>
          <p style={styles.manifestoText}>
            Smart Jeans™ không chỉ là Denim, đó là một giải pháp thời trang toàn
            diện cho người đàn ông bận rộn. Chúng tôi tích hợp công nghệ Nano
            chống bám bẩn, sợi vải ghi nhớ form dáng và kỹ thuật nhuộm khóa màu
            độc quyền. Một chiếc quần luôn trông như mới dù sau hàng trăm lần
            mặc, giúp bạn luôn tự tin trong mọi tình huống quan trọng nhất.
          </p>
        </div>
      </section>

      {/* --- 3. INTERACTIVE FEATURE SECTION (Hiệu ứng đan xen) --- */}
      <section style={styles.splitSection}>
        <div style={styles.splitImageSide}>
          <img
            src="https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=1000"
            alt="Smart Detail"
            style={styles.fullImg}
          />
        </div>
        <div style={styles.splitTextSide}>
          <div style={styles.stickyText}>
            <span style={styles.accentNumber}>03</span>
            <h3 style={styles.splitTitle}>Kỹ thuật nhuộm khóa màu</h3>
            <p style={styles.splitDesc}>
              Công nghệ nhuộm sâu (Deep-Dye) giúp các phân tử màu bám chặt vào
              lõi sợi vải. Kết quả là màu sắc đậm đà, sắc nét và đặc biệt là khả
              năng chống phai màu vượt trội, giữ cho chiếc quần của bạn luôn giữ
              được sắc thái sang trọng như ngày đầu tiên.
            </p>
          </div>
        </div>
      </section>

      {/* --- 4. TECH CARDS WITH HOVER EFFECTS --- */}
      <section style={styles.techGridSection}>
        <h2 style={styles.techMainTitle}>Smart Technology</h2>
        <div style={styles.techWrapper}>
          <div style={styles.techCard} className="smart-card">
            <div style={styles.techIcon}>🛡️</div>
            <h4>ANTI-STAIN NANO</h4>
            <p>
              Lớp phủ Nano siêu mỏng giúp trượt nước và chống bám bẩn từ cà phê,
              bùn đất.
            </p>
          </div>
          <div style={styles.techCard} className="smart-card">
            <div style={styles.techIcon}>👔</div>
            <h4>IRON-FREE</h4>
            <p>
              Khả năng tự phẳng sau khi giặt, giúp bạn tiết kiệm thời gian là ủi
              mỗi sáng.
            </p>
          </div>
          <div style={styles.techCard} className="smart-card">
            <div style={styles.techIcon}>🧬</div>
            <h4>MEMORY FIBER</h4>
            <p>
              Sợi vải thông minh ghi nhớ số đo cơ thể, tạo sự vừa vặn cá nhân
              hóa tuyệt đối.
            </p>
          </div>
          <div style={styles.techCard} className="smart-card">
            <div style={styles.techIcon}>🦠</div>
            <h4>SILVER-ION</h4>
            <p>
              Tích hợp ion bạc kháng khuẩn, khử mùi hôi hiệu quả suốt 24 giờ
              năng động.
            </p>
          </div>
        </div>
      </section>

      {/* --- 5. PREMIUM CALL TO ACTION --- */}
      <section style={styles.shopLook}>
        <div style={styles.shopContent}>
          <div style={styles.shopText}>
            <h2 style={{ fontSize: "48px", color: "#fff" }}>
              Sở hữu công nghệ Denim dẫn đầu.
            </h2>
            <p style={{ margin: "30px 0", color: "#aaa", fontSize: "18px" }}>
              Đừng để trang phục làm rào cản. Hãy để Smart Jeans™ trở thành
              người đồng hành đáng tin cậy nhất.
            </p>
            <Link to="/collections/smart-jeans" style={styles.luxuryBtn}>
              MUA NGAY SMART JEANS™
            </Link>
          </div>
          <div style={styles.productFeature}>
            <img
              src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"
              alt="Premium Product"
              style={styles.productImg}
            />
            <div style={styles.goldBadge}>PREMIUM QUALITY</div>
          </div>
        </div>
      </section>

      {/* --- CSS HOVER INLINE --- */}
      <style>
        {`
          .smart-card:hover {
            transform: translateY(-15px);
            border-color: #c5a059 !important;
            box-shadow: 0 20px 40px rgba(197, 160, 89, 0.2);
            background: #1a1a1a !important;
          }
          .smart-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: { backgroundColor: "#000", color: "#fff", overflow: "hidden" },

  // Hero
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
    opacity: 0.7,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    padding: "0 10%",
  },
  heroTextContainer: { maxWidth: "900px" },
  heroTag: {
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "5px",
    color: "#c5a059",
    display: "block",
    marginBottom: "20px",
  },
  heroTitle: {
    fontSize: "140px",
    fontWeight: "900",
    lineHeight: "1",
    margin: 0,
    letterSpacing: "-5px",
  },
  goldText: { color: "#c5a059" },
  heroSubtitle: {
    fontSize: "20px",
    letterSpacing: "10px",
    marginTop: "20px",
    color: "#ccc",
  },
  heroScrollGuide: {
    position: "absolute",
    bottom: "50px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    color: "#aaa",
  },
  scrollLine: { width: "50px", height: "1px", backgroundColor: "#c5a059" },

  // Manifesto
  manifestoSection: {
    padding: "150px 20%",
    textAlign: "center",
    backgroundColor: "#0a0a0a",
  },
  manifestoHeader: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "40px",
    color: "#fff",
  },
  manifestoText: {
    fontSize: "20px",
    lineHeight: "2",
    color: "#888",
    fontWeight: "300",
  },

  // Split Visual
  splitSection: { display: "flex", minHeight: "85vh", backgroundColor: "#000" },
  splitImageSide: { flex: 1.3 },
  fullImg: { width: "100%", height: "100%", objectFit: "cover" },
  splitTextSide: {
    flex: 1,
    padding: "100px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  accentNumber: {
    fontSize: "100px",
    fontWeight: "900",
    color: "#151515",
    display: "block",
  },
  splitTitle: { fontSize: "36px", margin: "20px 0", color: "#c5a059" },
  splitDesc: { fontSize: "18px", lineHeight: "1.8", color: "#999" },

  // Tech Grid
  techGridSection: {
    padding: "120px 10%",
    textAlign: "center",
    backgroundColor: "#000",
  },
  techMainTitle: {
    fontSize: "40px",
    marginBottom: "80px",
    letterSpacing: "5px",
    color: "#fff",
    textTransform: "uppercase",
  },
  techWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "30px",
  },
  techCard: {
    padding: "50px 30px",
    border: "1px solid #222",
    backgroundColor: "#0a0a0a",
    borderRadius: "10px",
  },
  techIcon: { fontSize: "40px", marginBottom: "25px" },

  // Shop Look
  shopLook: { padding: "150px 10%", backgroundColor: "#0a0a0a" },
  shopContent: { display: "flex", alignItems: "center", gap: "100px" },
  shopText: { flex: 1 },
  luxuryBtn: {
    display: "inline-block",
    padding: "20px 50px",
    backgroundColor: "#c5a059",
    color: "#000",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
    borderRadius: "2px",
    transition: "0.3s",
  },
  productFeature: { flex: 1, position: "relative" },
  productImg: { width: "100%", borderRadius: "5px", filter: "grayscale(20%)" },
  goldBadge: {
    position: "absolute",
    top: "30px",
    right: "-20px",
    backgroundColor: "#c5a059",
    color: "#000",
    padding: "10px 20px",
    fontWeight: "bold",
    fontSize: "12px",
    letterSpacing: "2px",
  },

  // Quote
  quoteSection: {
    padding: "100px 20%",
    textAlign: "center",
    borderTop: "1px solid #111",
  },
  quote: { fontSize: "28px", fontStyle: "italic", color: "#555" },
};

export default SmartJeansPage;
