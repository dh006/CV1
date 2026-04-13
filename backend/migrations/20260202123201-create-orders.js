"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id" },
        allowNull: true,
      },
      orderCode: { type: Sequelize.STRING, unique: true },
      fullName: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false }, // Lưu SĐT đặt hàng thực tế

      // Địa chỉ 3 cấp chuẩn VN
      province: { type: Sequelize.STRING, allowNull: false },
      district: { type: Sequelize.STRING, allowNull: false },
      ward: { type: Sequelize.STRING, allowNull: false },
      addressDetail: { type: Sequelize.STRING, allowNull: false },

      status: { type: Sequelize.INTEGER, defaultValue: 0 }, // 0: Chờ xác nhận, 1: Đang giao...
      note: { type: Sequelize.TEXT },
      totalPrice: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      paymentMethod: { type: Sequelize.STRING, defaultValue: "COD" },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Orders");
  },
};
