const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Railway / production — dùng connection string
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
    },
  });
} else {
  // Local development
  sequelize = new Sequelize(
    process.env.DB_NAME || "clothing_store",
    process.env.DB_USER || "root",
    process.env.DB_PASS || null,
    {
      host: process.env.DB_HOST || "127.0.0.1",
      dialect: "mysql",
      logging: false,
    }
  );
}

module.exports = sequelize;
