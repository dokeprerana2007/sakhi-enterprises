import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getProfileData, updateAddress, addToCart, placeOrder } from "../controllers/profileController.js";

const router = express.Router();

// Profile
router.get("/profiledata", authMiddleware, getProfileData);
router.put("/update-address", authMiddleware, updateAddress);

// Cart
router.post("/add-to-cart", authMiddleware, addToCart);

// Orders
router.post("/place-order", authMiddleware, placeOrder);

export default router;
