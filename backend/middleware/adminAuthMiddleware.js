import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.cookies.token;
    const token = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin || admin.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

export default adminAuth;
