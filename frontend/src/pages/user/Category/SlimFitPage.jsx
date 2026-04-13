import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const SlimFitPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.container}>
      {/* --- 1. MODERN HERO SECTION --- */}
      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <span style={styles.heroTag}>MODERN & ENERGETIC</span>
          <h1 style={styles.heroTitle}>
            SLIM <span style={styles.accentText}>FIT</span>
          </h1>
          <p style={styles.heroSubtitle}>CRAFTED FOR THE NEXT GENERATION</p>
          <Link to="/form/slim-fit" style={styles.heroBtn}>
            OWN YOUR STYLE
          </Link>
        </div>
        <div style={styles.heroRight}>
          <img
            src="https://images.unsplash.com/photo-1594938290170-0714486968d9?w=800"
            alt="Slim Fit Modern"
            style={styles.heroImg}
          />
        </div>
      </section>

      {/* --- 2. INTRO TEXT BLOCK --- */}
      <section style={styles.introTextBlock}>
        <div style={styles.introLeftText}>
          <h2 style={styles.introTitle}>
            Phá vỡ giới hạn phom dáng truyền thống.
          </h2>
        </div>
        <div style={styles.introRightText}>
          <p style={styles.introDesc}>
            Thiết kế ôm nhẹ theo chân nhưng vẫn giữ được sự thoải mái cần thiết,
            Slim-Fit giúp tôn lên vóc dáng khỏe khoắn, năng động. Đường cắt tinh
            tế từ hông xuống cổ chân tạo hiệu ứng thị giác kéo dài đôi chân, cho
            bạn vẻ ngoài tự tin và hiện đại trong mọi khoảnh khắc.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600"
          alt="Slim Fit Model Full"
          style={styles.introImage}
        />
      </section>

      {/* --- 3. SCULPTED LOOK SECTION --- */}
      <section style={styles.sculptedSection}>
        <div style={styles.sculptedContent}>
          <h3 style={styles.sculptedNumber}>02.</h3>
          <h4 style={styles.sculptedTitle}>Đường nét ôm sát, tôn dáng.</h4>
          <p style={styles.sculptedDesc}>
            Slim-Fit được tạo ra để ôm trọn vẹn những đường cong tự nhiên của cơ
            thể. Không quá bó sát nhưng đủ để tôn lên vẻ đẹp hình thể, mang lại
            cảm giác thoải mái tối đa khi di chuyển, giúp bạn luôn tự tin và
            phong độ.
          </p>
          <Link to="/collections/quan-jeans" style={styles.sculptedLink}>
            KHÁM PHÁ CÁC MẪU SLIM FIT →
          </Link>
        </div>
        <div style={styles.sculptedImage}>
          <img
            src="https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600"
            alt="Sculpted Slim Fit"
            style={styles.sculptedImg}
          />
        </div>
      </section>

      {/* --- 4. STYLE VIBES (Grid 3 ảnh) --- */}
      <section style={styles.styleVibesSection}>
        <h2 style={styles.styleVibesTitle}>
          Hơn cả một chiếc quần: Phong cách sống Slim-Fit.
        </h2>
        <div style={styles.styleVibesGrid}>
          <div style={styles.vibesItem} className="vibes-card">
            <img
              src="https://images.unsplash.com/photo-1594938290170-0714486968d9?w=400"
              alt="Urban Vibe"
              style={styles.vibesImg}
            />
            <p style={styles.vibesCaption}>PHONG CÁCH URBAN</p>
          </div>
          <div style={styles.vibesItem} className="vibes-card">
            <img
              src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400"
              alt="Street Vibe"
              style={styles.vibesImg}
            />
            <p style={styles.vibesCaption}>PHONG THÁI ĐƯỜNG PHỐ</p>
          </div>
          <div style={styles.vibesItem} className="vibes-card">
            <img
              src="https://images.unsplash.com/photo-1563297155-7d4062a74c15?w=400"
              alt="Elegant Vibe"
              style={styles.vibesImg}
            />
            <p style={styles.vibesCaption}>LỊCH LÃM & ĐẲNG CẤP</p>
          </div>
        </div>
      </section>

      {/* --- 5. STYLING TIPS SECTION --- */}
      <section style={styles.stylingTipsSection}>
        <div style={styles.stylingTipsLeft}>
          <h2 style={styles.stylingTipsTitle}>Tạo dấu ấn phong cách riêng.</h2>
          <div style={styles.tipCardsGrid}>
            <div style={styles.tipCard} className="tip-card">
              <img
                src="https://images.unsplash.com/photo-1603252109355-6df3d12d98dc?w=200"
                alt="Sneakers"
                style={styles.tipCardImg}
              />
              <h4>Sneakers Trắng</h4>
              <p>Tạo vẻ năng động, trẻ trung cho mọi set đồ.</p>
            </div>
            <div style={styles.tipCard} className="tip-card">
              <img
                src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200"
                alt="Leather Jacket"
                style={styles.tipCardImg}
              />
              <h4>Áo khoác da</h4>
              <p>Tăng thêm sự cá tính và mạnh mẽ.</p>
            </div>
            <div style={styles.tipCard} className="tip-card">
              <img
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200"
                alt="Basic Tee"
                style={styles.tipCardImg}
              />
              <h4>Áo thun cơ bản</h4>
              <p>Phối hợp dễ dàng cho phong cách tối giản.</p>
            </div>
          </div>
        </div>
        <div style={styles.stylingTipsRight}>
          <h2 style={styles.stylingRightTitle}>Khẳng định đẳng cấp riêng.</h2>
          <p style={styles.stylingRightDesc}>
            Chọn Slim-Fit để kiến tạo phong cách và làm chủ mọi xu hướng thời
            trang mới nhất.
          </p>
          <Link to="/form/slim-fit" style={styles.stylingRightBtn}>
            MUA NGAY SLIM FIT
          </Link>
          <img
            src="https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600"
            alt="New Generation"
            style={styles.stylingRightImg}
          />
          <span style={styles.stylingRightBadge}>
            NEW <br /> GENERATION
          </span>
        </div>
      </section>

      {/* --- CSS HOVER INLINE --- */}
      <style>
        {`
          .vibes-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.3); }
          .vibes-card { transition: all 0.4s ease-out; cursor: pointer; text-align: center; }
          .vibes-card img { filter: grayscale(50%); transition: 0.3s; }
          .vibes-card:hover img { filter: grayscale(0%); }

          .tip-card:hover { transform: scale(1.05); background-color: #222; }
          .tip-card { transition: all 0.3s ease; background-color: #111; padding: 25px; border-radius: 8px; text-align: center; cursor: pointer; }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: { backgroundColor: "#000", color: "#fff", overflow: "hidden" },

  // Hero
  hero: { display: "flex", minHeight: "100vh", backgroundColor: "#000" },
  heroLeft: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 10%",
  },
  heroTag: {
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "5px",
    color: "#666",
    marginBottom: "20px",
  },
  heroTitle: {
    fontSize: "140px",
    fontWeight: "900",
    margin: 0,
    letterSpacing: "-5px",
  },
  accentText: { color: "#d71920" },
  heroSubtitle: {
    fontSize: "20px",
    letterSpacing: "8px",
    marginTop: "20px",
    color: "#888",
  },
  heroBtn: {
    display: "inline-block",
    marginTop: "40px",
    padding: "18px 45px",
    backgroundColor: "#d71920",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  heroRight: { flex: 1, overflow: "hidden" },
  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(0.8)",
  },

  // Intro
  introTextBlock: {
    display: "flex",
    padding: "100px 10%",
    backgroundColor: "#0a0a0a",
    position: "relative",
    gap: "50px",
  },
  introLeftText: { flex: 1 },
  introTitle: { fontSize: "42px", fontWeight: "bold" },
  introRightText: {
    flex: 1,
    color: "#888",
    fontSize: "18px",
    lineHeight: "1.8",
  },
  introImage: {
    position: "absolute",
    bottom: "-80px",
    right: "10%",
    width: "250px",
    height: "350px",
    objectFit: "cover",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  },

  // Sculpted
  sculptedSection: {
    display: "flex",
    alignItems: "center",
    padding: "150px 10%",
  },
  sculptedContent: { flex: 1, paddingRight: "50px" },
  sculptedNumber: { fontSize: "80px", fontWeight: "900", color: "#222" },
  sculptedTitle: { fontSize: "42px", fontWeight: "bold", marginBottom: "30px" },
  sculptedDesc: { fontSize: "18px", lineHeight: "1.8", color: "#888" },
  sculptedLink: {
    display: "inline-block",
    marginTop: "40px",
    color: "#d71920",
    textDecoration: "none",
    fontWeight: "bold",
  },
  sculptedImage: { flex: 1 },
  sculptedImg: { width: "100%", borderRadius: "10px" },

  // Vibes
  styleVibesSection: { padding: "100px 10%", textAlign: "center" },
  styleVibesTitle: { fontSize: "36px", marginBottom: "60px" },
  styleVibesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "30px",
  },
  vibesImg: { width: "100%", height: "400px", objectFit: "cover" },
  vibesCaption: { padding: "20px", fontWeight: "bold" },

  // Tips
  stylingTipsSection: {
    display: "flex",
    padding: "100px 10%",
    backgroundColor: "#050505",
    gap: "100px",
  },
  stylingTipsLeft: { flex: 1.5 },
  stylingTipsTitle: { fontSize: "36px", marginBottom: "50px" },
  tipCardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  tipCardImg: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "15px",
    objectFit: "cover",
  },
  stylingTipsRight: { flex: 1, position: "relative", textAlign: "right" },
  stylingRightTitle: { fontSize: "36px" },
  stylingRightDesc: { color: "#888", margin: "20px 0 40px" },
  stylingRightBtn: {
    padding: "15px 40px",
    backgroundColor: "#fff",
    color: "#000",
    textDecoration: "none",
    fontWeight: "bold",
  },
  stylingRightImg: {
    width: "100%",
    marginTop: "50px",
    filter: "grayscale(100%)",
  },
  stylingRightBadge: {
    position: "absolute",
    bottom: "50px",
    left: "-20px",
    backgroundColor: "#fff",
    color: "#000",
    padding: "15px",
    fontWeight: "bold",
    textAlign: "left",
  },
};

export default SlimFitPage;
