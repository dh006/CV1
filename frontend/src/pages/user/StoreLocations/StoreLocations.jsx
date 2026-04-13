import React, { useState, useEffect } from "react";

const StoreLocations = () => {
  const stores = [
    {
      id: 1,
      city: "ĐÀ NẴNG",
      name: "DIEP COLLECTION - SƠN TRÀ",
      address: "114 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
      phone: "0383 123 456",
      openTime: 8,
      closeTime: 22,
      // Thay link này bằng link "Embed a map" từ Google Maps
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8955515324247!2d108.24151527583681!3d16.071195639384755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142177f1f7d9831%3A0x2897282b99a63212!2zMTE0IFbDtSBOZ3V5w6puIEdpw6FwLCBQaMaw4bubYyBN4bu5LCBTxqWbiIFRyw6AsIMSQw6AgTuG6tW5n!5e0!3m2!1svi!2s!4v1710000000000",
    },
    {
      id: 2,
      city: "ĐÀ NẴNG",
      name: "DIEP COLLECTION - HẢI CHÂU",
      address: "271 Hồ Nghinh, Phước Mỹ, Sơn Trà, Đà Nẵng",
      phone: "0383 999 888",
      openTime: 8,
      closeTime: 22,
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.914282869062!2d108.24357287583677!3d16.070258039410977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142177f5904d41d%3A0x6b2e1694f414446e!2zMjcxIEjhu5MgTmdo4bubmgsIFBoxrDhu5tjIE3hu7ksIFPGoW4gVHLDoCwgxJDDoCBO4bq1bmc!5e0!3m2!1svi!2s!4v1710000000001",
    },
  ];

  const [activeStore, setActiveStore] = useState(stores[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentTime(new Date().getHours()),
      60000,
    );
    return () => clearInterval(timer);
  }, []);

  const checkStatus = (open, close) =>
    currentTime >= open && currentTime < close;
  const theme = isDarkMode ? darkStyles : lightStyles;

  return (
    <div style={{ ...styles.wrapper, backgroundColor: theme.bg }}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={{ ...styles.mainTitle, color: theme.text }}>
              HỆ THỐNG CỬA HÀNG
            </h2>
            <p
              style={{
                color: theme.text,
                opacity: 0.6,
                fontSize: "14px",
                marginTop: "8px",
              }}
            >
              Tìm cửa hàng Diep Collection gần bạn nhất
            </p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ ...styles.themeToggle, backgroundColor: theme.text, color: theme.bg }}
          >
            <i className={`fa-solid ${isDarkMode ? "fa-sun" : "fa-moon"}`} style={{ marginRight: "6px" }} />
            {isDarkMode ? "CHẾ ĐỘ SÁNG" : "CHẾ ĐỘ TỐI"}
          </button>
        </div>

        <div style={styles.content}>
          {/* List Stores */}
          <div style={styles.sidebar}>
            {stores.map((store) => {
              const isOpen = checkStatus(store.openTime, store.closeTime);
              const isActive = activeStore.id === store.id;

              return (
                <div
                  key={store.id}
                  style={{
                    ...styles.storeCard,
                    backgroundColor: theme.cardBg,
                    borderColor: isActive ? "#000" : theme.border,
                    borderWidth: isActive ? "2px" : "1px",
                    color: theme.text,
                    transform: isActive ? "translateX(10px)" : "none",
                  }}
                  onClick={() => setActiveStore(store)}
                >
                  <div style={styles.cardHeader}>
                    <span
                      style={{
                        ...styles.cityTag,
                        backgroundColor: theme.text,
                        color: theme.bg,
                      }}
                    >
                      {store.city}
                    </span>
                    <span
                      style={{
                        ...styles.statusTag,
                        backgroundColor: isOpen ? "#4CAF50" : "#F44336",
                      }}
                    >
                      {isOpen ? "ĐANG MỞ CỬA" : "ĐÃ ĐÓNG CỬA"}
                    </span>
                  </div>
                  <h4 style={styles.storeName}>{store.name}</h4>
                  <div style={styles.detailsGroup}>
                    <p style={styles.detail}>
                      <i className="fa-solid fa-location-dot" style={{ marginRight: "8px", color: "#6b7280" }} />
                      {store.address}
                    </p>
                    <p style={styles.detail}>
                      <i className="fa-solid fa-phone" style={{ marginRight: "8px", color: "#6b7280" }} />
                      {store.phone}
                    </p>
                    <p style={styles.detail}>
                      <i className="fa-solid fa-clock" style={{ marginRight: "8px", color: "#6b7280" }} />
                      {store.openTime}:00 - {store.closeTime}:00
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map View */}
          <div
            style={{
              ...styles.mapContainer,
              border: `1px solid ${theme.border}`,
            }}
          >
            <iframe
              src={activeStore.mapEmbed}
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: isDarkMode ? "grayscale(1) invert(0.9)" : "none",
              }}
              allowFullScreen=""
              loading="lazy"
              title="google-map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

const lightStyles = {
  bg: "#ffffff",
  text: "#000",
  cardBg: "#fff",
  border: "#eee",
};
const darkStyles = { bg: "#000", text: "#fff", cardBg: "#111", border: "#222" };

const styles = {
  wrapper: { width: "100%", minHeight: "100vh", transition: "0.3s ease" },
  container: { maxWidth: "1300px", margin: "0 auto", padding: "80px 20px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "50px",
  },
  mainTitle: {
    fontSize: "32px",
    fontWeight: "900",
    margin: 0,
    letterSpacing: "2px",
  },
  themeToggle: {
    padding: "10px 20px",
    borderRadius: "30px",
    border: "none",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  content: { display: "flex", gap: "50px" },
  sidebar: {
    flex: "0 0 420px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  storeCard: {
    padding: "30px",
    border: "1px solid",
    cursor: "pointer",
    transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  cityTag: {
    fontSize: "10px",
    padding: "4px 10px",
    fontWeight: "800",
    letterSpacing: "1px",
  },
  statusTag: {
    fontSize: "9px",
    color: "#fff",
    padding: "4px 10px",
    fontWeight: "bold",
  },
  storeName: { fontSize: "18px", fontWeight: "800", marginBottom: "15px" },
  detailsGroup: { display: "flex", flexDirection: "column", gap: "10px" },
  detail: { fontSize: "14px", opacity: 0.8, margin: 0, lineHeight: "1.5" },
  mapContainer: { flex: 1, height: "700px", overflow: "hidden" },
};

export default StoreLocations;
