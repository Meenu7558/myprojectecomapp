import { cloudinaryInstance } from "../config/cloudinaryconfig.js";
import { Product } from "../models/productModel.js";
import dotenv from "dotenv";
dotenv.config();

export const getProducts = async (req, res) => {
  try {
    const productList = await Product.find().select("-description");
    
    console.log("productList ===>", productList);


    res.json({ success: true, data: productList, message: "Product list fetched" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate("seller");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, data: product, message: "Product details" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, seller } = req.body;

    if (!name || !description || !price || !category || !stock || !req.file) {
      return res.status(400).json({ message: "All fields including image are required" });
    }

  

    // ✅ Upload to Cloudinary
    const result = await cloudinaryInstance.uploader.upload(req.file.path);

    // ✅ ADD THIS LINE TO DEBUG
    console.log("Cloudinary upload result:", result);

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      seller,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    await product.save();
    res.status(201).json({ success: true, data: product, message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, seller } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.file) {
      // Delete old image
      if (product.image?.public_id) {
        await cloudinaryInstance.uploader.destroy(product.image.public_id);
      }

      // Upload new image
      const result = await cloudinaryInstance.uploader.upload(req.file.path);
      product.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.stock = stock;
    product.seller = seller;

    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct, message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image?.public_id) {
      await cloudinaryInstance.uploader.destroy(product.image.public_id);
    }

    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
