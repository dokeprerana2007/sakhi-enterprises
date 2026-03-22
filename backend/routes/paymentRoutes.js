import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// Create order
router.post("/create-order", async (req, res) => {

  const amount = req.body.amount;

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR"
  });

  res.json(order);

});


// Verify payment
router.post("/verify", async (req, res) => {

  console.log("Payment success:", req.body);

  res.json({ success: true });

});

export default router;