const Service = require('../Model/serviceModel');

// Get all services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.status(200).json({
            success: true,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching services",
            error: error.message
        });
    }
};

// Get service by ID
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }
        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching service",
            error: error.message
        });
    }
};

// Create new service
const createService = async (req, res) => {
    try {
        const service = new Service(req.body);
        const savedService = await service.save();
        res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: savedService
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating service",
            error: error.message
        });
    }
};

// Update service
const updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: service
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating service",
            error: error.message
        });
    }
};

// Delete service
const deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting service",
            error: error.message
        });
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
}; 