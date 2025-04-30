import express from "express";
import { adminSignup ,adminLogin,adminProfile,adminLogout,updateAdminProfile,forgotAdminPassword,changeAdminPassword, blockUser, unblockUser, getAllUsers, getAllSellers, approveSeller, blockSeller, getOrders } from "../controllers/adminControllers.js";
import {adminAuth}from "../middlewares/adminAuth.js";

const router = express.Router();

// Signup
router.post('/signup', adminSignup);

// Login
router.post('/login', adminLogin);

// Profile
router.get('/profile', adminAuth, adminProfile);

// Logout
router.post('/logout', adminAuth, adminLogout);

// Profile Update
router.put('/profile-update', adminAuth, updateAdminProfile );

// Forgot Password
router.post('/forgot-password', forgotAdminPassword );


// Change Password
router.put('/change-password', adminAuth, changeAdminPassword);

// Block User
router.put('/block-user/:id', adminAuth, blockUser);

// Unblock User
router.put('/unblock-user/:id', adminAuth, unblockUser);

// Get all users
router.get('/users', adminAuth, getAllUsers);

// Admin routes for managing sellers

router.get("/getsellers", adminAuth,  getAllSellers);
router.put("/approve-seller/:id", adminAuth, approveSeller);
router.put("/block-seller/:id",  adminAuth,  blockSeller);

router.get("/orders", adminAuth, getOrders);


export  { router as adminRouter };
