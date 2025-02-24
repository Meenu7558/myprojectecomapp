import { Review } from "../models/reviewModel.js";
import { Product } from "../models/productModel.js";


import mongoose from "mongoose";

export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Create new review
    const newReview = new Review({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    await newReview.save();

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      ratings: avgRating.toFixed(1),
      numReviews: reviews.length,
    });

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error in addReview:", error);
    res.status(500).json({ message: error.message });
  }
};



export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    console.log("Received Product ID:", productId);

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    console.log("Fetched Reviews:", reviews);

    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found for this product" });
    }

    res.status(200).json({ data: reviews, message: "Reviews fetched successfully" });
  } catch (error) {
    console.error("Error in getProductReviews:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



  export const deleteReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role; // Assuming you store role in req.user
  
      const review = await Review.findById(reviewId);
  
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      // Allow only the user who wrote the review OR an admin to delete
      if (review.user.toString() !== userId && userRole !== "admin") {
        return res.status(403).json({ message: "Unauthorized to delete this review" });
      }
  
      await Review.findByIdAndDelete(reviewId);
  
      // Update product rating
      const reviews = await Review.find({ product: review.product });
      const avgRating = reviews.length ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;
  
      await Product.findByIdAndUpdate(review.product, {
        ratings: avgRating.toFixed(1),
        numReviews: reviews.length,
      });
  
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error in deleteReview:", error);
      res.status(500).json({ message: error.message });
    }
};
export const getAverageRating = async (req, res) => {
    try {
      const { productId } = req.params;
  
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
 
      const reviews = await Review.find({ product: productId });
  
      
      if (reviews.length === 0) {
        return res.status(200).json({ averageRating: 0, message: "No reviews yet" });
      }
  
      // Calculation
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
  
      res.status(200).json({ averageRating: averageRating.toFixed(1), totalReviews: reviews.length });
    } catch (error) {
      console.error("Error in getAverageRating:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };