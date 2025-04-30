import {Cart} from "../models/cartModel.js";
import {Product} from "../models/productModel.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  try {
    console.log("User in Request:", req.user); 

    const { productId, quantity } = req.body;

    if (!req.user || !req.user.id) { 
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid product or quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find(item => item.product.equals(productId));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ 
        product: productId,
        price: product.price,
        quantity: quantity
      });
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();

    res.status(200).json({ data: cart, message: "Product added to cart" });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id; 

    
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ message: error.message });
  }
};




export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    console.log("User ID:", userId);
    console.log("Product ID:", productId);

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty. Add products first." });
    }

    console.log("Cart Found:", cart);
    console.log("Cart Items Before Removal:", cart.items);

    const objectId = new mongoose.Types.ObjectId(productId);
    
    cart.items.forEach(item => {
      console.log("Cart Item Product ID:", item.product.toString());
    });

    const existingItem = cart.items.find(item => item.product.equals(objectId));

    if (!existingItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items = cart.items.filter(item => !item.product.equals(objectId));

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    await cart.save();
    console.log("Updated Cart Items:", cart.items);

    res.status(200).json({ data: cart, message: "Product removed from cart" });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({ message: error.message });
  }
};

 
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndDelete({ userId });

    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
