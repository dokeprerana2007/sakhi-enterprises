import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Only latest address
  address: {
    fullName: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String },
    updatedAt: { type: Date, default: Date.now }
  },

  // Cart and orders
  cart: { type: Array, default: [] },
  orders: { type: Array, default: [] }

}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);
