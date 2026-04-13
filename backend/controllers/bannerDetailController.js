const { Banner_Detail, Product } = require("../models");

// 1. Tìm kiếm danh sách sản phẩm thuộc một banner cụ thể
exports.getByBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;

    const data = await Banner_Detail.findAll({
      where: { banner_id: bannerId },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "image"], // Chỉ lấy các cột cần thiết
        },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chi tiết cho banner này!" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Thêm một sản phẩm vào Banner (Tạo liên kết Many-to-Many)
exports.create = async (req, res) => {
  try {
    const { banner_id, product_id } = req.body;

    // Kiểm tra xem sản phẩm đã có trong banner này chưa để tránh trùng lặp
    const exists = await Banner_Detail.findOne({
      where: { banner_id, product_id },
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "Sản phẩm này đã tồn tại trong banner!" });
    }

    const newItem = await Banner_Detail.create(req.body);
    res.status(201).json({
      message: "Thêm sản phẩm vào banner thành công!",
      data: newItem,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. Xóa một bản ghi chi tiết (Gỡ sản phẩm khỏi banner)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Banner_Detail.destroy({
      where: { id: id },
    });

    if (result === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bản ghi để xóa!" });
    }

    res.json({ message: "Đã gỡ sản phẩm khỏi banner thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
