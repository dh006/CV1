import React, { useEffect, useState } from "react";
import { productAPI } from "../../../services/api";
import { Link } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await productAPI.getAll({ limit: 100 });
      setProducts(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa sản phẩm "${name}"?`)) return;
    setDeleting(id);
    try {
      await productAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Không thể xóa sản phẩm này!");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.spinner} />
        <p style={{ color: "#6b7280", marginTop: "12px" }}>
          Đang tải sản phẩm...
        </p>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Quản lý sản phẩm</h1>
          <p style={s.subtitle}>{products.length} sản phẩm trong hệ thống</p>
        </div>
        <Link to="/admin/products/add" style={s.addBtn}>
          + Thêm sản phẩm
        </Link>
      </div>

      {/* SEARCH & FILTER */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={s.searchInput}
          />
        </div>
        <div style={s.toolbarRight}>
          <span style={s.resultCount}>{filtered.length} kết quả</span>
        </div>
      </div>

      {/* TABLE */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>Sản phẩm</th>
              <th style={s.th}>Giá</th>
              <th style={s.th}>Tồn kho</th>
              <th style={s.th}>Danh mục</th>
              <th style={{ ...s.th, textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={s.emptyRow}>
                  <div style={s.emptyContent}>
                    <span style={{ fontSize: "40px" }}>
                      <i
                        className="fa-solid fa-box"
                        style={{ color: "#d1d5db" }}
                      />
                    </span>
                    <p>Không tìm thấy sản phẩm nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p, index) => (
                <tr
                  key={p.id}
                  style={{ ...s.tr, animationDelay: `${index * 0.05}s` }}
                >
                  <td style={s.td}>
                    <div style={s.productCell}>
                      <div style={s.imgWrap}>
                        <img
                          src={
                            p.image
                              ? p.image.startsWith("http")
                                ? p.image
                                : `http://localhost:5000${p.image}`
                              : "https://via.placeholder.com/60x80"
                          }
                          alt={p.name}
                          style={s.productImg}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/60x80";
                          }}
                        />
                      </div>
                      <div>
                        <p style={s.productName}>{p.name}</p>
                        <p style={s.productId}>ID: #{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td style={s.td}>
                    <p style={s.price}>{Number(p.price).toLocaleString()}đ</p>
                    {p.oldPrice && (
                      <p style={s.oldPrice}>
                        {Number(p.oldPrice).toLocaleString()}đ
                      </p>
                    )}
                  </td>
                  <td style={s.td}>
                    <span
                      style={{
                        ...s.stockBadge,
                        background:
                          p.quantity > 10
                            ? "#d1fae5"
                            : p.quantity > 0
                              ? "#fef3c7"
                              : "#fee2e2",
                        color:
                          p.quantity > 10
                            ? "#059669"
                            : p.quantity > 0
                              ? "#b45309"
                              : "#dc2626",
                      }}
                    >
                      {p.quantity > 0 ? `${p.quantity} sản phẩm` : "Hết hàng"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <span style={s.categoryBadge}>
                      {p.Category?.name ||
                        (p.categoryId ? `Danh mục #${p.categoryId}` : "—")}
                    </span>
                    {p.Brand?.name && (
                      <span
                        style={{
                          ...s.categoryBadge,
                          marginLeft: "4px",
                          background: "#ede9fe",
                          color: "#7c3aed",
                        }}
                      >
                        {p.Brand.name}
                      </span>
                    )}
                  </td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <div style={s.actions}>
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        style={s.editBtn}
                        title="Chỉnh sửa"
                      >
                        ✏️ Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        style={{
                          ...s.deleteBtn,
                          opacity: deleting === p.id ? 0.5 : 1,
                        }}
                        disabled={deleting === p.id}
                        title="Xóa"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter', sans-serif" },
  loadingWrap: {
    minHeight: "50vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #001C40",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
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
  addBtn: {
    display: "inline-block",
    background: "#001C40",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "700",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    gap: "12px",
  },
  searchWrap: { position: "relative", flex: 1, maxWidth: "400px" },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
  },
  searchInput: {
    width: "100%",
    padding: "10px 14px 10px 38px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fafafa",
  },
  toolbarRight: { display: "flex", alignItems: "center", gap: "12px" },
  resultCount: { fontSize: "13px", color: "#6b7280" },
  tableWrap: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: {
    padding: "14px 16px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    textAlign: "left",
    borderBottom: "1px solid #e5e7eb",
  },
  tr: { borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" },
  td: { padding: "14px 16px", verticalAlign: "middle" },
  productCell: { display: "flex", alignItems: "center", gap: "12px" },
  imgWrap: {
    width: "52px",
    height: "68px",
    borderRadius: "6px",
    overflow: "hidden",
    flexShrink: 0,
    background: "#f3f4f6",
  },
  productImg: { width: "100%", height: "100%", objectFit: "cover" },
  productName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "3px",
    maxWidth: "200px",
  },
  productId: { fontSize: "11px", color: "#9ca3af" },
  price: { fontSize: "14px", fontWeight: "700", color: "#d71920" },
  oldPrice: {
    fontSize: "11px",
    color: "#9ca3af",
    textDecoration: "line-through",
    marginTop: "2px",
  },
  stockBadge: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "999px",
  },
  categoryBadge: {
    fontSize: "12px",
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "4px 10px",
    borderRadius: "6px",
  },
  actions: { display: "flex", gap: "8px", justifyContent: "center" },
  editBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 12px",
    background: "#dbeafe",
    color: "#1d4ed8",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "600",
  },
  deleteBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 12px",
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
  emptyRow: { padding: "60px", textAlign: "center" },
  emptyContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    color: "#9ca3af",
    fontSize: "14px",
  },
};

export default AdminProducts;
