const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order_Detail = sequelize.define(
  "Order_Detail",
  {
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    color: { type: DataTypes.STRING },
    size: { type: DataTypes.STRING },
  },
  { tableName: "Order_Details" },
);

module.exports = Order_Detail;
