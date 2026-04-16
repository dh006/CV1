import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../../hooks/useCart";
import { productAPI, feedbackAPI, BASE_URL } from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";

const StarRating = ({ value, onChange, size = 22 }) => (
  <div style={{ display: "flex", gap: "3px" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} onClick={() => onChange?.(s)}
        style={{ fontSize: size, cursor: onChange ? "pointer" : "default", color: s <= value ? "#f59e0b" : "#d1d5db", transition: "color 0.15s" }}>
        ★
      </span>
    ))}
  </div>
);

// Parse "S,M,L" hoặc JSON array → array
const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return val.split(",").map((s) => s.trim()).filter(Boolean); }
};

const getImgUrl = (img) => {
  if (!img) return "";
  return img.startsWith("http") ? img : `${BASE_URL}${img}`;
};

// ── RelatedCard: card sản phẩm cùng loại ────────────────────────────────────
const RelatedCard = ({ product: p, img, hoverImg, disc, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={rc.card} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={rc.imgWrap}>
        <img src={img} alt={p.name} style={{ ...rc.img, opacity: hovered && hoverImg ? 0 : 1 }} onError={(e) => { e.target.src = "https://via.placeholder.com/300x400"; }} />
        {hoverImg && <img src={hoverImg} alt="" style={{ ...rc.img, opacity: hovered ? 1 : 0, position: "absolute", top: 0, left: 0, zIndex: 1 }} />}
        {disc && <span style={rc.disc}>-{disc}%</span>}
        {p.label === "NEW" && <span style={rc.newBadge}>NEW</span>}
      </div>
      <div style={rc.info}>
        <p style={rc.cat}>{p.Category?.name || ""}</p>
        <p style={rc.name}>{p.name}</p>
        <div style={rc.priceRow}>
          <span style={rc.price}>{Number(p.price).toLocaleString()}đ</span>
          {p.oldPrice && <span style={rc.oldPrice}>{Number(p.oldPrice).toLocaleString()}đ</span>}
        </div>
      </div>
    </div>
  );
};

const rc = {
  card: { cursor: "pointer", transition: "transform 0.2s", display: "flex", flexDirection: "column" },
  imgWrap: { position: "relative", aspectRatio: "3/4", overflow: "hidden", borderRadius: "10px", background: "#f9fafb" },
  img: { width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.4s ease, transform 0.4s ease", position: "absolute", top: 0, left: 0 },
  disc: { position: "absolute", top: "10px", right: "10px", background: "#001C40", color: "#fff", fontSize: "10px", fontWeight: "800", padding: "3px 8px", borderRadius: "4px", zIndex: 2 },
  newBadge: { position: "absolute", top: "10px", left: "10px", background: "#d71920", color: "#fff", fontSize: "10px", fontWeight: "800", padding: "3px 8px", borderRadius: "4px", zIndex: 2 },
  info: { padding: "10px 2px 0" },
  cat: { fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" },
  name: { fontSize: "13px", fontWeight: "600", color: "#1a1a1a", marginBottom: "6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.4" },
  priceRow: { display: "flex", alignItems: "center", gap: "8px" },
  price: { fontSize: "14px", fontWeight: "700", color: "#d71920" },
  oldPrice: { fontSize: "11px", color: "#9ca3af", textDecoration: "line-through" },
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart() || {};
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [zoomImg, setZoomImg] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Feedbacks
  const [feedbacks, setFeedbacks] = useState([]);
  const [avgStar, setAvgStar] = useState(0);
  const [newReview, setNewReview] = useState({ star: 5, content: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  // Sản phẩm cùng loại
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getById(slug);
        const p = res.data;
        setProduct(p);
        const img = getImgUrl(p.image);
        setMainImage(img);
        const colors = parseList(p.colors);
        if (colors.length > 0) {
          setSelectedColor(colors[0]);
          // Ảnh đầu tiên = màu đầu tiên (đã set qua setMainImage ở trên)
        }
        loadFeedbacks(p.id);
        // Load sản phẩm cùng danh mục
        if (p.categoryId) {
          productAPI.getAll({ categoryId: p.categoryId, limit: 8 })
            .then((res) => {
              const all = res.data?.data || res.data || [];
              setRelatedProducts(all.filter((r) => r.id !== p.id).slice(0, 6));
            }).catch(() => {});
        }
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, navigate]);

  const loadFeedbacks = async (id) => {
    try {
      const res = await feedbackAPI.getByProduct(id);
      setFeedbacks(res.data?.data || res.data || []);
      setAvgStar(Number(res.data?.avgStar || 0));
    } catch {}
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setSubmittingReview(true);
    try {
      await feedbackAPI.create({ productId: product.id, ...newReview });
      setNewReview({ star: 5, content: "" });
      loadFeedbacks(product.id);
    } catch (err) {
      alert(err.response?.data?.message || "Không thể gửi đánh giá!");
    } finally {
      setSubmittingReview(false);
    }
  };

  const product_images = useMemo(() => {
    if (!product) return [];
    const gallery = parseList(product.gallery);
    return [product.image, ...gallery]
      .filter(Boolean)
      .map(getImgUrl)
      .filter((v, i, a) => a.indexOf(v) === i);
  }, [product]);

  // Map màu → ảnh: ưu tiên colorImages từ DB, fallback về index-based
  const colorImageMap = useMemo(() => {
    // Thử đọc colorImages từ DB (JSON map chính xác)
    if (product?.colorImages) {
      try {
        const map = JSON.parse(product.colorImages);
        // Resolve URL cho các path local
        const resolved = {};
        Object.entries(map).forEach(([c, img]) => {
          resolved[c] = img ? getImgUrl(img) : null;
        });
        return resolved;
      } catch {}
    }
    // Fallback: map theo index (cũ)
    const map = {};
    const colorList = parseList(product?.colors) || [];
    colorList.forEach((c, i) => {
      if (product_images[i]) map[c] = product_images[i];
    });
    return map;
  }, [product, product_images]);

  const sizes = useMemo(() => parseList(product?.sizes) || [], [product]);
  const hasSizes = sizes.length > 0;
  const colors = useMemo(() => parseList(product?.colors) || [], [product]);
  const sizeStock = useMemo(() => {
    if (!product?.sizeStock) return {};
    try { return JSON.parse(product.sizeStock); } catch { return {}; }
  }, [product]);

  const getSizeQty = (sz) => sizeStock[sz] ?? null; // null = không có data theo size
  const isSizeOut = (sz) => {
    const q = getSizeQty(sz);
    return q !== null ? q === 0 : false;
  };

  const isOutOfStock = product?.quantity === 0;
  const discountPct = product?.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  // Chọn màu → đổi ảnh chính
  const handleColorSelect = (c) => {
    setSelectedColor(c);
    if (colorImageMap[c]) setMainImage(colorImageMap[c]);
  };

  // Map tên màu tiếng Việt → hex CSS
  const getColorHex = (name) => {
    const n = (name || "").toLowerCase().trim();
    const map = {
      "đen": "#1a1a1a", "den": "#1a1a1a", "black": "#1a1a1a",
      "trắng": "#f5f5f5", "trang": "#f5f5f5", "white": "#f5f5f5",
      "xám": "#9ca3af", "xam": "#9ca3af", "gray": "#9ca3af", "grey": "#9ca3af",
      "xanh navy": "#001C40", "navy": "#001C40",
      "xanh dương": "#3b82f6", "xanh duong": "#3b82f6", "blue": "#3b82f6",
      "xanh lá": "#22c55e", "xanh la": "#22c55e", "green": "#22c55e",
      "xanh rêu": "#4d7c0f", "xanh reu": "#4d7c0f",
      "đỏ": "#dc2626", "do": "#dc2626", "red": "#dc2626",
      "cam": "#f97316", "orange": "#f97316",
      "vàng": "#eab308", "vang": "#eab308", "yellow": "#eab308",
      "hồng": "#ec4899", "hong": "#ec4899", "pink": "#ec4899",
      "tím": "#8b5cf6", "tim": "#8b5cf6", "purple": "#8b5cf6",
      "nâu": "#92400e", "nau": "#92400e", "brown": "#92400e",
      "be": "#d4b896", "kem": "#fef3c7",
      "xanh xám": "#64748b", "xanh xam": "#64748b",
      "xám xanh": "#64748b",
    };
    // Tìm khớp một phần
    for (const [key, hex] of Object.entries(map)) {
      if (n.includes(key) || key.includes(n)) return hex;
    }
    return "#e5e7eb"; // fallback
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (hasSizes && !selectedSize) { alert("Vui lòng chọn kích thước!"); return; }
    addToCart({ ...product, image: getImgUrl(product.image), size: selectedSize || "", color: selectedColor, quantity });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (hasSizes && !selectedSize) { alert("Vui lòng chọn kích thước!"); return; }
    addToCart({ ...product, image: getImgUrl(product.image), size: selectedSize || "", color: selectedColor, quantity });
    navigate("/cart");
  };

  if (loading) return (
    <div style={{ padding: "120px 20px", textAlign: "center" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid #e5e7eb", borderTop: "3px solid #001C40", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
      <p style={{ color: "#6b7280", fontSize: "14px" }}>Đang tải sản phẩm...</p>
    </div>
  );

  if (!product) return null;

  return (
    <div style={s.page}>
      {/* BREADCRUMB */}
      <div style={s.breadcrumb}>
        <Link to="/" style={s.breadLink}>Trang chủ</Link>
        <span style={s.sep}>/</span>
        <Link to="/collections/ao-nam" style={s.breadLink}>{product.Category?.name || "Sản phẩm"}</Link>
        <span style={s.sep}>/</span>
        <span style={s.breadCurrent}>{product.name}</span>
      </div>

      <div className="product-detail-layout">
        {/* ═══ CỘT ẢNH ═══ */}
        <div className="product-detail-image-col">
          {/* Thumbnails dọc bên trái */}
          {product_images.length > 1 && (
            <div className="product-detail-thumb-col">
              {product_images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setMainImage(img)}
                  style={{
                    width: "68px", height: "90px", cursor: "pointer",
                    borderRadius: "6px", overflow: "hidden", flexShrink: 0,
                    transition: "all 0.2s",
                    border: mainImage === img ? "2px solid #111" : "1.5px solid #e5e7eb",
                    opacity: mainImage === img ? 1 : 0.6,
                  }}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/68x90"; }} />
                </div>
              ))}
            </div>
          )}
          {/* Ảnh chính + nút prev/next */}
          <div className="product-detail-main-img" onClick={() => setZoomImg(!zoomImg)}>
            <img
              src={mainImage || product_images[0]}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", transform: zoomImg ? "scale(1.06)" : "scale(1)" }}
            />
            {product.label && <span style={s.labelBadge}>{product.label}</span>}
            {discountPct && <span style={s.discountBadge}>-{discountPct}%</span>}
            {isOutOfStock && (
              <div style={s.soldOutOverlay}>
                <span style={s.soldOutText}>HẾT HÀNG</span>
              </div>
            )}
            <i className="fa-solid fa-magnifying-glass-plus" style={{ position: "absolute", bottom: "10px", right: "10px", fontSize: "16px", opacity: 0.4, color: "#111" }} />

            {/* Nút Prev / Next */}
            {product_images.length > 1 && (() => {
              const curIdx = product_images.indexOf(mainImage);
              const hasPrev = curIdx > 0;
              const hasNext = curIdx < product_images.length - 1;
              const navBtn = (dir) => ({
                position: "absolute", top: "50%", transform: "translateY(-50%)",
                [dir === "prev" ? "left" : "right"]: "10px",
                zIndex: 5, background: "rgba(255,255,255,0.88)",
                border: "none", borderRadius: "50%",
                width: "36px", height: "36px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "background 0.2s",
                opacity: dir === "prev" ? (hasPrev ? 1 : 0.3) : (hasNext ? 1 : 0.3),
              });
              return (
                <>
                  <button
                    style={navBtn("prev")}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasPrev) setMainImage(product_images[curIdx - 1]);
                    }}
                  >
                    <i className="fa-solid fa-chevron-left" style={{ fontSize: "13px", color: "#111" }} />
                  </button>
                  <button
                    style={navBtn("next")}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasNext) setMainImage(product_images[curIdx + 1]);
                    }}
                  >
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: "13px", color: "#111" }} />
                  </button>
                  {/* Chỉ số ảnh */}
                  <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "999px", zIndex: 5, letterSpacing: "0.5px" }}>
                    {curIdx + 1} / {product_images.length}
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* ═══ CỘT THÔNG TIN ═══ */}
        <div style={s.infoCol}>
          <p style={s.catLabel}>{product.Category?.name || "DIEP COLLECTION"}</p>
          <h1 style={s.title}>{product.name}</h1>
          <div style={s.skuRow}>
            <span style={s.sku}>Mã SP: DC-{String(product.id).padStart(6, "0")}</span>
            <span style={{ ...s.stockBadge, background: isOutOfStock ? "#f3f4f6" : "#f3f4f6", color: isOutOfStock ? "#dc2626" : product.quantity < 10 ? "#b45309" : "#059669" }}>
              {isOutOfStock ? "Hết hàng" : product.quantity < 10 ? `Sắp hết (${product.quantity})` : "Còn hàng"}
            </span>
          </div>

          {/* Rating */}
          {avgStar > 0 && (
            <div style={s.ratingRow}>
              <StarRating value={Math.round(avgStar)} />
              <span style={s.ratingText}>{Number(avgStar).toFixed(1)} · {feedbacks.length} đánh giá</span>
            </div>
          )}

          {/* Giá */}
          <div style={s.priceRow}>
            <span style={{ ...s.price, color: isOutOfStock ? "#aaa" : "#111" }}>
              {Number(product.price).toLocaleString()}đ
            </span>
            {product.oldPrice && (
              <span style={s.oldPrice}>{Number(product.oldPrice).toLocaleString()}đ</span>
            )}
            {discountPct && <span style={s.discountTag}>-{discountPct}%</span>}
          </div>

          {/* ƯU ĐÃI ONLINE */}
          <div style={s.promoBox}>
            <div style={s.promoTitle}>
              <i className="fa-solid fa-gift" style={{ marginRight: "6px", color: "#d71920" }} />
              ƯU ĐÃI ONLINE
            </div>
            <ul style={s.promoList}>
              <li><i className="fa-solid fa-circle-dot" style={{ marginRight: "6px", color: "#f59e0b" }} />DIỆN MẶT ĐÓN HÈ – ƯU ĐÃI 20%</li>
              <li><i className="fa-solid fa-bolt" style={{ marginRight: "6px", color: "#f59e0b" }} />Áp dụng toàn bộ: Áo Thun & Polo, Quần Smart Jeans dài, Áo khoác Jeans</li>
              <li><i className="fa-solid fa-tag" style={{ marginRight: "6px", color: "#6b7280" }} />Nhập mã <strong>APR60</strong> GIẢM 60K đơn từ 799K</li>
              <li><i className="fa-solid fa-tag" style={{ marginRight: "6px", color: "#6b7280" }} />Nhập mã <strong>APR90</strong> GIẢM 90K đơn từ 1099K</li>
              <li><i className="fa-solid fa-truck" style={{ marginRight: "6px", color: "#059669" }} />FREESHIP đơn từ 399K</li>
            </ul>
          </div>

          {/* Màu sắc */}
          {colors.length > 0 && (
            <div style={s.optGroup}>
              <p style={s.optLabel}>
                MÀU SẮC: <strong style={{ color: "#1a1a1a" }}>{selectedColor || "Chưa chọn"}</strong>
              </p>
              <div style={s.colorRow}>
                {colors.map((c) => {
                  const isSelected = selectedColor === c;
                  const thumbImg = colorImageMap[c];
                  const hex = getColorHex(c);
                  const isLight = ["#f5f5f5", "#fef3c7", "#d4b896"].includes(hex);
                  return (
                    <button
                      key={c}
                      onClick={() => handleColorSelect(c)}
                      title={c}
                      style={{
                        width: "52px", height: "52px",
                        borderRadius: "50%",
                        padding: 0,
                        overflow: "hidden",
                        cursor: "pointer",
                        flexShrink: 0,
                        border: isSelected ? "2.5px solid #1a1a1a" : "1.5px solid #e5e7eb",
                        boxShadow: isSelected ? "0 0 0 3px rgba(0,0,0,0.15)" : "none",
                        transform: isSelected ? "scale(1.12)" : "scale(1)",
                        transition: "all 0.2s",
                        background: thumbImg ? "transparent" : hex,
                        position: "relative",
                      }}
                    >
                      {thumbImg ? (
                        <img
                          src={thumbImg}
                          alt={c}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          onError={(e) => { e.target.style.display = "none"; e.target.parentNode.style.background = hex; }}
                        />
                      ) : (
                        isSelected && (
                          <span style={{ color: isLight ? "#1a1a1a" : "#fff", fontSize: "12px", fontWeight: "900", lineHeight: 1 }}>✓</span>
                        )
                      )}
                      {isSelected && thumbImg && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <i className="fa-solid fa-check" style={{ color: "#fff", fontSize: "14px", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size — chỉ hiện khi sản phẩm có size */}
          {hasSizes && (
          <div style={s.optGroup}>
            <div style={s.optLabelRow}>
              <p style={s.optLabel}>KÍCH THƯỚC: <strong>{selectedSize || "Chưa chọn"}</strong></p>
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
                const isSelected = selectedSize === sz;
                const sizeOut = isSizeOut(sz);
                const sizeQty = getSizeQty(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => !sizeOut && setSelectedSize(sz)}
                    disabled={sizeOut}
                    title={sizeQty !== null ? `Còn ${sizeQty} cái` : ""}
                    style={{
                      ...s.sizeBtn,
                      background: isSelected ? "#001C40" : sizeOut ? "#f9fafb" : "#fff",
                      color: isSelected ? "#fff" : sizeOut ? "#d1d5db" : "#1a1a1a",
                      border: isSelected ? "1.5px solid #001C40" : sizeOut ? "1.5px solid #e5e7eb" : "1.5px solid #e5e7eb",
                      cursor: sizeOut ? "not-allowed" : "pointer",
                      position: "relative",
                      opacity: sizeOut ? 0.5 : 1,
                    }}
                  >
                    {sz}
                    {sizeOut && (
                      <span style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "#d1d5db", transform: "rotate(-20deg)" }} />
                    )}
                    {sizeQty !== null && sizeQty > 0 && sizeQty <= 5 && (
                      <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#f59e0b", color: "#fff", fontSize: "8px", fontWeight: "800", borderRadius: "999px", padding: "1px 4px", lineHeight: 1 }}>
                        {sizeQty}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedSize && getSizeQty(selectedSize) !== null && (
              <p style={{ fontSize: "12px", color: getSizeQty(selectedSize) <= 5 ? "#b45309" : "#059669", marginTop: "8px", fontWeight: "600" }}>
                {getSizeQty(selectedSize) === 0 ? "❌ Size này đã hết hàng" : getSizeQty(selectedSize) <= 5 ? `⚠️ Chỉ còn ${getSizeQty(selectedSize)} sản phẩm size ${selectedSize}` : `✅ Còn ${getSizeQty(selectedSize)} sản phẩm size ${selectedSize}`}
              </p>
            )}
          </div>
          )}

          {/* Số lượng + Thêm giỏ */}
          {!isOutOfStock ? (
            <>
              <div style={s.actionRow}>
                <div style={s.qtyCtrl}>
                  <button style={s.qBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span style={s.qNum}>{quantity}</span>
                  <button style={s.qBtn} onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}>+</button>
                </div>
                <button style={s.addBtn} onClick={handleAddToCart}>THÊM VÀO GIỎ HÀNG</button>
              </div>
              <button style={s.buyBtn} onClick={handleBuyNow}>MUA NGAY</button>
            </>
          ) : (
            <div style={s.outOfStockBox}>
              <p style={s.outOfStockText}>😔 Sản phẩm này hiện đã hết hàng</p>
              <p style={s.outOfStockSub}>Vui lòng quay lại sau hoặc chọn sản phẩm khác</p>
              <Link to="/" style={s.shopMoreBtn}>Xem sản phẩm khác</Link>
            </div>
          )}

          {/* Chính sách */}
          <div style={s.policies}>
            {[
              ["fa-solid fa-truck", "#059669", "Miễn phí ship đơn từ 399K"],
              ["fa-solid fa-rotate-left", "#2563eb", "Đổi hàng tận nhà 15 ngày"],
              ["fa-solid fa-circle-check", "#059669", "Hàng chính hãng 100%"],
            ].map(([icon, color, text], i) => (
              <div key={i} style={s.policyItem}>
                <i className={icon} style={{ color, fontSize: "14px", width: "18px", textAlign: "center" }} />
                <span style={s.policyText}>{text}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={s.tabs}>
            <div style={s.tabHeader}>
              {[["description", "Mô tả"], ["shipping", "Đổi trả"], ["reviews", `Đánh giá (${feedbacks.length})`]].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  style={{ ...s.tabBtn, borderBottom: activeTab === key ? "2px solid #001C40" : "2px solid transparent", color: activeTab === key ? "#001C40" : "#6b7280", fontWeight: activeTab === key ? "700" : "400" }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={s.tabBody}>
              {activeTab === "description" && (
                <p style={s.tabText}>{product.description || "Chất liệu cao cấp, form dáng chuẩn, bền màu sau nhiều lần giặt."}</p>
              )}
              {activeTab === "shipping" && (
                <div style={s.tabText}>
                  <p>• Miễn phí đổi trả trong vòng <strong>15 ngày</strong> đối với sản phẩm lỗi hoặc không vừa size.</p>
                  <p style={{ marginTop: "8px" }}>• Sản phẩm phải còn nguyên tag mác, chưa qua sử dụng.</p>
                  <p style={{ marginTop: "8px" }}>• Liên hệ hotline <strong>1900 xxxx</strong> để được hỗ trợ.</p>
                </div>
              )}
              {activeTab === "reviews" && (
                <div>
                  {feedbacks.length > 0 ? (
                    <div style={s.reviewList}>
                      {feedbacks.map((fb, i) => (
                        <div key={i} style={s.reviewItem}>
                          <div style={s.reviewHead}>
                            <div style={s.reviewAvatar}>{fb.User?.fullName?.charAt(0) || "K"}</div>
                            <div>
                              <p style={s.reviewName}>{fb.User?.fullName || "Khách hàng"}</p>
                              <StarRating value={fb.star} size={16} />
                            </div>
                            <span style={s.reviewDate}>
                              {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString("vi-VN") : ""}
                            </span>
                          </div>
                          {fb.content && <p style={s.reviewContent}>{fb.content}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#9ca3af", fontSize: "14px", padding: "16px 0" }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                  )}
                  <div style={s.reviewFormWrap}>
                    <h4 style={s.reviewFormTitle}>Viết đánh giá của bạn</h4>
                    {user ? (
                      <form onSubmit={handleSubmitReview}>
                        <div style={{ marginBottom: "12px" }}>
                          <p style={{ fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>ĐÁNH GIÁ</p>
                          <StarRating value={newReview.star} onChange={(v) => setNewReview({ ...newReview, star: v })} />
                        </div>
                        <textarea style={s.reviewTA} rows={3}
                          placeholder="Chia sẻ trải nghiệm của bạn..."
                          value={newReview.content}
                          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })} />
                        <button type="submit" style={s.reviewSubmitBtn} disabled={submittingReview}>
                          {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                        </button>
                      </form>
                    ) : (
                      <p style={{ fontSize: "13px", color: "#6b7280" }}>
                        <Link to="/login" style={{ color: "#001C40", fontWeight: "700" }}>Đăng nhập</Link> để viết đánh giá.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SẢN PHẨM CÙNG LOẠI ═══ */}
      {relatedProducts.length > 0 && (
        <div style={s.relatedSection}>
          <div style={s.relatedHeader}>
            <h2 style={s.relatedTitle}>SẢN PHẨM CÙNG LOẠI</h2>
            <span style={s.relatedSub}>{product.Category?.name}</span>
          </div>
          <div className="product-detail-related-grid">
            {relatedProducts.map((p) => {
              const img = getImgUrl(p.image);
              const hoverImg = (() => {
                try {
                  const g = JSON.parse(p.gallery || "[]");
                  return g[0] ? getImgUrl(g[0]) : null;
                } catch { return null; }
              })();
              const disc = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : null;
              return (
                <RelatedCard
                  key={p.id}
                  product={p}
                  img={img}
                  hoverImg={hoverImg}
                  disc={disc}
                  onClick={() => navigate(`/products/${p.slug || p.id}`)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ SIZE GUIDE MODAL ═══ */}
      {showSizeGuide && product.sizeGuide && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: "14px", padding: "24px", maxWidth: "700px", width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#111", margin: 0 }}>
                <i className="fa-solid fa-ruler" style={{ marginRight: "8px", color: "#001C40" }} />
                Hướng dẫn chọn size
              </h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", fontSize: "16px", color: "#555", display: "flex", alignItems: "center", justifyContent: "center" }}
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
    </div>
  );
};

const s = {
  page: { maxWidth: "1400px", margin: "0 auto", padding: "28px 24px 60px", fontFamily: "'Inter',sans-serif", background: "#fff" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#aaa", marginBottom: "28px", flexWrap: "wrap" },
  breadLink: { textDecoration: "none", color: "#aaa" },
  sep: { color: "#ddd" },
  breadCurrent: { color: "#333", fontWeight: "600" },

  // Badges on image
  labelBadge: { position: "absolute", top: "12px", left: "12px", background: "#111", color: "#fff", padding: "4px 10px", fontSize: "10px", fontWeight: "800", borderRadius: "3px", zIndex: 2, letterSpacing: "0.5px" },
  discountBadge: { position: "absolute", top: "12px", right: "12px", background: "#111", color: "#fff", padding: "4px 10px", fontSize: "11px", fontWeight: "700", borderRadius: "3px", zIndex: 2 },
  soldOutOverlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 },
  soldOutText: { color: "#fff", fontSize: "20px", fontWeight: "900", letterSpacing: "4px", border: "2px solid #fff", padding: "10px 24px" },
  zoomHint: { position: "absolute", bottom: "10px", right: "10px", fontSize: "16px", opacity: 0.4 },

  // Info column
  infoCol: { display: "flex", flexDirection: "column" },
  catLabel: { fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#111", marginBottom: "6px", lineHeight: "1.35" },
  skuRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" },
  sku: { fontSize: "12px", color: "#bbb" },
  stockBadge: { fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "999px" },
  ratingRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" },
  ratingText: { fontSize: "12px", color: "#888" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0", flexWrap: "wrap" },
  price: { fontSize: "26px", fontWeight: "800", color: "#111" },
  oldPrice: { fontSize: "15px", color: "#bbb", textDecoration: "line-through" },
  discountTag: { background: "#111", color: "#fff", padding: "3px 8px", borderRadius: "3px", fontSize: "11px", fontWeight: "700" },

  promoBox: { border: "1px dashed #ccc", borderRadius: "6px", padding: "12px 14px", marginBottom: "18px", background: "#fafafa" },
  promoTitle: { fontSize: "12px", fontWeight: "800", color: "#111", marginBottom: "8px", letterSpacing: "0.5px", textTransform: "uppercase" },
  promoList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "#555", lineHeight: "1.6" },

  optGroup: { marginBottom: "16px" },
  optLabel: { fontSize: "11px", fontWeight: "700", color: "#888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" },
  optLabelRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  sizeGuide: { fontSize: "11px", color: "#888", textDecoration: "underline", cursor: "pointer" },
  colorRow: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", padding: "4px 4px 4px 6px" },
  colorSwatch: { width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 },
  sizeRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  sizeBtn: { minWidth: "50px", height: "44px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", transition: "all 0.2s", padding: "0 12px" },

  actionRow: { display: "flex", gap: "10px", marginBottom: "10px" },
  qtyCtrl: { display: "flex", alignItems: "center", border: "1.5px solid #111", borderRadius: "6px", overflow: "hidden", height: "50px" },
  qBtn: { width: "40px", height: "50px", border: "none", background: "none", cursor: "pointer", fontSize: "18px", fontWeight: "300", color: "#111" },
  qNum: { width: "40px", textAlign: "center", fontWeight: "700", fontSize: "15px", color: "#111" },
  addBtn: { flex: 1, height: "50px", background: "#fff", color: "#111", border: "1.5px solid #111", borderRadius: "6px", fontWeight: "700", fontSize: "13px", cursor: "pointer", letterSpacing: "0.5px", transition: "all 0.2s" },
  buyBtn: { width: "100%", height: "50px", background: "#111", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "800", fontSize: "13px", cursor: "pointer", marginBottom: "16px", letterSpacing: "1px" },

  outOfStockBox: { background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", textAlign: "center", marginBottom: "16px" },
  outOfStockText: { fontSize: "14px", fontWeight: "700", color: "#333", marginBottom: "6px" },
  outOfStockSub: { fontSize: "12px", color: "#888", marginBottom: "14px" },
  shopMoreBtn: { display: "inline-block", padding: "10px 24px", background: "#111", color: "#fff", textDecoration: "none", borderRadius: "6px", fontWeight: "700", fontSize: "12px" },

  policies: { display: "flex", flexDirection: "column", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", marginBottom: "20px" },
  policyItem: { display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", padding: "9px 0", borderBottom: "1px solid #f5f5f5", color: "#555" },
  policyText: { color: "#555" },

  tabs: { marginTop: "4px" },
  tabHeader: { display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: "16px", overflowX: "auto" },
  tabBtn: { padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", transition: "all 0.2s", fontFamily: "inherit", whiteSpace: "nowrap" },
  tabBody: { fontSize: "14px", color: "#555", lineHeight: "1.8" },
  tabText: { color: "#666", lineHeight: "1.8", fontSize: "13px" },

  reviewList: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" },
  reviewItem: { padding: "12px 14px", background: "#fafafa", borderRadius: "8px", border: "1px solid #f0f0f0" },
  reviewHead: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" },
  reviewAvatar: { width: "32px", height: "32px", borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", flexShrink: 0 },
  reviewName: { fontSize: "13px", fontWeight: "600", marginBottom: "2px", color: "#111" },
  reviewDate: { marginLeft: "auto", fontSize: "11px", color: "#bbb" },
  reviewContent: { fontSize: "13px", color: "#666", marginTop: "4px", lineHeight: "1.6" },
  reviewFormWrap: { borderTop: "1px solid #e5e7eb", paddingTop: "16px", marginTop: "8px" },
  reviewFormTitle: { fontSize: "14px", fontWeight: "700", marginBottom: "14px", color: "#111" },
  reviewTA: { width: "100%", padding: "12px", border: "1.5px solid #e5e7eb", borderRadius: "6px", fontSize: "13px", outline: "none", resize: "vertical", fontFamily: "inherit", marginBottom: "10px", color: "#333" },
  reviewSubmitBtn: { padding: "10px 24px", background: "#111", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "13px" },

  relatedSection: { marginTop: "56px", paddingTop: "36px", borderTop: "1px solid #e5e7eb" },
  relatedHeader: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" },
  relatedTitle: { fontSize: "18px", fontWeight: "900", color: "#111", letterSpacing: "0.5px" },
  relatedSub: { fontSize: "11px", color: "#888", background: "#f3f4f6", padding: "3px 10px", borderRadius: "999px", fontWeight: "600" },

};

export default ProductDetail;