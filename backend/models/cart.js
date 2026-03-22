import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
