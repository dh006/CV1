const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    oldPrice: { type: DataTypes.INTEGER },
    image: { type: DataTypes.TEXT },
    gallery: { type: DataTypes.TEXT }, // JSON array các ảnh phụ
    description: { type: DataTypes.TEXT },
    specification: { type: DataTypes.TEXT },
    label: { type: DataTypes.STRING },
    sizes: { type: DataTypes.STRING }, // JSON: '["S","M","L","XL"]'
    colors: { type: DataTypes.STRING }, // JSON: '["Đen","Trắng"]'
    sizeStock: { type: DataTypes.TEXT }, // JSON: '{"S":10,"M":20,"L":5}' — tồn kho theo size
    buyTurn: { type: DataTypes.INTEGER, defaultValue: 0 },
    quantity: { type: DataTypes.INTEGER, allowNull: false }, // tổng tồn kho (tự tính từ sizeStock)
    brandId: { type: DataTypes.INTEGER },
    categoryId: { type: DataTypes.INTEGER },
  },
  { tableName: "Products" },
);

module.exports = Product;
