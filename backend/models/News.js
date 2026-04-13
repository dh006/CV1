const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const News = sequelize.define(
  "News",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.TEXT },
    content: { type: DataTypes.TEXT },
  },
  { tableName: "News" },
);

module.exports = News;
