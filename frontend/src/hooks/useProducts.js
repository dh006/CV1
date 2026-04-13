/**
 * Hook tái sử dụng để load sản phẩm từ API
 * Thay thế hoàn toàn constants/products.js
 */
import { useState, useEffect, useMemo } from "react";
import { productAPI, BASE_URL } from "../services/api";

// Chuẩn hoá sản phẩm từ DB
export const normalizeProduct = (p) => {
  const gallery = parseGallery(p.gallery);
  const resolveUrl = (url) =>
    url ? (url.startsWith("http") ? url : `${BASE_URL}${url}`) : null;

  // Ảnh hover = ảnh đầu tiên trong gallery (nếu có)
  const hoverImage = gallery.length > 0 ? resolveUrl(gallery[0]) : null;

  return {
    ...p,
    image: resolveUrl(p.image) || "https://via.placeholder.com/400x530?text=No+Image",
    hoverImage,
    gallery: gallery.map(resolveUrl),
    categoryName: p.Category?.name || p.categoryName || "",
    price: Number(p.price) || 0,
    oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
    slug: p.slug || String(p.id),
    sizes: parseSizesColors(p.sizes),
    colors: parseSizesColors(p.colors),
  };
};

function parseGallery(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

function parseSizesColors(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return val.split(",").map((s) => s.trim()).filter(Boolean); }
}

/**
 * Load tất cả sản phẩm từ API
 */
export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getAll({ limit: 200, ...params });
        if (!cancelled) {
          const raw = res.data?.data || res.data || [];
          setProducts(raw.map(normalizeProduct));
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [JSON.stringify(params)]);

  return { products, loading, error };
};

/**
 * Load sản phẩm theo tên danh mục (khớp linh hoạt)
 */
export const useProductsByCategory = (...categoryKeywords) => {
  const { products, loading, error } = useProducts();

  const filtered = useMemo(() => {
    if (!categoryKeywords.length) return products;
    return products.filter((p) => {
      const catName = (p.categoryName || "").toLowerCase();
      return categoryKeywords.some((kw) => catName.includes(kw.toLowerCase()));
    });
  }, [products, categoryKeywords.join(",")]);

  return { products: filtered, allProducts: products, loading, error };
};
