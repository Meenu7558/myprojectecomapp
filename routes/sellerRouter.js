import express from "express";
import { sellerSignup,sellerLogin,sellerProfile,sellerLogout,updateSellerProfile ,forgotPassword,changePassword} from "../controllers/sellerControllers.js";
import  { sellerAuth}from "../middlewares/sellerAuth.js";


const router = express.Router();

// Signup
router.post('/signup', sellerSignup);

// Login
router.post('/login', sellerLogin);

// Profile
router.get('/profile', sellerAuth, sellerProfile);

// Logout
router.post('/logout', sellerAuth, sellerLogout);

// Profile Update
router.put('/profile-update', sellerAuth, updateSellerProfile    );

// Forgot Password
router.post('/forgot-password', forgotPassword );

// Change Password
router.put('/change-password', sellerAuth, changePassword);



export  { router as sellerRouter };
