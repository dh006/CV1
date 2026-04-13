import React, { useEffect, useState } from "react";
import { userAPI } from "../../../services/api";

const ROLE_MAP = {
  0: { label: "Khách hàng", color: "#374151", bg: "#f3f4f6" },
  1: { label: "Admin", color: "#1d4ed8", bg: "#dbeafe" },
  2: { label: "Sale", color: "#0068FF", bg: "#dbeafe" },
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await userAPI.getAll({ limit: 100 });
      setUsers(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    setUpdatingRole(id);
    try {
      await userAPI.update(id, { role: Number(newRole) });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: Number(newRole) } : u)));
      alert(
        "Đã cập nhật vai trò trên server. Người đó nên đăng xuất và đăng nhập lại để menu (Khu vực Sale / Admin) hiển thị đúng."
      );
    } catch (err) {
      alert(err.response?.data?.message || "Không cập nhật được vai trò!");
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa tài khoản "${name}"?`)) return;
    setDeleting(id);
    try {
      await userAPI.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Không thể xóa tài khoản này!");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.spinner} />
        <p style={{ color: "#6b7280", marginTop: "12px" }}>Đang tải danh sách...</p>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Quản lý người dùng</h1>
          <p style={s.subtitle}>
          {users.length} tài khoản — Admin quản trị toàn bộ; Sale chỉ xử lý đơn (không sản phẩm / kho).
        </p>
        </div>
      </div>

      <div style={s.toolbar}>
        <div style={s.searchWrap}>
                  <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", color: "#9ca3af" }} />
          <input
            type="text"
            placeholder="Tìm theo tên, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={s.searchInput}
          />
        </div>
        <span style={s.count}>{filtered.length} kết quả</span>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>Người dùng</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Số điện thoại</th>
              <th style={s.th}>Vai trò</th>
              <th style={s.th}>Ngày tạo</th>
              <th style={{ ...s.th, textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={s.emptyRow}>
                  <div style={s.emptyContent}>
                    <span style={{ fontSize: "40px" }}><i className="fa-solid fa-users" style={{ color: "#d1d5db" }} /></span>
                    <p>Không tìm thấy người dùng nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const role = ROLE_MAP[u.role] || ROLE_MAP[0];
                return (
                  <tr key={u.id} style={s.tr}>
                    <td style={s.td}>
                      <div style={s.userCell}>
                        <div style={s.avatar}>
                          {u.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p style={s.userName}>{u.fullName}</p>
                          <p style={s.userId}>ID: #{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>
                      <p style={s.email}>{u.email}</p>
                    </td>
                    <td style={s.td}>
                      <p style={s.phone}>{u.phone || "—"}</p>
                    </td>
                    <td style={s.td}>
                      {u.role === 1 ? (
                        <span style={{ ...s.roleBadge, color: role.color, background: role.bg }}>
                          {role.label}
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          disabled={updatingRole === u.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          style={s.roleSelect}
                        >
                          <option value={0}>Khách hàng</option>
                          <option value={2}>Sale (đơn hàng)</option>
                        </select>
                      )}
                    </td>
                    <td style={s.td}>
                      <p style={s.date}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </p>
                    </td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      {u.role !== 1 && (
                        <button
                          onClick={() => handleDelete(u.id, u.fullName)}
                          style={{ ...s.deleteBtn, opacity: deleting === u.id ? 0.5 : 1 }}
                          disabled={deleting === u.id}
                        >
                          <i className="fa-solid fa-trash" style={{ marginRight: "4px" }} />Xóa
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter',sans-serif" },
  loadingWrap: { minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #001C40", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#1a1a1a", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  toolbar: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" },
  searchWrap: { position: "relative", flex: 1, maxWidth: "400px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" },
  searchInput: { width: "100%", padding: "10px 14px 10px 38px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", backgroundColor: "#fafafa" },
  count: { fontSize: "13px", color: "#6b7280" },
  tableWrap: { background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "14px 16px", fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left", borderBottom: "1px solid #e5e7eb" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "14px 16px", verticalAlign: "middle" },
  userCell: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: { width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg,#001C40,#1890ff)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "15px", flexShrink: 0 },
  userName: { fontSize: "13px", fontWeight: "600", color: "#1a1a1a", marginBottom: "2px" },
  userId: { fontSize: "11px", color: "#9ca3af" },
  email: { fontSize: "13px", color: "#374151" },
  phone: { fontSize: "13px", color: "#374151" },
  roleBadge: { fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "999px" },
  roleSelect: {
    fontSize: "12px",
    fontWeight: "600",
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "#fafafa",
    cursor: "pointer",
    maxWidth: "160px",
  },
  date: { fontSize: "12px", color: "#6b7280" },
  deleteBtn: { padding: "6px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  emptyRow: { padding: "60px", textAlign: "center" },
  emptyContent: { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", color: "#9ca3af", fontSize: "14px" },
};

export default AdminUsers;
