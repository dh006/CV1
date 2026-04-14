const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

// Production: dùng DATABASE_URL hoặc MYSQLHOST (Railway/Render)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: false,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  });
} else if (process.env.MYSQLHOST) {
  sequelize = new Sequelize(
    process.env.MYSQLDATABASE || "railway",
    process.env.MYSQLUSER || "root",
    process.env.MYSQLPASSWORD || "",
    {
      host: process.env.MYSQLHOST,
      port: Number(process.env.MYSQLPORT || 3306),
      dialect: "mysql",
      logging: false,
    }
  );
} else if (process.env.DB_HOST && process.env.DB_HOST !== "localhost" && process.env.DB_HOST !== "127.0.0.1") {
  // Aiven hoặc remote MySQL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      dialect: "mysql",
      logging: false,
      dialectOptions: process.env.DB_SSL === "true"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
    }
  );
} else {
  // Local development — MySQL trên máy
  sequelize = new Sequelize(
    process.env.DB_NAME || "clothing_store",
    process.env.DB_USER || "root",
    process.env.DB_PASS || null,
    {
      host: "127.0.0.1",
      port: 3306,
      dialect: "mysql",
      logging: false,
    }
  );
}

module.exports = sequelize;
