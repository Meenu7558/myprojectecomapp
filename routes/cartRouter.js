import express from "express";
import {
  addToCart,
  getCart,
  clearCart,
  removeFromCart
} from "../controllers/cartController.js";

import { userAuth } from "../middlewares/userAuth.js";
const router = express.Router();


router.post("/add", userAuth, addToCart); 
router.get("/getcart", userAuth, getCart); 
router.delete("/remove", userAuth, removeFromCart); 
router.delete("/clear", userAuth, clearCart); 

export { router as cartRouter };