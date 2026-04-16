const { Product, Category, Brand } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

// ── Lấy danh sách sản phẩm (có filter, search, pagination) ───────────────────
exports.getAll = async (req, res) => {
  try {
    const { name, id, categoryId, brandId, minPrice, maxPrice, page = 1, limit = 50 } = req.query;

    const where = {};
    if (id) where.id = id;
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: "Category", attributes: ["id", "name"] },
        { model: Brand, as: "Brand", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    // Tự động fill hoverImage từ gallery[0] nếu chưa có
    const data = rows.map((p) => {
      const obj = p.toJSON();
      if (!obj.hoverImage && obj.gallery) {
        try {
          const gallery = JSON.parse(obj.gallery);
          if (gallery[0]) obj.hoverImage = gallery[0];
        } catch {}
      }
      return obj;
    });

    res.json({
      data,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Lấy 1 sản phẩm theo ID ───────────────────────────────────────────────────
exports.getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: "Category", attributes: ["id", "name"] },
        { model: Brand, as: "Brand", attributes: ["id", "name"] },
      ],
    });
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });

    const obj = product.toJSON();
    // Tự động fill hoverImage từ gallery[0] nếu chưa có
    if (!obj.hoverImage && obj.gallery) {
      try {
        const gallery = JSON.parse(obj.gallery);
        if (gallery[0]) obj.hoverImage = gallery[0];
      } catch {}
    }

    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Thêm sản phẩm ─────────────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const data = { ...req.body };

    // Parse remote URLs gửi từ frontend (JSON string)
    let remoteUrls = [];
    if (data.remoteUrls) {
      try { remoteUrls = JSON.parse(data.remoteUrls); } catch { remoteUrls = []; }
      delete data.remoteUrls;
    }
    const mainIsUrl = data.mainIsUrl === "true";
    delete data.mainIsUrl;

    // Ghép ảnh đúng thứ tự: ảnh đại diện đứng đầu
    const uploadedPaths = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    let allImages;
    if (mainIsUrl && remoteUrls.length > 0) {
      allImages = [remoteUrls[0], ...uploadedPaths, ...remoteUrls.slice(1)];
    } else {
      allImages = [...uploadedPaths, ...remoteUrls];
    }

    if (allImages.length > 0) {
      data.image = allImages[0];
      if (allImages.length > 1) {
        data.gallery = JSON.stringify(allImages.slice(1));
      }
    }

    // Xây dựng colorImages map từ colorImageIndex nếu có
    // colorImageIndex: { "Đen": 0, "Trắng": 1, ... } — index trong allImages
    if (data.colorImageIndex) {
      try {
        const indexMap = JSON.parse(data.colorImageIndex);
        const colorImagesMap = {};
        Object.entries(indexMap).forEach(([color, idx]) => {
          if (allImages[idx]) colorImagesMap[color] = allImages[idx];
        });
        data.colorImages = JSON.stringify(colorImagesMap);
      } catch { /* bỏ qua nếu parse lỗi */ }
      delete data.colorImageIndex;
    }

    // Lưu hoverImage từ hoverImageIndex
    if (data.hoverImageIndex !== undefined) {
      const hIdx = Number(data.hoverImageIndex);
      if (!isNaN(hIdx) && allImages[hIdx]) {
        data.hoverImage = allImages[hIdx];
      }
      delete data.hoverImageIndex;
    }

    // Xử lý sizeStock — tính tổng quantity từ sizeStock nếu có
    if (data.sizeStock) {
      try {
        const sizeStockObj = typeof data.sizeStock === "string" ? JSON.parse(data.sizeStock) : data.sizeStock;
        const total = Object.values(sizeStockObj).reduce((s, v) => s + (Number(v) || 0), 0);
        data.sizeStock = JSON.stringify(sizeStockObj);
        data.quantity = total; // ghi đè quantity bằng tổng từ sizeStock
      } catch { delete data.sizeStock; }
    }

    if (!data.name || !data.price || !data.quantity) {
      return res.status(400).json({ message: "Tên, giá và số lượng là bắt buộc!" });
    }

    // Tính oldPrice từ discount nếu có
    if (data.discount && Number(data.discount) > 0) {
      data.oldPrice = data.price;
      data.price = Math.round(data.price * (1 - data.discount / 100));
    }
    delete data.discount;

    const product = await Product.create(data);

    const full = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: "Category", attributes: ["id", "name"] },
        { model: Brand, as: "Brand", attributes: ["id", "name"] },
      ],
    });

    res.status(201).json({ message: "Thêm sản phẩm thành công!", product: full });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Cập nhật sản phẩm ─────────────────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });

    const data = { ...req.body };

    // Parse remote URLs gửi từ frontend
    let remoteUrls = [];
    if (data.remoteUrls) {
      try { remoteUrls = JSON.parse(data.remoteUrls); } catch { remoteUrls = []; }
      delete data.remoteUrls;
    }
    const mainIsUrl = data.mainIsUrl === "true";
    delete data.mainIsUrl;

    const uploadedPaths = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    let allImages;
    if (mainIsUrl && remoteUrls.length > 0) {
      allImages = [remoteUrls[0], ...uploadedPaths, ...remoteUrls.slice(1)];
    } else {
      allImages = [...uploadedPaths, ...remoteUrls];
    }

    if (allImages.length > 0) {
      // Xóa ảnh cũ trên disk (chỉ xóa nếu là file local, không phải URL ngoài)
      if (product.image && product.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "..", product.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      data.image = allImages[0];
      data.gallery = allImages.length > 1 ? JSON.stringify(allImages.slice(1)) : null;
    }

    // Xây dựng colorImages map từ colorImageIndex nếu có
    if (data.colorImageIndex) {
      try {
        const indexMap = JSON.parse(data.colorImageIndex);
        const colorImagesMap = {};
        Object.entries(indexMap).forEach(([color, idx]) => {
          if (allImages[idx]) colorImagesMap[color] = allImages[idx];
        });
        data.colorImages = JSON.stringify(colorImagesMap);
      } catch { /* bỏ qua */ }
      delete data.colorImageIndex;
    }

    // Lưu hoverImage từ hoverImageIndex
    if (data.hoverImageIndex !== undefined) {
      const hIdx = Number(data.hoverImageIndex);
      if (!isNaN(hIdx) && allImages[hIdx]) {
        data.hoverImage = allImages[hIdx];
      }
      delete data.hoverImageIndex;
    }

    // Xử lý sizeStock — tính tổng quantity từ sizeStock nếu có
    if (data.sizeStock) {
      try {
        const sizeStockObj = typeof data.sizeStock === "string" ? JSON.parse(data.sizeStock) : data.sizeStock;
        const total = Object.values(sizeStockObj).reduce((s, v) => s + (Number(v) || 0), 0);
        data.sizeStock = JSON.stringify(sizeStockObj);
        data.quantity = total;
      } catch { delete data.sizeStock; }
    }

    // Tính oldPrice từ discount nếu có
    if (data.discount && Number(data.discount) > 0) {
      data.oldPrice = data.price;
      data.price = Math.round(data.price * (1 - data.discount / 100));
    }
    delete data.discount;

    await product.update(data);

    const updated = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: "Category", attributes: ["id", "name"] },
        { model: Brand, as: "Brand", attributes: ["id", "name"] },
      ],
    });

    res.json({ message: "Cập nhật sản phẩm thành công!", product: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Xóa sản phẩm ──────────────────────────────────────────────────────────────
exports.delete = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });

    if (product.image) {
      const filePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await product.destroy();
    res.json({ message: "Đã xóa sản phẩm thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
