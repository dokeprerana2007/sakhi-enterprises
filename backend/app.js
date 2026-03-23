import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import profileRoutes from "./routes/profileRoutes.js"; // ✅ ADD THIS
import checkoutRoutes from "./routes/checkoutRoutes.js"; // ✅ ADD THIS
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.static(path.join(process.cwd(), "assets")));
app.use(express.static(path.join(process.cwd(), "product")));

app.use(authRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use("/api/profile", profileRoutes);
// Compatibility: also mount profile routes at root for legacy frontend calls
app.use(profileRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use(adminRoutes);
app.use(productRoutes);
app.use(contactRoutes);
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Catch-all handler: serve HTML files for clean URLs
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const htmlFile = path.join(process.cwd(), "public", `${page}.html`);
  
  // Check if the HTML file exists
  if (fs.existsSync(htmlFile)) {
    res.sendFile(htmlFile);
  } else {
    next(); // Continue to 404 if file doesn't exist
  }
});

export default app;
