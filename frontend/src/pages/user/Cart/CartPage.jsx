import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderAPI, paymentAPI, BASE_URL, voucherAPI } from "../../../services/api";
import api from "../../../services/api";
import { useCart } from "../../../hooks/useCart";

const getImgUrl = (img) => {
  if (!img) return "https://via.placeholder.com/64x84?text=No+Image";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
};

// Thông tin tài khoản từ .env
const BANK_ID      = import.meta.env.VITE_BANK_ID      || "MB";
const ACCOUNT_NO   = import.meta.env.VITE_ACCOUNT_NO   || "0383562784";
const ACCOUNT_NAME = import.meta.env.VITE_ACCOUNT_NAME || "DIEP COLLECTION";

// Tạo URL QR VietQR với số tiền và nội dung chuyển khoản
const getQRUrl = (amount, orderCode) =>
  `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent("DIEP " + orderCode)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [qrCreated, setQrCreated] = useState(false);
  const [pollingStatus, setPollingStatus] = useState("waiting");
  const [showManualBtn, setShowManualBtn] = useState(false);
  const pollingRef = useRef(null);
  const manualTimerRef = useRef(null);

  // Voucher
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null); // { code, discount }
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherMsg, setVoucherMsg] = useState(null); // { type, text }

  // Điểm thưởng
  const [usePoints, setUsePoints] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const userPoints = user?.points || 0;

  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.fullName || user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch(() => {});
  }, []);

  // Polling kiểm tra thanh toán mỗi 3 giây khi QR đang hiển thị
  useEffect(() => {
    if (showQR && pendingOrder?.orderCode && qrCreated) {
      setPollingStatus("checking");
      setShowManualBtn(false);

      // Sau 15 giây → hiện nút xác nhận thủ công (đủ thời gian chuyển khoản)
      manualTimerRef.current = setTimeout(() => setShowManualBtn(true), 15000);

      const checkPaid = async () => {
        try {
          const res = await paymentAPI.checkStatus(pendingOrder.orderCode);
          if (res.data.paid) {
            if (pollingRef.current) clearInterval(pollingRef.current);
            clearTimeout(manualTimerRef.current);
            setPollingStatus("paid");
            setTimeout(() => {
              clearCart();
              setShowQR(false);
              navigate("/thank-you", {
                state: {
                  orderCode: pendingOrder.orderCode,
                  customerName: pendingOrder.fullName,
                },
              });
            }, 1500);
            return true;
          }
        } catch {}
        return false;
      };

      checkPaid();
      pollingRef.current = setInterval(checkPaid, 3000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (manualTimerRef.current) clearTimeout(manualTimerRef.current);
    };
  }, [showQR, pendingOrder, qrCreated]);

  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    const selectedProv = provinces.find((p) => p.name === provinceName);
    setCustomerInfo({ ...customerInfo, city: provinceName, district: "", ward: "" });
    setDistricts([]);
    setWards([]);
    if (selectedProv) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProv.code}?depth=2`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.districts));
    }
  };

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    const selectedDist = districts.find((d) => d.name === districtName);
    setCustomerInfo({ ...customerInfo, district: districtName, ward: "" });
    setWards([]);
    if (selectedDist) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDist.code}?depth=2`)
        .then((res) => res.json())
        .then((data) => setWards(data.wards));
    }
  };

  // Phí ship theo vùng
  const getShippingFee = () => {
    if (totalPrice >= 399000 || totalPrice === 0) return 0;
    const city = (customerInfo.city || "").toLowerCase();
    // Miền Nam (HCM, Đồng Nai, Bình Dương...)
    if (city.includes("hồ chí minh") || city.includes("ho chi minh") || city.includes("đồng nai") || city.includes("bình dương") || city.includes("long an") || city.includes("tiền giang") || city.includes("vũng tàu")) return 20000;
    // Miền Trung (Đà Nẵng, Huế, Quảng Nam...)
    if (city.includes("đà nẵng") || city.includes("da nang") || city.includes("huế") || city.includes("quảng") || city.includes("bình định") || city.includes("khánh hòa")) return 25000;
    // Miền Bắc (Hà Nội...)
    if (city.includes("hà nội") || city.includes("ha noi") || city.includes("hải phòng") || city.includes("bắc") || city.includes("nam định")) return 30000;
    return 30000; // mặc định
  };

  const shippingFee = getShippingFee();

  // Tính giảm giá điểm (1 điểm = 100đ, tối đa 20% đơn)
  const pointsDiscount = usePoints && userPoints > 0
    ? Math.min(userPoints * 100, Math.round(totalPrice * 0.2))
    : 0;
  const pointsUsed = Math.ceil(pointsDiscount / 100);

  const voucherDiscount = appliedVoucher?.discount || 0;
  const total = Math.max(0, totalPrice + shippingFee - voucherDiscount - pointsDiscount);
  const remainingForPromo = Math.max(0, 399000 - totalPrice);

  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
    if (!user) { navigate("/login"); return; }
    setVoucherLoading(true);
    setVoucherMsg(null);
    try {
      const res = await voucherAPI.check(voucherInput.trim(), totalPrice);
      setAppliedVoucher({ code: res.data.voucher.code, discount: res.data.discount });
      setVoucherMsg({ type: "success", text: res.data.message });
    } catch (err) {
      setVoucherMsg({ type: "error", text: err.response?.data?.message || "Mã không hợp lệ!" });
      setAppliedVoucher(null);
    } finally {
      setVoucherLoading(false);
    }
  };

  const validateOrder = () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    const { fullName, phone, address, city, district, ward } = customerInfo;
    if (fullName.trim().length < 2) return showErr("Vui lòng nhập họ và tên hợp lệ.");
    const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (!vnf_regex.test(phone.replace(/\s/g, ""))) return showErr("Số điện thoại không đúng định dạng Việt Nam.");
    if (!city || !district || !ward) return showErr("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện và Phường/Xã.");
    if (address.trim().length < 5) return showErr("Vui lòng nhập địa chỉ cụ thể (Số nhà, tên đường).");
    return true;
  };

  const showErr = (msg) => { alert("⚠️ " + msg); return false; };

  const handleFinishOrder = async () => {
    if (!validateOrder()) return;
    if (cartItems.length === 0) { alert("Giỏ hàng trống!"); return; }

    const buildOrderData = (paymentMethod) => ({
      fullName: customerInfo.fullName,
      phone: customerInfo.phone,
      province: customerInfo.city,
      district: customerInfo.district,
      ward: customerInfo.ward,
      addressDetail: customerInfo.address,
      note: customerInfo.note,
      paymentMethod,
      totalPrice: total,
      voucherCode: appliedVoucher?.code || null,
      usePoints,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.size || "",
        color: item.color || "",
      })),
    });

    if (paymentMethod === "VNPAY") {
      setSubmitting(true);
      try {
        const orderData = buildOrderData("VNPAY_QR");
        const res = await orderAPI.create(orderData);
        const orderCode = res.data.orderCode;
        setPendingOrder({ ...orderData, orderCode });
        setQrCreated(true);
        setPollingStatus("waiting");
        setShowQR(true);
      } catch (err) {
        alert("❌ " + (err.response?.data?.message || "Lỗi tạo đơn hàng!"));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (paymentMethod === "ZALOPAY") {
      setSubmitting(true);
      try {
        const orderData = buildOrderData("ZALOPAY");
        const res = await orderAPI.create(orderData);
        navigate("/zalopay-nhan-tien", {
          state: { orderCode: res.data.orderCode, amount: total, fullName: customerInfo.fullName, fromCheckout: true },
        });
      } catch (err) {
        alert("❌ " + (err.response?.data?.message || "Lỗi tạo đơn hàng!"));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    await submitOrder(buildOrderData("COD"));
  };

  const submitOrder = async (orderData) => {
    setSubmitting(true);
    try {
      const res = await orderAPI.create(orderData);
      clearCart();
      navigate("/thank-you", {
        state: {
          orderCode: res.data.orderCode,
          customerName: orderData.fullName,
        },
      });
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Đặt hàng thất bại!"));
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa đơn hàng nếu user hủy QR
  const handleCancelQR = () => {
    setShowQR(false);
    clearInterval(pollingRef.current);
  };

  return (
    <div style={s.container}>
      {/* BREADCRUMB */}
      <div style={s.breadcrumb}>
        <Link to="/" style={s.breadLink}>Trang chủ</Link>
        <span style={s.breadSep}>/</span>
        <span style={s.breadCurrent}>Giỏ hàng & Thanh toán</span>
      </div>

      {cartItems.length === 0 ? (
        <div style={s.emptyState}>
          <div style={s.emptyIcon}>
            <i className="fa-solid fa-cart-shopping" style={{ fontSize: "56px", color: "#d1d5db" }} />
          </div>
          <h2 style={s.emptyTitle}>Giỏ hàng trống</h2>
          <p style={s.emptyDesc}>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          <Link to="/" style={s.shopBtn}>Khám phá sản phẩm</Link>
        </div>
      ) : (
        <div style={s.mainContent} className="cart-main-content">
          {/* CỘT TRÁI */}
          <div style={s.leftColumn}>
            {/* THÔNG TIN GIAO HÀNG */}
            <div style={s.section}>
              <h3 style={s.sectionTitle}>
                <span style={s.sectionNum}>1</span>
                Thông tin giao hàng
                {user && <span style={s.userBadge}>👤 {user.fullName || user.name}</span>}
              </h3>
              <div style={s.formGroup}>
                <div style={s.row2} className="cart-row2">
                  <div style={s.fieldWrap}>
                    <label style={s.fieldLabel}>Họ và tên *</label>
                    <input
                      type="text"
                      placeholder="Người nhận hàng"
                      style={s.input}
                      value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                    />
                  </div>
                  <div style={s.fieldWrap}>
                    <label style={s.fieldLabel}>Số điện thoại *</label>
                    <input
                      type="tel"
                      placeholder="09x xxx xxxx"
                      style={s.input}
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={s.row3} className="cart-row3">
                  <div style={s.fieldWrap}>
                    <label style={s.fieldLabel}>Tỉnh/Thành phố *</label>
                    <select style={s.select} value={customerInfo.city} onChange={handleProvinceChange}>
                      <option value="">Chọn tỉnh/thành</option>
                      {provinces.map((p) => <option key={p.code} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div style={s.fieldWrap}>
                    <label style={s.fieldLabel}>Quận/Huyện *</label>
                    <select style={s.select} value={customerInfo.district} onChange={handleDistrictChange} disabled={!districts.length}>
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((d) => <option key={d.code} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <div style={s.fieldWrap}>
                    <label style={s.fieldLabel}>Phường/Xã *</label>
                    <select style={s.select} value={customerInfo.ward} onChange={(e) => setCustomerInfo({ ...customerInfo, ward: e.target.value })} disabled={!wards.length}>
                      <option value="">Chọn phường/xã</option>
                      {wards.map((w) => <option key={w.code} value={w.name}>{w.name}</option>)}
                    </select>
                  </div>
                </div>

                <div style={s.fieldWrap}>
                  <label style={s.fieldLabel}>Địa chỉ chi tiết *</label>
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường..."
                    style={s.input}
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  />
                </div>

                <div style={s.fieldWrap}>
                  <label style={s.fieldLabel}>Ghi chú đơn hàng</label>
                  <textarea
                    placeholder="Giao giờ hành chính, gọi trước khi giao..."
                    style={{ ...s.input, minHeight: "80px", resize: "vertical" }}
                    value={customerInfo.note}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <div style={s.section}>
              <h3 style={s.sectionTitle}>
                <span style={s.sectionNum}>2</span>
                Phương thức thanh toán
              </h3>
              <div style={s.paymentOptions}>
                {[
                  {
                    id: "COD",
                    fa: "fa-solid fa-money-bill-wave",
                    iconColor: "#059669",
                    label: "Thanh toán khi nhận hàng (COD)",
                    desc: "Kiểm tra hàng trước khi thanh toán. Miễn phí ship đơn từ 399K.",
                  },
                  {
                    id: "ZALOPAY",
                    fa: "fa-solid fa-wallet",
                    iconColor: "#0068FF",
                    label: "ZaloPay",
                    desc: "Quét mã QR ZaloPay để chuyển đúng số tiền. Ghi nội dung có mã đơn. Xác nhận thủ công trong đơn nếu cần.",
                  },
                  {
                    id: "VNPAY",
                    fa: "fa-solid fa-building-columns",
                    iconColor: "#475569",
                    label: "Chuyển khoản QR ngân hàng",
                    desc: "Quét VietQR bằng app ngân hàng. Tự xác nhận khi có SePay/Casso hoặc bấm Đã chuyển khoản.",
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    style={{ ...s.paymentBox, ...(paymentMethod === opt.id ? s.paymentBoxActive : {}) }}
                    onClick={() => setPaymentMethod(opt.id)}
                  >
                    <div style={s.paymentHead}>
                      <div style={{ ...s.radioCircle, ...(paymentMethod === opt.id ? s.radioChecked : {}) }}>
                        {paymentMethod === opt.id && <div style={s.radioDot} />}
                      </div>
                      <span style={s.paymentIcon}>
                        <i className={opt.fa} style={{ ...s.paymentFa, color: opt.iconColor }} aria-hidden />
                      </span>
                      <span style={s.paymentLabel}>{opt.label}</span>
                    </div>
                    {paymentMethod === opt.id && (
                      <p style={s.paymentDesc}>{opt.desc}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div style={s.rightColumn} className="cart-right-column">
            <div style={s.summaryCard}>
              <div style={s.summaryHeader}>
                <h3 style={s.summaryTitle}>Đơn hàng ({cartItems.length} sản phẩm)</h3>
                <Link to="/" style={s.editLink}>Thêm sản phẩm</Link>
              </div>

              {remainingForPromo > 0 ? (
                <div style={s.promoBanner}>
                  <i className="fa-solid fa-truck" style={{ marginRight: "6px" }} />
                  Mua thêm <strong>{remainingForPromo.toLocaleString()}đ</strong> để được MIỄN PHÍ SHIP
                </div>
              ) : (
                <div style={{ ...s.promoBanner, background: "linear-gradient(135deg, #10b981, #059669)" }}>
                  <i className="fa-solid fa-circle-check" style={{ marginRight: "6px" }} />
                  Đơn hàng được MIỄN PHÍ VẬN CHUYỂN
                </div>
              )}

              <div style={s.itemList}>
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} style={s.item}>
                    <div style={s.itemImgWrap}>
                      <img src={getImgUrl(item.image)} alt={item.name} style={s.itemImg}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/64x84?text=No+Image"; }} />
                      <span style={s.itemQtyBadge}>{item.quantity}</span>
                    </div>
                    <div style={s.itemInfo}>
                      <p style={s.itemName}>{item.name}</p>
                      <p style={s.itemVariant}>
                        {item.color && `Màu: ${item.color}`}
                        {item.color && item.size && " | "}
                        {item.size && `Size: ${item.size}`}
                      </p>
                      <div style={s.itemBottom}>
                        <div style={s.qtyBox}>
                          <button style={s.qtyBtn} onClick={() => updateQuantity(item.id, -1, item.size || "", item.color || "")}>−</button>
                          <span style={s.qtyNum}>{item.quantity}</span>
                          <button style={s.qtyBtn} onClick={() => updateQuantity(item.id, 1, item.size || "", item.color || "")}>+</button>
                        </div>
                        <div style={s.itemRight}>
                          <p style={s.itemPrice}>{(item.price * item.quantity).toLocaleString()}đ</p>
                          <button style={s.removeBtn} onClick={() => removeFromCart(item.id, item.size || "", item.color || "")}>Xóa</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* VOUCHER */}
              <div style={s.voucherBox}>
                <label style={s.voucherLabel}>
                  <i className="fa-solid fa-tag" style={{ marginRight: "6px", color: "#059669" }} />
                  Mã giảm giá
                </label>
                <div style={s.voucherRow}>
                  <input
                    type="text"
                    placeholder="Nhập mã voucher..."
                    value={voucherInput}
                    onChange={(e) => { setVoucherInput(e.target.value.toUpperCase()); setVoucherMsg(null); }}
                    style={s.voucherInput}
                    disabled={!!appliedVoucher}
                  />
                  {appliedVoucher ? (
                    <button style={s.voucherRemoveBtn} onClick={() => { setAppliedVoucher(null); setVoucherInput(""); setVoucherMsg(null); }}>
                      <i className="fa-solid fa-xmark" />
                    </button>
                  ) : (
                    <button style={s.voucherApplyBtn} onClick={handleApplyVoucher} disabled={voucherLoading}>
                      {voucherLoading ? "..." : "Áp dụng"}
                    </button>
                  )}
                </div>
                {voucherMsg && (
                  <p style={{ fontSize: "12px", marginTop: "6px", color: voucherMsg.type === "success" ? "#059669" : "#dc2626", fontWeight: "600" }}>
                    <i className={`fa-solid ${voucherMsg.type === "success" ? "fa-circle-check" : "fa-circle-xmark"}`} style={{ marginRight: "4px" }} />
                    {voucherMsg.text}
                  </p>
                )}
              </div>

              {/* ĐIỂM THƯỞNG */}
              {user && userPoints > 0 && (
                <div style={s.pointsBox}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#7c3aed" }}>
                      <i className="fa-solid fa-star" style={{ marginRight: "5px", color: "#f59e0b" }} />
                      Dùng {userPoints} điểm thưởng
                      <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "400", marginLeft: "6px" }}>
                        (= {(userPoints * 100).toLocaleString()}đ, tối đa 20% đơn)
                      </span>
                    </span>
                  </label>
                </div>
              )}

              <div style={s.priceSummary}>
                <div style={s.priceRow}>
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString()}đ</span>
                </div>
                <div style={s.priceRow}>
                  <span>Phí vận chuyển</span>
                  <span style={{ color: shippingFee === 0 ? "#10b981" : "#1a1a1a", fontWeight: "600" }}>
                    {shippingFee === 0 ? "Miễn phí" : shippingFee.toLocaleString() + "đ"}
                  </span>
                </div>
                {voucherDiscount > 0 && (
                  <div style={s.priceRow}>
                    <span style={{ color: "#059669" }}>
                      <i className="fa-solid fa-tag" style={{ marginRight: "5px" }} />
                      Voucher ({appliedVoucher.code})
                    </span>
                    <span style={{ color: "#059669", fontWeight: "700" }}>-{voucherDiscount.toLocaleString()}đ</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div style={s.priceRow}>
                    <span style={{ color: "#7c3aed" }}>
                      <i className="fa-solid fa-star" style={{ marginRight: "5px" }} />
                      Điểm thưởng ({pointsUsed} điểm)
                    </span>
                    <span style={{ color: "#7c3aed", fontWeight: "700" }}>-{pointsDiscount.toLocaleString()}đ</span>
                  </div>
                )}
                <div style={s.totalRow}>
                  <span style={s.totalLabel}>Tổng cộng</span>
                  <span style={s.totalAmount}>{total.toLocaleString()}đ</span>
                </div>
              </div>

              <button
                onClick={handleFinishOrder}
                disabled={cartItems.length === 0 || submitting}
                style={{
                  ...s.checkoutBtn,
                  opacity: (cartItems.length === 0 || submitting) ? 0.6 : 1,
                  cursor: (cartItems.length === 0 || submitting) ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Đang xử lý..." : "HOÀN TẤT ĐẶT HÀNG →"}
              </button>

              <div style={s.secureNote}>
                <i className="fa-solid fa-lock" style={{ marginRight: "5px" }} />
                Thông tin của bạn được bảo mật tuyệt đối
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── QR PAYMENT MODAL ── */}
      {showQR && pendingOrder && (
        <div style={qr.overlay} onClick={() => {}}>
          <div style={qr.modal}>
            {/* HEADER */}
            <div style={qr.header}>
              <div style={qr.headerLeft}>
                <div style={qr.bankIcon}>
                  <i className="fa-solid fa-mobile-screen" style={{ fontSize: "24px" }} />
                </div>
                <div>
                  <h3 style={qr.title}>Quét mã để thanh toán</h3>
                  <p style={qr.subtitle}>Hỗ trợ MoMo, VietQR, Napas 247</p>
                </div>
              </div>
              {pollingStatus !== "paid" && (
                <button style={qr.closeBtn} onClick={() => { setShowQR(false); clearInterval(pollingRef.current); }}>✕</button>
              )}
            </div>

            {/* TRẠNG THÁI THANH TOÁN */}
            {pollingStatus === "paid" ? (
              <div style={qr.successWrap}>
                <div style={qr.successIcon}>
                  <i className="fa-solid fa-circle-check" style={{ fontSize: "52px", color: "#059669" }} />
                </div>
                <h3 style={qr.successTitle}>Thanh toán thành công!</h3>
                <p style={qr.successSub}>Đang chuyển đến trang xác nhận đơn hàng...</p>
                <div style={qr.successSpinner} />
              </div>
            ) : (
              <>
                {/* QR CODE */}
                <div style={qr.qrWrap}>
                  <img
                    src={getQRUrl(pendingOrder.totalPrice, pendingOrder.orderCode)}
                    alt="QR thanh toán"
                    style={qr.qrImg}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/260x260?text=QR+Error"; }}
                  />
                  {/* Pulse indicator đang chờ */}
                  <div style={qr.waitingBadge}>
                    <span style={qr.pulseDot} />
                    Đang chờ thanh toán...
                  </div>
                </div>

                {/* THÔNG TIN CHUYỂN KHOẢN */}
                <div style={qr.infoBox}>
                  <div style={qr.infoRow}>
                    <span style={qr.infoLabel}>Ngân hàng</span>
                    <span style={qr.infoVal}>{BANK_ID} Bank</span>
                  </div>
                  <div style={qr.infoRow}>
                    <span style={qr.infoLabel}>Số tài khoản</span>
                    <span style={{ ...qr.infoVal, fontWeight: "800", fontSize: "16px", color: "#001C40" }}>{ACCOUNT_NO}</span>
                  </div>
                  <div style={qr.infoRow}>
                    <span style={qr.infoLabel}>Chủ tài khoản</span>
                    <span style={qr.infoVal}>{ACCOUNT_NAME}</span>
                  </div>
                  <div style={qr.infoRow}>
                    <span style={qr.infoLabel}>Số tiền</span>
                    <span style={{ ...qr.infoVal, fontWeight: "800", fontSize: "18px", color: "#d71920" }}>
                      {pendingOrder.totalPrice.toLocaleString()}đ
                    </span>
                  </div>
                  <div style={qr.infoRow}>
                    <span style={qr.infoLabel}>Nội dung CK</span>
                    <span style={{ ...qr.infoVal, fontWeight: "700", color: "#059669" }}>
                      DIEP {pendingOrder.orderCode}
                    </span>
                  </div>
                </div>

                <p style={qr.note}>
                  ⚠️ Giữ nguyên <strong>nội dung chuyển khoản</strong> (có mã đơn). Khi tài khoản đã kết nối SePay/Casso, hệ thống tự xác nhận và chuyển trang. Chưa kết nối: bấm &quot;Đã chuyển khoản&quot; sau vài giây.
                </p>

                <div style={qr.actions}>
                  <button style={qr.cancelBtn} onClick={() => {
                    if (window.confirm("Hủy đơn hàng này?")) {
                      setShowQR(false);
                      clearInterval(pollingRef.current);
                    }
                  }}>
                    <i className="fa-solid fa-xmark" style={{ marginRight: "6px" }} />
                    Hủy
                  </button>

                  {/* Nút thủ công — chỉ hiện sau 15 giây */}
                  {showManualBtn && (
                    <button
                      style={{ ...qr.confirmBtn, opacity: submitting ? 0.7 : 1 }}
                      disabled={submitting}
                      onClick={async () => {
                        setSubmitting(true);
                        try {
                          await api.put(`/my-orders/${pendingOrder.orderCode}/confirm-paid`);
                        } catch {}
                        clearInterval(pollingRef.current);
                        setPollingStatus("paid");
                        setTimeout(() => {
                          clearCart();
                          setShowQR(false);
                          navigate("/thank-you", {
                            state: { orderCode: pendingOrder.orderCode, customerName: pendingOrder.fullName },
                          });
                        }, 1500);
                        setSubmitting(false);
                      }}
                    >
                      {submitting ? "Đang xử lý..." : "Đã chuyển khoản"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  container: { maxWidth: "1200px", margin: "40px auto", padding: "0 20px", fontFamily: "'Inter', sans-serif" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#9ca3af", marginBottom: "32px" },
  breadLink: { textDecoration: "none", color: "#9ca3af" },
  breadSep: { color: "#d1d5db" },
  breadCurrent: { color: "#1a1a1a", fontWeight: "600" },
  emptyState: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { fontSize: "64px", marginBottom: "20px" },
  emptyTitle: { fontSize: "24px", fontWeight: "700", marginBottom: "10px" },
  emptyDesc: { fontSize: "15px", color: "#6b7280", marginBottom: "28px" },
  shopBtn: { display: "inline-block", background: "#001C40", color: "#fff", padding: "14px 32px", textDecoration: "none", fontWeight: "700", borderRadius: "10px" },
  mainContent: { display: "flex", gap: "40px", alignItems: "flex-start" },
  leftColumn: { flex: 1.4 },
  rightColumn: { flex: 1, position: "sticky", top: "110px" },
  section: { marginBottom: "32px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "24px" },
  sectionTitle: { fontSize: "15px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" },
  sectionNum: {
    width: "26px", height: "26px", borderRadius: "50%",
    background: "#001C40", color: "#fff",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: "700", flexShrink: 0,
  },
  userBadge: { marginLeft: "auto", fontSize: "12px", color: "#6b7280", fontWeight: "400" },
  formGroup: { display: "flex", flexDirection: "column", gap: "16px" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" },
  fieldWrap: {},
  fieldLabel: { display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", backgroundColor: "#fafafa", fontFamily: "inherit" },
  select: { width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", backgroundColor: "#fafafa", cursor: "pointer" },
  paymentOptions: { display: "flex", flexDirection: "column", gap: "12px" },
  paymentBox: { border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "16px", cursor: "pointer", transition: "all 0.2s" },
  paymentBoxActive: { border: "1.5px solid #001C40", background: "#f8faff" },
  paymentHead: { display: "flex", alignItems: "center", gap: "12px" },
  radioCircle: { width: "18px", height: "18px", borderRadius: "50%", border: "2px solid #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  radioChecked: { border: "2px solid #001C40" },
  radioDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#001C40" },
  paymentIcon: { width: "28px", display: "flex", alignItems: "center", justifyContent: "center" },
  paymentFa: { fontSize: "20px", lineHeight: 1 },
  paymentLabel: { fontSize: "14px", fontWeight: "600", color: "#1a1a1a" },
  paymentDesc: { fontSize: "13px", color: "#6b7280", marginTop: "10px", paddingLeft: "30px", lineHeight: "1.6" },
  summaryCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "24px" },
  summaryHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  summaryTitle: { fontSize: "15px", fontWeight: "700" },
  editLink: { fontSize: "12px", color: "#6b7280", textDecoration: "underline" },
  promoBanner: {
    background: "linear-gradient(135deg, #1a1a1a, #333)",
    color: "#fff", padding: "10px 14px",
    borderRadius: "8px", fontSize: "12px",
    textAlign: "center", marginBottom: "20px",
  },
  itemList: { display: "flex", flexDirection: "column", gap: "0" },
  item: { display: "flex", gap: "12px", padding: "14px 0", borderBottom: "1px solid #f3f4f6" },
  itemImgWrap: { position: "relative", flexShrink: 0 },
  itemImg: { width: "64px", height: "84px", objectFit: "cover", borderRadius: "6px" },
  itemQtyBadge: {
    position: "absolute", top: "-6px", right: "-6px",
    background: "#001C40", color: "#fff",
    width: "20px", height: "20px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "10px", fontWeight: "700",
  },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontSize: "12px", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px", lineHeight: "1.4" },
  itemVariant: { fontSize: "11px", color: "#9ca3af", marginBottom: "8px" },
  itemBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  qtyBox: { display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: "6px", overflow: "hidden" },
  qtyBtn: { border: "none", background: "#f9fafb", padding: "4px 10px", cursor: "pointer", fontSize: "14px" },
  qtyNum: { padding: "4px 10px", fontSize: "13px", fontWeight: "600", minWidth: "30px", textAlign: "center" },
  itemRight: { textAlign: "right" },
  itemPrice: { fontSize: "13px", fontWeight: "700", marginBottom: "2px" },
  removeBtn: { background: "none", border: "none", color: "#9ca3af", fontSize: "11px", cursor: "pointer", textDecoration: "underline" },
  priceSummary: { padding: "16px 0", borderTop: "1px solid #f3f4f6", marginTop: "4px" },
  priceRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6b7280", marginBottom: "10px" },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "2px solid #1a1a1a", marginTop: "4px" },
  totalLabel: { fontSize: "15px", fontWeight: "700" },
  totalAmount: { fontSize: "22px", fontWeight: "800", color: "#d71920" },
  checkoutBtn: {
    width: "100%", padding: "16px",
    background: "linear-gradient(135deg, #001C40, #003080)",
    color: "#fff", border: "none",
    fontWeight: "800", fontSize: "14px",
    letterSpacing: "1px", borderRadius: "10px",
    marginTop: "20px", transition: "all 0.2s",
    boxShadow: "0 4px 15px rgba(0,28,64,0.3)",
  },
  secureNote: { textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "12px" },
  // Voucher & Points
  voucherBox: { padding: "14px 0", borderTop: "1px solid #f3f4f6", marginTop: "4px" },
  voucherLabel: { display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" },
  voucherRow: { display: "flex", gap: "8px" },
  voucherInput: { flex: 1, padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", outline: "none", fontFamily: "inherit", background: "#fafafa", letterSpacing: "1px", fontWeight: "600" },
  voucherApplyBtn: { padding: "9px 16px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "700", whiteSpace: "nowrap" },
  voucherRemoveBtn: { padding: "9px 14px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
  pointsBox: { padding: "12px 14px", background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: "8px", marginBottom: "12px" },
};

// QR Modal styles
const qr = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" },
  modal: { background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "420px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", background: "linear-gradient(135deg,#001C40,#003080)", color: "#fff" },
  headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
  bankIcon: { fontSize: "26px" },
  title: { fontSize: "15px", fontWeight: "700", margin: 0 },
  subtitle: { fontSize: "11px", opacity: 0.7, margin: 0 },
  closeBtn: { background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" },
  qrWrap: { display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 22px 12px", background: "#f8fafc", gap: "10px" },
  qrImg: { width: "230px", height: "230px", borderRadius: "12px", border: "3px solid #e5e7eb" },
  waitingBadge: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#6b7280", fontWeight: "500" },
  pulseDot: { display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b", animation: "pulse 1.2s ease-in-out infinite" },
  infoBox: { padding: "14px 22px", display: "flex", flexDirection: "column", gap: "8px" },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 12px", background: "#f8fafc", borderRadius: "8px" },
  infoLabel: { fontSize: "11px", color: "#6b7280", fontWeight: "500" },
  infoVal: { fontSize: "13px", color: "#1a1a1a", fontWeight: "600" },
  note: { fontSize: "12px", color: "#b45309", background: "#fef3c7", margin: "0 22px 4px", padding: "10px 14px", borderRadius: "8px", lineHeight: "1.5" },
  actions: { display: "flex", gap: "10px", padding: "16px 22px" },
  cancelBtn: { flex: 1, padding: "13px", background: "#fee2e2", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" },
  confirmBtn: { flex: 2, padding: "13px", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700" },
  // Success state
  successWrap: { padding: "48px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  successIcon: { fontSize: "56px" },
  successTitle: { fontSize: "20px", fontWeight: "800", color: "#059669" },
  successSub: { fontSize: "14px", color: "#6b7280" },
  successSpinner: { width: "28px", height: "28px", border: "3px solid #d1fae5", borderTop: "3px solid #059669", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginTop: "8px" },
};

export default CartPage;
