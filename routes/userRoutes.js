import e from "express";

import { userProfile, userSignup, userLogin, userLogout, updateUserProfile ,forgotPassword, changePassword,deactivateAccount, checkUser } from "../controllers/userControllers.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

// Signup
router.post('/signup', userSignup);

// Login
router.post('/login', userLogin);

// Profile
router.get('/profile', userAuth, userProfile);

// Logout
router.post('/logout', userAuth, userLogout);

// Profile Update
router.put('/profile-update', userAuth, updateUserProfile    );

// Forgot Password
router.post('/forgot-password', forgotPassword );

// Change Password
router.put('/change-password', userAuth, changePassword);

// Deactivate Account
router.delete('/deactivate', userAuth, deactivateAccount );

// Check User (to check if user exists)
router.get('/check-user', userAuth, checkUser);

export { router as userRouter };