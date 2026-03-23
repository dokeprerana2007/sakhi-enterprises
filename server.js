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

  // Import static products if DB empty
  try {
    const count = await Product.countDocuments();
    if (!count) {
      console.log("No products found in DB — importing static products...");
      await importStaticProducts();
    }
  } catch (err) {
    console.warn("Product import failed:", err.message);
  }

  app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Server running`);
  });
};

start();