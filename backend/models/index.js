const sequelize = require("../config/db");
const User = require("./User");
const Category = require("./Category");
const Brand = require("./Brand");
const Product = require("./Product");
const Order = require("./Order");
const Order_Detail = require("./Order_Detail");
const News = require("./News");
const Feedback = require("./Feedback");
const Banner = require("./Banner");
const News_Detail = require("./News_Detail");
const Banner_Detail = require("./Banner_Detail");
const Voucher = require("./Voucher");

// ── Product associations ──────────────────────────────────────────────────────
Product.belongsTo(Category, { foreignKey: "categoryId", as: "Category" });
Product.belongsTo(Brand, { foreignKey: "brandId", as: "Brand" });
Category.hasMany(Product, { foreignKey: "categoryId" });
Brand.hasMany(Product, { foreignKey: "brandId" });

// ── Order associations ────────────────────────────────────────────────────────
Order.belongsTo(User, { foreignKey: "userId", as: "User" });
Order.hasMany(Order_Detail, { foreignKey: "orderId", as: "details" });
Order_Detail.belongsTo(Order, { foreignKey: "orderId" });
Order_Detail.belongsTo(Product, { foreignKey: "productId", as: "Product" });

// ── Feedback associations ─────────────────────────────────────────────────────
Feedback.belongsTo(Product, { foreignKey: "productId" });
Feedback.belongsTo(User, { foreignKey: "userId" });
Product.hasMany(Feedback, { foreignKey: "productId" });
User.hasMany(Feedback, { foreignKey: "userId" });

// ── News & Banner (many-to-many) ──────────────────────────────────────────────
Product.belongsToMany(News, {
  through: News_Detail,
  foreignKey: "product_id",
  otherKey: "news_id",
  indexes: false,
});
News.belongsToMany(Product, {
  through: News_Detail,
  foreignKey: "news_id",
  otherKey: "product_id",
  indexes: false,
});

Product.belongsToMany(Banner, {
  through: Banner_Detail,
  foreignKey: "product_id",
  otherKey: "banner_id",
  indexes: false,
});
Banner.belongsToMany(Product, {
  through: Banner_Detail,
  foreignKey: "banner_id",
  otherKey: "product_id",
  indexes: false,
});

module.exports = {
  sequelize,
  User, Category, Brand, Product,
  Order, Order_Detail,
  News, Feedback, Banner, News_Detail, Banner_Detail,
  Voucher,
};
