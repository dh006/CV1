import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productAPI, categoryAPI, brandAPI, BASE_URL } from "../../../services/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newImages, setNewImages] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [sizeStockMap, setSizeStockMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [product, setProduct] = useState({
    name: "", price: "", oldPrice: "", quantity: "",
    categoryId: "", brandId: "", description: "", image: "",
    label: "", sizes: "", colors: "", gallery: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, brandRes] = await Promise.all([
          productAPI.getById(id),
          categoryAPI.getAll(),
          brandAPI.getAll(),
        ]);
        setProduct(prodRes.data);
        // Load sizeStock
        if (prodRes.data.sizeStock) {
          try { setSizeStockMap(JSON.parse(prodRes.data.sizeStock)); } catch {}
        } else if (prodRes.data.sizes) {
          // Tạo sizeStockMap từ sizes + quantity chia đều
          const sizeList = parseSizes(prodRes.data.sizes);
          if (sizeList.length > 0) {
            const perSize = Math.floor((prodRes.data.quantity || 0) / sizeList.length);
            const map = {};
            sizeList.forEach((sz) => { map[sz] = perSize; });
            setSizeStockMap(map);
          }
        }
        setCategories(catRes.data);
        setBrands(brandRes.data || []);
      } catch (err) {
        alert("Không tìm thấy sản phẩm!");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const addImages = useCallback((files) => {
    const imgs = Array.from(files).map((file) => ({
      file, preview: URL.createObjectURL(file), isMain: false, isHover: false, isUrl: false,
    }));
    setNewImages((prev) => {
      const combined = [...prev, ...imgs];
      if (!combined.some((i) => i.isMain) && combined.length > 0) combined[0].isMain = true;
      if (!combined.some((i) => i.isHover) && combined.length > 1) combined[1].isHover = true;
      return combined;
    });
  }, []);

  const addImageByUrl = () => {
    if (!urlInput.trim()) return;
    setNewImages((prev) => {
      const combined = [...prev, { file: null, preview: urlInput.trim(), isMain: false, isHover: false, isUrl: true }];
      if (!combined.some((i) => i.isMain)) combined[0].isMain = true;
      if (!combined.some((i) => i.isHover) && combined.length > 1) combined[1].isHover = true;
      return combined;
    });
    setUrlInput("");
  };

  const handleFileInput = (e) => addImages(e.target.files);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); addImages(e.dataTransfer.files); };

  const setMainNew = (idx) => {
    setNewImages((prev) => prev.map((img, i) => ({
      ...img, isMain: i === idx,
      isHover: img.isHover && i === idx ? false : img.isHover,
    })));
  };

  const setHoverNew = (idx) => {
    setNewImages((prev) => {
      const updated = prev.map((img, i) => ({ ...img, isHover: i === idx }));
      if (updated[idx].isMain) {
        updated[idx].isHover = false;
        const first = updated.find((img, i) => i !== idx);
        if (first) first.isHover = true;
      }
      return updated;
    });
  };

  const removeNew = (idx) => setNewImages((prev) => {
    const next = prev.filter((_, i) => i !== idx);
    if (prev[idx].isMain && next.length > 0) next[0].isMain = true;
    if (prev[idx].isHover && next.length > 1) {
      const firstNonMain = next.find((img) => !img.isMain);
      if (firstNonMain) firstNonMain.isHover = true;
    }
    return next;
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    ["name", "price", "oldPrice", "quantity", "categoryId", "brandId", "description", "label", "sizes", "colors"].forEach((k) => {
      if (product[k] !== undefined && product[k] !== null) formData.append(k, product[k]);
    });
    // Gửi sizeStock
    if (Object.keys(sizeStockMap).length > 0) {
      formData.append("sizeStock", JSON.stringify(sizeStockMap));
    }

    if (newImages.length > 0) {
      const mainImg = newImages.find((i) => i.isMain) || newImages[0];
      const hoverImg = newImages.find((i) => i.isHover && !i.isMain);
      const restImgs = newImages.filter((i) => i !== mainImg && i !== hoverImg);
      const sorted = [mainImg, ...(hoverImg ? [hoverImg] : []), ...restImgs];

      const fileImages = [];
      const remoteUrls = [];
      sorted.forEach((img) => {
        if (img.isUrl) remoteUrls.push(img.preview);
        else fileImages.push(img);
      });

      formData.append("mainIsUrl", mainImg.isUrl ? "true" : "false");
      fileImages.forEach((img) => formData.append("images", img.file));
      if (remoteUrls.length > 0) formData.append("remoteUrls", JSON.stringify(remoteUrls));
    }

    try {
      await productAPI.update(id, formData);
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 1000);
    } catch (err) {
      alert("❌ Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Parse gallery
  const parseGallery = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return []; }
  };

  const parseSizes = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return val.split(",").map((s) => s.trim()).filter(Boolean); }
  };

  const handleSizesChange = (val) => {
    setProduct((prev) => ({ ...prev, sizes: val }));
    const sizeList = val.split(",").map((s) => s.trim()).filter(Boolean);
    setSizeStockMap((prev) => {
      const next = {};
      sizeList.forEach((sz) => { next[sz] = prev[sz] ?? 0; });
      return next;
    });
  };

  const totalStock = Object.values(sizeStockMap).reduce((s, v) => s + (Number(v) || 0), 0);

  const currentMainImg = product.image
    ? (product.image.startsWith("http") ? product.image : `${BASE_URL}${product.image}`)
    : null;
  const galleryImgs = parseGallery(product.gallery).map((g) =>
    g.startsWith("http") ? g : `${BASE_URL}${g}`
  );

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.spinner} />
      <p style={{ color: "#6b7280", marginTop: "12px" }}>Đang tải sản phẩm...</p>
    </div>
  );

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Chỉnh sửa sản phẩm</h1>
          <p style={s.subtitle}>ID: #{id} — {product.name}</p>
        </div>
        <button onClick={() => navigate("/admin/products")} style={s.backBtn}>← Quay lại</button>
      </div>

      {success && (
        <div style={s.successBanner}>✅ Cập nhật thành công! Đang chuyển hướng...</div>
      )}

      <form onSubmit={handleUpdate} style={s.formGrid}>
        {/* LEFT */}
        <div style={s.leftCol}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>Thông tin cơ bản</h3>

            <div style={s.group}>
              <label style={s.label}>Tên sản phẩm *</label>
              <input style={s.input} type="text" value={product.name || ""}
                onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
            </div>

            <div style={s.row2}>
              <div style={s.group}>
                <label style={s.label}>Giá bán (đ) *</label>
                <input style={s.input} type="number" value={product.price || ""}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })} required />
              </div>
              <div style={s.group}>
                <label style={s.label}>Giá gốc (đ)</label>
                <input style={s.input} type="number" value={product.oldPrice || ""}
                  onChange={(e) => setProduct({ ...product, oldPrice: e.target.value })} />
              </div>
            </div>

            <div style={s.row2}>
              <div style={s.group}>
                <label style={s.label}>Số lượng kho *</label>
                <input style={s.input} type="number" value={product.quantity || ""}
                  onChange={(e) => setProduct({ ...product, quantity: e.target.value })} required />
              </div>
              <div style={s.group}>
                <label style={s.label}>Danh mục</label>
                <select style={s.input} value={product.categoryId || ""}
                  onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}>
                  <option value="">-- Chọn danh mục --</option>
                  <optgroup label="── Áo Nam ──">
                    {categories.filter(c => ["Áo Thun","Áo Polo","Áo Sơ Mi","Áo Khoác","Áo Nỉ & Len","Áo Hoodie","Tank Top - Áo Ba Lỗ"].includes(c.name))
                      .map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </optgroup>
                  <optgroup label="── Quần Nam ──">
                    {categories.filter(c => ["Quần Jean","Quần Short","Quần Kaki","Quần Jogger - Quần Dài","Quần Tây","Quần Boxer"].includes(c.name))
                      .map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </optgroup>
                  <optgroup label="── Phụ Kiện ──">
                    {categories.filter(c => ["Giày & Dép","Balo & Túi","Nón","Thắt Lưng","Vớ","Mắt Kính"].includes(c.name))
                      .map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </optgroup>
                  <optgroup label="── Khác ──">
                    {categories.filter(c => !["Áo Thun","Áo Polo","Áo Sơ Mi","Áo Khoác","Áo Nỉ & Len","Áo Hoodie","Tank Top - Áo Ba Lỗ","Quần Jean","Quần Short","Quần Kaki","Quần Jogger - Quần Dài","Quần Tây","Quần Boxer","Giày & Dép","Balo & Túi","Nón","Thắt Lưng","Vớ","Mắt Kính"].includes(c.name))
                      .map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </optgroup>
                </select>
              </div>
            </div>

            <div style={s.row2}>
              <div style={s.group}>
                <label style={s.label}>Nhãn (label)</label>
                <select style={s.input} value={product.label || ""}
                  onChange={(e) => setProduct({ ...product, label: e.target.value })}>
                  <option value="">-- Không có --</option>
                  <option value="NEW">🆕 NEW</option>
                  <option value="BEST SELLER">🔥 BEST SELLER</option>
                  <option value="SALE">💸 SALE</option>
                  <option value="LIMITED">⭐ LIMITED</option>
                </select>
              </div>
              <div style={s.group}>
                <label style={s.label}>Sizes (cách nhau bởi dấu phẩy)</label>
                <input style={s.input} type="text" placeholder="S,M,L,XL,2XL"
                  value={product.sizes || ""}
                  onChange={(e) => handleSizesChange(e.target.value)} />
              </div>
            </div>

            {/* TỒN KHO THEO SIZE */}
            {Object.keys(sizeStockMap).length > 0 && (
              <div style={s.group}>
                <label style={s.label}>
                  Tồn kho theo size — Tổng: <span style={{ color: "#059669", fontWeight: "800" }}>{totalStock} cái</span>
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {Object.entries(sizeStockMap).map(([sz, qty]) => (
                    <div key={sz} style={s.sizeStockItem}>
                      <span style={s.sizeStockLabel}>{sz}</span>
                      <input
                        type="number" min="0" value={qty}
                        onChange={(e) => setSizeStockMap((prev) => ({ ...prev, [sz]: Number(e.target.value) || 0 }))}
                        style={s.sizeStockInput}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* THƯƠNG HIỆU */}
            {brands.length > 0 && (
              <div style={s.group}>
                <label style={s.label}>Thương hiệu</label>
                <select style={s.input} value={product.brandId || ""}
                  onChange={(e) => setProduct({ ...product, brandId: e.target.value })}>
                  <option value="">-- Không có / Chính hãng --</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            )}

            <div style={s.group}>
              <label style={s.label}>Màu sắc (cách nhau bởi dấu phẩy)</label>
              <input style={s.input} type="text" placeholder="Đen,Trắng,Xanh Navy"
                value={product.colors || ""}
                onChange={(e) => setProduct({ ...product, colors: e.target.value })} />
            </div>

            <div style={s.group}>
              <label style={s.label}>Mô tả sản phẩm</label>
              <textarea style={{ ...s.input, minHeight: "100px", resize: "vertical" }}
                value={product.description || ""}
                onChange={(e) => setProduct({ ...product, description: e.target.value })} />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={s.rightCol}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>Hình ảnh sản phẩm</h3>

            {/* ẢNH HIỆN TẠI */}
            {(currentMainImg || galleryImgs.length > 0) && (
              <div style={s.currentImgsSection}>
                <p style={s.currentImgsLabel}>Ảnh hiện tại:</p>
                <div style={s.currentImgsGrid}>
                  {currentMainImg && (
                    <div style={s.currentImgItem}>
                      <img src={currentMainImg} alt="main" style={s.currentImg}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/80x106"; }} />
                      <span style={s.mainTag}>⭐</span>
                    </div>
                  )}
                  {galleryImgs.map((img, i) => (
                    <div key={i} style={s.currentImgItem}>
                      <img src={img} alt={`gallery-${i}`} style={s.currentImg}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/80x106"; }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NHẬP URL ẢNH */}
            <div style={s.group}>
              <label style={s.label}>Nhập link ảnh mới (URL)</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  style={s.input}
                  type="text"
                  placeholder="Dán link ảnh tại đây..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageByUrl())}
                />
                <button type="button" onClick={addImageByUrl} style={s.addUrlBtn}>Thêm</button>
              </div>
            </div>

            <div style={{ textAlign: "center", margin: "8px 0", fontSize: "12px", color: "#9ca3af" }}>— HOẶC —</div>

            {/* UPLOAD ẢNH MỚI */}
            <div
              style={{ ...s.dropZone, borderColor: dragOver ? "#001C40" : "#e5e7eb", background: dragOver ? "#f0f4ff" : "#f9fafb" }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <span style={{ fontSize: "28px" }}>📸</span>
              <p style={s.dropText}>Kéo thả hoặc</p>
              <label style={s.chooseBtn}>
                Chọn ảnh mới
                <input type="file" accept="image/*" multiple onChange={handleFileInput} style={{ display: "none" }} />
              </label>
              <p style={s.dropHint}>Tải lên sẽ thay thế ảnh cũ</p>
            </div>

            {/* PREVIEW ẢNH MỚI */}
            {newImages.length > 0 && (
              <div style={s.imgList}>
                {/* Preview dual: đại diện + hover */}
                {(newImages.find(i => i.isMain) || newImages.find(i => i.isHover)) && (
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                    {newImages.find(i => i.isMain) && (
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "11px", fontWeight: "700", color: "#001C40", marginBottom: "4px", textAlign: "center" }}>⭐ Đại diện</p>
                        <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: "8px", overflow: "hidden", background: "#f3f4f6" }}>
                          <img src={newImages.find(i => i.isMain).preview} alt="main" style={s.imgThumb} />
                        </div>
                      </div>
                    )}
                    {newImages.find(i => i.isHover && !i.isMain) && (
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "11px", fontWeight: "700", color: "#7c3aed", marginBottom: "4px", textAlign: "center" }}>🖱️ Hover</p>
                        <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: "8px", overflow: "hidden", background: "#f3f4f6" }}>
                          <img src={newImages.find(i => i.isHover && !i.isMain).preview} alt="hover" style={s.imgThumb} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <p style={s.imgListTitle}>{newImages.length} ảnh mới — ⭐ đại diện &nbsp;·&nbsp; 🖱️ hover</p>
                <div style={s.imgGrid}>
                  {newImages.map((img, i) => (
                    <div key={i} style={{ ...s.imgItem, border: img.isMain ? "2.5px solid #001C40" : img.isHover ? "2.5px solid #7c3aed" : "1.5px solid #e5e7eb" }}>
                      <img src={img.preview} alt="" style={s.imgThumb} />
                      {img.isMain && <div style={s.badgeMain}>⭐</div>}
                      {img.isHover && <div style={s.badgeHover}>🖱️</div>}
                      <div style={s.imgActions}>
                        {!img.isMain && (
                          <button type="button" onClick={() => setMainNew(i)} style={s.setMainBtn} title="Đặt làm ảnh đại diện">⭐</button>
                        )}
                        {!img.isHover && !img.isMain && (
                          <button type="button" onClick={() => setHoverNew(i)} style={s.setHoverBtn} title="Đặt làm ảnh hover">🖱️</button>
                        )}
                        <button type="button" onClick={() => removeNew(i)} style={s.removeBtn}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={s.actions}>
            <button type="button" onClick={() => navigate("/admin/products")} style={s.cancelBtn}>
              Hủy bỏ
            </button>
            <button type="submit" style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
              {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter', sans-serif" },
  loadingWrap: { minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #001C40", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  successBanner: { background: "#d1fae5", color: "#065f46", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontWeight: "600", fontSize: "14px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#1a1a1a", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  backBtn: { background: "#f3f4f6", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#374151" },
  formGrid: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px" },
  leftCol: {},
  rightCol: {},
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", marginBottom: "16px" },
  cardTitle: { fontSize: "14px", fontWeight: "700", color: "#1a1a1a", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" },
  group: { marginBottom: "16px" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit", backgroundColor: "#fafafa" },
  // Current images
  currentImgsSection: { marginBottom: "14px" },
  currentImgsLabel: { fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "8px" },
  currentImgsGrid: { display: "flex", gap: "8px", flexWrap: "wrap" },
  currentImgItem: { position: "relative", width: "72px", height: "96px", borderRadius: "6px", overflow: "hidden", border: "1.5px solid #e5e7eb" },
  currentImg: { width: "100%", height: "100%", objectFit: "cover" },
  mainTag: { position: "absolute", top: "3px", left: "3px", fontSize: "12px" },
  // Drop zone
  dropZone: { border: "2px dashed", borderRadius: "10px", padding: "20px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" },
  dropText: { fontSize: "13px", color: "#374151", margin: 0 },
  chooseBtn: { display: "inline-block", padding: "7px 16px", background: "#001C40", color: "#fff", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" },
  dropHint: { fontSize: "11px", color: "#9ca3af", margin: 0 },
  // New images
  imgList: { marginTop: "12px" },
  imgListTitle: { fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px" },
  imgGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" },
  imgItem: { position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "3/4", background: "#f3f4f6" },
  imgThumb: { width: "100%", height: "100%", objectFit: "cover" },
  badgeMain: { position: "absolute", top: "4px", left: "4px", fontSize: "13px", lineHeight: 1 },
  badgeHover: { position: "absolute", top: "4px", left: "22px", fontSize: "13px", lineHeight: 1 },
  mainTagNew: { position: "absolute", top: "4px", left: "4px", fontSize: "14px" },
  imgActions: { position: "absolute", top: "4px", right: "4px", display: "flex", gap: "4px" },
  setMainBtn: { width: "22px", height: "22px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px" },
  setHoverBtn: { width: "22px", height: "22px", background: "rgba(237,233,254,0.95)", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px" },
  removeBtn: { width: "22px", height: "22px", background: "rgba(220,38,38,0.85)", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "10px", fontWeight: "700" },
  actions: { display: "flex", gap: "12px" },
  cancelBtn: { flex: 1, padding: "12px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700", color: "#374151" },
  saveBtn: { flex: 2, padding: "12px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" },
  addUrlBtn: { padding: "10px 16px", background: "#001C40", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap" },
  sizeStockItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  sizeStockLabel: { fontSize: "11px", fontWeight: "800", color: "#001C40", background: "#e0e7ff", padding: "2px 10px", borderRadius: "4px" },
  sizeStockInput: { width: "60px", padding: "7px 6px", border: "1.5px solid #e5e7eb", borderRadius: "6px", fontSize: "14px", textAlign: "center", outline: "none", fontFamily: "inherit" },
};

export default EditProduct;
