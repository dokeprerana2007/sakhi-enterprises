import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  label: String,
  price: Number,
  sku: String
});

const extraOptionSchema = new mongoose.Schema({
  label: String,
  priceModifier: Number
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  image: String,
  description: String,
  slug: { type: String, unique: true },
  shortDescription: String,
  description: String,

  category: String,
  subCategory: String,
  materialType: String,

  images: [String],

  baseVariants: [variantSchema],
  extraOptions: [extraOptionSchema],

  isCustomizable: { type: Boolean, default: false },
  minOrderQty: { type: Number, default: 1 },
  stock: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", productSchema);