const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true, unique: true },
    role: { type: DataTypes.INTEGER, defaultValue: 0 },
    avatar: { type: DataTypes.STRING },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    points: { type: DataTypes.INTEGER, defaultValue: 0 }, // điểm thưởng tích lũy
  },
  { tableName: "Users" },
);

module.exports = User;
