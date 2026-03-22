import dotenv from "dotenv";
dotenv.config();

import app from "./backend/app.js";
import connectDB from "./backend/config/db.js";
import paymentRoutes from "./backend/routes/paymentRoutes.js";
import { importStaticProducts } from "./backend/utils/importStaticProducts.js";
import Product from "./backend/models/Product.js";

const start = async () => {
  await connectDB();
  app.use("/api/payment", paymentRoutes);

  // If no products exist in DB, import static products on startup
  try {
    const count = await Product.countDocuments();
    if (!count) {
      console.log('No products found in DB — importing static products...');
      const res = await importStaticProducts();
      console.log('Import result:', res && res.result ? res.result : res);
    }
  } catch (err) {
    console.warn('Product import failed on startup:', err.message);
  }

  app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`);
  });
};

start();