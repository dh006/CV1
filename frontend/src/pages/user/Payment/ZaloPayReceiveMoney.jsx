import React, { useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const RECIPIENT_NAME = "DIEP COLLECTION";

/** QR demo: thay bằng ảnh QR thật (đặt trong public/ hoặc URL) khi cần */
const qrDemoSrc = (text) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(text)}`;

const ZaloPayReceiveMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkout = location.state || {};
  const orderCode = checkout.orderCode;
  const amount = checkout.amount;
  const fromCheckout = checkout.fromCheckout;

  const qrSrc = useMemo(() => {
    const base = orderCode
      ? `ZaloPay ${RECIPIENT_NAME} ${amount}d DIEP ${orderCode}`
      : `ZaloPay nhan tien - ${RECIPIENT_NAME}`;
    return qrDemoSrc(base);
  }, [orderCode, amount]);

  const themeItems = [
    { id: "up", icon: "fa-cloud-arrow-up", color: "#e0e7ff" },
    { id: "gal", icon: "fa-images", color: "#fce7f3" },
    { id: "none", icon: "fa-ban", color: "#f3f4f6" },
    { id: "a", icon: "fa-star", color: "#fef3c7" },
    { id: "b", icon: "fa-heart", color: "#fecaca" },
    { id: "c", icon: "fa-leaf", color: "#d1fae5" },
    { id: "d", icon: "fa-paw", color: "#e9d5ff" },
  ];

  return (
    <div style={s.shell}>
      <div style={s.phone}>
        {/* Header */}
        <header style={s.header}>
          <button type="button" style={s.closeBtn} onClick={() => navigate(-1)} aria-label="Đóng">
            <i className="fa-solid fa-xmark" style={s.closeIcon} />
          </button>
          <h1 style={s.title}>Mã nhận tiền</h1>
          <p style={s.subtitle}>
            Quét để chuyển tiền đến <strong style={s.nameStrong}>{RECIPIENT_NAME}</strong>
          </p>
        </header>

        {fromCheckout && orderCode && (
          <div style={s.checkoutBanner}>
            <p style={s.checkoutBannerTitle}>
              <i className="fa-solid fa-receipt" style={{ marginRight: "8px" }} />
              Đơn chờ thanh toán
            </p>
            <p style={s.checkoutLine}>
              <i className="fa-solid fa-hashtag" style={s.checkoutIcon} />
              {orderCode}
            </p>
            {amount != null && (
              <p style={s.checkoutLine}>
                <i className="fa-solid fa-sack-dollar" style={s.checkoutIcon} />
                {Number(amount).toLocaleString("vi-VN")}đ
              </p>
            )}
            <p style={s.checkoutHint}>
              Chuyển đúng số tiền, nội dung ghi: <strong>DIEP {orderCode}</strong>
            </p>
            <Link to="/cart" style={s.checkoutLink}>
              <i className="fa-solid fa-arrow-left" style={{ marginRight: "6px" }} />
              Quay lại giỏ hàng
            </Link>
          </div>
        )}

        <div style={s.body}>
          {/* QR */}
          <div style={s.qrFrame}>
            <div style={s.qrInner}>
              <img src={qrSrc} alt={`QR nhận tiền ${RECIPIENT_NAME}`} style={s.qrImg} />
              <div style={s.avatarRing}>
                <div style={s.avatar}>
                  <span style={s.avatarText}>HD</span>
                </div>
              </div>
            </div>
          </div>

          <button type="button" style={s.addAmount}>
            <i className="fa-solid fa-plus" style={s.addAmountIcon} />
            Thêm số tiền
          </button>

          {/* Action row */}
          <div style={s.actionsRow}>
            <button type="button" style={s.actionBtn}>
              <span style={s.actionIconWrap}>
                <i className="fa-solid fa-download" style={s.actionIcon} />
              </span>
              <span style={s.actionLabel}>Tải xuống</span>
            </button>
            <button type="button" style={s.actionBtn}>
              <span style={s.actionIconWrap}>
                <i className="fa-solid fa-share-nodes" style={s.actionIcon} />
              </span>
              <span style={s.actionLabel}>Chia sẻ</span>
            </button>
            <button type="button" style={s.actionBtn}>
              <span style={s.actionIconWrap}>
                <i className="fa-solid fa-gear" style={s.actionIcon} />
              </span>
              <span style={s.actionLabel}>Tùy chỉnh</span>
            </button>
            <button type="button" style={s.actionBtn}>
              <span style={s.actionIconWrap}>
                <i className="fa-solid fa-store" style={s.actionIcon} />
              </span>
              <span style={s.actionLabel}>Cửa hàng</span>
            </button>
          </div>

          {/* Theme chips */}
          <div style={s.themeScroll}>
            {themeItems.map((t) => (
              <button key={t.id} type="button" style={{ ...s.themeCircle, background: t.color }}>
                <i className={`fa-solid ${t.icon}`} style={s.themeIcon} />
              </button>
            ))}
          </div>

          <p style={s.themeHint}>
            <i className="fa-solid fa-palette" style={{ marginRight: "6px", opacity: 0.7 }} />
            Tuỳ chỉnh mặc định
          </p>
        </div>

        {/* Bottom tabs */}
        <nav style={s.bottomNav}>
          <button type="button" style={{ ...s.tab, ...s.tabActive }}>
            <i className="fa-solid fa-arrow-down-long" style={s.tabIcon} />
            Nhận tiền
          </button>
          <button type="button" style={s.tab}>
            <i className="fa-solid fa-qrcode" style={s.tabIcon} />
            Thanh toán
          </button>
        </nav>

        <p style={s.disclaimer}>
          <i className="fa-solid fa-circle-info" style={s.disclaimerIcon} />
          Tôi đồng ý sử dụng QR đa năng để nhận khoản phải trả của người chuyển
        </p>
      </div>
    </div>
  );
};

const blue = "#0068FF";

const s = {
  shell: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0068FF 0%, #0052cc 45%, #e8f1ff 45%, #f0f4fa 100%)",
    padding: "24px 16px 32px",
    fontFamily: "'Inter', -apple-system, sans-serif",
    boxSizing: "border-box",
  },
  phone: {
    maxWidth: "400px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(0,40,120,0.25)",
  },
  header: {
    background: `linear-gradient(180deg, ${blue} 0%, #0056d6 100%)`,
    color: "#fff",
    padding: "20px 20px 28px",
    textAlign: "center",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    width: "36px",
    height: "36px",
    border: "none",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: { fontSize: "18px", color: "#fff" },
  title: {
    margin: "8px 0 8px",
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    opacity: 0.95,
    lineHeight: 1.5,
    padding: "0 32px",
  },
  nameStrong: { fontWeight: "800" },
  checkoutBanner: {
    margin: "0 16px",
    marginTop: "-8px",
    marginBottom: "4px",
    padding: "14px 16px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "14px",
    textAlign: "left",
  },
  checkoutBannerTitle: {
    margin: "0 0 10px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#1e40af",
    display: "flex",
    alignItems: "center",
  },
  checkoutLine: {
    margin: "4px 0",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
  },
  checkoutIcon: { width: "22px", color: "#0068FF", fontSize: "13px" },
  checkoutHint: {
    margin: "12px 0 10px",
    fontSize: "12px",
    color: "#475569",
    lineHeight: 1.5,
  },
  checkoutLink: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "600",
    color: blue,
    textDecoration: "none",
  },
  body: {
    padding: "24px 20px 16px",
    textAlign: "center",
  },
  qrFrame: {
    display: "inline-block",
    padding: "12px",
    borderRadius: "20px",
    background: `linear-gradient(135deg, ${blue}, #3b9eff)`,
    boxShadow: "0 8px 24px rgba(0,104,255,0.35)",
  },
  qrInner: {
    position: "relative",
    background: "#fff",
    borderRadius: "12px",
    padding: "10px",
  },
  qrImg: {
    display: "block",
    width: "220px",
    height: "220px",
    borderRadius: "8px",
  },
  avatarRing: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 2,
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${blue}, #5ab0ff)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#fff",
    letterSpacing: "0.5px",
  },
  addAmount: {
    marginTop: "18px",
    border: "none",
    background: "none",
    color: blue,
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  addAmountIcon: { fontSize: "13px" },
  actionsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "28px",
    padding: "0 4px",
    gap: "8px",
  },
  actionBtn: {
    flex: 1,
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: "8px 4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  actionIconWrap: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: { fontSize: "20px", color: "#334155" },
  actionLabel: { fontSize: "11px", fontWeight: "600", color: "#475569" },
  themeScroll: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    marginTop: "24px",
    padding: "8px 4px 12px",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  themeCircle: {
    flexShrink: 0,
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "2px solid #e2e8f0",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  themeIcon: { fontSize: "16px", color: "#64748b" },
  themeHint: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNav: {
    display: "flex",
    borderTop: "1px solid #e2e8f0",
    marginTop: "8px",
    padding: "12px 16px 16px",
    gap: "12px",
  },
  tab: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "12px 8px",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
  },
  tabActive: {
    border: `2px solid ${blue}`,
    background: "#eff6ff",
    color: blue,
  },
  tabIcon: { fontSize: "20px" },
  disclaimer: {
    fontSize: "10px",
    color: "#94a3b8",
    lineHeight: 1.5,
    padding: "0 20px 20px",
    margin: 0,
    textAlign: "center",
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    justifyContent: "center",
  },
  disclaimerIcon: {
    marginTop: "2px",
    flexShrink: 0,
    color: "#cbd5e1",
    fontSize: "12px",
  },
};

export default ZaloPayReceiveMoney;
