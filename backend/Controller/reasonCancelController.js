const ReasonCancellation = require('../Model/reasonCancelModel');

// Create reason for cancellation
const createReasonCancel = async (req, res) => {
    try {
        const { reasonCancel } = req.body;
        const newReason = new ReasonCancellation({ reasonCancel });
        const savedReason = await newReason.save();
        res.status(201).json({
            success: true,
            message: "Reason For Cancellation created successfully",
            data: savedReason,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating Reason For Cancellation",
            error: error.message,
        });
    }
};

// Get all reasons for cancellation
const getAllReasonCancel = async (req, res) => {
    try {
        const reasons = await ReasonCancellation.find();
        res.status(200).json(reasons);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching Reason For Cancellations",
            error: error.message,
        });
    }
};

// Get reason by ID
const getReasonCancelById = async (req, res) => {
    try {
        const reason = await ReasonCancellation.findById(req.params.id);
        if (!reason) {
            return res.status(404).json({
                success: false,
                message: "Reason not found" 
            });
        }
        res.status(200).json({
            success:true,
            data: reason
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching Reason",
            error: error.message,
        });
    }
};

// Update reason
const updateReasonCancel = async (req, res) => {
    try {
        const updatedReason = await ReasonCancellation.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        )
        if (!updatedReason) {
            return res.status(404).json({
                success: false,
                message: "Reason not found" 
            });
        }
        res.status(200).json({
            success: true,
            message: "Reason updated successfully",
            data: updatedReason,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete reason
const deleteReasonCancel = async (req, res) => {
    try {
        const deletedReason = await ReasonCancellation.findByIdAndDelete(req.params.id);
        if (!deletedReason) {
            return res.status(404).json({
                success: false,
                message: "Reason not found" 
            });
        }
        res.status(200).json({
            success: true,
            message: "Reason deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting Reason",
            error: error.message,
        });
    }
};

module.exports = {
    createReasonCancel,
    getAllReasonCancel,
    getReasonCancelById,
    updateReasonCancel,
    deleteReasonCancel
};