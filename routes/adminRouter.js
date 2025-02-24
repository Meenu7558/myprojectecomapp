import express from "express";
import { adminSignup ,adminLogin,adminProfile,adminLogout,updateAdminProfile,forgotAdminPassword,changeAdminPassword } from "../controllers/adminControllers.js";
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



export  { router as adminRouter };
