const { News_Detail, Product } = require("../models");

// 1. Xem danh sách sản phẩm được gắn vào 1 tin tức (Tìm theo news_id)
exports.getByNews = async (req, res) => {
  try {
    const { newsId } = req.params;

    const data = await News_Detail.findAll({
      where: { news_id: newsId },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "image", "oldPrice"], // Lấy thông tin cần thiết để hiển thị trong bài viết
        },
      ],
    });

    if (!data || data.length === 0) {
      return res.status(200).json([]); // Trả về mảng rỗng nếu chưa có sản phẩm nào gắn vào
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Thêm liên kết (Gán sản phẩm vào bài viết tin tức)
exports.create = async (req, res) => {
  try {
    const { news_id, product_id } = req.body;

    // Kiểm tra xem sản phẩm này đã được gán vào bài viết này chưa
    const checkExist = await News_Detail.findOne({
      where: { news_id, product_id },
    });

    if (checkExist) {
      return res
        .status(400)
        .json({ message: "Sản phẩm này đã tồn tại trong bài viết này!" });
    }

    const newItem = await News_Detail.create(req.body);
    res.status(201).json({
      message: "Gán sản phẩm vào tin tức thành công!",
      data: newItem,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. Xóa liên kết (Gỡ sản phẩm khỏi bài viết)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await News_Detail.destroy({
      where: { id: id },
    });

    if (result === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy dữ liệu liên kết để gỡ!" });
    }

    res.json({ message: "Đã gỡ sản phẩm khỏi bài viết thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
