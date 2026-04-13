import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { BASE_URL } from "../../services/api";

// Chuẩn hoá URL ảnh
const getImgUrl = (img) => {
  if (!img) return "https://via.placeholder.com/80x110?text=No+Image";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
};

const CartMini = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { user } = useAuth();

  if (!isOpen) return null;

  const shippingFee = totalPrice > 399000 || totalPrice === 0 ? 0 : 30000;
  const remaining = Math.max(0, 399000 - totalPrice);

  // Chưa đăng nhập
  if (!user) {
    return (
      <div style={s.overlay} onClick={onClose}>
        <div style={s.sidebar} onClick={(e) => e.stopPropagation()}>
          <div style={s.header}>
            <h2 style={s.title}>GIỎ HÀNG</h2>
            <button onClick={onClose} style={s.closeBtn}>✕</button>
          </div>
          <div style={s.notLoginWrap}>
            <div style={s.lockIcon}>🔒</div>
            <p style={s.notLoginTitle}>Vui lòng đăng nhập</p>
            <p style={s.notLoginSub}>Đăng nhập để xem và quản lý giỏ hàng của bạn</p>
            <Link to="/login" onClick={onClose} style={s.loginBtn}>Đăng nhập ngay</Link>
            <Link to="/register" onClick={onClose} style={s.registerBtn}>Tạo tài khoản mới</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.sidebar} onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <h2 style={s.title}>GIỎ HÀNG</h2>
            {cartItems.length > 0 && (
              <span style={s.countBadge}>{cartItems.reduce((a, i) => a + i.quantity, 0)}</span>
            )}
          </div>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>

        {/* FREESHIP BANNER */}
        {cartItems.length > 0 && (
          <div style={{ ...s.freeshipBar, background: remaining === 0 ? "#059669" : "#001C40" }}>
            {remaining === 0
              ? "🎉 Đơn hàng được MIỄN PHÍ VẬN CHUYỂN"
              : `🚚 Mua thêm ${remaining.toLocaleString()}đ để FREESHIP`}
          </div>
        )}

        {/* DANH SÁCH */}
        <div style={s.content}>
          {cartItems.length === 0 ? (
            <div style={s.emptyWrap}>
              <div style={s.emptyIcon}>🛒</div>
              <p style={s.emptyTitle}>Giỏ hàng trống</p>
              <p style={s.emptySub}>Hãy thêm sản phẩm vào giỏ hàng</p>
              <button style={s.shopNowBtn} onClick={onClose}>TIẾP TỤC MUA SẮM</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} style={s.item}>
                {/* ẢNH */}
                <div style={s.imgWrap}>
                  <img
                    src={getImgUrl(item.image)}
                    alt={item.name}
                    style={s.itemImg}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/80x110?text=No+Image"; }}
                  />
                </div>

                {/* INFO */}
                <div style={s.itemInfo}>
                  <p style={s.itemName}>{item.name}</p>
                  <p style={s.itemVariant}>
                    {item.size && `Size: ${item.size}`}
                    {item.size && item.color && " · "}
                    {item.color && `Màu: ${item.color}`}
                  </p>
                  <p style={s.itemPrice}>{Number(item.price).toLocaleString()}đ</p>

                  <div style={s.qtyRow}>
                    <div style={s.qtyBox}>
                      <button style={s.qtyBtn}
                        onClick={() => updateQuantity(item.id, -1, item.size || "", item.color || "")}>−</button>
                      <span style={s.qtyNum}>{item.quantity}</span>
                      <button style={s.qtyBtn}
                        onClick={() => updateQuantity(item.id, 1, item.size || "", item.color || "")}>+</button>
                    </div>
                    <div style={s.itemRight}>
                      <p style={s.itemTotal}>{(item.price * item.quantity).toLocaleString()}đ</p>
                      <button style={s.removeBtn}
                        onClick={() => removeFromCart(item.id, item.size || "", item.color || "")}>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {cartItems.length > 0 && (
          <div style={s.footer}>
            <div style={s.priceRow}>
              <span style={s.priceLabel}>Tạm tính</span>
              <span style={s.priceVal}>{totalPrice.toLocaleString()}đ</span>
            </div>
            <div style={s.priceRow}>
              <span style={s.priceLabel}>Phí vận chuyển</span>
              <span style={{ ...s.priceVal, color: shippingFee === 0 ? "#059669" : "#1a1a1a" }}>
                {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString()}đ`}
              </span>
            </div>
            <div style={s.totalRow}>
              <span style={s.totalLabel}>Tổng cộng</span>
              <span style={s.totalAmount}>{(totalPrice + shippingFee).toLocaleString()}đ</span>
            </div>
            <button style={s.checkoutBtn} onClick={() => { onClose(); navigate("/cart"); }}>
              THANH TOÁN NGAY →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 9999, display: "flex", justifyContent: "flex-end" },
  sidebar: { width: "400px", height: "100%", backgroundColor: "#fff", display: "flex", flexDirection: "column", boxShadow: "-4px 0 20px rgba(0,0,0,0.12)", animation: "slideInRight 0.28s ease-out", fontFamily: "'Inter',sans-serif" },
  header: { padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0" },
  headerLeft: { display: "flex", alignItems: "center", gap: "10px" },
  title: { fontSize: "14px", fontWeight: "800", letterSpacing: "1.5px", color: "#1a1a1a" },
  countBadge: { background: "#001C40", color: "#fff", borderRadius: "999px", padding: "2px 8px", fontSize: "11px", fontWeight: "700" },
  closeBtn: { border: "none", background: "#f3f4f6", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" },
  freeshipBar: { padding: "9px 20px", color: "#fff", fontSize: "12px", fontWeight: "600", textAlign: "center" },
  content: { flex: 1, overflowY: "auto", padding: "16px 20px" },
  // Empty
  emptyWrap: { textAlign: "center", paddingTop: "60px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
  emptyIcon: { fontSize: "52px" },
  emptyTitle: { fontSize: "15px", fontWeight: "700", color: "#1a1a1a" },
  emptySub: { fontSize: "13px", color: "#9ca3af" },
  shopNowBtn: { marginTop: "8px", padding: "11px 24px", background: "#001C40", color: "#fff", border: "none", fontWeight: "700", cursor: "pointer", borderRadius: "8px", fontSize: "13px" },
  // Item
  item: { display: "flex", gap: "14px", paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid #f3f4f6" },
  imgWrap: { width: "80px", height: "106px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "#f9fafb", border: "1px solid #e5e7eb" },
  itemImg: { width: "100%", height: "100%", objectFit: "cover" },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontSize: "13px", fontWeight: "700", color: "#1a1a1a", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemVariant: { fontSize: "11px", color: "#9ca3af", marginBottom: "4px" },
  itemPrice: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  qtyRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" },
  qtyBox: { display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: "6px", overflow: "hidden" },
  qtyBtn: { border: "none", background: "#f9fafb", padding: "4px 10px", cursor: "pointer", fontSize: "15px", color: "#374151" },
  qtyNum: { padding: "4px 10px", fontSize: "13px", fontWeight: "700", minWidth: "28px", textAlign: "center" },
  itemRight: { textAlign: "right" },
  itemTotal: { fontSize: "13px", fontWeight: "700", color: "#1a1a1a", marginBottom: "2px" },
  removeBtn: { background: "none", border: "none", color: "#9ca3af", fontSize: "11px", cursor: "pointer", textDecoration: "underline" },
  // Footer
  footer: { padding: "16px 20px", borderTop: "1px solid #f0f0f0", background: "#fff" },
  priceRow: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6b7280", marginBottom: "8px" },
  priceLabel: {},
  priceVal: { fontWeight: "600" },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1.5px solid #1a1a1a", marginBottom: "14px" },
  totalLabel: { fontSize: "14px", fontWeight: "700" },
  totalAmount: { fontSize: "20px", fontWeight: "800", color: "#d71920" },
  checkoutBtn: { width: "100%", padding: "14px", background: "#001C40", color: "#fff", border: "none", fontWeight: "800", cursor: "pointer", letterSpacing: "1px", fontSize: "13px", borderRadius: "8px", marginBottom: "8px" },
  continueBtn: { width: "100%", padding: "11px", background: "transparent", color: "#374151", border: "1px solid #e5e7eb", fontWeight: "600", cursor: "pointer", fontSize: "13px", borderRadius: "8px" },
  // Not login
  notLoginWrap: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", gap: "12px", textAlign: "center" },
  lockIcon: { fontSize: "52px" },
  notLoginTitle: { fontSize: "16px", fontWeight: "700", color: "#1a1a1a" },
  notLoginSub: { fontSize: "13px", color: "#6b7280", lineHeight: "1.6", marginBottom: "8px" },
  loginBtn: { display: "block", width: "100%", padding: "13px", background: "#001C40", color: "#fff", textDecoration: "none", fontWeight: "700", fontSize: "14px", borderRadius: "8px", textAlign: "center" },
  registerBtn: { display: "block", width: "100%", padding: "13px", background: "transparent", color: "#001C40", border: "1.5px solid #001C40", textDecoration: "none", fontWeight: "700", fontSize: "14px", borderRadius: "8px", textAlign: "center" },
};

export default CartMini;
