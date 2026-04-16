"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Products", "colorImages", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "colors",
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("Products", "colorImages");
  },
};
