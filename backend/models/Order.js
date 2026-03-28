import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: "CONFIRMED"
  },
  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: String // "system", "admin", "user"
  }],
  cancelReason: {
    type: String,
    default: ""
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  statusUpdatedAt: {
    type: Date,
    default: Date.now
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [itemSchema],

  // ✅ FIXED ADDRESS STRUCTURE
  address: {
    fullName: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },

  totalAmount: {
    type: Number,
    required: true
  },
  
  // ✅ PAYMENT METHOD
  paymentMethod: {
    type: String,
    enum: ["ONLINE", "COD"],
    default: "ONLINE"
  },
  
  // ✅ PAYMENT STATUS
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  },
  
  // ✅ RAZORPAY REFERENCE (for online payments)
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  
  // ✅ ORDER STATUS
  status: {
    type: String,
    enum: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PLACED"
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);