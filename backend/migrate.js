/**
 * Chạy 1 lần để thêm các cột mới vào bảng Products
 * Lệnh: node migrate.js
 */
require("dotenv").config();
const sequelize = require("./config/db");

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối DB thành công");

    const qi = sequelize.getQueryInterface();

    // Lấy danh sách cột hiện tại
    const cols = await qi.describeTable("Products");
    console.log("Cột hiện tại:", Object.keys(cols).join(", "));

    const toAdd = [
      { name: "gallery", type: "TEXT", after: "image" },
      { name: "label", type: "VARCHAR(50)", after: "gallery" },
      { name: "sizes", type: "VARCHAR(255)", after: "label" },
      { name: "colors", type: "VARCHAR(255)", after: "sizes" },
    ];

    for (const col of toAdd) {
      if (!cols[col.name]) {
        await sequelize.query(
          `ALTER TABLE Products ADD COLUMN \`${col.name}\` ${col.type} NULL AFTER \`${col.after}\``,
        );
        console.log(`✅ Đã thêm cột: ${col.name}`);
      } else {
        console.log(`⏭️  Cột đã tồn tại: ${col.name}`);
      }
    }

    console.log("\n🎉 Migration hoàn tất!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi migration:", err.message);
    process.exit(1);
  }
};

run();
