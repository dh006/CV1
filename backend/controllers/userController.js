const { User } = require("../models");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const { name, phone, email } = req.query;
    const where = {};
    if (name) where.fullName = { [Op.like]: `%${name}%` };
    if (phone) where.phone = phone;
    if (email) where.email = { [Op.like]: `%${email}%` };

    const users = await User.findAll({
      where,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { fullName, phone, role } = req.body;
    const data = {};
    if (fullName) data.fullName = fullName;
    if (phone !== undefined) data.phone = phone;
    if (role !== undefined) data.role = role;

    await User.update(data, { where: { id: req.params.id } });
    res.json({ message: "Cập nhật người dùng thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "Đã xóa người dùng!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
