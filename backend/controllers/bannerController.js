const { Banner } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

exports.getAll = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status !== undefined) where.status = status;
    const data = await Banner.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    if (!data.image) return res.status(400).json({ message: "Vui lòng cung cấp ảnh banner!" });
    const banner = await Banner.create(data);
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: "Không tìm thấy banner!" });
    const data = { ...req.body };
    if (req.file) {
      if (banner.image && !banner.image.startsWith("http")) {
        const old = path.join(__dirname, "..", banner.image);
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      data.image = `/uploads/${req.file.filename}`;
    }
    await banner.update(data);
    res.json({ message: "Cập nhật banner thành công!", banner });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: "Không tìm thấy banner!" });
    if (banner.image && !banner.image.startsWith("http")) {
      const p = path.join(__dirname, "..", banner.image);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    await banner.destroy();
    res.json({ message: "Đã xóa banner!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
