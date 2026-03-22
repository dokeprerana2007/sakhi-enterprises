import mongoose from "mongoose";
import Profile from "../models/Profile.js";
import User from "../models/User.js";


// ================= PROFILE DATA =================
export const getProfileData = async (req, res) => {
  try {

    if (!req.user)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user._id).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      { $setOnInsert: { userId: user._id } },
      { new: true, upsert: true }
    );

    res.json({
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: profile.address || null,
      cart: profile.cart,
      orders: profile.orders
    });

  } catch (err) {

    console.error("PROFILE ERROR:", err);

    res.status(500).json({
      message: "Failed to load profile",
      error: err.message
    });
  }
};


// ================= UPDATE ADDRESS =================
export const updateAddress = async (req, res) => {
  try {

    if (!req.user)
      return res.status(401).json({ message: "Unauthorized" });

    const { fullName, street, city, state, pincode, country } = req.body;

    if (!fullName || !street || !city || !state || !pincode || !country) {
      return res.status(400).json({ message: "All fields required" });
    }

    const addressObj = {
      fullName,
      street,
      city,
      state,
      pincode,
      country,
      updatedAt: new Date()
    };

    // ✅ Always update OR create
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { address: addressObj } },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.json({
      message: "Address saved successfully",
      address: profile.address
    });

  } catch (err) {

    console.error("ADDRESS ERROR:", err);

    res.status(500).json({
      message: "Failed to save address",
      error: err.message
    });
  }
};


// ================= ADD TO CART =================
export const addToCart = async (req, res) => {
  try {

    const { productId, productName, price, quantity } = req.body;

    if (!productId || !productName || !price || !quantity) {
      return res.status(400).json({ message: "All cart fields required" });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $setOnInsert: { userId: req.user._id, cart: [] } },
      { new: true, upsert: true }
    );

    const index = profile.cart.findIndex(
      item => item.productId.toString() === productId
    );

    if (index >= 0) {
      profile.cart[index].quantity += quantity;
    } else {
      profile.cart.push({ productId, productName, price, quantity });
    }

    await profile.save();

    res.json({
      message: "Cart updated",
      cart: profile.cart
    });

  } catch (err) {

    console.error("CART ERROR:", err);

    res.status(500).json({
      message: "Failed to update cart",
      error: err.message
    });
  }
};


// ================= PLACE ORDER =================
export const placeOrder = async (req, res) => {
  try {

    const { orderId } = req.body;

    if (!orderId)
      return res.status(400).json({ message: "Order ID required" });

    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile || !profile.cart.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalPrice = profile.cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const order = {
      orderId,
      products: profile.cart,
      totalPrice,
      date: new Date()
    };

    profile.orders.push(order);
    profile.cart = [];

    await profile.save();

    res.json({
      message: "Order placed successfully",
      order
    });

  } catch (err) {

    console.error("ORDER ERROR:", err);

    res.status(500).json({
      message: "Failed to place order",
      error: err.message
    });
  }
};