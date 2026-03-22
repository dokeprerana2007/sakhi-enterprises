import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { broadcast } from '../utils/sse.js';
import { importStaticProducts as importStaticProductsUtil } from '../utils/importStaticProducts.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || "secretkey", { expiresIn: "7d" });

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });
    const match = await admin.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = signToken(admin._id);
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const token = req.body.setupToken || req.headers['x-setup-token'];
    if (!token || token !== (process.env.ADMIN_SETUP_TOKEN || 'setup-secret')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin exists' });
    const a = new Admin({ name, email, password });
    await a.save();
    res.status(201).json({ message: 'Admin created' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const dashboard = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const revenue = (revenueAgg[0] && revenueAgg[0].total) || 0;
    res.json({ usersCount, ordersCount, productsCount, revenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const addProduct = async (req, res) => {
  try {
    const { name, price, description, images, image, category, stock } = req.body;
    // normalize images: allow comma/newline-separated string or array
    let imgs = [];
    if (Array.isArray(images)) imgs = images.filter(Boolean);
    else if (typeof images === 'string' && images.trim()) imgs = images.split(/\r?\n|,/).map(s=>s.trim()).filter(Boolean);
    else if (typeof image === 'string' && image.trim()) imgs = [image.trim()];

    // enforce max 6 images
    if (imgs.length > 6) return res.status(400).json({ message: 'Maximum 6 images allowed' });

    const doc = { name, price, description, category, stock };
    if (imgs.length) { doc.images = imgs; doc.image = imgs[0]; }

    const p = new Product(doc);
    await p.save();
    // broadcast new product to SSE clients (best-effort)
    try{ broadcast('product-added', p); }catch(e){ /* ignore */ }
    res.status(201).json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // if images provided, validate length
    if (req.body && req.body.images) {
      const imgs = Array.isArray(req.body.images) ? req.body.images : (typeof req.body.images === 'string' ? req.body.images.split(/\r?\n|,/) : []);
      if (imgs.length > 6) return res.status(400).json({ message: 'Maximum 6 images allowed' });
    }
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Product.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'username email').sort({ createdAt: -1 });
    const mapped = orders.map(o => {
      const obj = (typeof o.toObject === 'function') ? o.toObject() : o;
      obj.userDisplay = obj.user ? (obj.user.username || obj.user.email || String(obj.user._id || obj.user)) : '—';
      return obj;
    });
    res.json(mapped);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['Pending','Processing','Shipped','Out for Delivery','Delivered','Cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Map order status to item status
    const statusMapping = {
      'Pending': 'CONFIRMED',
      'Processing': 'PACKED',
      'Shipped': 'SHIPPED',
      'Out for Delivery': 'OUT_FOR_DELIVERY',
      'Delivered': 'DELIVERED',

    };

    const itemStatus = statusMapping[status] || 'CONFIRMED';

    // Update order status
    order.status = status;

    // Update all items' status
    order.items.forEach(item => {
      item.status = itemStatus;
      item.statusUpdatedAt = new Date();

      if (!item.statusHistory) item.statusHistory = [];
      item.statusHistory.push({
        status: itemStatus,
        updatedAt: new Date(),
        updatedBy: req.admin._id.toString() // assuming admin auth middleware sets req.admin
      });
    });

    await order.save();

    // Broadcast status change to all connected clients
    broadcast("orderStatusUpdated", {
      orderId: order._id.toString(),
      newStatus: itemStatus,
      order: order,
      timestamp: new Date().toISOString()
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await User.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const changePassword = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Missing fields' });
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const ok = await admin.comparePassword(oldPassword);
    if (!ok) return res.status(401).json({ message: 'Invalid password' });
    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const importStaticProducts = async (req, res) => {
  try {
    const result = await importStaticProductsUtil();
    res.json({ message: 'Import completed', result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
