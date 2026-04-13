const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Brand = sequelize.define(
  "Brand",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.TEXT },
  },
  { tableName: "Brands" },
);

module.exports = Brand;
