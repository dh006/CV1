// import React, { useState, useMemo } from "react";
// import { useCart } from "../../../hooks/useCart";
// import { Link, useNavigate } from "react-router-dom";

// const Checkout = () => {
//   const { cartItems, totalPrice, totalCount, clearCart } = useCart();
//   const navigate = useNavigate();

//   // 1. State cho Voucher
//   const [voucherCode, setVoucherCode] = useState("");
//   const [discountValue, setDiscountValue] = useState(0);
//   const [appliedCode, setAppliedCode] = useState("");

//   const shippingFee = totalPrice > 399000 ? 0 : 30000;

//   // 2. Logic kiểm tra mã giảm giá
//   const handleApplyVoucher = () => {
//     const code = voucherCode.toUpperCase();
//     if (code === "ICD150") {
//       setDiscountValue(150000);
//       setAppliedCode("ICD150");
//       alert("Áp dụng mã giảm giá 150K thành công!");
//     } else if (code === "DIEP10") {
//       setDiscountValue(totalPrice * 0.1);
//       setAppliedCode("DIEP10");
//       alert("Áp dụng mã giảm giá 10% thành công!");
//     } else {
//       alert("Mã giảm giá không tồn tại hoặc đã hết hạn!");
//       setDiscountValue(0);
//       setAppliedCode("");
//     }
//   };

//   // 3. Tính toán số tiền cuối cùng
//   const finalTotal = useMemo(() => {
//     return totalPrice + shippingFee - discountValue;
//   }, [totalPrice, shippingFee, discountValue]);

//   // Logic hoàn tất đơn hàng
//   const handleFinishOrder = () => {
//     alert("Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đang được xử lý.");
//     clearCart();
//     navigate("/");
//   };

//   if (cartItems.length === 0)
//     return (
//       <div style={styles.emptyContainer}>
//         <h3>Giỏ hàng trống</h3>
//         <Link to="/" style={styles.backBtn}>
//           MUA SẮM NGAY
//         </Link>
//       </div>
//     );

//   return (
//     <div style={styles.pageBackground}>
//       <div style={styles.container}>
//         <div style={styles.grid}>
//           {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG (Giữ nguyên như bản trước) */}
//           <div style={styles.leftCol}>
//             <section style={styles.section}>
//               <h2 style={styles.sectionTitle}>Thông tin đơn hàng</h2>
//               <input type="text" placeholder="Họ và tên" style={styles.input} />
//               <input
//                 type="text"
//                 placeholder="Số điện thoại"
//                 style={styles.input}
//               />
//               <input
//                 type="text"
//                 placeholder="Địa chỉ chi tiết"
//                 style={styles.input}
//               />
//               <div style={styles.selectRow}>
//                 <select style={styles.select}>
//                   <option>Đà Nẵng</option>
//                 </select>
//                 <select style={styles.select}>
//                   <option>Quận Ngũ Hành Sơn</option>
//                 </select>
//                 <select style={styles.select}>
//                   <option>Phường Hoà Quý</option>
//                 </select>
//               </div>
//             </section>

//             {/* Thanh toán COD giống ảnh mẫu */}
//             <section style={styles.section}>
//               <h2 style={styles.sectionTitle}>Hình thức thanh toán</h2>
//               <div style={styles.paymentBox}>
//                 <div style={styles.radioBoxActive}>
//                   <span style={styles.codIcon}>COD</span>
//                   <span style={styles.radioLabel}>
//                     Thanh toán khi giao hàng (COD)
//                   </span>
//                 </div>
//                 <div style={styles.paymentDesc}>
//                   - Khách hàng được kiểm tra hàng trước khi nhận hàng.
//                   <br />- Freeship đơn từ 399K
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* CỘT PHẢI: GIỎ HÀNG & VOUCHER */}
//           <div style={styles.rightCol}>
//             <div style={styles.cartHeader}>
//               <h2 style={styles.sectionTitle}>Giỏ hàng</h2>
//               <span style={styles.itemCount}>{totalCount} Sản phẩm</span>
//             </div>

//             {/* Dải thông báo ưu đãi màu xanh giống ảnh */}
//             <div style={styles.promoAlert}>
//               Đơn hàng của bạn đã đủ điều kiện giảm 150K, nhớ nhập nha 🎊 (Only
//               Online)
//             </div>

//             {/* Ô NHẬP VOUCHER */}
//             <div style={styles.voucherBox}>
//               <input
//                 type="text"
//                 placeholder="Nhập mã giảm giá..."
//                 style={styles.voucherInput}
//                 value={voucherCode}
//                 onChange={(e) => setVoucherCode(e.target.value)}
//               />
//               <button style={styles.voucherBtn} onClick={handleApplyVoucher}>
//                 ÁP DỤNG
//               </button>
//             </div>

//             {/* DANH SÁCH SẢN PHẨM (Dùng item từ giỏ hàng thực tế) */}
//             <div style={styles.itemList}>
//               {cartItems.map((item) => (
//                 <div key={`${item.id}-${item.size}`} style={styles.item}>
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     style={styles.itemImg}
//                   />
//                   <div style={styles.itemInfo}>
//                     <p style={styles.itemName}>{item.name}</p>
//                     <p style={styles.itemBadge}>Đổi ý 15 ngày</p>
//                     <div style={styles.itemMetaRow}>
//                       <span>{item.size}</span>
//                       <span>x{item.quantity}</span>
//                       <span style={styles.itemPrice}>
//                         {(item.price * item.quantity).toLocaleString()}đ
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* TÓM TẮT TIỀN */}
//             <div style={styles.summaryBox}>
//               <div style={styles.row}>
//                 <span>Tạm tính:</span>
//                 <span>{totalPrice.toLocaleString()}đ</span>
//               </div>
//               <div style={styles.row}>
//                 <span>Phí vận chuyển:</span>
//                 <span>
//                   {shippingFee === 0
//                     ? "Miễn phí"
//                     : shippingFee.toLocaleString() + "đ"}
//                 </span>
//               </div>
//               <div style={styles.row}>
//                 <span>Voucher giảm giá:</span>
//                 <span style={{ color: "#d71920" }}>
//                   -{discountValue.toLocaleString()}đ
//                 </span>
//               </div>
//               <div style={styles.totalRow}>
//                 <span>Tổng:</span>
//                 <div style={styles.totalAmountBox}>
//                   <span style={styles.totalPrice}>
//                     {finalTotal.toLocaleString()}đ
//                   </span>
//                   {discountValue > 0 && (
//                     <small style={styles.savedNote}>
//                       (Tiết kiệm {discountValue.toLocaleString()}đ)
//                     </small>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* BOTTOM NAV STICKY giống ảnh */}
//         <div style={styles.bottomBar}>
//           <div style={styles.bottomBarContent}>
//             <div style={styles.bottomInfo}>
//               <span style={styles.codBadge}>COD</span> Thanh toán khi giao hàng
//               (COD)
//             </div>
//             <div style={styles.bottomTotalBox}>
//               <div style={styles.finalPriceGroup}>
//                 <span style={styles.finalPrice}>
//                   {finalTotal.toLocaleString()}đ
//                 </span>
//                 <span style={styles.finalSub}>
//                   Đã Giảm: {discountValue.toLocaleString()}đ
//                 </span>
//               </div>
//               <button style={styles.checkoutBtn} onClick={handleFinishOrder}>
//                 Thanh toán
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   pageBackground: { backgroundColor: "#fff", minHeight: "100vh" },
//   container: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "20px",
//     paddingBottom: "120px",
//   },
//   grid: { display: "flex", gap: "50px" },
//   leftCol: { flex: 1.2 },
//   rightCol: { flex: 1, borderLeft: "1px solid #eee", paddingLeft: "40px" },

//   // Voucher
//   voucherBox: { display: "flex", gap: "10px", marginBottom: "20px" },
//   voucherInput: {
//     flex: 1,
//     padding: "10px",
//     border: "1px solid #ddd",
//     borderRadius: "4px",
//   },
//   voucherBtn: {
//     padding: "10px 20px",
//     backgroundColor: "#001c40",
//     color: "#fff",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },

//   // Promo Alert (Màu xanh giống ảnh)
//   promoAlert: {
//     backgroundColor: "#3b69b9",
//     color: "#fff",
//     padding: "12px",
//     borderRadius: "4px",
//     fontSize: "13px",
//     marginBottom: "20px",
//     fontWeight: "500",
//   },

//   // Items
//   itemList: { maxHeight: "450px", overflowY: "auto" },
//   item: { display: "flex", gap: "15px", marginBottom: "20px" },
//   itemImg: {
//     width: "70px",
//     height: "90px",
//     objectFit: "cover",
//     borderRadius: "4px",
//   },
//   itemInfo: { flex: 1 },
//   itemName: { fontSize: "14px", fontWeight: "bold", marginBottom: "5px" },
//   itemBadge: {
//     fontSize: "10px",
//     color: "#d71920",
//     border: "1px solid #d71920",
//     padding: "1px 4px",
//     borderRadius: "2px",
//     display: "inline-block",
//   },
//   itemMetaRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginTop: "10px",
//     fontSize: "13px",
//   },

//   // Summary
//   summaryBox: {
//     borderTop: "2px solid #eee",
//     paddingTop: "20px",
//     marginTop: "20px",
//   },
//   row: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "12px",
//     fontSize: "14px",
//   },
//   totalRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginTop: "20px",
//   },
//   totalPrice: { fontSize: "22px", fontWeight: "900", color: "#000" },
//   savedNote: {
//     color: "#d71920",
//     fontSize: "12px",
//     display: "block",
//     textAlign: "right",
//   },

//   // Sticky Bottom Bar
//   bottomBar: {
//     position: "fixed",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     borderTop: "1px solid #eee",
//     padding: "15px 0",
//     zIndex: 1000,
//     boxShadow: "0 -4px 15px rgba(0,0,0,0.08)",
//   },
//   bottomBarContent: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "0 20px",
//   },
//   codBadge: {
//     backgroundColor: "#001c40",
//     color: "#fff",
//     padding: "3px 10px",
//     borderRadius: "4px",
//     fontWeight: "bold",
//     fontSize: "12px",
//   },
//   bottomTotalBox: { display: "flex", alignItems: "center", gap: "40px" },
//   finalPriceGroup: { textAlign: "right" },
//   finalPrice: {
//     fontSize: "24px",
//     fontWeight: "900",
//     color: "#3b69b9",
//     display: "block",
//   },
//   finalSub: { fontSize: "12px", color: "#888" },
//   checkoutBtn: {
//     backgroundColor: "#001c40",
//     color: "#fff",
//     padding: "12px 50px",
//     border: "none",
//     borderRadius: "4px",
//     fontWeight: "bold",
//     cursor: "pointer",
//     fontSize: "16px",
//   },
// };

// export default Checkout;
