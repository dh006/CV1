import React, { useEffect } from "react";
// Đảm bảo Navigate đã được import để điều hướng
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/user/Home/Home";
import Login from "../pages/user/Auth/Login";
import Register from "../pages/user/Auth/Register";
import CartPage from "../pages/user/Cart/CartPage";
import StoreLocations from "../pages/user/StoreLocations/StoreLocations";
import CategoryPage from "../pages/user/Category/CategoryPage";
import ProductDetail from "../pages/user/Product/ProductDetail";

// IMPORT DANH MỤC ÁO
import AoNamPage from "../pages/user/Category/AoNamPage";
import AoThunPage from "../pages/user/Category/AoThunPage";
import AoPoloPage from "../pages/user/Category/AoPoloPage";
import SoMiPage from "../pages/user/Category/SoMiPage";
import AoKhoacPage from "../pages/user/Category/AoKhoacPage";
import AoNiLenPage from "../pages/user/Category/AoNiLenPage";
import HoodiePage from "../pages/user/Category/HoodiePage";
import AoBaLoPage from "../pages/user/Category/AoBaLoPage";
import SetDoPage from "../pages/user/Category/SetDoPage";
import AoKhoacJeanPage from "../pages/user/Category/AoKhoacJeanPage";

// IMPORT DANH MỤC QUẦN
import QuanNamPage from "../pages/user/Category/QuanNamPage";
import QuanJeansPage from "../pages/user/Category/QuanJeansPage";
import QuanShortPage from "../pages/user/Category/QuanShortPage";
import SetDoQuanPage from "../pages/user/Category/SetDoQuanPage";
import QuanKakiPage from "../pages/user/Category/QuanKakiPage";
import QuanJoggerPage from "../pages/user/Category/QuanJoggerPage";
import QuanTayPage from "../pages/user/Category/QuanTayPage";
import QuanBoxerPage from "../pages/user/Category/QuanBoxerPage";

// IMPORT DANH MỤC PHỤ KIỆN
import PhuKienPage from "../pages/user/Category/PhuKienPage";
import GiayDepPage from "../pages/user/Category/GiayDepPage";
import BaloTuiPage from "../pages/user/Category/BaloTuiPage";
import ThatLungPage from "../pages/user/Category/ThatLungPage";
import VoPage from "../pages/user/Category/VoPage";
import MatKinhPage from "../pages/user/Category/MatKinhPage";

// IMPORT 6 FILE PHONG CÁCH DENIM
import AirflexPage from "../pages/user/Category/AirflexPage";
import ProcoolPage from "../pages/user/Category/ProcoolPage";
import SmartJeansPage from "../pages/user/Category/SmartJeansPage";
import SmartFitPage from "../pages/user/Category/SmartFitPage";
import StraightPage from "../pages/user/Category/StraightPage";
import SlimFitPage from "../pages/user/Category/SlimFitPage";

// IMPORT CÁC TRANG ĐẶC BIỆT
import HangMoiPage from "../pages/user/Category/HangMoiPage";
import BestSellerPage from "../pages/user/Category/BestSellerPage";
import DenimPage from "../pages/user/Category/DenimPage";
import OutletPage from "../pages/user/Category/OutletPage";
import NonPage from "../pages/user/Category/NonPage";

// Thank You
import ThankYou from "../pages/user/ThankYou/ThankYou";
import ProfilePage from "../pages/user/Profile/ProfilePage";
import CollectionsPage from "../pages/user/Category/CollectionsPage";
import NewsPage from "../pages/user/News/NewsPage";
import ZaloPayReceiveMoney from "../pages/user/Payment/ZaloPayReceiveMoney";

// IMPORT ADMIN PAGES
import AdminDashboard from "../pages/admin/Dashboard/AdminDashboard";
import AdminProducts from "../pages/admin/Products/AdminProducts";
import AddProduct from "../pages/admin/Products/AddProduct";
import EditProduct from "../pages/admin/Products/EditProduct";
import RevenueReport from "../pages/admin/Analytics/RevenueReport";
import InventoryManager from "../pages/admin/Inventory/InventoryManager";
import AdminOrders from "../pages/admin/Orders/AdminOrders";
import OrderDetail from "../pages/admin/Orders/OrderDetail";
import AdminLayout from "../layouts/AdminLayout";
import AdminCategories from "../pages/admin/Categories/AdminCategories";
import AdminUsers from "../pages/admin/Users/AdminUsers";
import AdminBrands from "../pages/admin/Brands/AdminBrands";
import AdminBanners from "../pages/admin/Banners/AdminBanners";
import AdminNews from "../pages/admin/News/AdminNews";

import AboutPage from "../pages/user/About/AboutPage";
import RetroSportsPage from "../pages/user/Collection/RetroSportsPage";
import SnoopyPage from "../pages/user/Collection/SnoopyPage";
import AdminVouchers from "../pages/admin/Vouchers/AdminVouchers";
const AdminIndexRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (Number(user.role) === 2) return <Navigate to="/admin/orders" replace />;
  return <Navigate to="/admin/dashboard" replace />;
};

// Admin (role 1) toàn quyền; Sale (role 2) chỉ đơn hàng (layout tự chặn trang khác)
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const r = Number(user.role);
  if (r !== 1 && r !== 2) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* --- Website bán hàng (khách hàng role 0) — không có trang quản lý file sản phẩm --- */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />

          {/* 1. AUTH & USER ROUTES */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="thank-you" element={<ThankYou />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="my-orders" element={<ProfilePage />} />
          <Route path="he-thong-cua-hang" element={<StoreLocations />} />
          <Route path="gioi-thieu" element={<AboutPage />} />
          <Route path="collections/retro-sports" element={<RetroSportsPage />} />
          <Route path="collections/snoopy" element={<SnoopyPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="zalopay-nhan-tien" element={<ZaloPayReceiveMoney />} />

          {/* 2. TRANG ĐẶC BIỆT */}
          <Route path="new" element={<HangMoiPage />} />
          <Route path="best-seller" element={<BestSellerPage />} />
          <Route path="outlet" element={<OutletPage />} />
          <Route path="denim" element={<DenimPage />} />

          {/* 3. CHI TIẾT SẢN PHẨM */}
          <Route path="products/:slug" element={<ProductDetail />} />

          {/* 4. ROUTES DANH MỤC ÁO */}
          <Route path="collections/ao-nam" element={<AoNamPage />} />
          <Route path="collections/ao-thun" element={<AoThunPage />} />
          <Route path="collections/ao-polo" element={<AoPoloPage />} />
          <Route path="collections/somi" element={<SoMiPage />} />
          <Route path="collections/ao-khoac" element={<AoKhoacPage />} />
          <Route path="collections/ao-ni-len" element={<AoNiLenPage />} />
          <Route path="collections/ao-hoodie" element={<HoodiePage />} />
          <Route path="collections/ao-balo" element={<AoBaLoPage />} />
          <Route path="collections/setdo" element={<SetDoPage />} />
          <Route
            path="collections/ao-khoac-jeans"
            element={<AoKhoacJeanPage />}
          />

          {/* 5. ROUTES DANH MỤC QUẦN */}
          <Route path="collections/quan-nam" element={<QuanNamPage />} />
          <Route path="collections/quan-jeans" element={<QuanJeansPage />} />
          <Route path="collections/quan-short" element={<QuanShortPage />} />
          <Route path="collections/quan-kaki" element={<QuanKakiPage />} />
          <Route path="collections/quan-jogger" element={<QuanJoggerPage />} />
          <Route path="collections/quan-tay" element={<QuanTayPage />} />
          <Route path="collections/quan-boxer" element={<QuanBoxerPage />} />
          <Route path="collections/set-do-quan" element={<SetDoQuanPage />} />

          {/* 6. ROUTES PHONG CÁCH DENIM */}
          <Route path="collections/airflex" element={<AirflexPage />} />
          <Route path="collections/procool" element={<ProcoolPage />} />
          <Route path="collections/smart-jeans" element={<SmartJeansPage />} />

          {/* 7. ROUTES FORM DÁNG */}
          <Route path="form/smart-fit" element={<SmartFitPage />} />
          <Route path="form/straight" element={<StraightPage />} />
          <Route path="form/slim-fit" element={<SlimFitPage />} />

          {/* 8. ROUTES DANH MỤC PHỤ KIỆN */}
          <Route path="collections/phu-kien" element={<PhuKienPage />} />
          <Route path="collections/giay-dep" element={<GiayDepPage />} />
          <Route path="collections/balo-tui" element={<BaloTuiPage />} />
          <Route path="collections/non" element={<NonPage />} />
          <Route path="collections/that-lung" element={<ThatLungPage />} />
          <Route path="collections/vo" element={<VoPage />} />
          <Route path="collections/mat-kinh" element={<MatKinhPage />} />

          <Route path="collections/:category" element={<CategoryPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="products" element={<CategoryPage />} />

          <Route
            path="chinh-sach-doi-tra"
            element={
              <div style={{ padding: "100px 50px", textAlign: "center" }}>
                <h2>Chính sách đổi trả</h2>
                <p>Nội dung chính sách đang được cập nhật...</p>
              </div>
            }
          />
        </Route>

        {/* --- Admin (role 1): đầy đủ. Sale (role 2): chỉ đơn hàng --- */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminIndexRedirect />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="stats" element={<RevenueReport />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="inventory" element={<InventoryManager />} />
          <Route path="vouchers" element={<AdminVouchers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="news" element={<AdminNews />} />
        </Route>

        {/* 11. 404 PAGE */}
        <Route
          path="*"
          element={
            <div style={errorPageStyles}>
              <h1 style={{ fontSize: "120px", margin: 0 }}>404</h1>
              <p style={{ fontSize: "20px", marginBottom: "30px" }}>
                Trang bạn tìm kiếm không tồn tại.
              </p>
              <a href="/" style={btnHomeStyles}>
                QUAY LẠI TRANG CHỦ
              </a>
            </div>
          }
        />
      </Routes>
    </>
  );
};

const errorPageStyles = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  backgroundColor: "#fff",
};

const btnHomeStyles = {
  padding: "15px 40px",
  backgroundColor: "#001C40",
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold",
  borderRadius: "4px",
  letterSpacing: "1px",
};

export default AppRouter;
