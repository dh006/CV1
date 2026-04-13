import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, width = "500px" }) => {
  // Khóa cuộn trang khi Modal đang mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={{ ...styles.modalContainer, width }}
        onClick={(e) => e.stopPropagation()} // Ngăn đóng modal khi click vào bên trong
      >
        {/* Header của Modal */}
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Nội dung bên trong */}
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 11000, // Cao hơn cả CartMini
    backdropFilter: "blur(2px)", // Làm mờ nhẹ nền sau
  },
  modalContainer: {
    backgroundColor: "#fff",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    animation: "fadeIn 0.3s ease",
  },
  header: {
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
  },
  title: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
  },
  content: {
    padding: "20px",
    overflowY: "auto",
  },
};

export default Modal;
