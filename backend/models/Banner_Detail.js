const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Banner_Detail = sequelize.define(
  "Banner_Detail",
  {
    product_id: { type: DataTypes.INTEGER },
    banner_id: { type: DataTypes.INTEGER },
  },
  { tableName: "banner_details" },
);

module.exports = Banner_Detail;
