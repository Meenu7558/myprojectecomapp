import mongoose, { Schema } from "mongoose";
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User Model
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product", //  Product Model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Ensure at least 1 quantity
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  
);

export const Cart = mongoose.model("cart",cartSchema)
