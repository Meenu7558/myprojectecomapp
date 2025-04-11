import { Product } from "../models/productModel.js";

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const results = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // case-insensitive
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({ message: error.message });
  }
};
