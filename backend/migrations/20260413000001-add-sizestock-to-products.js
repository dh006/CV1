"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Products", "sizeStock", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "colors",
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("Products", "sizeStock");
  },
};
