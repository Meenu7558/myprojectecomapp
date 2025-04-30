import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: {
    public_id: { type: String, required: true },
    url: {
      type: String,
      required: true,
      default: "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model("Product", ProductSchema);
