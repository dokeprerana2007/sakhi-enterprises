import express from "express";
import {
  addToCart,
  getMyCart,
  clearCart,
  removeFromCart,
  updateCartQuantity,
  getSingleCartItem   // ✅ ADD THIS
} from "../controllers/cartController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ADD TO CART */
router.post("/cart/add", authMiddleware, addToCart);

/* GET CART */

router.get("/cart", authMiddleware, getMyCart);
/* GET SINGLE ITEM */
router.get("/cart/:id", authMiddleware, getSingleCartItem);

/* UPDATE QUANTITY */
router.put("/cart/update/:id", authMiddleware, updateCartQuantity);

/* REMOVE ITEM */
router.delete("/cart/remove/:id", authMiddleware, removeFromCart);

/* CLEAR CART */
router.delete("/cart/clear", authMiddleware, clearCart);

export default router;
