import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { authAPI, feedbackAPI, BASE_URL, orderAPI } from "../../../services/api";
import api from "../../../services/api";
import { useCart } from "../../../hooks/useCart";

const STATUS_MAP = {
  0: { label: "Chờ xử lý", color: "#b45309", bg: "#fef3c7" },
  1: { label: "Đang giao", color: "#1d4ed8", bg: "#dbeafe" },
  2: { label: "Hoàn thành", color: "#059669", bg: "#d1fae5" },
  3: { label: "Đã hủy",    color: "#dc2626", bg: "#fee2e2" },
};

const ProfilePage = () => {
  const { user, logout, updateProfile, loading } = useAuth(); // ← lấy loading
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart() || {};
  const [tab, setTab] = useState(location.pathname === "/my-orders" ? "orders" : "info");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Modal đánh giá
  const [reviewModal, setReviewModal] = useState(null); // { product, orderId }
  const [reviewForm, setReviewForm] = useState({ star: 5, content: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirm: "" });

  // ── Chờ AuthContext load xong mới kiểm tra ──────────────────────────────
  useEffect(() => {
    if (loading) return; // Đang load → chờ
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    setForm({ fullName: user.fullName || "", phone: user.phone || "" });
  }, [user, loading, navigate]);

  // ── Load đơn hàng theo userId (không cần phone) ──────────────────────────
  useEffect(() => {
    if (tab !== "orders" || !user) return;
    setLoadingOrders(true);
    // Gọi API lấy đơn hàng theo userId từ token
    api.get("/my-orders/user/me")
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, [tab, user]);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateProfile(form);
    setSaving(false);
    if (result?.success) showMsg("success", "Cập nhật thông tin thành công!");
    else showMsg("error", result?.message || "Lỗi cập nhật!");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { showMsg("error", "Mật khẩu xác nhận không khớp!"); return; }
    if (pwForm.newPassword.length < 6) { showMsg("error", "Mật khẩu mới phải có ít nhất 6 ký tự!"); return; }
    setSaving(true);
    try {
      await authAPI.changePassword({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword });
      setPwForm({ oldPassword: "", newPassword: "", confirm: "" });
      showMsg("success", "Đổi mật khẩu thành công!");
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Lỗi đổi mật khẩu!");
    } finally {
      setSaving(false);
    }
  };

  // ── Hủy đơn hàng ────────────────────────────────────────────────────────────
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    setCancellingId(orderId);
    try {
      await orderAPI.cancelOrder(orderId);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 3 } : o));
      showMsg("success", "Đã hủy đơn hàng thành công!");
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Không thể hủy đơn hàng!");
    } finally {
      setCancellingId(null);
    }
  };

  // ── Mua lại ──────────────────────────────────────────────────────────────────
  const handleReorder = (order) => {
    if (!order.details || order.details.length === 0) {
      navigate("/");
      return;
    }
    order.details.forEach((detail) => {
      if (detail.Product) {
        addToCart({
          id: detail.Product.id,
          name: detail.Product.name,
          price: detail.price,
          image: detail.Product.image
            ? (detail.Product.image.startsWith("http") ? detail.Product.image : `http://localhost:5000${detail.Product.image}`)
            : "",
          size: detail.size || "",
          color: detail.color || "",
          quantity: detail.quantity,
        }, false);
      }
    });
    showMsg("success", "Đã thêm sản phẩm vào giỏ hàng!");
    setTimeout(() => navigate("/cart"), 800);
  };

  // ── Gửi đánh giá ─────────────────────────────────────────────────────────────
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewModal) return;
    setSubmittingReview(true);
    try {
      await feedbackAPI.create({
        productId: reviewModal.product.id,
        star: reviewForm.star,
        content: reviewForm.content,
      });
      setReviewModal(null);
      setReviewForm({ star: 5, content: "" });
      showMsg("success", `Đã gửi đánh giá cho "${reviewModal.product.name}"!`);
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Không thể gửi đánh giá!");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Đang load auth → hiện spinner, không redirect
  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={s.spinner} />
      </div>
    );
  }

  if (!user) return null;

  const initial = (user.fullName || "U").charAt(0).toUpperCase();

  const NAV_ITEMS = [
    { key: "info",     icon: "fa-user",          label: "Thông tin cá nhân" },
    { key: "orders",   icon: "fa-box",            label: "Đơn hàng của tôi" },
    { key: "password", icon: "fa-lock",           label: "Đổi mật khẩu" },
  ];
  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* SIDEBAR */}
        <div style={s.sidebar}>
          <div style={s.avatarWrap}>
            <div style={s.avatar}>{initial}</div>
            <p style={s.userName}>{user.fullName}</p>
            <p style={s.userEmail}>{user.email}</p>
            {user.role === 1 && <span style={s.adminBadge}>Quản trị Admin</span>}
            {user.role === 2 && <span style={s.saleBadge}>Nhân viên Sale</span>}
            {user.role === 0 && user.points > 0 && (
              <div style={{ marginTop: "10px", padding: "6px 14px", background: "rgba(245,158,11,0.2)", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <i className="fa-solid fa-star" style={{ color: "#f59e0b", fontSize: "12px" }} />
                <span style={{ color: "#fff", fontSize: "12px", fontWeight: "700" }}>{user.points} điểm</span>
              </div>
            )}
          </div>

          <nav style={s.nav}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                style={{ ...s.navItem, ...(tab === item.key ? s.navItemActive : {}) }}
              >
                <i className={`fa-solid ${item.icon}`} style={s.navIcon} />
                {item.label}
              </button>
            ))}

            <div style={s.navDivider} />

            <button onClick={logout} style={s.logoutBtn}>
              <i className="fa-solid fa-right-from-bracket" style={{ ...s.navIcon, color: "#dc2626" }} />
              Đăng xuất
            </button>
          </nav>
        </div>

        {/* CONTENT */}
        <div style={s.content}>
          {msg && (
            <div style={{ ...s.toast, background: msg.type === "success" ? "#d1fae5" : "#fee2e2", color: msg.type === "success" ? "#065f46" : "#dc2626" }}>
              <i className={`fa-solid ${msg.type === "success" ? "fa-circle-check" : "fa-circle-xmark"}`} />
              {" "}{msg.text}
            </div>
          )}

          {/* ── THÔNG TIN ── */}
          {tab === "info" && (
            <div style={s.card}>
              <h2 style={s.cardTitle}>
                <i className="fa-solid fa-user" style={{ marginRight: "10px", color: "#001C40" }} />
                Thông tin cá nhân
              </h2>
              <form onSubmit={handleSaveInfo} style={s.form}>
                <div style={s.row2}>
                  <div style={s.group}>
                    <label style={s.label}>Họ và tên</label>
                    <input style={s.input} type="text" value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                  </div>
                  <div style={s.group}>
                    <label style={s.label}>Số điện thoại</label>
                    <input style={s.input} type="tel" placeholder="09x xxx xxxx"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div style={s.group}>
                  <label style={s.label}>Email</label>
                  <input style={{ ...s.input, background: "#f3f4f6", color: "#9ca3af" }}
                    type="email" value={user.email} disabled />
                  <p style={s.hint}>Email không thể thay đổi</p>
                </div>
                <button type="submit" style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </form>
            </div>
          )}

          {/* ── ĐƠN HÀNG ── */}
          {tab === "orders" && (
            <div style={s.card}>
              <h2 style={s.cardTitle}>
                <i className="fa-solid fa-box" style={{ marginRight: "10px", color: "#001C40" }} />
                Đơn hàng của tôi
              </h2>
              {loadingOrders ? (
                <div style={s.loadingWrap}><div style={s.spinner} /></div>
              ) : orders.length === 0 ? (
                <div style={s.emptyOrders}>
                  <i className="fa-solid fa-box-open" style={{ fontSize: "52px", color: "#d1d5db" }} />
                  <p style={{ color: "#9ca3af", marginTop: "12px", fontSize: "15px" }}>Bạn chưa có đơn hàng nào</p>
                  <Link to="/" style={s.shopBtn}>Mua sắm ngay</Link>
                </div>
              ) : (
                <div style={s.orderList}>
                  {orders.map((order) => {
                    const status = STATUS_MAP[order.status] || STATUS_MAP[0];
                    const canCancel = order.status === 0;
                    const canReorder = order.status === 2 || order.status === 3;
                    const canReview = order.status === 2;

                    return (
                      <div key={order.id} style={s.orderCard}>
                        {/* HEADER ĐƠN HÀNG */}
                        <div style={s.orderTop}>
                          <div>
                            <p style={s.orderCode}>
                              <i className="fa-solid fa-hashtag" style={{ fontSize: "11px", marginRight: "2px" }} />
                              {order.orderCode}
                            </p>
                            <p style={s.orderDate}>
                              <i className="fa-regular fa-calendar" style={{ marginRight: "5px" }} />
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : ""}
                            </p>
                          </div>
                          <div style={s.orderRight}>
                            <span style={{ ...s.statusBadge, color: status.color, background: status.bg }}>
                              {status.label}
                            </span>
                            <p style={s.orderTotal}>{Number(order.totalPrice).toLocaleString()}đ</p>
                          </div>
                        </div>

                        {/* ĐỊA CHỈ */}
                        {order.addressDetail && (
                          <p style={s.orderAddr}>
                            <i className="fa-solid fa-location-dot" style={{ marginRight: "5px", color: "#9ca3af" }} />
                            {order.addressDetail}, {order.ward}, {order.district}, {order.province}
                          </p>
                        )}

                        {/* SẢN PHẨM TRONG ĐƠN */}
                        {order.details && order.details.length > 0 && (
                          <div style={s.orderItems}>
                            {order.details.map((detail, i) => (
                              <div key={i} style={s.orderItem}>
                                {detail.Product?.image && (
                                  <img
                                    src={detail.Product.image.startsWith("http") ? detail.Product.image : `http://localhost:5000${detail.Product.image}`}
                                    alt={detail.Product?.name}
                                    style={s.orderItemImg}
                                    onError={(e) => { e.target.style.display = "none"; }}
                                  />
                                )}
                                <div style={s.orderItemInfo}>
                                  <p style={s.orderItemName}>{detail.Product?.name || "Sản phẩm"}</p>
                                  <p style={s.orderItemMeta}>
                                    {detail.size && `Size: ${detail.size}`}
                                    {detail.size && detail.color && " · "}
                                    {detail.color && `Màu: ${detail.color}`}
                                    {" · "}x{detail.quantity}
                                  </p>
                                </div>
                                <p style={s.orderItemPrice}>{Number(detail.price * detail.quantity).toLocaleString()}đ</p>

                                {/* NÚT ĐÁNH GIÁ từng sản phẩm */}
                                {canReview && detail.Product && (
                                  <button
                                    style={s.reviewBtn}
                                    onClick={() => {
                                      setReviewModal({ product: detail.Product, orderId: order.id });
                                      setReviewForm({ star: 5, content: "" });
                                    }}
                                  >
                                    <i className="fa-solid fa-star" style={{ marginRight: "4px" }} />
                                    Đánh giá
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ACTIONS */}
                        <div style={s.orderActions}>
                          {canCancel && (
                            <button
                              style={{ ...s.cancelBtn, opacity: cancellingId === order.id ? 0.6 : 1 }}
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={cancellingId === order.id}
                            >
                              <i className="fa-solid fa-xmark" style={{ marginRight: "5px" }} />
                              {cancellingId === order.id ? "Đang hủy..." : "Hủy đơn hàng"}
                            </button>
                          )}
                          {canReorder && (
                            <button style={s.reorderBtn} onClick={() => handleReorder(order)}>
                              <i className="fa-solid fa-rotate-right" style={{ marginRight: "5px" }} />
                              Mua lại
                            </button>
                          )}
                          {order.status === 3 && (
                            <span style={s.cancelledNote}>
                              <i className="fa-solid fa-circle-info" style={{ marginRight: "4px" }} />
                              Đơn đã hủy — kho hàng đã được hoàn lại
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── ĐỔI MẬT KHẨU ── */}
          {tab === "password" && (
            <div style={s.card}>
              <h2 style={s.cardTitle}>
                <i className="fa-solid fa-lock" style={{ marginRight: "10px", color: "#001C40" }} />
                Đổi mật khẩu
              </h2>
              <form onSubmit={handleChangePassword} style={{ ...s.form, maxWidth: "420px" }}>
                {[
                  { label: "Mật khẩu hiện tại", key: "oldPassword", placeholder: "Nhập mật khẩu hiện tại" },
                  { label: "Mật khẩu mới", key: "newPassword", placeholder: "Tối thiểu 6 ký tự" },
                  { label: "Xác nhận mật khẩu mới", key: "confirm", placeholder: "Nhập lại mật khẩu mới" },
                ].map((f) => (
                  <div key={f.key} style={s.group}>
                    <label style={s.label}>{f.label}</label>
                    <input style={s.input} type="password" placeholder={f.placeholder}
                      value={pwForm[f.key]}
                      onChange={(e) => setPwForm({ ...pwForm, [f.key]: e.target.value })} required />
                  </div>
                ))}
                <button type="submit" style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  {saving ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL ĐÁNH GIÁ ── */}
      {reviewModal && (
        <div style={m.overlay} onClick={() => setReviewModal(null)}>
          <div style={m.box} onClick={(e) => e.stopPropagation()}>
            <div style={m.header}>
              <h3 style={m.title}>
                <i className="fa-solid fa-star" style={{ color: "#f59e0b", marginRight: "8px" }} />
                Đánh giá sản phẩm
              </h3>
              <button onClick={() => setReviewModal(null)} style={m.closeBtn}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <p style={m.productName}>{reviewModal.product.name}</p>

            <form onSubmit={handleSubmitReview}>
              {/* SAO */}
              <div style={m.group}>
                <label style={m.label}>Đánh giá của bạn</label>
                <div style={m.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, star })}
                      style={{ fontSize: "32px", cursor: "pointer", color: star <= reviewForm.star ? "#f59e0b" : "#d1d5db", transition: "color 0.15s" }}
                    >
                      ★
                    </span>
                  ))}
                  <span style={{ fontSize: "13px", color: "#6b7280", marginLeft: "8px" }}>
                    {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"][reviewForm.star]}
                  </span>
                </div>
              </div>

              {/* NỘI DUNG */}
              <div style={m.group}>
                <label style={m.label}>Nhận xét</label>
                <textarea
                  style={m.textarea}
                  rows={4}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                />
              </div>

              <div style={m.actions}>
                <button type="button" onClick={() => setReviewModal(null)} style={m.cancelBtn}>Hủy</button>
                <button type="submit" style={{ ...m.submitBtn, opacity: submittingReview ? 0.7 : 1 }} disabled={submittingReview}>
                  {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  page: { minHeight: "80vh", backgroundColor: "#f9fafb", fontFamily: "'Inter',sans-serif", padding: "40px 20px" },
  container: { maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "24px", alignItems: "flex-start" },
  sidebar: { width: "250px", flexShrink: 0, background: "#fff", borderRadius: "14px", border: "1px solid #e5e7eb", overflow: "hidden" },
  avatarWrap: { padding: "28px 20px", textAlign: "center", background: "linear-gradient(135deg,#001C40,#003080)", color: "#fff" },
  avatar: { width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "28px", margin: "0 auto 12px" },
  userName: { fontSize: "15px", fontWeight: "700", marginBottom: "4px" },
  userEmail: { fontSize: "12px", opacity: 0.7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  adminBadge: { display: "inline-block", marginTop: "8px", padding: "3px 10px", background: "#1890ff", color: "#fff", borderRadius: "999px", fontSize: "11px", fontWeight: "700" },
  saleBadge: { display: "inline-block", marginTop: "8px", padding: "3px 10px", background: "#0068FF", color: "#fff", borderRadius: "999px", fontSize: "11px", fontWeight: "700" },
  nav: { padding: "12px" },
  navItem: { width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "none", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", color: "#374151", textAlign: "left", transition: "all 0.15s" },
  navItemActive: { background: "#f0f4ff", color: "#001C40", fontWeight: "700" },
  navIcon: { fontSize: "14px", width: "18px", textAlign: "center", color: "inherit" },
  navDivider: { height: "1px", background: "#f3f4f6", margin: "8px 0" },
  logoutBtn: { width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "none", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", color: "#dc2626", textAlign: "left" },
  content: { flex: 1, minWidth: 0 },
  toast: { padding: "12px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" },
  card: { background: "#fff", borderRadius: "14px", border: "1px solid #e5e7eb", padding: "28px" },
  cardTitle: { fontSize: "18px", fontWeight: "800", color: "#1a1a1a", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center" },
  form: { display: "flex", flexDirection: "column" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  group: { marginBottom: "18px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "7px", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit", background: "#fafafa" },
  hint: { fontSize: "11px", color: "#9ca3af", marginTop: "5px" },
  saveBtn: { padding: "13px 28px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700", alignSelf: "flex-start", marginTop: "4px" },
  loadingWrap: { display: "flex", justifyContent: "center", padding: "40px" },
  spinner: { width: "32px", height: "32px", border: "3px solid #e5e7eb", borderTop: "3px solid #001C40", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  emptyOrders: { textAlign: "center", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  shopBtn: { display: "inline-block", padding: "12px 28px", background: "#001C40", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "700", fontSize: "13px", marginTop: "8px" },
  orderList: { display: "flex", flexDirection: "column", gap: "12px" },
  orderCard: { border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", transition: "box-shadow 0.2s" },
  orderTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" },
  orderCode: { fontSize: "14px", fontWeight: "700", color: "#1d4ed8", marginBottom: "4px" },
  orderDate: { fontSize: "12px", color: "#9ca3af" },
  orderRight: { textAlign: "right" },
  statusBadge: { fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "999px", display: "inline-block", marginBottom: "4px" },
  orderTotal: { fontSize: "15px", fontWeight: "800", color: "#1a1a1a" },
  orderAddr: { fontSize: "12px", color: "#6b7280", marginTop: "6px" },
  // Order items
  orderItems: { borderTop: "1px solid #f3f4f6", marginTop: "12px", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "10px" },
  orderItem: { display: "flex", alignItems: "center", gap: "12px" },
  orderItemImg: { width: "52px", height: "68px", objectFit: "cover", borderRadius: "6px", flexShrink: 0, border: "1px solid #e5e7eb" },
  orderItemInfo: { flex: 1, minWidth: 0 },
  orderItemName: { fontSize: "13px", fontWeight: "600", color: "#1a1a1a", marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  orderItemMeta: { fontSize: "11px", color: "#9ca3af" },
  orderItemPrice: { fontSize: "13px", fontWeight: "700", color: "#374151", flexShrink: 0 },
  reviewBtn: { padding: "5px 12px", background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "700", flexShrink: 0 },
  // Order actions
  orderActions: { display: "flex", gap: "10px", alignItems: "center", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #f3f4f6", flexWrap: "wrap" },
  cancelBtn: { padding: "8px 16px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "700" },
  reorderBtn: { padding: "8px 16px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "700" },
  cancelledNote: { fontSize: "11px", color: "#9ca3af", fontStyle: "italic" },
};

// Modal styles
const m = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  box: { background: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "480px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  title: { fontSize: "16px", fontWeight: "700", color: "#1a1a1a", display: "flex", alignItems: "center" },
  closeBtn: { background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#6b7280", padding: "4px" },
  productName: { fontSize: "14px", color: "#6b7280", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #f3f4f6" },
  group: { marginBottom: "18px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" },
  stars: { display: "flex", alignItems: "center", gap: "4px" },
  textarea: { width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical", fontFamily: "inherit", background: "#fafafa" },
  actions: { display: "flex", gap: "10px", marginTop: "4px" },
  cancelBtn: { flex: 1, padding: "12px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#374151" },
  submitBtn: { flex: 2, padding: "12px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" },
};

export default ProfilePage;
