const { Brand } = require("../models");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const { name, id } = req.query;
    let condition = {};
    if (id) condition.id = id;
    if (name) condition.name = { [Op.like]: `%${name}%` };

    const data = await Brand.findAll({ where: condition });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await Brand.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Brand.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Cập nhật thương hiệu thành công!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Brand.destroy({ where: { id: req.params.id } });
    res.json({ message: "Đã xóa thương hiệu!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
