import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { productAPI } from "../../../services/api";
import { normalizeProduct } from "../../../hooks/useProducts";
import ProductCard from "../../../components/Product/ProductCard";
import QuickViewModal from "../../../components/Product/QuickViewModal";
import { useCart } from "../../../hooks/useCart";

// Danh sách nhóm con — slug khớp với route
const SUB_GROUPS = [
  { name: "Áo Thun",     slug: "ao-thun",     keywords: ["thun"],              img: "https://file.hstatic.net/1000360022/file/1__2__4a0c70e9dc6c4625b4e9861f813bca3b.jpg" },
  { name: "Áo Polo",     slug: "ao-polo",     keywords: ["polo"],              img: "https://file.hstatic.net/1000360022/file/2__3__917dd4cc92e94037b3314b0c9e10261b.jpg" },
  { name: "Áo Sơ Mi",    slug: "somi",        keywords: ["sơ mi","so mi","somi"], img: "https://file.hstatic.net/1000360022/file/3__1__93be8fffe191491da9be3dab5e7afec8.jpg" },
  { name: "Áo Khoác",    slug: "ao-khoac",    keywords: ["khoác","khoac"],     img: "https://file.hstatic.net/1000360022/file/4__1__0bb5123fe909417fa194f232ef6e1afb.jpg" },
  { name: "Áo Ba Lỗ",    slug: "ao-balo",     keywords: ["ba lỗ","tank"],      img: "https://file.hstatic.net/1000360022/file/5_f868b104dc514165865e4601fc50f6ad.jpg" },
  { name: "Áo Nỉ & Len", slug: "ao-ni-len",   keywords: ["nỉ","ni","len","sweater"], img: "https://file.hstatic.net/1000360022/file/6_cf59104249b24699974bcb49af249bda.jpg" },
  { name: "Hoodie",      slug: "ao-hoodie",   keywords: ["hoodie"],            img: "https://file.hstatic.net/1000360022/file/7_8a545eca5ca44ebc870f9ff5c247d87f.jpg" },
  { name: "Set Đồ",      slug: "setdo",       keywords: ["set"],               img: "https://file.hstatic.net/1000360022/file/7_copy.jpg" },
];

const AoNamPage = () => {
  const { subCategory } = useParams(); // undefined = tất cả áo nam
  const { addToCart } = useCart() || {};
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getAll({ limit: 200 });
        const raw = res.data?.data || res.data || [];
        setAllProducts(raw.map(normalizeProduct));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, []);

  // Lọc sản phẩm theo nhóm con đang chọn
  const filtered = useMemo(() => {
    const allAoKeywords = SUB_GROUPS.flatMap((g) => g.keywords);

    if (!subCategory) {
      // Tất cả áo nam = tất cả sản phẩm có categoryName chứa keyword của bất kỳ nhóm nào
      return allProducts.filter((p) => {
        const cat = (p.categoryName || "").toLowerCase();
        return allAoKeywords.some((kw) => cat.includes(kw.toLowerCase()));
      });
    }

    const group = SUB_GROUPS.find((g) => g.slug === subCategory);
    if (!group) return allProducts;

    return allProducts.filter((p) => {
      const cat = (p.categoryName || "").toLowerCase();
      return group.keywords.some((kw) => cat.includes(kw.toLowerCase()));
    });
  }, [allProducts, subCategory]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortOrder === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortOrder === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [filtered, sortOrder]);

  const currentGroup = SUB_GROUPS.find((g) => g.slug === subCategory);
  const pageTitle = currentGroup ? currentGroup.name.toUpperCase() : "TẤT CẢ ÁO NAM";

  return (
    <div style={s.container}>
      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroContent}>
          <nav style={s.breadcrumb}>
            <Link to="/" style={s.breadLink}>Trang chủ</Link>
            {" / "}
            <Link to="/collections/ao-nam" style={s.breadLink}>Áo Nam</Link>
            {currentGroup && <> / <strong>{currentGroup.name}</strong></>}
          </nav>
          <h1 style={s.heroTitle}>{pageTitle}</h1>
          <h2 style={s.heroSub}>DIEP COLLECTION</h2>
        </div>
        <div style={s.heroImgBox}>
          <img
            src={currentGroup?.img || "https://cdn.hstatic.net/files/1000360022/collection/ao-nam_0f93e80528b44fdca8d1ddce375892bd.jpg"}
            alt={pageTitle}
            style={s.heroImg}
          />
        </div>
      </div>

      {/* NHÓM CON — icon tròn */}
      <div style={s.subGroupWrap}>
        <div style={s.subGroupRow}>
          {/* Nút "Tất cả" */}
          <Link to="/collections/ao-nam" style={s.subGroupItem}>
            <div style={{
              ...s.subGroupCircle,
              border: !subCategory ? "2.5px solid #001C40" : "2px solid #e5e7eb",
              background: !subCategory ? "#f0f4ff" : "#fff",
            }}>
              <span style={{ fontSize: "22px" }}>👕</span>
            </div>
            <span style={{ ...s.subGroupLabel, fontWeight: !subCategory ? "700" : "400", color: !subCategory ? "#001C40" : "#6b7280" }}>
              Tất cả
            </span>
          </Link>

          {SUB_GROUPS.map((g) => (
            <Link key={g.slug} to={`/collections/${g.slug}`} style={s.subGroupItem}>
              <div style={{
                ...s.subGroupCircle,
                border: subCategory === g.slug ? "2.5px solid #001C40" : "2px solid #e5e7eb",
              }}>
                <img src={g.img} alt={g.name} style={s.subGroupImg} />
              </div>
              <span style={{ ...s.subGroupLabel, fontWeight: subCategory === g.slug ? "700" : "400", color: subCategory === g.slug ? "#001C40" : "#6b7280" }}>
                {g.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={s.toolbar}>
        <p style={s.count}>
          {loading ? "Đang tải..." : `${sorted.length} sản phẩm`}
        </p>
        <select style={s.select} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="default">Nổi bật</option>
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá: Thấp → Cao</option>
          <option value="price-desc">Giá: Cao → Thấp</option>
        </select>
      </div>

      {/* GRID SẢN PHẨM */}
      {loading ? (
        <div style={s.grid}>
          {Array(10).fill(0).map((_, i) => <div key={i} style={s.skeleton} />)}
        </div>
      ) : sorted.length > 0 ? (
        <div style={s.grid}>
          {sorted.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={(prod) => { setSelectedProduct(prod); setIsModalOpen(true); }}
            />
          ))}
        </div>
      ) : (
        <div style={s.empty}>
          <span style={{ fontSize: "56px" }}>👕</span>
          <p>Chưa có sản phẩm trong danh mục này.</p>
          <Link to="/collections/ao-nam" style={s.backBtn}>Xem tất cả áo nam</Link>
        </div>
      )}

      <QuickViewModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onAdd={addToCart}
      />
    </div>
  );
};

const s = {
  container: { width: "100%", backgroundColor: "#fff", fontFamily: "'Inter',sans-serif" },
  hero: { display: "flex", height: "420px", backgroundColor: "#f8f9fb", alignItems: "center", overflow: "hidden" },
  heroContent: { paddingLeft: "8%", flex: 1 },
  breadcrumb: { fontSize: "12px", color: "#888", marginBottom: "16px" },
  breadLink: { color: "#888", textDecoration: "none" },
  heroTitle: { fontSize: "52px", fontWeight: "900", color: "#001C40", margin: "0 0 8px" },
  heroSub: { fontSize: "22px", color: "#001C40", opacity: 0.5, fontWeight: "300", margin: 0 },
  heroImgBox: { flex: 1, height: "100%", display: "flex", justifyContent: "flex-end" },
  heroImg: { height: "100%", objectFit: "cover", maxWidth: "100%" },
  subGroupWrap: { padding: "32px 5% 0", borderBottom: "1px solid #f0f0f0" },
  subGroupRow: { display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "20px", flexWrap: "wrap" },
  subGroupItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textDecoration: "none", minWidth: "72px" },
  subGroupCircle: { width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", transition: "all 0.2s" },
  subGroupImg: { width: "100%", height: "100%", objectFit: "cover" },
  subGroupLabel: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" },
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 5%", borderBottom: "1px solid #f0f0f0" },
  count: { fontSize: "13px", color: "#6b7280", margin: 0 },
  select: { padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "13px", outline: "none", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "24px 16px", padding: "28px 5%" },
  skeleton: { aspectRatio: "3/4", background: "#f3f4f6", borderRadius: "8px" },
  empty: { textAlign: "center", padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", color: "#9ca3af" },
  backBtn: { display: "inline-block", padding: "12px 28px", background: "#001C40", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "700", fontSize: "13px" },
};

export default AoNamPage;
