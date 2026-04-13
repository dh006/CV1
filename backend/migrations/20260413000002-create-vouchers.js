"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Vouchers", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      code: { type: Sequelize.STRING(30), allowNull: false, unique: true },
      type: { type: Sequelize.ENUM("percent", "fixed"), defaultValue: "fixed" }, // percent = %, fixed = tiền
      value: { type: Sequelize.INTEGER, allowNull: false }, // 10 = 10% hoặc 10000đ
      minOrder: { type: Sequelize.INTEGER, defaultValue: 0 }, // đơn tối thiểu
      maxDiscount: { type: Sequelize.INTEGER, defaultValue: 0 }, // giảm tối đa (cho loại %)
      usageLimit: { type: Sequelize.INTEGER, defaultValue: 100 }, // số lần dùng tối đa
      usedCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      expiresAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable("Vouchers"); },
};
