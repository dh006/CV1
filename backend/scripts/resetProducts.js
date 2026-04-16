/**
 * Xóa toàn bộ sản phẩm và dữ liệu liên quan (chi tiết đơn hàng, feedback sản phẩm).
 * Đơn hàng (Orders) vẫn giữ bản ghi nhưng không còn dòng chi tiết.
 *
 * Chạy: node scripts/resetProducts.js
 */
require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});
const sequelize = require("../config/db");
const { Product, Order_Detail, Feedback } = require("../models");

async function run() {
  await sequelize.authenticate();
  console.log("Đã kết nối database.");

  const t = await sequelize.transaction();
  try {
    const od = await Order_Detail.destroy({ where: {}, transaction: t });
    const fb = await Feedback.destroy({ where: {}, transaction: t });
    const pr = await Product.destroy({ where: {}, transaction: t });

    await t.commit();
    console.log(
      `Đã xóa: ${od} dòng Order_Details, ${fb} Feedbacks, ${pr} Products.`,
    );
    console.log("Hoàn tất reset sản phẩm.");
  } catch (err) {
    await t.rollback();
    console.error("Lỗi:", err.message);
    process.exit(1);
  }

  await sequelize.close();
  process.exit(0);
}

run();
