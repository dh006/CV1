const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Banner = sequelize.define(
  "Banner",
  {
    name: { type: DataTypes.STRING },
    image: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  { tableName: "Banners" },
);

module.exports = Banner;
