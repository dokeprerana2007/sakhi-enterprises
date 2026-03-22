import Contact from "../models/Contact.js";


// SAVE CONTACT MESSAGE
export const saveContact = async (req, res) =>
{
    try
    {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !message)
        {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });
        }

        const newContact = new Contact({
            name,
            email,
            phone,
            message
        });

        await newContact.save();

        res.status(201).json({
            success: true,
            message: "Contact saved successfully"
        });

    }
    catch (error)
    {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET ALL CONTACTS (for admin dashboard)
export const getAllContacts = async (req, res) =>
{
    try
    {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            contacts
        });
    }
    catch (error)
    {
        res.status(500).json({
            success: false,
            message: "Error fetching contacts"
        });
    }
};