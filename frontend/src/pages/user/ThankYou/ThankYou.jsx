import React, { useEffect, useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { paymentAPI } from "../../../services/api";
import { useCart } from "../../../hooks/useCart";

const ThankYou = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const cartCleared = useRef(false);

  const fromMomo = searchParams.get("from") === "momo";
  const resultCode = searchParams.get("resultCode");
  const momoMessage = searchParams.get("message") || "";
  const urlOrderId = searchParams.get("orderId") || "";

  const orderCode = location.state?.orderCode || urlOrderId || "";
  const customerName = location.state?.customerName || "";

  const momoSuccess = fromMomo && resultCode === "0";
  const momoFailed =
    fromMomo && resultCode != null && resultCode !== "" && resultCode !== "0";

  useEffect(() => {
    if (momoSuccess && typeof clearCart === "function" && !cartCleared.current) {
      cartCleared.current = true;
      clearCart();
    }
  }, [momoSuccess, clearCart]);

  useEffect(() => {
    if (!momoSuccess || !orderCode) return;
    let n = 0;
    const id = setInterval(async () => {
      n += 1;
      try {
        await paymentAPI.checkStatus(orderCode);
      } catch {
        /* ignore */
      }
      if (n >= 15) clearInterval(id);
    }, 2000);
    return () => clearInterval(id);
  }, [momoSuccess, orderCode]);

  if (momoFailed) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={{ ...s.iconRing, background: "rgba(245,158,11,0.12)" }}>
            <div style={{ ...s.iconCircle, background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
              <span style={{ fontSize: "32px", color: "#fff" }}>!</span>
            </div>
          </div>
          <h1 style={s.title}>Thanh toán MoMo chưa hoàn tất</h1>
          <p style={s.message}>
            {momoMessage || `Mã lỗi: ${resultCode}.`} Đơn hàng vẫn ở trạng thái chờ thanh toán. Bạn có thể thử lại từ giỏ hàng hoặc xem đơn trong mục Tài khoản.
          </p>
          {orderCode && (
            <div style={{ ...s.orderBox, background: "#fffbeb", borderColor: "#fcd34d" }}>
              <p style={s.orderLabel}>Mã đơn (chưa thanh toán)</p>
              <p style={{ ...s.orderCode, color: "#b45309" }}>#{orderCode}</p>
            </div>
          )}
          <div style={s.actions}>
            <Link to="/cart" style={s.primaryBtn}>Về giỏ hàng</Link>
            <Link to="/my-orders" style={s.outlineBtn}>Đơn của tôi</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.iconRing}>
          <div style={s.iconCircle}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h1 style={s.title}>{momoSuccess ? "Thanh toán thành công!" : "Đặt hàng thành công!"}</h1>
        {customerName && (
          <p style={s.greeting}>
            Cảm ơn bạn, <strong>{customerName}</strong> 🎉
          </p>
        )}

        <div style={s.orderBox}>
          <p style={s.orderLabel}>Mã đơn hàng của bạn</p>
          <p style={s.orderCode}>{orderCode ? `#${orderCode}` : "—"}</p>
        </div>

        <div style={s.infoGrid}>
          {[
            ["fa-box", "#f59e0b", "Xử lý đơn hàng", "Trong vòng 24 giờ"],
            ["fa-truck", "#2563eb", "Thời gian giao hàng", "2 – 4 ngày làm việc"],
            ["fa-phone", "#059669", "Xác nhận đơn hàng", "Qua số điện thoại"],
          ].map(([icon, color, title, desc], i) => (
            <div key={i} style={s.infoItem}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`fa-solid ${icon}`} style={{ color, fontSize: "16px" }} />
              </div>
              <div>
                <p style={s.infoTitle}>{title}</p>
                <p style={s.infoDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={s.message}>
          Nhân viên DIEP COLLECTION sẽ liên hệ xác nhận đơn hàng sớm nhất.
          Bạn có thể theo dõi trạng thái đơn hàng trong mục <strong>Tài khoản</strong>.
        </p>

        <div style={s.actions}>
          <Link to="/" style={s.primaryBtn}>
            TIẾP TỤC MUA SẮM
          </Link>
          <Link to="/my-orders" style={s.outlineBtn}>
            Xem đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    maxWidth: "560px",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "50px 40px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    animation: "fadeIn 0.5s ease",
  },
  iconRing: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "rgba(16,185,129,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  },
  iconCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #059669)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(16,185,129,0.4)",
  },
  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  greeting: {
    fontSize: "15px",
    color: "#6b7280",
    marginBottom: "24px",
  },
  orderBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    padding: "16px 24px",
    marginBottom: "28px",
  },
  orderLabel: { fontSize: "12px", color: "#6b7280", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" },
  orderCode: { fontSize: "22px", fontWeight: "800", color: "#059669", letterSpacing: "2px" },
  infoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "28px",
    textAlign: "left",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 16px",
    background: "#f9fafb",
    borderRadius: "10px",
  },
  infoIcon: { fontSize: "22px" },
  infoTitle: { fontSize: "13px", fontWeight: "600", color: "#1a1a1a", marginBottom: "2px" },
  infoDesc: { fontSize: "12px", color: "#6b7280" },
  message: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.7",
    marginBottom: "32px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryBtn: {
    display: "inline-block",
    backgroundColor: "#001C40",
    color: "#fff",
    padding: "14px 32px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: "1px",
    borderRadius: "10px",
    transition: "all 0.2s",
  },
  outlineBtn: {
    display: "inline-block",
    backgroundColor: "transparent",
    color: "#001C40",
    border: "1.5px solid #001C40",
    padding: "14px 32px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
    borderRadius: "10px",
  },
};

export default ThankYou;
