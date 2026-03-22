import express from "express";
import { signup, login, profile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { logout } from "../controllers/authController.js";
import { forgotPassword } from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profiledata", authMiddleware, profile);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);

export default router;
