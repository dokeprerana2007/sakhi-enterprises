import express from "express";
import adminAuth from "../middleware/adminAuthMiddleware.js";
import * as ctrl from "../controllers/adminController.js";
import upload from '../utils/upload.js';

const router = express.Router();

// auth
router.post("/api/admin/login", ctrl.adminLogin);
router.post("/api/admin/register", ctrl.registerAdmin); // optional setup route (requires ADMIN_SETUP_TOKEN)

// protected
router.get("/api/admin/dashboard", adminAuth, ctrl.dashboard);

// products
router.get("/api/admin/products", adminAuth, ctrl.getProducts);
router.post("/api/admin/products", adminAuth, ctrl.addProduct);
router.put("/api/admin/products/:id", adminAuth, ctrl.updateProduct);
router.delete("/api/admin/products/:id", adminAuth, ctrl.deleteProduct);

// orders
router.get("/api/admin/orders", adminAuth, ctrl.getOrders);
router.get("/api/admin/orders/:id", adminAuth, ctrl.getOrder);
router.put("/api/admin/orders/:id/status", adminAuth, ctrl.updateOrderStatus);

// users
router.get("/api/admin/users", adminAuth, ctrl.getUsers);
router.delete("/api/admin/users/:id", adminAuth, ctrl.deleteUser);
router.put("/api/admin/change-password", adminAuth, ctrl.changePassword);
router.post("/api/admin/import-static-products", adminAuth, (req, res, next) => {
  if (typeof ctrl.importStaticProducts !== 'function') {
    return res.status(500).json({ message: 'importStaticProducts handler is not available' });
  }
  return ctrl.importStaticProducts(req, res, next);
});

// upload image file
router.post('/api/admin/upload', adminAuth, upload.single('file'), (req, res, next) => {
  if (typeof ctrl.uploadImage !== 'function') {
    return res.status(500).json({ message: 'uploadImage handler is not available' });
  }
  return ctrl.uploadImage(req, res, next);
});

export default router;
