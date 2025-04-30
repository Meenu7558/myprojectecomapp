import Stripe from "stripe";
import { Order } from "../models/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_API_KEY);
const client_domain = process.env.CLIENT_DOMAIN;

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { products } = req.body;

    console.log("Received Products:", products);

    if (!products || products.length === 0) {d
      return res.status(400).json({ message: "No products found for checkout" });
    }

    const lineItems = products.map((product) => {
      const productDetails = product.product;

      if (!productDetails?.name || !productDetails?.price || !productDetails?.image.url) {
        throw new Error("Product details are incomplete.");
      }

      if (isNaN(productDetails.price) || productDetails.price <= 0) {
        throw new Error("Invalid price for product.");
      }

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: productDetails.name,
            images: [productDetails.images],
            description: productDetails.description || 'No description available',
          },
          unit_amount: Math.round(productDetails.price * 100), // Convert price to cents (for INR)
        },
        quantity: product.quantity || 1,
      };
    });

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${client_domain}/user/payment/success`,
      cancel_url: `${client_domain}/user/payment/cancel`,
    });

    // Create new order after the session has been created
    const newOrder = new Order({
      userId,
      sessionId: session.id,
    });
    await newOrder.save();

    // Send back the session ID
    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const getSessionStatus = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("session=====", session);

    res.send({
      status: session?.status,
      customer_email: session?.customer_details?.email,
      session_data: session,
    });
  } catch (error) {
    res.status(error?.statusCode || 500).json(error.message || "internal server error");
  }
};
