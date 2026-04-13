const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Voucher = sequelize.define("Voucher", {
  code: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  type: { type: DataTypes.ENUM("percent", "fixed"), defaultValue: "fixed" },
  value: { type: DataTypes.INTEGER, allowNull: false },
  minOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  maxDiscount: { type: DataTypes.INTEGER, defaultValue: 0 },
  usageLimit: { type: DataTypes.INTEGER, defaultValue: 100 },
  usedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  expiresAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: "Vouchers" });

module.exports = Voucher;
