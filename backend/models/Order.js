const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define(
  "Order",
  {
    userId: { type: DataTypes.INTEGER },
    orderCode: { type: DataTypes.STRING, unique: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    province: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    ward: { type: DataTypes.STRING, allowNull: false },
    addressDetail: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 0 },
    note: { type: DataTypes.TEXT },
    totalPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    paymentMethod: { type: DataTypes.STRING, defaultValue: "COD" },
  },
  { tableName: "Orders" },
);

module.exports = Order;
