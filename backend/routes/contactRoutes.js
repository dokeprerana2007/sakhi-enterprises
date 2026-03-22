import express from "express";
import { saveContact, getAllContacts } from "../controllers/contactController.js";

const router = express.Router();


// POST contact
router.post("/contact", saveContact);


// GET all contacts
router.get("/contact", getAllContacts);


export default router;