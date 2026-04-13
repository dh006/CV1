import React, { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { productAPI, bannerAPI, newsAPI, BASE_URL } from "../../../services/api";
import { normalizeProduct } from "../../../hooks/useProducts";
import ProductCard from "../../../components/Product/ProductCard";
import QuickViewModal from "../../../components/Product/QuickViewModal";
import { useCart } from "../../../hooks/useCart";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Fallback banners nếu DB chưa có
const FALLBACK_BANNERS = [
  "https://cdn.hstatic.net/files/1000360022/file/2500x991_-_banner_web_d_nh_v__jeans_-_ngang.jpg",
  "https://cdn.hstatic.net/files/1000360022/file/2048x813_-_banner_web_fall_winter_25_-_ngang.jpg",
];

const tabBanners = {
  "Hàng mới": "https://cdn.hstatic.net/files/1000360022/file/08_-_nh_m_s_n_ph_m_h_ng_m_i_-_600x1000.jpg",
  "Bán chạy": "https://cdn.hstatic.net/files/1000360022/file/08_-_nh_m_s_n_ph_m_h_ng_b_n_ch_y_-_600x1000.jpg",
  "Đồ Đông": "https://cdn.hstatic.net/files/1000360022/file/08_-_nh_m_s_n_ph_m_d__d_ng_-_600x1000.jpg",
  "Áo Thun": "https://cdn.hstatic.net/files/1000360022/file/08_-_nh_m_s_n_ph_m__o_thun_-_600x1000.jpg",
  "Áo Sơ mi": "https://cdn.hstatic.net/files/1000360022/file/ao-so-mi-pc_5d63c1995de745649302fa9b12aed2aa.jpg",
  "Áo Polo": "https://cdn.hstatic.net/files/1000360022/file/08_-_nh_m_s_n_ph_m__o_polo_-_600x1000.jpg",
  "Quần Short": "https://cdn.hstatic.net/files/1000360022/file/08_-_nh_m_s_n_ph_m_qu_n_short_-_600x1000.jpg",
  "Quần Jean": "https://cdn.hstatic.net/files/1000360022/file/08_-_nh_m_s_n_ph_m_qu_n_jeans_-_600x1000.jpg",
  "Quần Tây": "https://cdn.hstatic.net/files/1000360022/file/08_-_nh_m_s_n_ph_m_qu_n_t_y_-_600x1000.jpg",
};

const Home = () => {
  const { addToCart } = useCart() || {};
  const [allProducts, setAllProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeJeansTab, setActiveJeansTab] = useState("all");
  const [rowTabs, setRowTabs] = useState({
    row1: "Hàng mới",
    row2: "Áo Thun",
    row3: "Quần Tây",
  });

  // ── Load sản phẩm, banner, news từ API ──────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, bannerRes, newsRes] = await Promise.all([
          productAPI.getAll({ limit: 200 }),
          bannerAPI.getAll(),
          newsAPI.getAll(),
        ]);
        const raw = prodRes.data?.data || prodRes.data || [];
        setAllProducts(raw.map(normalizeProduct));

        // Banner từ DB (chỉ lấy banner đang hiển thị status=1)
        const dbBanners = (bannerRes.data || []).filter((b) => b.status === 1);
        setBanners(dbBanners.length > 0 ? dbBanners : []);
        setNews((newsRes.data || []).slice(0, 3));
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isModalOpen]);

  // ── Phân loại sản phẩm theo tên danh mục ─────────────────────────────────
  const productData = useMemo(() => {
    const byCategory = (...keywords) =>
      allProducts.filter((p) => {
        const catName = (p.categoryName || "").toLowerCase();
        return keywords.some((kw) => catName.includes(kw.toLowerCase()));
      });

    return {
      "Quần Jean":  byCategory("jean", "jeans"),
      // Hàng mới = label NEW (admin đặt khi thêm sản phẩm)
      "Hàng mới":   allProducts.filter((p) =>
        p.label === "NEW" || p.label === "new" || p.label === "New"
      ),
      // Bán chạy = sắp xếp theo buyTurn (số lượt mua thực tế)
      "Bán chạy":   allProducts
        .filter((p) => (p.buyTurn || 0) > 0 || p.label === "BEST SELLER")
        .sort((a, b) => (b.buyTurn || 0) - (a.buyTurn || 0)),
      "Áo Thun":    byCategory("thun"),
      "Áo Sơ mi":   byCategory("sơ mi", "so mi", "somi"),
      "Áo Polo":    byCategory("polo"),
      "Quần Short": byCategory("short"),
      "Quần Tây":   byCategory("tây", "tay"),
      "Đồ Đông":    byCategory("khoác", "khoac", "nỉ", "ni", "len", "hoodie", "sweater"),
    };
  }, [allProducts]);

  const openQuickView = (prod) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  // ── Component hàng sản phẩm + banner ─────────────────────────────────────
  const ProductRowWithBanner = ({ rowKey, tabList }) => {
    const currentTab = rowTabs[rowKey];
    const displayProducts = productData[currentTab] || [];
    const currentBanner = tabBanners[currentTab] || tabBanners["Bán chạy"];

    return (
      <div style={st.sectionRow}>
        <div style={st.sectionHeader}>
          <div style={st.subTabs}>
            {tabList.map((tab) => (
              <span
                key={tab}
                onClick={() => setRowTabs((prev) => ({ ...prev, [rowKey]: tab }))}
                style={{
                  ...st.subTabItem,
                  fontWeight: currentTab === tab ? "bold" : "normal",
                  borderBottom: currentTab === tab ? "2px solid #000" : "none",
                  color: currentTab === tab ? "#000" : "#999",
                }}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>

        <div style={st.rowGrid}>
          <div style={st.leftBannerContainer}>
            <img src={currentBanner} alt={currentTab} style={st.leftBannerImg} />
            <div style={st.bannerOverlay}>
              <h2 style={st.bannerTitleText}>{currentTab.toUpperCase()}</h2>
              <button style={st.btnXemNgay}>XEM NGAY</button>
            </div>
          </div>

          <div style={st.rightProductGrid}>
            {displayProducts.length === 0 ? (
              <div style={st.emptyCategory}>
                <p>Chưa có sản phẩm trong danh mục này</p>
              </div>
            ) : (
              displayProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={openQuickView} />
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Skeleton loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={st.container}>
        <div style={st.skeletonBanner} />
        <div style={st.skeletonGrid}>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} style={st.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  const jeanProducts = productData["Quần Jean"] || [];

  return (
    <div style={st.container}>
      {/* BANNER CHÍNH — từ DB hoặc fallback */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        style={st.swiper}
      >
        {(banners.length > 0 ? banners : FALLBACK_BANNERS).map((item, i) => {
          const imgUrl = typeof item === "string"
            ? item
            : (item.image?.startsWith("http") ? item.image : `${BASE_URL}${item.image}`);
          return (
            <SwiperSlide key={i}>
              <img src={imgUrl} alt={typeof item === "object" ? item.name : "banner"} style={st.bannerImg}
                onError={(e) => { e.target.src = FALLBACK_BANNERS[0]; }} />
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* DỊCH VỤ */}
      <div style={st.serviceBar}>
        {[
          { icon: "https://file.hstatic.net/1000360022/file/giaohangnhanh_abaa5d524e464a0c8547a91ad9b50968.png", title: "Miễn phí vận chuyển", desc: "Đơn từ 399K" },
          { icon: "https://file.hstatic.net/1000360022/file/giaohang_2943ae148bf64680bf20c3d881c898c9.png", title: "Đổi hàng tận nhà", desc: "Trong vòng 15 ngày" },
          { icon: "https://file.hstatic.net/1000360022/file/cod_5631433f0ad24c949e44e512b8535c43.png", title: "Thanh toán COD", desc: "Yên tâm mua sắm" },
        ].map((s, i) => (
          <div key={i} style={st.serviceItem}>
            <img src={s.icon} style={st.iconImg} alt="icon" />
            <div>
              <strong style={st.serviceTitle}>{s.title}</strong>
              <p style={st.serviceDesc}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TẤT CẢ SẢN PHẨM MỚI NHẤT */}
      <div style={st.sectionRow}>
        <div style={st.sectionTitleRow}>
          <h2 style={st.mainTitle}>SẢN PHẨM MỚI NHẤT</h2>
          <Link to="/new" style={st.viewAllLink}>Xem tất cả →</Link>
        </div>
        {allProducts.length === 0 ? (
          <div style={st.emptyAll}>
            <span style={{ fontSize: "48px" }}>👕</span>
            <p>Chưa có sản phẩm nào. Hãy thêm sản phẩm từ trang Admin!</p>
          </div>
        ) : (
          <div style={st.productGrid}>
            {allProducts.slice(0, 10).map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={openQuickView} />
            ))}
          </div>
        )}
      </div>

      {/* JEANS UNIVERSE */}
      {jeanProducts.length > 0 && (
        <>
          <h2 style={{ ...st.mainTitle, marginTop: "40px" }}>JEANS UNIVERSE</h2>
          <div style={st.tabSection}>
            <div style={st.tabContainer}>
              {["all", "light", "cool", "soft", "stretch"].map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveJeansTab(id)}
                  style={{
                    ...st.tabButton,
                    backgroundColor: activeJeansTab === id ? "#000" : "#fff",
                    color: activeJeansTab === id ? "#fff" : "#000",
                  }}
                >
                  {id === "all" ? "TẤT CẢ" : id.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div style={st.productGrid}>
            {(activeJeansTab === "all"
              ? jeanProducts
              : jeanProducts.filter((p) => p.category === activeJeansTab)
            ).map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={openQuickView} />
            ))}
          </div>
        </>
      )}

      <ProductRowWithBanner rowKey="row1" tabList={["Hàng mới", "Bán chạy", "Đồ Đông"]} />
      <ProductRowWithBanner rowKey="row2" tabList={["Áo Thun", "Áo Sơ mi", "Áo Polo"]} />
      <ProductRowWithBanner rowKey="row3" tabList={["Quần Tây", "Quần Jean", "Quần Short"]} />

      {/* TIN TỨC — chỉ hiện nếu có data từ DB */}
      {news.length > 0 && (
        <div style={st.sectionRow}>
          <div style={st.sectionTitleRow}>
            <h2 style={st.mainTitle}>TIN TỨC & XU HƯỚNG</h2>
            <Link to="/news" style={st.viewAllLink}>Xem tất cả →</Link>
          </div>
          <div style={st.newsGrid}>
            {news.map((n) => {
              const imgUrl = n.image
                ? (n.image.startsWith("http") ? n.image : `${BASE_URL}${n.image}`)
                : "https://via.placeholder.com/400x250?text=News";
              return (
                <div key={n.id} style={st.newsCard}>
                  <div style={st.newsImgWrap}>
                    <img src={imgUrl} alt={n.title} style={st.newsImg}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x250?text=News"; }} />
                  </div>
                  <div style={st.newsInfo}>
                    <p style={st.newsDate}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString("vi-VN") : ""}
                    </p>
                    <h3 style={st.newsTitle}>{n.title}</h3>
                    {n.content && (
                      <p style={st.newsExcerpt}>
                        {n.content.substring(0, 100)}{n.content.length > 100 ? "..." : ""}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <QuickViewModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onAdd={addToCart}
      />

      <button
        style={st.backTop}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Lên đầu trang"
      >
        ︿
      </button>
    </div>
  );
};

const st = {
  container: { width: "100%", backgroundColor: "#fff", paddingBottom: "80px", fontFamily: "'Inter', sans-serif" },
  swiper: { width: "100%" },
  bannerImg: { width: "100%", display: "block" },

  // Skeleton
  skeletonBanner: { width: "100%", height: "400px", background: "#f3f4f6", animation: "pulse 1.5s ease-in-out infinite" },
  skeletonGrid: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "20px", padding: "40px 4%" },
  skeletonCard: { aspectRatio: "3/4", background: "#f3f4f6", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" },

  serviceBar: { display: "flex", justifyContent: "center", gap: "60px", padding: "28px 5%", borderBottom: "1px solid #f0f0f0", flexWrap: "wrap" },
  serviceItem: { display: "flex", alignItems: "center", gap: "12px" },
  iconImg: { width: "40px" },
  serviceTitle: { fontSize: "13px", textTransform: "uppercase", fontWeight: "700", display: "block" },
  serviceDesc: { fontSize: "12px", color: "#888", margin: 0 },

  sectionRow: { padding: "40px 4%", maxWidth: "1600px", margin: "0 auto" },
  sectionTitleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  mainTitle: { textAlign: "center", fontWeight: "900", fontSize: "26px", margin: "0" },
  viewAllLink: { fontSize: "13px", color: "#001C40", textDecoration: "none", fontWeight: "600" },

  productGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px" },

  tabSection: { display: "flex", justifyContent: "center", margin: "20px 0" },
  tabContainer: { display: "flex", border: "1px solid #eee", borderRadius: "50px", overflow: "hidden", backgroundColor: "#fff" },
  tabButton: { border: "none", padding: "10px 22px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", transition: "0.3s" },

  sectionHeader: { display: "flex", justifyContent: "flex-end", borderBottom: "2px solid #f5f5f5", marginBottom: "25px" },
  subTabs: { display: "flex", gap: "30px" },
  subTabItem: { paddingBottom: "10px", cursor: "pointer", fontSize: "15px", textTransform: "uppercase", transition: "0.2s" },

  rowGrid: { display: "grid", gridTemplateColumns: "minmax(260px, 1fr) 4fr", gap: "24px" },
  leftBannerContainer: { position: "relative", borderRadius: "10px", overflow: "hidden" },
  leftBannerImg: { width: "100%", height: "100%", objectFit: "cover" },
  bannerOverlay: { position: "absolute", bottom: "10%", width: "100%", textAlign: "center", color: "#fff", zIndex: 2 },
  bannerTitleText: { fontSize: "28px", fontWeight: "900", marginBottom: "12px", textShadow: "0 2px 4px rgba(0,0,0,0.3)" },
  btnXemNgay: { padding: "10px 24px", backgroundColor: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", borderRadius: "4px", color: "#000" },
  rightProductGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
  emptyCategory: { gridColumn: "1/-1", padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "14px" },

  emptyAll: { textAlign: "center", padding: "60px 20px", color: "#9ca3af", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", fontSize: "14px" },
  backTop: { width: "48px", height: "48px", backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", fontSize: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", position: "fixed", bottom: "30px", right: "30px", zIndex: 99 },
  // News
  newsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" },
  newsCard: { borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", transition: "box-shadow 0.2s" },
  newsImgWrap: { height: "200px", overflow: "hidden" },
  newsImg: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" },
  newsInfo: { padding: "16px 18px" },
  newsDate: { fontSize: "11px", color: "#9ca3af", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
  newsTitle: { fontSize: "15px", fontWeight: "700", color: "#1a1a1a", marginBottom: "8px", lineHeight: "1.4" },
  newsExcerpt: { fontSize: "13px", color: "#6b7280", lineHeight: "1.6" },
};

export default Home;
