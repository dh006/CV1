import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomerManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          // Sử dụng token để xác thực quyền Admin
          headers: { "x-access-token": localStorage.getItem("token") },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khách hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading)
    return <div className="p-6">Đang tải danh sách khách hàng...</div>;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          👥 Quản lý Khách hàng
        </h2>
        <div className="text-sm text-gray-500">
          Tổng cộng: {users.length} thành viên
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 font-semibold text-gray-600">
                Họ tên / Liên hệ
              </th>
              <th className="p-4 font-semibold text-gray-600">Vai trò</th>
              <th className="p-4 font-semibold text-gray-600">
                Lịch sử mua hàng
              </th>
              <th className="p-4 font-semibold text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{u.fullName}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                    {u.phone && (
                      <p className="text-xs text-gray-400">{u.phone}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        u.role === 1 || u.role === "admin"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {u.role === 1 || u.role === "admin"
                        ? "Admin"
                        : "Khách hàng"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800 underline italic transition-colors"
                      onClick={() => console.log("Xem đơn hàng của:", u.id)}
                    >
                      Xem đơn đã mua
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      className="bg-red-50 text-red-500 text-xs px-3 py-2 rounded border border-red-100 hover:bg-red-500 hover:text-white transition-all"
                      onClick={() =>
                        alert(`Đang xử lý khóa tài khoản: ${u.fullName}`)
                      }
                    >
                      Khóa tài khoản
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  Chưa có dữ liệu người dùng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerManager;
