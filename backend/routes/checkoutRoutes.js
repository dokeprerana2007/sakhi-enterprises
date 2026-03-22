import express from "express";
import User from "../models/User.js";
import Cart from "../models/cart.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/checkout
router.get("/", authMiddleware, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    const cartItems = await Cart.find({ user: req.user.id });

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.json({
      address: user.address,
      phone: user.phone,
      username: user.username,
      items: cartItems,
      total
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }

});

export default router;