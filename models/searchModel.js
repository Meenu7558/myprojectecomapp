import mongoose from "mongoose";

const searchSchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Optional: track which user searched
    },
    searchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Search = mongoose.model("Search", searchSchema);
