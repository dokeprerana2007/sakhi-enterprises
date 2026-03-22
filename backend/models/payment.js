const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderId: String,
  paymentId: String,
  signature: String,
  amount: Number,
  status: {
    type: String,
    default: "success"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Payment", paymentSchema);