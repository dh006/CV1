const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define(
  "Category",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.TEXT },
  },
  { tableName: "Categories" },
);

module.exports = Category;
