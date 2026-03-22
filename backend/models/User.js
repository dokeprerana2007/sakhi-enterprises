import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  visit_reason: String
}, { timestamps: true });

export default mongoose.model("User", userSchema);
