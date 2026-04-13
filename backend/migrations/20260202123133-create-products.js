"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      price: { type: Sequelize.INTEGER, allowNull: false },
      oldPrice: { type: Sequelize.INTEGER },
      image: { type: Sequelize.TEXT },
      description: { type: Sequelize.TEXT },
      specification: { type: Sequelize.TEXT },
      buyTurn: { type: Sequelize.INTEGER, defaultValue: 0 },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      brandId: {
        type: Sequelize.INTEGER,
        references: { model: "Brands", key: "id" },
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: { model: "Categories", key: "id" },
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Products");
  },
};
