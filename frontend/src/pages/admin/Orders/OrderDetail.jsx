import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderAPI, BASE_URL } from "../../../services/api";

const getImgUrl = (img) => {
  if (!img) return null;
  return img.startsWith("http") ? img : `${BASE_URL}${img}`;
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getDetails(id)
      .then((res) => setDetails(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const totalOrderAmount = details.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid #e5e7eb", borderTop: "3px solid #001C40", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
      Đang tải...
    </div>
  );

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <h2 style={s.title}>
          <i className="fa-solid fa-box" style={{ marginRight: "10px", color: "#f59e0b" }} />
          Đơn hàng #{id}
        </h2>
        <button style={s.backBtn} onClick={() => navigate("/admin/orders")}>
          <i className="fa-solid fa-arrow-left" style={{ marginRight: "6px" }} />
          Quay lại
        </button>
      </div>

      <div style={s.content}>
        {/* TABLE */}
        <div style={s.tableBox}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Sản phẩm</th>
                <th style={{ ...s.th, textAlign: "center" }}>Đơn giá</th>
                <th style={{ ...s.th, textAlign: "center" }}>SL</th>
                <th style={{ ...s.th, textAlign: "right" }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {details.length > 0 ? details.map((item) => {
                const imgUrl = getImgUrl(item.Product?.image);
                return (
                  <tr key={item.id} style={s.tr}>
                    <td style={s.td}>
                      <div style={s.productCell}>
                        <div style={s.imgWrap}>
                          {imgUrl ? (
                            <img src={imgUrl} alt={item.Product?.name || ""}
                              style={s.productImg}
                              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                          ) : null}
                          <div style={{ ...s.imgPlaceholder, display: imgUrl ? "none" : "flex" }}>
                            <i className="fa-solid fa-image" style={{ color: "#d1d5db", fontSize: "18px" }} />
                          </div>
                        </div>
                        <div>
                          <p style={s.productName}>{item.Product?.name || "Sản phẩm đã xóa"}</p>
                          <div style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap" }}>
                            {item.size && <span style={s.variantBadge}><i className="fa-solid fa-ruler" style={{ marginRight: "4px", fontSize: "9px" }} />Size: {item.size}</span>}
                            {item.color && <span style={{ ...s.variantBadge, background: "#f3e8ff", color: "#7c3aed" }}><i className="fa-solid fa-palette" style={{ marginRight: "4px", fontSize: "9px" }} />{item.color}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...s.td, textAlign: "center" }}>{Number(item.price).toLocaleString()}đ</td>
                    <td style={{ ...s.td, textAlign: "center", fontWeight: "700" }}>{item.quantity}</td>
                    <td style={{ ...s.td, textAlign: "right", fontWeight: "700", color: "#1d4ed8" }}>
                      {(item.price * item.quantity).toLocaleString()}đ
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="4" style={{ ...s.td, textAlign: "center", color: "#9ca3af" }}>Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SUMMARY */}
        <div style={s.summary}>
          <h3 style={s.summaryTitle}>
            <i className="fa-solid fa-fire" style={{ marginRight: "8px", color: "#f59e0b" }} />
            Tổng thanh toán
          </h3>
          <div style={s.summaryRow}>
            <span>Tạm tính</span>
            <span>{totalOrderAmount.toLocaleString()}đ</span>
          </div>
          <div style={s.summaryTotal}>
            <span>Tổng cộng</span>
            <span>{totalOrderAmount.toLocaleString()}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { padding: "0", fontFamily: "'Inter',sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "20px", fontWeight: "700", color: "#1f2937", display: "flex", alignItems: "center" },
  backBtn: { background: "none", border: "none", color: "#2563eb", fontWeight: "600", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center" },
  content: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" },
  tableBox: { background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "12px 16px", fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left", borderBottom: "1px solid #e5e7eb" },
  tr: { borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" },
  td: { padding: "14px 16px", fontSize: "14px", color: "#374151", verticalAlign: "middle" },
  productCell: { display: "flex", alignItems: "center", gap: "14px" },
  imgWrap: { width: "56px", height: "72px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "#f3f4f6", position: "relative" },
  productImg: { width: "100%", height: "100%", objectFit: "cover" },
  imgPlaceholder: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#f3f4f6" },
  productName: { fontSize: "13px", fontWeight: "600", color: "#1f2937", lineHeight: "1.4" },
  variantBadge: { display: "inline-flex", alignItems: "center", fontSize: "11px", background: "#dbeafe", color: "#2563eb", padding: "2px 8px", borderRadius: "999px", fontWeight: "600" },
  summary: { background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px", height: "fit-content", position: "sticky", top: "24px" },
  summaryTitle: { fontSize: "16px", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center" },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#4b5563", fontSize: "14px" },
  summaryTotal: { display: "flex", justifyContent: "space-between", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #e5e7eb", fontSize: "17px", fontWeight: "800", color: "#dc2626" },
};


export default OrderDetail;