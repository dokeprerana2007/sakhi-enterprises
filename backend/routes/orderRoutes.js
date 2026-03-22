
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { placeOrder, myOrders, getOrder, updateItemStatus } from "../controllers/orderControllers.js";
import { addClient } from "../utils/sse.js";

const router = express.Router();
router.post("/order/place", auth, placeOrder);
router.get("/my-orders", auth, myOrders);
router.get("/order/:id", auth, getOrder);

// ✅ NEW: Update item status
router.put("/order/:orderId/item/:itemIndex/status", auth, updateItemStatus);

// ✅ NEW: SSE stream for real-time order status updates
router.get("/order/status-stream/:orderId", auth, (req, res) => {
  // Client connects to this endpoint to listen for status changes
  addClient(res);
});

export default router;
