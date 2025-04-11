import express from "express";
import { searchProducts } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", searchProducts); // Example: /api/search?query=laptop

export { router as searchRouter };
