const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Feedback = sequelize.define(
  "Feedback",
  {
    productId: { type: DataTypes.INTEGER },
    userId: { type: DataTypes.INTEGER },
    star: { type: DataTypes.INTEGER, defaultValue: 5 },
    content: { type: DataTypes.TEXT },
  },
  { tableName: "Feedbacks" },
);

module.exports = Feedback;
