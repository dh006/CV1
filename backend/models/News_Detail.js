const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const News_Detail = sequelize.define(
  "News_Detail",
  {
    product_id: { type: DataTypes.INTEGER },
    news_id: { type: DataTypes.INTEGER },
  },
  { tableName: "news_details" },
);

module.exports = News_Detail;
