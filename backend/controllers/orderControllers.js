import Order from "../models/Order.js";
import Cart from "../models/cart.js";
import { broadcast } from "../utils/sse.js";

/* PLACE ORDER */
export const placeOrder = async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    let totalAmount = 0;

    // 🔥 Convert frontend items to proper structure
    const formattedItems = items.map(item => {

      const price = Number(item.price);
      const quantity = Number(item.quantity);

      if (isNaN(price) || isNaN(quantity)) {
        throw new Error("Invalid price or quantity");
      }

      const totalPrice = price * quantity;
      totalAmount += totalPrice;

      return {
        name: item.name || item.productName,
        quantity,
        totalPrice,
        image: item.image || "",
        status: "CONFIRMED",
        statusHistory: [{
          status: "CONFIRMED",
          updatedAt: new Date(),
          updatedBy: "system"
        }],
        statusUpdatedAt: new Date(),
        orderDate: new Date()
      };
    });

    const order = await Order.create({
      user: req.user._id,
      items: formattedItems,
      address,
      totalAmount,
      status: "Placed"
    });

    res.status(201).json({
      success: true,
      order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* MY ORDERS */
export const myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(orders);
};

/* GET SINGLE ORDER (FOR TRACKING) */
export const getOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
};

/* ✅ UPDATE ITEM STATUS */
export const updateItemStatus = async (req, res) => {
  try {
    const { orderId, itemIndex } = req.params;
    const { newStatus, cancelReason } = req.body;

    const validStatuses = ["CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.items[itemIndex]) {
      return res.status(404).json({ message: "Item not found in order" });
    }

    const item = order.items[itemIndex];

    // Prevent status downgrade (except for cancellation)
    const currentStep = validStatuses.indexOf(item.status);
    const newStep = validStatuses.indexOf(newStatus);

    if (newStatus !== "CANCELLED" && newStep < currentStep) {
      return res.status(400).json({ message: "Cannot downgrade order status" });
    }

    // Update status and history
    item.status = newStatus;
    item.statusUpdatedAt = new Date();

    if (!item.statusHistory) item.statusHistory = [];
    item.statusHistory.push({
      status: newStatus,
      updatedAt: new Date(),
      updatedBy: req.user._id.toString()
    });

    // Handle cancellation reason
    if (newStatus === "CANCELLED" && cancelReason) {
      item.cancelReason = cancelReason;
    }

    await order.save();

    // 🔴 BROADCAST STATUS CHANGE TO ALL CONNECTED CLIENTS
    broadcast("orderStatusUpdated", {
      orderId: order._id.toString(),
      itemIndex: itemIndex,
      newStatus: newStatus,
      order: order,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Item status updated to ${newStatus}`,
      order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
