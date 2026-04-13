import React, { useEffect, useState } from "react";
import axios from "axios";

const StockManager = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // Lọc theo: all, low, out

  useEffect(() => {
    const fetchStock = async () => {
      try {
        // Lấy dữ liệu sản phẩm kèm chi tiết tồn kho
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { "x-access-token": localStorage.getItem("token") },
        });
        setStock(res.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tồn kho:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  // Logic lọc sản phẩm dựa trên số lượng
  const filteredStock = stock.filter((p) => {
    if (filter === "low") return p.quantity > 0 && p.quantity < 5;
    if (filter === "out") return p.quantity <= 0;
    return true;
  });

  if (loading)
    return (
      <div className="p-6 text-gray-500 font-medium text-center">
        Đang kiểm tra kho hàng...
      </div>
    );

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            🛡️ Quản lý Tồn kho Chi tiết
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi và cảnh báo hàng tồn kho hệ thống
          </p>
        </div>

        <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === "all" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("low")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === "low" ? "bg-white shadow text-red-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Sắp hết
          </button>
          <button
            onClick={() => setFilter("out")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === "out" ? "bg-white shadow text-black" : "text-gray-500 hover:text-gray-700"}`}
          >
            Đã hết
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-semibold">Sản phẩm</th>
              <th className="p-4 font-semibold text-center">
                Phân loại (Size/Màu)
              </th>
              <th className="p-4 font-semibold text-center">
                Tồn kho hiện tại
              </th>
              <th className="p-4 font-semibold text-center">
                Trạng thái cảnh báo
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredStock.length > 0 ? (
              filteredStock.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={
                        p.image
                          ? `http://localhost:5000${p.image}`
                          : "https://via.placeholder.com/40"
                      }
                      className="w-10 h-12 object-cover rounded shadow-sm"
                      alt={p.name}
                    />
                    <span className="font-medium text-gray-800">{p.name}</span>
                  </td>
                  <td className="p-4 text-center text-gray-500 text-sm">
                    {p.size || "Free"} / {p.color || "N/A"}
                  </td>
                  <td
                    className={`p-4 text-center font-bold text-lg ${p.quantity < 5 ? "text-red-600" : "text-gray-800"}`}
                  >
                    {p.quantity}
                  </td>
                  <td className="p-4 text-center">
                    {p.quantity <= 0 ? (
                      <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                        HẾT HÀNG
                      </span>
                    ) : p.quantity < 5 ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        SẮP HẾT
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        BÌNH THƯỜNG
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-16 text-gray-400 italic bg-gray-50"
                >
                  Không có sản phẩm nào thuộc danh mục lọc này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          💡 <strong>Ghi chú:</strong> Hệ thống tự động cảnh báo "Sắp hết" khi
          số lượng sản phẩm thấp hơn 5 cái.
        </p>
      </div>
    </div>
  );
};

export default StockManager;
