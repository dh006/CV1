import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI, categoryAPI, brandAPI } from "../../../services/api";

const getColorHex = (name) => {
  const n = (name || "").toLowerCase().trim();
  const map = {
    đen: "#1a1a1a",
    den: "#1a1a1a",
    black: "#1a1a1a",
    trắng: "#f0f0f0",
    trang: "#f0f0f0",
    white: "#f0f0f0",
    xám: "#9ca3af",
    xam: "#9ca3af",
    gray: "#9ca3af",
    "xanh navy": "#001C40",
    navy: "#001C40",
    "xanh dương": "#3b82f6",
    blue: "#3b82f6",
    "xanh lá": "#22c55e",
    green: "#22c55e",
    "xanh rêu": "#4d7c0f",
    đỏ: "#dc2626",
    do: "#dc2626",
    red: "#dc2626",
    cam: "#f97316",
    orange: "#f97316",
    vàng: "#eab308",
    vang: "#eab308",
    hồng: "#ec4899",
    hong: "#ec4899",
    pink: "#ec4899",
    tím: "#8b5cf6",
    tim: "#8b5cf6",
    purple: "#8b5cf6",
    nâu: "#92400e",
    nau: "#92400e",
    brown: "#92400e",
    be: "#d4b896",
    kem: "#fef3c7",
    "đen nâu": "#3d2b1f",
  };
  for (const [key, hex] of Object.entries(map)) {
    if (n === key || n.includes(key) || key.includes(n)) return hex;
  }
  return "#e5e7eb";
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    oldPrice: "",
    quantity: "",
    categoryId: "",
    brandId: "",
    description: "",
    label: "",
    sizes: "S,M,L,XL,2XL",
    colors: "",
  });

  // Mỗi ảnh: { file, preview, isUrl, colorTag }
  // colorTag = tên màu được gán (hoặc "" nếu chưa gán)
  const [images, setImages] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [colorList, setColorList] = useState([]);
  const [sizeStockMap, setSizeStockMap] = useState({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    "2XL": 0,
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([categoryAPI.getAll(), brandAPI.getAll()])
      .then(([catRes, brandRes]) => {
        setCategories(catRes.data);
        setBrands(brandRes.data || []);
      })
      .catch(console.error);
  }, []);

  const handleColorsChange = (val) => {
    setProduct((prev) => ({ ...prev, colors: val }));
    setColorList(
      val
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    );
  };

  const handleSizesChange = (val) => {
    setProduct((prev) => ({ ...prev, sizes: val }));
    const list = val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setSizeStockMap((prev) => {
      const next = {};
      list.forEach((sz) => {
        next[sz] = prev[sz] ?? 0;
      });
      return next;
    });
  };

  const totalStock = Object.values(sizeStockMap).reduce(
    (s, v) => s + (Number(v) || 0),
    0,
  );

  const addImages = useCallback((files) => {
    const newImgs = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isMain: false,
      isHover: false,
      isUrl: false,
      colorTag: "",
    }));
    setImages((prev) => {
      const combined = [...prev, ...newImgs];
      // Ảnh đầu tiên = main
      if (!combined.some((i) => i.isMain) && combined.length > 0)
        combined[0].isMain = true;
      // Ảnh thứ 2 = hover (chỉ khi có ít nhất 2 ảnh và chưa có hover)
      if (!combined.some((i) => i.isHover) && combined.length > 1) {
        const firstNonMain = combined.find((i) => !i.isMain);
        if (firstNonMain) firstNonMain.isHover = true;
      }
      return combined;
    });
  }, []);

  const addImageByUrl = () => {
    if (!urlInput.trim()) return;
    setImages((prev) => {
      const newImg = {
        file: null,
        preview: urlInput.trim(),
        isMain: false,
        isHover: false,
        isUrl: true,
        colorTag: "",
      };
      const combined = [...prev, newImg];
      if (!combined.some((i) => i.isMain)) combined[0].isMain = true;
      if (!combined.some((i) => i.isHover) && combined.length > 1) {
        const firstNonMain = combined.find((i) => !i.isMain);
        if (firstNonMain) firstNonMain.isHover = true;
      }
      return combined;
    });
    setUrlInput("");
  };

  const setMainImage = (idx) => {
    setImages((prev) => {
      const updated = prev.map((img, i) => ({
        ...img,
        isMain: i === idx,
        // Nếu ảnh này đang là hover thì bỏ hover
        isHover: i === idx ? false : img.isHover,
      }));
      // Nếu sau khi set main mà không còn hover → tự động set hover cho ảnh non-main đầu tiên
      if (!updated.some((i) => i.isHover) && updated.length > 1) {
        const firstNonMain = updated.find((i) => !i.isMain);
        if (firstNonMain) firstNonMain.isHover = true;
      }
      return updated;
    });
  };

  const setHoverImage = (idx) => {
    setImages((prev) => {
      // Không cho ảnh main đồng thời là hover
      if (prev[idx].isMain) return prev;
      return prev.map((img, i) => ({ ...img, isHover: i === idx }));
    });
  };

  const removeHover = (idx) => {
    setImages((prev) =>
      prev.map((img, i) => (i === idx ? { ...img, isHover: false } : img)),
    );
  };

  const setColorTag = (idx, color) => {
    setImages((prev) =>
      prev.map((img, i) => (i === idx ? { ...img, colorTag: color } : img)),
    );
  };

  const removeImage = (idx) => {
    setImages((prev) => {
      const wasMain = prev[idx].isMain;
      const wasHover = prev[idx].isHover;
      const next = prev.filter((_, i) => i !== idx);
      if (wasMain && next.length > 0) next[0].isMain = true;
      // Nếu xóa ảnh hover → tự set hover cho ảnh non-main đầu tiên còn lại
      if (wasHover && next.length > 1) {
        const firstNonMain = next.find((img) => !img.isMain);
        if (firstNonMain) firstNonMain.isHover = true;
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ảnh!");
      return;
    }
    setSaving(true);

    const formData = new FormData();
    Object.entries(product).forEach(([k, v]) => {
      if (v !== "") formData.append(k, v);
    });
    if (Object.keys(sizeStockMap).length > 0) {
      formData.append("sizeStock", JSON.stringify(sizeStockMap));
    }

    // Sắp xếp: nếu có colorTag → sắp theo thứ tự colorList
    // Ảnh main đứng đầu, hover thứ 2, còn lại theo sau
    let sorted;
    if (colorList.length > 0 && images.some((img) => img.colorTag)) {
      // Sắp theo thứ tự màu
      const byColor = {};
      colorList.forEach((c) => {
        byColor[c] = images.find((img) => img.colorTag === c);
      });
      const colorOrdered = colorList.map((c) => byColor[c]).filter(Boolean);
      const untagged = images.filter((img) => !img.colorTag);
      sorted = [...colorOrdered, ...untagged];
    } else {
      const mainImg = images.find((img) => img.isMain) || images[0];
      const hoverImg = images.find((img) => img.isHover && !img.isMain);
      const rest = images.filter((img) => img !== mainImg && img !== hoverImg);
      sorted = [mainImg, ...(hoverImg ? [hoverImg] : []), ...rest];
    }

    const fileImgs = [];
    const remoteUrls = [];
    sorted.forEach((img) => {
      if (img.isUrl) remoteUrls.push(img.preview);
      else fileImgs.push(img);
    });

    formData.append("mainIsUrl", sorted[0].isUrl ? "true" : "false");
    fileImgs.forEach((img) => formData.append("images", img.file));
    if (remoteUrls.length > 0)
      formData.append("remoteUrls", JSON.stringify(remoteUrls));

    try {
      await productAPI.create(formData);
      navigate("/admin/products");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const mainImg = images.find((img) => img.isMain) || images[0];
  const hoverImg = images.find((img) => img.isHover && !img.isMain);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Thêm sản phẩm mới</h1>
          <p style={s.subtitle}>
            Điền đầy đủ thông tin và tải lên nhiều ảnh sản phẩm
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          style={s.backBtn}
        >
          ← Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-add-grid">
        {/* ═══ LEFT: THÔNG TIN ═══ */}
        <div>
          <div style={s.card}>
            <h3 style={s.cardTitle}>Thông tin cơ bản</h3>

            <div style={s.group}>
              <label style={s.label}>Tên sản phẩm *</label>
              <input
                style={s.input}
                type="text"
                placeholder="VD: Áo Thun Cotton Premium"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                required
              />
            </div>

            <div style={s.row3}>
              <div style={s.group}>
                <label style={s.label}>Giá bán (đ) *</label>
                <input
                  style={s.input}
                  type="number"
                  placeholder="299000"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                  required
                />
              </div>
              <div style={s.group}>
                <label style={s.label}>Giá gốc (đ)</label>
                <input
                  style={s.input}
                  type="number"
                  placeholder="399000"
                  value={product.oldPrice}
                  onChange={(e) =>
                    setProduct({ ...product, oldPrice: e.target.value })
                  }
                />
              </div>
              <div style={s.group}>
                <label style={s.label}>Số lượng *</label>
                <input
                  style={{
                    ...s.input,
                    background:
                      Object.keys(sizeStockMap).length > 0
                        ? "#f3f4f6"
                        : "#fafafa",
                    color: "#6b7280",
                  }}
                  type="number"
                  placeholder="Tự tính từ tồn kho theo size"
                  value={
                    Object.keys(sizeStockMap).length > 0
                      ? totalStock
                      : product.quantity
                  }
                  onChange={(e) =>
                    Object.keys(sizeStockMap).length === 0 &&
                    setProduct({ ...product, quantity: e.target.value })
                  }
                  readOnly={Object.keys(sizeStockMap).length > 0}
                  required
                />
              </div>
            </div>

            <div style={s.row2}>
              <div style={s.group}>
                <label style={s.label}>Danh mục *</label>
                <select
                  style={s.input}
                  value={product.categoryId}
                  onChange={(e) =>
                    setProduct({ ...product, categoryId: e.target.value })
                  }
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  <optgroup label="── Áo Nam ──">
                    {categories
                      .filter((c) =>
                        [
                          "Áo Thun",
                          "Áo Polo",
                          "Áo Sơ Mi",
                          "Áo Khoác",
                          "Áo Nỉ & Len",
                          "Áo Hoodie",
                          "Tank Top - Áo Ba Lỗ",
                        ].includes(c.name),
                      )
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="── Quần Nam ──">
                    {categories
                      .filter((c) =>
                        [
                          "Quần Jean",
                          "Quần Short",
                          "Quần Kaki",
                          "Quần Jogger - Quần Dài",
                          "Quần Tây",
                          "Quần Boxer",
                        ].includes(c.name),
                      )
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="── Phụ Kiện ──">
                    {categories
                      .filter((c) =>
                        [
                          "Giày & Dép",
                          "Balo & Túi",
                          "Nón",
                          "Thắt Lưng",
                          "Vớ",
                          "Mắt Kính",
                        ].includes(c.name),
                      )
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="── Khác ──">
                    {categories
                      .filter(
                        (c) =>
                          ![
                            "Áo Thun",
                            "Áo Polo",
                            "Áo Sơ Mi",
                            "Áo Khoác",
                            "Áo Nỉ & Len",
                            "Áo Hoodie",
                            "Tank Top - Áo Ba Lỗ",
                            "Quần Jean",
                            "Quần Short",
                            "Quần Kaki",
                            "Quần Jogger - Quần Dài",
                            "Quần Tây",
                            "Quần Boxer",
                            "Giày & Dép",
                            "Balo & Túi",
                            "Nón",
                            "Thắt Lưng",
                            "Vớ",
                            "Mắt Kính",
                          ].includes(c.name),
                      )
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
              <div style={s.group}>
                <label style={s.label}>Nhãn sản phẩm</label>
                <select
                  style={s.input}
                  value={product.label}
                  onChange={(e) =>
                    setProduct({ ...product, label: e.target.value })
                  }
                >
                  <option value="">-- Không có --</option>
                  <option value="NEW">🆕 NEW — Hàng mới</option>
                  <option value="BEST SELLER">🔥 BEST SELLER — Bán chạy</option>
                  <option value="SALE">💸 SALE — Giảm giá</option>
                  <option value="LIMITED">⭐ LIMITED — Giới hạn</option>
                </select>
              </div>
            </div>

            {brands.length > 0 && (
              <div style={s.group}>
                <label style={s.label}>Thương hiệu</label>
                <select
                  style={s.input}
                  value={product.brandId}
                  onChange={(e) =>
                    setProduct({ ...product, brandId: e.target.value })
                  }
                >
                  <option value="">-- Không có / Chính hãng --</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={s.row2}>
              <div style={s.group}>
                <label style={s.label}>Sizes (cách nhau bởi dấu phẩy)</label>
                <input
                  style={s.input}
                  type="text"
                  placeholder="S,M,L,XL,2XL"
                  value={product.sizes}
                  onChange={(e) => handleSizesChange(e.target.value)}
                />
              </div>
              <div style={s.group}>
                <label style={s.label}>Màu sắc (cách nhau bởi dấu phẩy)</label>
                <input
                  style={s.input}
                  type="text"
                  placeholder="Đen,Trắng,Xanh Navy"
                  value={product.colors}
                  onChange={(e) => handleColorsChange(e.target.value)}
                />
              </div>
            </div>

            {/* TỒN KHO THEO SIZE */}
            {Object.keys(sizeStockMap).length > 0 && (
              <div style={s.group}>
                <label style={s.label}>
                  Tồn kho theo size — Tổng:{" "}
                  <span style={{ color: "#059669", fontWeight: "800" }}>
                    {totalStock} cái
                  </span>
                </label>
                <div style={s.sizeStockGrid}>
                  {Object.entries(sizeStockMap).map(([sz, qty]) => (
                    <div
                      key={sz}
                      style={{
                        ...s.sizeStockCard,
                        borderColor: qty > 0 ? "#001C40" : "#e5e7eb",
                        background: qty > 0 ? "#f0f4ff" : "#fafafa",
                      }}
                    >
                      <span style={s.sizeStockBadge}>{sz}</span>
                      <input
                        type="number"
                        min="0"
                        value={qty}
                        onChange={(e) =>
                          setSizeStockMap((prev) => ({
                            ...prev,
                            [sz]: Number(e.target.value) || 0,
                          }))
                        }
                        style={s.sizeStockInput}
                      />
                      <span style={{ fontSize: "10px", color: "#9ca3af" }}>
                        cái
                      </span>
                    </div>
                  ))}
                </div>
                <div style={s.totalStockBar}>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    Tổng tồn kho:
                  </span>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: totalStock > 0 ? "#059669" : "#dc2626",
                    }}
                  >
                    {totalStock} cái
                  </span>
                </div>
              </div>
            )}

            <div style={s.group}>
              <label style={s.label}>Mô tả sản phẩm</label>
              <textarea
                style={{ ...s.input, minHeight: "100px", resize: "vertical" }}
                placeholder="Chất liệu, form dáng, hướng dẫn bảo quản..."
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </div>
          </div>

          <div style={s.noteBox}>
            <p style={s.noteTitle}>💡 Nhãn sản phẩm hoạt động như thế nào?</p>
            <ul style={s.noteList}>
              <li>
                <strong>NEW</strong> → Hiện trong mục "Hàng mới" trên trang chủ
              </li>
              <li>
                <strong>BEST SELLER</strong> → Hiện trong mục "Bán chạy" (kết
                hợp với lượt mua)
              </li>
              <li>
                <strong>Áo Thun / Polo...</strong> → Tự động hiện theo danh mục
                đã chọn
              </li>
              <li>Mục "Bán chạy" sắp xếp theo số lượt mua thực tế</li>
            </ul>
          </div>
        </div>

        {/* ═══ RIGHT: ẢNH ═══ */}
        <div>
          <div style={s.card}>
            <h3 style={s.cardTitle}>Hình ảnh sản phẩm</h3>

            {/* PREVIEW ĐẠI DIỆN + HOVER */}
            {(mainImg || hoverImg) && (
              <div
                style={{ display: "flex", gap: "8px", marginBottom: "14px" }}
              >
                {mainImg && (
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#001C40",
                        marginBottom: "4px",
                        textAlign: "center",
                      }}
                    >
                      ⭐ Đại diện
                    </p>
                    <div style={s.mainPreviewWrap}>
                      <img
                        src={mainImg.preview}
                        alt="main"
                        style={s.mainPreviewImg}
                      />
                      {mainImg.colorTag && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "6px",
                            left: "6px",
                            background: getColorHex(mainImg.colorTag),
                            border: "2px solid #fff",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
                {hoverImg && (
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#7c3aed",
                        marginBottom: "4px",
                        textAlign: "center",
                      }}
                    >
                      🖱️ Hover
                    </p>
                    <div style={{ ...s.mainPreviewWrap, marginBottom: 0 }}>
                      <img
                        src={hoverImg.preview}
                        alt="hover"
                        style={s.mainPreviewImg}
                      />
                      {hoverImg.colorTag && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "6px",
                            left: "6px",
                            background: getColorHex(hoverImg.colorTag),
                            border: "2px solid #fff",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ô nhập URL */}
            <div style={s.group}>
              <label style={s.label}>Nhập link ảnh (URL)</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  style={s.input}
                  type="text"
                  placeholder="Dán link ảnh tại đây..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addImageByUrl())
                  }
                />
                <button
                  type="button"
                  onClick={addImageByUrl}
                  style={s.addUrlBtn}
                >
                  Thêm
                </button>
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                margin: "8px 0",
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              — HOẶC —
            </div>

            {/* UPLOAD ZONE */}
            <div
              style={{
                ...s.dropZone,
                borderColor: dragOver ? "#001C40" : "#e5e7eb",
                background: dragOver ? "#f0f4ff" : "#f9fafb",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addImages(e.dataTransfer.files);
              }}
            >
              <span style={{ fontSize: "32px" }}>📸</span>
              <p style={s.dropText}>Kéo thả ảnh vào đây hoặc</p>
              <label style={s.chooseBtn}>
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => addImages(e.target.files)}
                  style={{ display: "none" }}
                />
              </label>
              <p style={s.dropHint}>JPG, PNG, WEBP — tối đa 5MB/ảnh</p>
            </div>

            {/* GRID ẢNH + GÁN MÀU */}
            {images.length > 0 && (
              <div style={s.imgList}>
                {/* Preview ảnh đại diện + hover */}
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "14px" }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#001C40",
                        marginBottom: "6px",
                        textAlign: "center",
                      }}
                    >
                      ⭐ Ảnh đại diện
                    </p>
                    <div
                      style={{
                        aspectRatio: "3/4",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#f3f4f6",
                        border: "2px solid #001C40",
                      }}
                    >
                      {mainImg ? (
                        <img
                          src={mainImg.preview}
                          alt="main"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#9ca3af",
                            fontSize: "12px",
                          }}
                        >
                          Chưa có
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#7c3aed",
                        marginBottom: "6px",
                        textAlign: "center",
                      }}
                    >
                      🖱️ Ảnh hover
                    </p>
                    <div
                      style={{
                        aspectRatio: "3/4",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#f3f4f6",
                        border: "2px solid #7c3aed",
                      }}
                    >
                      {hoverImg ? (
                        <img
                          src={hoverImg.preview}
                          alt="hover"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#9ca3af",
                            fontSize: "12px",
                          }}
                        >
                          Chưa có
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p style={s.imgListTitle}>
                  {images.length} ảnh — click ⭐ đặt đại diện · 🖱️ đặt hover
                  {colorList.length > 0 && (
                    <span style={{ color: "#7c3aed" }}>
                      {" "}
                      · dropdown gán màu
                    </span>
                  )}
                </p>
                <div className="admin-img-grid">
                  {images.map((img, i) => {
                    const hex = img.colorTag ? getColorHex(img.colorTag) : null;
                    const isLight =
                      hex &&
                      ["#f0f0f0", "#fef3c7", "#d4b896", "#e5e7eb"].includes(
                        hex,
                      );
                    return (
                      <div
                        key={i}
                        style={{
                          ...s.imgItem,
                          border: img.isMain
                            ? "2.5px solid #001C40"
                            : img.isHover
                              ? "2.5px solid #7c3aed"
                              : "1.5px solid #e5e7eb",
                        }}
                      >
                        <img
                          src={img.preview}
                          alt={`img-${i}`}
                          style={s.imgThumb}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x106";
                          }}
                        />
                        {/* Badges */}
                        {img.isMain && <div style={s.badgeMain}>⭐</div>}
                        {img.isHover && <div style={s.badgeHover}>🖱️</div>}
                        {/* Dot màu */}
                        {hex && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: colorList.length > 0 ? "26px" : "4px",
                              left: "4px",
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              background: hex,
                              border: isLight
                                ? "1.5px solid #ccc"
                                : "1.5px solid rgba(255,255,255,0.8)",
                            }}
                          />
                        )}
                        {/* Action buttons */}
                        <div style={s.imgActions}>
                          {!img.isMain && (
                            <button
                              type="button"
                              onClick={() => setMainImage(i)}
                              style={s.setMainBtn}
                              title="Đặt làm ảnh đại diện"
                            >
                              ⭐
                            </button>
                          )}
                          {!img.isHover && !img.isMain && (
                            <button
                              type="button"
                              onClick={() => setHoverImage(i)}
                              style={s.setHoverBtn}
                              title="Đặt làm ảnh hover"
                            >
                              🖱️
                            </button>
                          )}
                          {img.isHover && (
                            <button
                              type="button"
                              onClick={() => removeHover(i)}
                              style={{
                                ...s.setHoverBtn,
                                background: "rgba(124,58,237,0.15)",
                              }}
                              title="Bỏ hover"
                            >
                              🚫
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            style={s.removeBtn}
                            title="Xóa"
                          >
                            ✕
                          </button>
                        </div>
                        {/* Dropdown gán màu */}
                        {colorList.length > 0 && (
                          <select
                            value={img.colorTag || ""}
                            onChange={(e) => setColorTag(i, e.target.value)}
                            style={s.colorTagSelect}
                            title="Gán màu cho ảnh này"
                          >
                            <option value="">— màu —</option>
                            {colorList.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
                {colorList.length > 0 && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#7c3aed",
                      marginTop: "8px",
                    }}
                  >
                    🎨 Gán màu → user chọn màu nào thì ảnh đó hiện lên
                  </p>
                )}
              </div>
            )}
          </div>

          <div style={s.actionRow}>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              style={s.cancelBtn}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "✅ Thêm sản phẩm"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter',sans-serif" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  backBtn: {
    background: "#f3f4f6",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },
  grid: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f3f4f6",
  },
  group: { marginBottom: "16px" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    backgroundColor: "#fafafa",
  },
  noteBox: {
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: "10px",
    padding: "14px 16px",
  },
  noteTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#0369a1",
    marginBottom: "8px",
  },
  noteList: {
    fontSize: "12px",
    color: "#374151",
    lineHeight: "1.8",
    paddingLeft: "16px",
    margin: 0,
  },
  // Size stock
  sizeStockGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: "10px",
    marginBottom: "12px",
  },
  sizeStockCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "10px 8px",
    border: "1.5px solid",
    borderRadius: "10px",
    transition: "all 0.2s",
  },
  sizeStockBadge: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#001C40",
    background: "#e0e7ff",
    padding: "3px 12px",
    borderRadius: "6px",
    letterSpacing: "0.5px",
  },
  sizeStockInput: {
    width: "100%",
    padding: "6px 4px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "700",
    textAlign: "center",
    outline: "none",
    fontFamily: "inherit",
    color: "#1a1a1a",
  },
  totalStockBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
  },
  // Image section
  mainPreviewWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "3/4",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "14px",
    background: "#f3f4f6",
  },
  mainPreviewImg: { width: "100%", height: "100%", objectFit: "cover" },
  addUrlBtn: {
    padding: "10px 16px",
    background: "#001C40",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  dropZone: {
    border: "2px dashed",
    borderRadius: "10px",
    padding: "24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  dropText: { fontSize: "13px", color: "#374151", margin: 0 },
  chooseBtn: {
    display: "inline-block",
    padding: "8px 20px",
    background: "#001C40",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
  dropHint: { fontSize: "11px", color: "#9ca3af", margin: 0 },
  imgList: { marginTop: "14px" },
  imgListTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "10px",
  },
  imgGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
  },
  imgItem: {
    position: "relative",
    borderRadius: "8px",
    overflow: "hidden",
    aspectRatio: "3/4",
    background: "#f3f4f6",
  },
  imgThumb: { width: "100%", height: "100%", objectFit: "cover" },
  badgeMain: {
    position: "absolute",
    top: "4px",
    left: "4px",
    fontSize: "13px",
    lineHeight: 1,
  },
  badgeHover: {
    position: "absolute",
    top: "4px",
    left: "22px",
    fontSize: "13px",
    lineHeight: 1,
  },
  imgActions: {
    position: "absolute",
    top: "4px",
    right: "4px",
    display: "flex",
    gap: "3px",
  },
  setMainBtn: {
    width: "22px",
    height: "22px",
    background: "rgba(255,255,255,0.92)",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  setHoverBtn: {
    width: "22px",
    height: "22px",
    background: "rgba(237,233,254,0.95)",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtn: {
    width: "22px",
    height: "22px",
    background: "rgba(220,38,38,0.85)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  colorTagSelect: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    fontSize: "10px",
    border: "none",
    background: "rgba(0,0,0,0.55)",
    color: "#fff",
    padding: "3px 4px",
    cursor: "pointer",
    outline: "none",
    fontFamily: "inherit",
    textAlign: "center",
  },
  // Actions
  actionRow: { display: "flex", gap: "12px" },
  cancelBtn: {
    flex: 1,
    padding: "13px",
    background: "#f3f4f6",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
    color: "#374151",
  },
  saveBtn: {
    flex: 2,
    padding: "13px",
    background: "#001C40",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
  },
};

export default AddProduct;
