import { Admin } from "../models/adminModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

// Admin Signup
export const adminSignup = async (req, res, next) => {
  try {
    console.log("Admin signup attempt");
    const { name, email, password, phone, profilepic } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isAdminExist = await Admin.findOne({ email });

    if (isAdminExist) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const adminData = new Admin({ name, email, password: hashedPassword, phone, profilepic });
    await adminData.save();

    const token = generateToken(adminData._id);
    res.cookie("token", token);
    delete adminData._doc.password;
    return res.json({ data: adminData, message: "Admin account created" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

// Admin Login
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Admin login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const passwordMatch = bcrypt.compareSync(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id);
    res.cookie("token", token);
    delete admin._doc.password;
    return res.json({ data: admin, token, message: "Admin login successful" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

// Admin Profile
export const adminProfile = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const adminData = await Admin.findById(adminId).select("-password");

    if (!adminData) {
      return res.status(404).json({ message: "Admin not found", success: false });
    }
    return res.json({ data: adminData, message: "Admin profile fetched", success: true });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

// Admin Logout
export const adminLogout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { name, email },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Profile updated", admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Forgot Password
export const forgotAdminPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const resetToken = Math.random().toString(36).slice(2);
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await admin.save();

    res.status(200).json({ message: "Reset token generated", resetToken });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Change Password
export const changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from the old password" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
