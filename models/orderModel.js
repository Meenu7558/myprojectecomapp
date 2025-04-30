import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sessionId: {
        type: String,
        required: true,
    },
    courses: [
        {
            courseId: {
                type: Schema.Types.ObjectId,
                ref: "Course",
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
});

export const Order = mongoose.model("Order", orderSchema);