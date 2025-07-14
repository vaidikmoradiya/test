const ContactUs = require("../Model/contactUsModel");

const createContact = async (req, res) => {
    try {
        const { name, email, phoneNo, subject, message } = req.body;
        
        const contactUs = new ContactUs({
            name,
            email,
            phoneNo,
            subject,
            message
        })
        const savedContactUs = await contactUs.save()
        res.status(201).json({
            success: true,
            message: "Contact created successfully",
            data: savedContactUs
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating Contact",
            error: error.message
        })
    }
}

const getAllContact = async (req, res) => {
    try {
        const allContact = await ContactUs.find()
        res.status(201).json(allContact)
    } catch {
        res.status(400).json({
            success: false,
            message: "Error Fetching Contact",
            error: error.message
        })
    }
}

const getContactById = async (req, res) => {
    try {
        const getContact = await ContactUs.findById(req.params.id)
        if (!getContact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            })
        }
        res.status(200).json({
            success: true,
            data: getContact
        })
    } catch {
        res.status(500).json({
            success: false,
            message: "Error fetching Term & Condition",
            error: error.message
        })
    }
}

const updateContact = async (req, res) => {
    try {
        const { name, email, phoneNo, subject, message } = req.body;

        const updateContact = await ContactUs.findByIdAndUpdate(
            req.params.id,
            { name, email, phoneNo, subject, message },
            { new: true, runValidators: true }
        )
        
        if (!updateContact) {
            res.status(404).json({
                success: false,
                message: "Contact not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            data: updateContact
        })
    } catch {
        res.status(400).json({
            success: false,
            message: "Error updating Contact",
            error: error.message
        })
    }
}

const deleteContact = async (req, res) => {
    try {
        const deleteContact = await ContactUs.findByIdAndDelete(
            req.params.id
        )
        if (!deleteContact) {
            res.status(404).json({
                success: false,
                message: "Contact not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
        })
    } catch {

        res.status(400).json({
            success: false,
            message: "Error deleting Contact",
            error: error.message
        })
    }
}

module.exports = {
    createContact,
    getAllContact,
    getContactById,
    updateContact,
    deleteContact
}