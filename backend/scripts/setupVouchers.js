const { Sequelize } = require("sequelize");
const cfg = require("../config/config.json").development;
const s = new Sequelize(cfg.database, cfg.username, cfg.password, { host: cfg.host, dialect: cfg.dialect, logging: false });

async function run() {
  try {
    await s.query("ALTER TABLE Users ADD COLUMN IF NOT EXISTS points INT DEFAULT 0");
    await s.query(`
      CREATE TABLE IF NOT EXISTS Vouchers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(30) NOT NULL UNIQUE,
        type ENUM('percent','fixed') DEFAULT 'fixed',
        value INT NOT NULL,
        minOrder INT DEFAULT 0,
        maxDiscount INT DEFAULT 0,
        usageLimit INT DEFAULT 100,
        usedCount INT DEFAULT 0,
        isActive TINYINT(1) DEFAULT 1,
        expiresAt DATETIME NULL,
        createdAt DATETIME NOT NULL DEFAULT NOW(),
        updatedAt DATETIME NOT NULL DEFAULT NOW()
      )
    `);
    console.log("✅ Done: Vouchers table + points column created");
    process.exit(0);
  } catch (e) {
    console.error("❌", e.message);
    process.exit(1);
  }
}
run();
