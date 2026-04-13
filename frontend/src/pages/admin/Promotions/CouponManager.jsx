import React, { useState, useEffect } from "react";
import axios from "axios";

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        // Gọi API lấy danh sách coupon (Đảm bảo Backend đã có route này)
        const res = await axios.get("http://localhost:5000/api/admin/coupons", {
          headers: { "x-access-token": localStorage.getItem("token") },
        });
        setCoupons(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách mã giảm giá:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-gray-500">Đang tải danh sách khuyến mãi...</div>
    );

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          🏷️ Quản lý Mã giảm giá & Khuyến mãi
        </h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-medium transition-colors">
          + Tạo mã mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.length > 0 ? (
          coupons.map((cp) => (
            <div
              key={cp.id}
              className="border border-green-100 p-4 rounded-lg bg-green-50 flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-green-800 text-lg">
                  {cp.code} - Giảm {cp.discountValue}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Hết hạn: {new Date(cp.expiryDate).toLocaleDateString("vi-VN")}{" "}
                  | Lượt dùng: {cp.usedCount}/{cp.maxUsage}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600 text-sm hover:underline">
                  Sửa
                </button>
                <button className="text-red-600 text-sm hover:underline">
                  Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          // Hiển thị mã mẫu nếu Database chưa có dữ liệu để bạn xem trước giao diện
          <div className="border border-green-100 p-4 rounded-lg bg-green-50 flex justify-between items-center">
            <div>
              <p className="font-bold text-green-800 text-lg">
                SUMMER2026 - Giảm 20%
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Hết hạn: 30/08/2026 | Lượt dùng: 50/100
              </p>
            </div>
            <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded">
              Đang chạy
            </span>
          </div>
        )}
      </div>

      {coupons.length === 0 && (
        <p className="text-center text-gray-400 mt-6 italic text-sm">
          Chưa có mã giảm giá nào được tạo. Nhấn "Tạo mã mới" để bắt đầu.
        </p>
      )}
    </div>
  );
};

export default CouponManager;
