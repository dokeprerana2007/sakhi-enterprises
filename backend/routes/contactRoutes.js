import express from "express";
import { saveContact, getAllContacts } from "../controllers/contactController.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// POST contact
router.post("/contact", saveContact);

// GET all contacts (admin)
router.get("/admin/contacts", adminAuth, getAllContacts);

export default router;