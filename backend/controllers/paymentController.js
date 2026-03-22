import { getRazorpayInstance } from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "sakhi_rcpt_" + Date.now()
    });

    res.json({ success: true, order });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
