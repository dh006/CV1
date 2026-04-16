import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../../services/api";

const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return val.split(",").map((s) => s.trim()).filter(Boolean); }
};

const getImgUrl = (img) => {
  if (!img) return "";
  return img.startsWith("http") ? img : `${BASE_URL}${img}`;
};

const getColorHex = (name) => {
  const n = (name || "").toLowerCase().trim();
  const map = {
    "đen": "#1a1a1a", "den": "#1a1a1a", "black": "#1a1a1a",
    "trắng": "#f0f0f0", "trang": "#f0f0f0", "white": "#f0f0f0",
    "xám": "#9ca3af", "xam": "#9ca3af", "gray": "#9ca3af",
    "xanh navy": "#001C40", "navy": "#001C40",
    "xanh dương": "#3b82f6", "blue": "#3b82f6",
    "xanh lá": "#22c55e", "green": "#22c55e",
    "xanh rêu": "#4d7c0f", "xanh reu": "#4d7c0f",
    "đỏ": "#dc2626", "do": "#dc2626", "red": "#dc2626",
    "cam": "#f97316", "orange": "#f97316",
    "vàng": "#eab308", "vang": "#eab308",
    "hồng": "#ec4899", "hong": "#ec4899", "pink": "#ec4899",
    "tím": "#8b5cf6", "tim": "#8b5cf6", "purple": "#8b5cf6",
    "nâu": "#92400e", "nau": "#92400e", "brown": "#92400e",
    "be": "#d4b896", "kem": "#fef3c7",
    "xám xanh": "#64748b", "xanh xám": "#64748b",
    "đen nâu": "#3d2b1f", "den nau": "#3d2b1f",
  };
  for (const [key, hex] of Object.entries(map)) {
    if (n === key || n.includes(key) || key.includes(n)) return hex;
  }
  return "#e5e7eb";
};

const QuickViewModal = ({ product, isOpen, onClose, onAdd }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedSize(null);
      const colors = parseList(product.colors);
      const firstColor = colors[0] || null;
      setSelectedColor(firstColor);
      // Ảnh đầu tiên
      setMainImg(getImgUrl(product.image));
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const parseGallery = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val; // đã là array (sau normalize)
    try { return JSON.parse(val); } catch { return []; }
  };

  // Tất cả ảnh: main + gallery (đã resolve URL hoặc chưa)
  const allImages = [product.image, ...parseGallery(product.gallery)]
    .filter(Boolean)
    .map((img) => img.startsWith("http") ? img : getImgUrl(img))
    .filter((v, i, a) => a.indexOf(v) === i);

  // Map màu → ảnh: ưu tiên colorImages từ DB, fallback về index
  const colors = parseList(product.colors);
  const colorImageMap = (() => {
    if (product.colorImages) {
      try {
        const map = JSON.parse(product.colorImages);
        const resolved = {};
        Object.entries(map).forEach(([c, img]) => {
          resolved[c] = img ? getImgUrl(img) : null;
        });
        return resolved;
      } catch {}
    }
    // Fallback index-based
    const map = {};
    colors.forEach((c, i) => { if (allImages[i]) map[c] = allImages[i]; });
    return map;
  })();

  const handleColorSelect = (c) => {
    setSelectedColor(c);
    if (colorImageMap[c]) setMainImg(colorImageMap[c]);
  };

  const sizes = parseList(product.sizes);
  const hasSizes = sizes.length > 0;

  const sizeStock = (() => { try { return JSON.parse(product.sizeStock || "{}"); } catch { return {}; } })();
  const isSizeOut = (sz) => sizeStock[sz] !== undefined ? sizeStock[sz] === 0 : false;

  const discountPct = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  const isOutOfStock = product.quantity === 0;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) { alert("Vui lòng chọn kích thước!"); return; }
    onAdd({ ...product, image: getImgUrl(product.image), quantity, size: selectedSize || "", color: selectedColor });
    onClose();
  };

  const handleBuyNow = () => {
    if (hasSizes && !selectedSize) { alert("Vui lòng chọn kích thước!"); return; }
    onAdd({ ...product, image: getImgUrl(product.image), quantity, size: selectedSize || "", color: selectedColor });
    onClose();
    navigate("/cart");
  };

  return ReactDOM.createPortal(
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        {/* CLOSE */}
        <button style={s.closeBtn} onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div style={s.content} className="quickview-content">
          {/* ═══ ẢNH ═══ */}
          <div style={s.imageSection}>
            {/* Ảnh chính */}
            <div style={s.mainImgWrap}>
              <img src={mainImg || allImages[0]} alt={product.name} style={s.mainImg}
                onError={(e) => { e.target.src = "https://via.placeholder.com/400x530?text=No+Image"; }} />
              {discountPct && <span style={s.discountBadge}>-{discountPct}%</span>}
              {product.label === "NEW" && <span style={s.labelBadge}>NEW</span>}
              {isOutOfStock && <div style={s.soldOut}><span>HẾT HÀNG</span></div>}
            </div>

            {/* Thumbnails ngang */}
            {allImages.length > 1 && (
              <div style={s.thumbRow}>
                {allImages.map((img, idx) => (
                  <div key={idx} onClick={() => setMainImg(img)}
                    style={{ ...s.thumbItem, borderColor: mainImg === img ? "#111" : "#e5e7eb", opacity: mainImg === img ? 1 : 0.6 }}>
                    <img src={img} alt="" style={s.thumbImg}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/60x80"; }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ═══ THÔNG TIN ═══ */}
          <div style={s.infoSection}>
            <p style={s.catLabel}>{product.Category?.name || product.categoryName || "DIEP COLLECTION"}</p>
            <h2 style={s.title}>{product.name}</h2>
            <p style={s.sku}>SKU: DC-{String(product.id).padStart(6, "0")}</p>

            {/* GIÁ */}
            <div style={s.priceRow}>
              <span style={{ ...s.price, color: isOutOfStock ? "#aaa" : "#111" }}>
                {Number(product.price).toLocaleString()}đ
              </span>
              {product.oldPrice && Number(product.oldPrice) > Number(product.price) && (
                <span style={s.oldPrice}>{Number(product.oldPrice).toLocaleString()}đ</span>
              )}
              {discountPct && <span style={s.discTag}>-{discountPct}%</span>}
            </div>

            {/* MÀU SẮC — thumbnail ảnh */}
            {colors.length > 0 && (
              <div style={s.optGroup}>
                <p style={s.optLabel}>MÀU SẮC: <strong style={{ color: "#111" }}>{selectedColor || "Chưa chọn"}</strong></p>
                <div style={s.colorRow}>
                  {colors.map((c) => {
                    const hex = getColorHex(c);
                    const isLight = ["#f0f0f0", "#fef3c7", "#d4b896"].includes(hex);
                    const isSel = selectedColor === c;
                    const thumbImg = colorImageMap[c];
                    return (
                      <button key={c} onClick={() => handleColorSelect(c)} title={c}
                        style={{
                          width: "46px", height: "46px",
                          borderRadius: "50%",
                          padding: 0,
                          overflow: "hidden",
                          cursor: "pointer",
                          flexShrink: 0,
                          border: isSel ? "2.5px solid #111" : "1.5px solid #e5e7eb",
                          boxShadow: isSel ? "0 0 0 3px rgba(0,0,0,0.12)" : "none",
                          transform: isSel ? "scale(1.15)" : "scale(1)",
                          transition: "all 0.2s",
                          background: thumbImg ? "transparent" : hex,
                          position: "relative",
                        }}>
                        {thumbImg ? (
                          <img
                            src={thumbImg}
                            alt={c}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            onError={(e) => { e.target.style.display = "none"; e.target.parentNode.style.background = hex; }}
                          />
                        ) : (
                          isSel && <span style={{ color: isLight ? "#111" : "#fff", fontSize: "11px", fontWeight: "900" }}>✓</span>
                        )}
                        {isSel && thumbImg && (
                          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="fa-solid fa-check" style={{ color: "#fff", fontSize: "13px", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SIZE — chỉ hiện khi có size */}
            {hasSizes && (
            <div style={s.optGroup}>
              <div style={s.optLabelRow}>
                <p style={s.optLabel}>KÍCH THƯỚC: <strong style={{ color: "#111" }}>{selectedSize || "CHƯA CHỌN"}</strong></p>
                <span
                  style={{ ...s.sizeGuide, color: product.sizeGuide ? "#001C40" : "#888" }}
                  onClick={() => product.sizeGuide && setShowSizeGuide(true)}
                  title={product.sizeGuide ? "Xem bảng size" : "Chưa có bảng size"}
                >
                  <i className="fa-solid fa-ruler" style={{ marginRight: "4px" }} />
                  Hướng dẫn chọn size
                </span>
              </div>
              <div style={s.sizeRow}>
                {sizes.map((sz) => {
                  const out = isSizeOut(sz);
                  const sel = selectedSize === sz;
                  return (
                    <button key={sz} onClick={() => !out && setSelectedSize(sz)} disabled={out}
                      style={{ ...s.sizeBtn,
                        background: sel ? "#111" : out ? "#f5f5f5" : "#fff",
                        color: sel ? "#fff" : out ? "#ccc" : "#111",
                        border: sel ? "1.5px solid #111" : "1.5px solid #e5e7eb",
                        cursor: out ? "not-allowed" : "pointer",
                        opacity: out ? 0.5 : 1,
                        textDecoration: out ? "line-through" : "none",
                      }}>
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
            )}

            {/* MÔ TẢ ngắn */}
            {product.description && (
              <p style={s.desc}>{product.description.substring(0, 130)}{product.description.length > 130 ? "..." : ""}</p>
            )}

            {/* ƯU ĐÃI */}
            <div style={s.offerBox}>
              <p style={s.offerTitle}>🎁 ƯU ĐÃI ONLINE ĐỘC QUYỀN</p>
              <ul style={s.offerList}>
                <li>Nhập mã <strong>ICD10</strong> giảm 10% cho đơn đầu tiên</li>
                <li>Miễn phí vận chuyển đơn hàng từ 399K</li>
                <li>Đổi trả trong vòng 15 ngày nếu không vừa size</li>
              </ul>
            </div>

            {/* ACTIONS */}
            {!isOutOfStock ? (
              <div style={s.actionRow}>
                <div style={s.qtyBox}>
                  <button style={s.qBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span style={s.qNum}>{quantity}</span>
                  <button style={s.qBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <button style={s.addBtn} onClick={handleAddToCart}>THÊM VÀO GIỎ</button>
                <button style={{ ...s.buyBtn, background: "#111", cursor: "pointer" }}
                  onClick={handleBuyNow}>MUA NGAY</button>
              </div>
            ) : (
              <div style={{ padding: "14px", background: "#f5f5f5", borderRadius: "8px", textAlign: "center", fontSize: "13px", color: "#888", marginBottom: "12px" }}>
                Sản phẩm này hiện đã hết hàng
              </div>
            )}

            <Link to={`/products/${product.slug || product.id}`} style={s.detailLink} onClick={onClose}>
              Xem chi tiết sản phẩm →
            </Link>
          </div>
        </div>
      </div>

      {/* SIZE GUIDE POPUP */}
      {showSizeGuide && product.sizeGuide && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: "14px", padding: "24px", maxWidth: "680px", width: "100%", maxHeight: "88vh", overflowY: "auto", position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#111", margin: 0 }}>
                <i className="fa-solid fa-ruler" style={{ marginRight: "8px", color: "#001C40" }} />
                Hướng dẫn chọn size
              </h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "15px", color: "#555", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <img
              src={product.sizeGuide}
              alt="Bảng hướng dẫn chọn size"
              style={{ width: "100%", borderRadius: "8px", display: "block" }}
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
            />
            <p style={{ display: "none", textAlign: "center", color: "#9ca3af", padding: "40px 0", fontSize: "14px" }}>
              Không tải được ảnh. Vui lòng thử lại.
            </p>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

const s = {
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", zIndex: 10001, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(4px)", padding: "16px" },
  modal: { backgroundColor: "#fff", width: "min(900px, 96vw)", maxHeight: "94vh", overflowY: "auto", borderRadius: "14px", position: "relative", padding: "24px", fontFamily: "'Inter',sans-serif", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" },
  closeBtn: { position: "absolute", top: "12px", right: "12px", border: "none", background: "#f3f4f6", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", zIndex: 10 },
  content: { display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "28px" },

  // Image
  imageSection: { minWidth: 0 },
  mainImgWrap: { position: "relative", width: "100%", aspectRatio: "3/4", background: "#f5f5f5", borderRadius: "10px", overflow: "hidden" },
  mainImg: { width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.25s" },
  discountBadge: { position: "absolute", top: "10px", right: "10px", background: "#111", color: "#fff", padding: "3px 8px", borderRadius: "3px", fontSize: "11px", fontWeight: "700", zIndex: 2 },
  labelBadge: { position: "absolute", top: "10px", left: "10px", background: "#dc2626", color: "#fff", padding: "3px 8px", borderRadius: "3px", fontSize: "10px", fontWeight: "800", zIndex: 2 },
  soldOut: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px", fontWeight: "900", letterSpacing: "3px", zIndex: 3 },
  thumbRow: { display: "flex", gap: "6px", marginTop: "10px", overflowX: "auto", paddingBottom: "4px" },
  thumbItem: { width: "54px", height: "72px", borderRadius: "6px", overflow: "hidden", cursor: "pointer", flexShrink: 0, border: "1.5px solid", transition: "all 0.15s" },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },

  // Info
  infoSection: { display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" },
  catLabel: { fontSize: "10px", color: "#aaa", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "5px" },
  title: { fontSize: "17px", fontWeight: "800", color: "#111", marginBottom: "4px", lineHeight: "1.35" },
  sku: { fontSize: "11px", color: "#bbb", marginBottom: "10px" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid #f0f0f0", flexWrap: "wrap" },
  price: { fontSize: "22px", fontWeight: "800" },
  oldPrice: { fontSize: "14px", color: "#bbb", textDecoration: "line-through" },
  discTag: { background: "#111", color: "#fff", padding: "2px 7px", borderRadius: "3px", fontSize: "11px", fontWeight: "700" },

  optGroup: { marginBottom: "12px" },
  optLabel: { fontSize: "11px", fontWeight: "700", color: "#888", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.8px" },
  optLabelRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  sizeGuide: { fontSize: "11px", color: "#888", textDecoration: "underline", cursor: "pointer" },

  colorRow: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", padding: "4px 4px 4px 6px" },
  colorSwatch: { width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 },

  sizeRow: { display: "flex", gap: "6px", flexWrap: "wrap" },
  sizeBtn: { minWidth: "46px", height: "38px", borderRadius: "5px", fontWeight: "600", fontSize: "12px", transition: "all 0.15s", padding: "0 8px" },

  desc: { fontSize: "12px", color: "#777", lineHeight: "1.6", marginBottom: "10px", padding: "8px 10px", background: "#fafafa", borderRadius: "6px", border: "1px solid #f0f0f0" },

  offerBox: { padding: "8px 10px", background: "#fffdf0", border: "1px dashed #e5d88a", borderRadius: "6px", marginBottom: "12px" },
  offerTitle: { color: "#92700a", fontWeight: "800", fontSize: "10px", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" },
  offerList: { fontSize: "11px", paddingLeft: "14px", margin: 0, lineHeight: "1.7", color: "#555" },

  actionRow: { display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" },
  qtyBox: { display: "flex", alignItems: "center", border: "1.5px solid #111", borderRadius: "6px", overflow: "hidden", height: "44px" },
  qBtn: { width: "34px", height: "100%", border: "none", background: "none", cursor: "pointer", fontSize: "18px", color: "#111" },
  qNum: { width: "32px", textAlign: "center", fontWeight: "700", fontSize: "14px", color: "#111" },
  addBtn: { flex: 1, height: "44px", background: "#fff", color: "#111", border: "1.5px solid #111", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", letterSpacing: "0.5px" },
  buyBtn: { flex: 1, height: "44px", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", fontSize: "12px", letterSpacing: "0.5px" },
  detailLink: { fontSize: "12px", color: "#555", textDecoration: "underline", fontWeight: "600", textAlign: "center", display: "block", marginTop: "4px" },
};

export default QuickViewModal;
