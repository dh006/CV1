import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const HEADER_HEIGHT = 100; // topbar 36px + nav 64px

/** Giao diện cửa hàng cho khách mua hàng (role 0). Không có quản lý file/thêm sản phẩm — phần đó thuộc Admin. */
const UserLayout = () => {
  return (
    <div style={s.container}>
      <header style={s.header}>
        <Navbar />
      </header>
      <main style={s.main}>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

const s = {
  container: { display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", backgroundColor: "#fff" },
  header: { position: "fixed", top: 0, left: 0, width: "100%", zIndex: 2000, backgroundColor: "#fff", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" },
  main: { flex: 1, width: "100%", paddingTop: `${HEADER_HEIGHT}px` },
};

export default UserLayout;
