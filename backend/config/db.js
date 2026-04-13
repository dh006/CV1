const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.MYSQL_URL || process.env.DATABASE_URL) {
  // Railway connection string
  sequelize = new Sequelize(process.env.MYSQL_URL || process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: false,
    },
  });
} else if (process.env.MYSQLHOST) {
  // Railway individual variables
  sequelize = new Sequelize(
    process.env.MYSQLDATABASE || process.env.DB_NAME || "railway",
    process.env.MYSQLUSER || process.env.DB_USER || "root",
    process.env.MYSQLPASSWORD || process.env.DB_PASS || "",
    {
      host: process.env.MYSQLHOST || process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
      dialect: "mysql",
      logging: false,
    }
  );
} else {
  // Local development
  sequelize = new Sequelize(
    process.env.DB_NAME || "clothing_store",
    process.env.DB_USER || "root",
    process.env.DB_PASS || null,
    {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3306),
      dialect: "mysql",
      logging: false,
    }
  );
}

module.exports = sequelize;
