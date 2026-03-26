import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom logging middleware to filter out 304 responses
app.use((req, res, next) => {
  const originalEnd = res.end;
  res.end = function(...args) {
    // Only log non-304 responses or actual errors
    if (res.statusCode !== 304 && res.statusCode >= 400) {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode}`);
    }
    originalEnd.apply(this, args);
  };
  next();
});

// Static folders with cache control
app.use(express.static(path.join(process.cwd(), "public"), {
  maxAge: '1d', // Cache for 1 day
  etag: false, // Disable ETags to reduce 304 responses
  lastModified: false // Disable last-modified headers
}));
app.use("/assets", express.static(path.join(process.cwd(), "assets"), {
  maxAge: '7d', // Cache assets for 7 days
  etag: false,
  lastModified: false
}));
app.use("/product", express.static(path.join(process.cwd(), "product"), {
  maxAge: '1d', // Cache product files for 1 day
  etag: false,
  lastModified: false
}));

// Routes
app.use(authRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use(adminRoutes);
app.use(productRoutes);

// CONTACT ROUTE (FIXED)
app.use("/api", contactRoutes);

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Contact page
app.get("/contact", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "contact.html"));
});

// Handle favicon requests to prevent 404 errors
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "assets", "images", "logo.png"));
});

app.get("/contact/favicon.ico", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "assets", "images", "logo.png"));
});

app.get("/contact/apple-touch-icon.png", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "assets", "images", "logo.png"));
});

// Handle React/HTML routes on Railway (only for non-API routes)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

export default app;