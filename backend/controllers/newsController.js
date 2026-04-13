const { News } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

exports.getAll = async (req, res) => {
  try {
    const { title, id } = req.query;
    const where = {};
    if (id) where.id = id;
    if (title) where.title = { [Op.like]: `%${title}%` };
    const data = await News.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    if (!data.title) return res.status(400).json({ message: "Tiêu đề là bắt buộc!" });
    const news = await News.create(data);
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Không tìm thấy bài viết!" });
    const data = { ...req.body };
    if (req.file) {
      if (news.image && !news.image.startsWith("http")) {
        const old = path.join(__dirname, "..", news.image);
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      data.image = `/uploads/${req.file.filename}`;
    }
    await news.update(data);
    res.json({ message: "Cập nhật tin tức thành công!", news });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Không tìm thấy bài viết!" });
    if (news.image && !news.image.startsWith("http")) {
      const p = path.join(__dirname, "..", news.image);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    await news.destroy();
    res.json({ message: "Đã xóa bài viết!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
