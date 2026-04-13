const { Category } = require("../models");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const { name, id } = req.query;
    let condition = {};
    if (id) condition.id = id;
    if (name) condition.name = { [Op.like]: `%${name}%` };

    const data = await Category.findAll({ where: condition });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await Category.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Category.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Cập nhật danh mục thành công!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    res.json({ message: "Đã xóa danh mục!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
