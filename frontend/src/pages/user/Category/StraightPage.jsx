import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const StraightPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.container}>
      {/* --- 1. HERITAGE HERO SECTION --- */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroTextContainer}>
            <span style={styles.heroTag}>THE ICONIC RETURN</span>
            <h1 style={styles.heroTitle}>
              STRAIGHT <span style={styles.accentText}>FIT</span>
            </h1>
            <p style={styles.heroSubtitle}>CELEBRATING AUTHENTIC DENIM</p>
            <div style={styles.heroScrollGuide}>
              <div style={styles.scrollLine}></div>
              <span>UNVEIL THE LEGACY</span>
            </div>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1594938290170-0714486968d9?w=1600" // Ảnh hero mới, bụi bặm hơn
          alt="Straight Fit Heritage"
          style={styles.heroImg}
        />
      </section>

      {/* --- 2. THE CHRONICLE (Câu chuyện lịch sử) --- */}
      <section style={styles.chronicleSection}>
        <div style={styles.chronicleContent}>
          <h2 style={styles.chronicleHeader}>
            Huyền thoại chưa bao giờ phai nhạt.
          </h2>
          <p style={styles.chronicleText}>
            Từ những công nhân mỏ vàng California đến biểu tượng phản văn hóa
            của thập niên 90, quần Jeans ống suông đã vượt qua mọi giới hạn thời
            gian để trở thành một tượng đài. Tại DIEP COLLECTION, chúng tôi tái
            hiện phom dáng kinh điển này với sự tôn trọng tối đa di sản, nhưng
            vẫn không quên tích hợp những cải tiến hiện đại để phù hợp với phong
            cách sống của người đàn ông thế kỷ 21. Straight Fit - không chỉ là
            thời trang, mà là một tuyên ngôn về cá tính bền vững.
          </p>
        </div>
      </section>

      {/* --- 3. BOLD VISUAL + TEXT SPLIT --- */}
      <section style={styles.splitSection}>
        <div style={styles.splitImageSide}>
          <img
            src="https://images.unsplash.com/photo-1563297155-7d4062a74c15?w=1000"
            alt="Rugged Look"
            style={styles.fullImg}
          />
        </div>
        <div style={styles.splitTextSide}>
          <div style={styles.stickyText}>
            <span style={styles.accentNumber}>01.</span>
            <h3 style={styles.splitTitle}>Đường nét nguyên bản</h3>
            <p style={styles.splitDesc}>
              Điểm đặc trưng của Straight Fit là đường cắt thẳng từ đùi xuống
              mắt cá chân. Thiết kế này không chỉ tạo sự thoải mái tối đa mà còn
              mang đến vẻ ngoài mạnh mẽ, nam tính và phóng khoáng. Hoàn hảo để
              che khuyết điểm chân, phù hợp với mọi vóc dáng.
            </p>
            <Link to="/collections/quan-jeans" style={styles.secondaryLink}>
              KHÁM PHÁ THÊM VỀ JEAN CỔ ĐIỂN →
            </Link>
          </div>
        </div>
      </section>

      {/* --- 4. CULTURAL IMPACT GALLERY (Ảnh 3 cột) --- */}
      <section style={styles.gallerySection}>
        <h2 style={styles.galleryTitle}>Di sản vượt thời gian</h2>
        <div style={styles.galleryGrid}>
          <div style={styles.galleryItem}>
            <img
              src="https://images.unsplash.com/photo-1517457210941-f6be59279092?w=600"
              alt="Vintage Man"
              style={styles.galleryImg}
            />
            <p style={styles.galleryCaption}>
              THẬP NIÊN 50'S - SỰ NỔI LOẠN ĐẦY PHONG CÁCH
            </p>
          </div>
          <div style={styles.galleryItem}>
            <img
              src="https://images.unsplash.com/photo-1549721782-b67f167e4368?w=600"
              alt="Motorcycle Jeans"
              style={styles.galleryImg}
            />
            <p style={styles.galleryCaption}>
              THẬP NIÊN 70'S - TINH THẦN ĐƯỜNG PHỐ
            </p>
          </div>
          <div style={styles.galleryItem}>
            <img
              src="https://images.unsplash.com/photo-1557007559-994b7e8d3506?w=600"
              alt="Modern Look"
              style={styles.galleryImg}
            />
            <p style={styles.galleryCaption}>
              HIỆN ĐẠI - SỰ TRỞ LẠI CỦA SỰ TỰ TIN
            </p>
          </div>
        </div>
      </section>

      {/* --- 5. HOW TO STYLE (Gợi ý phối đồ) --- */}
      <section style={styles.stylingSection}>
        <h2 style={styles.stylingTitle}>Phối đồ cùng Straight Fit</h2>
        <div style={styles.stylingWrapper}>
          <div style={styles.styleTipCard} className="style-card">
            <img
              src="https://images.unsplash.com/photo-1594938290170-0714486968d9?w=400"
              alt="Classic Style"
              style={styles.tipImg}
            />
            <h4>Cổ điển & Thanh lịch</h4>
            <p>Kết hợp cùng áo sơ mi trắng, áo khoác blazer và giày da.</p>
          </div>
          <div style={styles.styleTipCard} className="style-card">
            <img
              src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400"
              alt="Casual Style"
              style={styles.tipImg}
            />
            <h4>Năng động & Thường ngày</h4>
            <p>
              Áo thun cơ bản, giày sneaker hoặc boot da, thêm áo khoác jean.
            </p>
          </div>
          <div style={styles.styleTipCard} className="style-card">
            <img
              src="https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400"
              alt="Layered Style"
              style={styles.tipImg}
            />
            <h4>Layering & Cá tính</h4>
            <p>Phối nhiều lớp áo, mũ len và các phụ kiện statement.</p>
          </div>
        </div>
      </section>

      {/* --- 6. SHOP THE COLLECTION (Bụi bặm) --- */}
      <section style={styles.shopLook}>
        <div style={styles.shopContent}>
          <div style={styles.shopText}>
            <h2 style={{ fontSize: "48px", color: "#fff" }}>
              Tái tạo phong cách của bạn.
            </h2>
            <p style={{ margin: "30px 0", color: "#aaa", fontSize: "18px" }}>
              Straight Fit - cho những ai biết trân trọng giá trị đích thực và
              tạo nên phong cách riêng.
            </p>
            <Link to="/form/straight" style={styles.luxuryBtn}>
              KHÁM PHÁ BỘ SƯU TẬP STRAIGHT FIT
            </Link>
          </div>
          <div style={styles.productFeature}>
            <img
              src="https://images.unsplash.com/photo-1563297155-7d4062a74c15?w=800"
              alt="Straight Jeans Model"
              style={styles.productImg}
            />
            <div style={styles.vintageBadge}>HERITAGE DENIM</div>
          </div>
        </div>
      </section>

      {/* --- CSS HOVER INLINE --- */}
      <style>
        {`
          .style-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          }
          .style-card {
            transition: all 0.4s ease-out;
            cursor: pointer;
            border: 1px solid #eee;
            border-radius: 5px;
            overflow: hidden;
            text-align: center;
            background-color: #fff;
          }
          .style-card img {
            filter: grayscale(10%);
            transition: filter 0.3s ease;
          }
          .style-card:hover img {
            filter: grayscale(0%);
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: { backgroundColor: "#fdfdfd", color: "#111", overflow: "hidden" },

  // Hero Heritage
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
    filter: "brightness(0.8)",
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
  heroTextContainer: { maxWidth: "900px" },
  heroTag: {
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "5px",
    color: "#e0dcdc",
    marginBottom: "20px",
    display: "block",
  },
  heroTitle: {
    fontSize: "140px",
    fontWeight: "900",
    lineHeight: "1",
    margin: 0,
    letterSpacing: "-5px",
    color: "#fff",
  },
  accentText: { color: "#d71920" },
  heroSubtitle: {
    fontSize: "20px",
    letterSpacing: "10px",
    marginTop: "20px",
    color: "#eee",
  },
  heroScrollGuide: {
    position: "absolute",
    bottom: "50px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    color: "#ccc",
  },
  scrollLine: { width: "50px", height: "1px", backgroundColor: "#d71920" },

  // Chronicle (Lịch sử)
  chronicleSection: {
    padding: "150px 20%",
    textAlign: "center",
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },
  chronicleContent: { maxWidth: "900px", margin: "0 auto" },
  chronicleHeader: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "40px",
    lineHeight: "1.2",
  },
  chronicleText: {
    fontSize: "20px",
    lineHeight: "2",
    color: "#aaa",
    fontWeight: "300",
  },

  // Split Visual + Text
  splitSection: {
    display: "flex",
    minHeight: "85vh",
    backgroundColor: "#fdfdfd",
  },
  splitImageSide: { flex: 1.3 },
  fullImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "grayscale(10%)",
  },
  splitTextSide: {
    flex: 1,
    padding: "100px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  stickyText: { position: "sticky", top: "100px", alignSelf: "flex-start" }, // Thêm sticky
  accentNumber: {
    fontSize: "100px",
    fontWeight: "900",
    color: "#f0f0f0",
    display: "block",
  },
  splitTitle: { fontSize: "38px", margin: "20px 0", color: "#001C40" },
  splitDesc: { fontSize: "18px", lineHeight: "1.8", color: "#555" },
  secondaryLink: {
    display: "inline-block",
    marginTop: "30px",
    fontSize: "15px",
    color: "#d71920",
    textDecoration: "none",
    borderBottom: "1px solid #d71920",
    paddingBottom: "5px",
    fontWeight: "bold",
    transition: "0.3s",
  },

  // Gallery 3 cột
  gallerySection: {
    padding: "100px 10%",
    backgroundColor: "#f5f5f5",
    textAlign: "center",
  },
  galleryTitle: {
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "60px",
    color: "#001C40",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "30px",
  },
  galleryItem: {
    backgroundColor: "#fff",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
    borderRadius: "5px",
    overflow: "hidden",
  },
  galleryImg: { width: "100%", height: "350px", objectFit: "cover" },
  galleryCaption: {
    padding: "20px",
    fontSize: "14px",
    color: "#666",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  // Styling Tips
  stylingSection: {
    padding: "120px 10%",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  stylingTitle: {
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "60px",
    color: "#001C40",
  },
  stylingWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "30px",
  },
  styleTipCard: { paddingBottom: "30px" },
  tipImg: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    marginBottom: "20px",
    borderRadius: "5px",
  },

  // Shop Look
  shopLook: { padding: "150px 10%", backgroundColor: "#001C40", color: "#fff" },
  shopContent: { display: "flex", alignItems: "center", gap: "100px" },
  shopText: { flex: 1 },
  luxuryBtn: {
    display: "inline-block",
    padding: "18px 45px",
    border: "1px solid #fff",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "0.3s",
    letterSpacing: "1px",
    backgroundColor: "#d71920",
  },
  productFeature: { flex: 1, position: "relative" },
  productImg: { width: "100%", borderRadius: "5px", filter: "grayscale(20%)" },
  vintageBadge: {
    position: "absolute",
    bottom: "-20px",
    left: "-20px",
    backgroundColor: "#c5a059",
    color: "#fff",
    padding: "10px 20px",
    fontWeight: "bold",
    fontSize: "12px",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
};

export default StraightPage;
