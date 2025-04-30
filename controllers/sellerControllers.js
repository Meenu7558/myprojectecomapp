import {Seller}  from "../models/sellerModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";


export const sellerSignup = async (req, res, next) => {
  try {
    console.log("Seller signup attempt");
    const { name, email, password, phone, profilepic } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isSellerExist = await Seller.findOne({ email });
    if (isSellerExist) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const sellerData = new Seller({ name, email, password: hashedPassword, phone, profilepic });
    await sellerData.save();

    const token = generateToken(sellerData._id);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 👉 change to true in production (with HTTPS)
      sameSite: "Lax", // or 'None' if cross-site and secure is true
    });
    
    delete sellerData._doc.password;

    return res.json({ data: sellerData, message: "Seller account created" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const sellerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Seller login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: "Seller does not exist" });
    }

    const passwordMatch = bcrypt.compareSync(password, seller.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Seller not authenticated" });
    }

    const token = generateToken(seller._id);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 👉 change to true in production (with HTTPS)
      sameSite: "Lax", // or 'None' if cross-site and secure is true
    });
    
    delete seller._doc.password;

    return res.json({ data: seller, token, message: "Seller login successful" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const sellerProfile = async (req, res, next) => {
  try {
    const sellerId = req.seller.id;
    const sellerData = await Seller.findById(sellerId).select("-password");
    if (!sellerData) {
      return res.status(404).json({ message: "Seller not found", success: false });
    }
    return res.json({ data: sellerData, message: "Seller profile fetched", success: true });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const sellerLogout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

export const updateSellerProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedSeller = await Seller.findByIdAndUpdate(
      req.seller.id,
      { name, email },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Profile updated", seller: updatedSeller });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;

      
      const seller = await Seller.findOne({ email: email.toLowerCase().trim() });

      if (!seller) return res.status(404).json({ message: "Seller not found" });

      
      const resetToken = Math.random().toString(36).slice(2);

      
      seller.resetPasswordToken = resetToken;
      seller.resetPasswordExpires = Date.now() + 3600000; 

      await seller.save();

      res.status(200).json({ message: "Reset token generated", resetToken });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
          return res.status(400).json({ message: "Both old and new passwords are required" });
      }

      
      const seller = await Seller.findById(req.seller.id);
      if (!seller) {
          return res.status(404).json({ message: "Seller not found" });
      }

      
      const isMatch = await bcrypt.compare(oldPassword, seller.password);
      if (!isMatch) {
          return res.status(400).json({ message: "Old password is incorrect" });
      }

      
      if (oldPassword === newPassword) {
          return res.status(400).json({ message: "New password must be different from old password" });
      }

  
      seller.password = await bcrypt.hash(newPassword, 10);
      await seller.save();

      res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};





export const deactivateSellerAccount = async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.seller.id);
    res.status(200).json({ message: "Seller account deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
