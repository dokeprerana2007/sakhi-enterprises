import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import Cart from "../models/cart.js";
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ✅ PLACE ORDER (COD or ONLINE)
router.post("/place-order", authMiddleware, async (req, res) => {
  try {
    const { paymentMethod, address, items, totalAmount } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: "Payment method is required" });
    }
    if (!["ONLINE", "COD"].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty or invalid" });
    }
    if (!address || !address.fullName) {
      return res.status(400).json({ success: false, message: "Valid delivery address is required" });
    }
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid total amount" });
    }

    console.log(`[ORDER] ${paymentMethod} Payment | User: ${userId} | Items: ${items.length} | Total: ₹${totalAmount}`);

    // ✅ COD Flow
    if (paymentMethod === "COD") {
      const order = new Order({
        user: userId,
        items,
        address,
        totalAmount,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        status: "PLACED"
      });

      await order.save();

      // Clear cart
      await Cart.deleteMany({ user: userId });

      console.log(`[COD SUCCESS] Order ${order._id} placed`);

      return res.status(201).json({
        success: true,
        message: "Order placed with Cash on Delivery",
        orderId: order._id,
        orderData: order
      });
    }

    // ✅ ONLINE Payment Flow (Create Razorpay Order)
    if (paymentMethod === "ONLINE") {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: "INR",
        receipt: `order_${Date.now()}`
      });

      // Create Order with pending payment
      const order = new Order({
        user: userId,
        items,
        address,
        totalAmount,
        paymentMethod: "ONLINE",
        paymentStatus: "PENDING",
        razorpayOrderId: razorpayOrder.id,
        status: "PLACED"
      });

      await order.save();

      console.log(`[RAZORPAY] Order ${order._id} created | Razorpay Order: ${razorpayOrder.id}`);

      return res.status(201).json({
        success: true,
        message: "Razorpay order created",
        orderId: order._id,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency
        }
      });
    }

  } catch (error) {
    console.error("[ORDER ERROR]", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ VERIFY ONLINE PAYMENT
router.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update payment details
    order.paymentStatus = "PAID";
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.status = "CONFIRMED";

    await order.save();

    // Clear cart
    await Cart.deleteMany({ user: req.user.id });

    res.json({
      success: true,
      message: "Payment verified successfully",
      orderId: order._id
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ LEGACY: Create Razorpay Order (for backward compatibility)
router.post("/create-order", async (req, res) => {
  const amount = req.body.amount;
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR"
  });
  res.json(order);
});

// ✅ LEGACY: Verify payment
router.post("/verify", async (req, res) => {
  console.log("Payment success:", req.body);
  res.json({ success: true });
});

export default router;