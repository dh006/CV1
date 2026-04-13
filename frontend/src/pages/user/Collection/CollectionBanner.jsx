import React from "react";

const CollectionBanner = ({ type }) => {
  // Bản đồ hình ảnh cho từng danh mục (Bạn có thể thay link ảnh thật ở đây)
  const bannerImages = {
    shirt:
      "https://images.unsplash.com/photo-1550995694-3f5f4a7b1bd2?q=80&w=1600&auto=format&fit=crop",
    jeans:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1600&auto=format&fit=crop",
    polo: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=1600&auto=format&fit=crop",
    all: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop",
  };

  const currentBanner = bannerImages[type] || bannerImages.all;

  return (
    <div
      style={{
        ...styles.bannerContainer,
        backgroundImage: `url(${currentBanner})`,
      }}
    >
      {/* Lớp phủ đen mờ để làm nổi bật chữ */}
      <div style={styles.overlay}>
        <div style={styles.content}>
          <h1 style={styles.title}>
            {type ? type.replace("-", " ") : "BỘ SƯU TẬP"}
          </h1>
          <div style={styles.breadcrumb}>
            <span>TRANG CHỦ</span>
            <span style={styles.separator}>/</span>
            <span style={styles.activePage}>
              {type?.toUpperCase() || "TẤT CẢ"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  bannerContainer: {
    width: "100%",
    height: "280px", // Tăng chiều cao cho thoáng
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Độ mờ vừa phải
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    textAlign: "center",
    color: "#fff",
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    textTransform: "uppercase",
    margin: "0 0 10px 0",
    letterSpacing: "4px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  breadcrumb: {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "2px",
  },
  separator: {
    margin: "0 10px",
    color: "rgba(255,255,255,0.6)",
  },
  activePage: {
    color: "#fff",
  },
};

export default CollectionBanner;
