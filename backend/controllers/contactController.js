import Contact from "../models/Contact.js";

export const saveContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      phone,
      message,
    });

    await newContact.save();

    res.json({
      success: true,
      message: "Message saved successfully",
    });
  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts" });
  }
};