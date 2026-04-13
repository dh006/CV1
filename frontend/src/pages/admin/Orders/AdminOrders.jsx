import React, { useEffect, useState } from "react";
import { orderAPI } from "../../../services/api";
import { useNavigate } from "react-router-dom";

const STATUS_MAP = {
  0: { label: "Chờ xử lý", color: "#b45309", bg: "#fef3c7" },
  1: { label: "Đang giao", color: "#1d4ed8", bg: "#dbeafe" },
  2: { label: "Hoàn thành", color: "#059669", bg: "#d1fae5" },
  3: { label: "Đã hủy", color: "#dc2626", bg: "#fee2e2" },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getAll({ limit: 100 });
        setOrders(res.data?.data || res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("Không thể cập nhật trạng thái!");
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o.orderCode?.toLowerCase().includes(search.toLowerCase()) ||
      o.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search);
    const matchStatus = filterStatus === "all" || String(o.status) === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.spinner} />
        <p style={{ color: "#6b7280", marginTop: "12px" }}>Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Quản lý đơn hàng</h1>
          <p style={s.subtitle}>{orders.length} đơn hàng trong hệ thống</p>
        </div>
        {/* STATS */}
        <div style={s.miniStats}>
          {Object.entries(STATUS_MAP).map(([key, val]) => (
            <div key={key} style={{ ...s.miniStat, background: val.bg }}>
              <span style={{ ...s.miniStatNum, color: val.color }}>
                {orders.filter((o) => String(o.status) === key).length}
              </span>
              <span style={{ ...s.miniStatLabel, color: val.color }}>{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "#9ca3af" }} />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={s.searchInput}
          />
        </div>
        <div style={s.filterTabs}>
          {[["all", "Tất cả"], ["0", "Chờ xử lý"], ["1", "Đang giao"], ["2", "Hoàn thành"], ["3", "Đã hủy"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilterStatus(val)}
              style={{ ...s.filterTab, ...(filterStatus === val ? s.filterTabActive : {}) }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div style={s.tableWrap}>
        {filtered.length === 0 ? (
          <div style={s.emptyState}>
            <i className="fa-solid fa-inbox" style={{ fontSize: "40px", color: "#d1d5db" }} />
            <p style={{ color: "#9ca3af", marginTop: "12px" }}>Không có đơn hàng nào</p>
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Mã đơn</th>
                <th style={s.th}>Khách hàng</th>
                <th style={s.th}>Địa chỉ</th>
                <th style={s.th}>Tổng tiền</th>
                <th style={s.th}>Trạng thái</th>
                <th style={{ ...s.th, textAlign: "center" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const status = STATUS_MAP[order.status] || STATUS_MAP[0];
                return (
                  <tr key={order.id} style={s.tr}>
                    <td style={s.td}>
                      <p style={s.orderCode}>#{order.orderCode}</p>
                      <p style={s.orderDate}>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                    </td>
                    <td style={s.td}>
                      <p style={s.customerName}>{order.fullName}</p>
                      <p style={s.customerPhone}>
                        <i className="fa-solid fa-phone" style={{ marginRight: "4px", fontSize: "10px" }} />
                        {order.phone}
                      </p>
                    </td>
                    <td style={s.td}>
                      <p style={s.address}>
                        {order.addressDetail}, {order.ward}, {order.district}, {order.province}
                      </p>
                    </td>
                    <td style={s.td}>
                      <p style={s.price}>{Number(order.totalPrice).toLocaleString()}đ</p>
                      <p style={s.payMethod}>{order.paymentMethod || "COD"}</p>
                    </td>
                    <td style={s.td}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, parseInt(e.target.value))}
                        style={{ ...s.statusSelect, color: status.color, background: status.bg }}
                      >
                        {Object.entries(STATUS_MAP).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <button
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        style={s.detailBtn}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter', sans-serif" },
  loadingWrap: { minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #001C40", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#1a1a1a", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  miniStats: { display: "flex", gap: "10px", flexWrap: "wrap" },
  miniStat: { padding: "8px 14px", borderRadius: "8px", textAlign: "center", minWidth: "80px" },
  miniStatNum: { display: "block", fontSize: "20px", fontWeight: "800" },
  miniStatLabel: { display: "block", fontSize: "10px", fontWeight: "600", textTransform: "uppercase" },
  toolbar: { display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" },
  searchWrap: { position: "relative", flex: 1, minWidth: "200px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" },
  searchInput: { width: "100%", padding: "10px 14px 10px 38px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", backgroundColor: "#fafafa" },
  filterTabs: { display: "flex", gap: "6px", flexWrap: "wrap" },
  filterTab: { padding: "8px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#6b7280" },
  filterTabActive: { background: "#001C40", color: "#fff", border: "1.5px solid #001C40" },
  tableWrap: { background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" },
  emptyState: { padding: "80px", textAlign: "center" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "14px 16px", fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left", borderBottom: "1px solid #e5e7eb" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "14px 16px", verticalAlign: "middle" },
  orderCode: { fontSize: "13px", fontWeight: "700", color: "#1d4ed8", marginBottom: "2px" },
  orderDate: { fontSize: "11px", color: "#9ca3af" },
  customerName: { fontSize: "13px", fontWeight: "600", marginBottom: "2px" },
  customerPhone: { fontSize: "12px", color: "#6b7280" },
  address: { fontSize: "12px", color: "#6b7280", maxWidth: "200px", lineHeight: "1.5" },
  price: { fontSize: "14px", fontWeight: "700", marginBottom: "2px" },
  payMethod: { fontSize: "11px", color: "#9ca3af" },
  statusSelect: { padding: "6px 10px", border: "none", borderRadius: "999px", fontSize: "12px", fontWeight: "700", cursor: "pointer", outline: "none" },
  detailBtn: { padding: "7px 14px", background: "#dbeafe", color: "#1d4ed8", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
};

export default AdminOrders;
