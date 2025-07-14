const Expence = require('../model/expenceModal');

// Create Expense
exports.createExpence = async (req, res) => {
    try {
        const {expenceName , price } = req.body; 
        const newExpence = Expence.create({expenceName,price});
        res.status(201).json({ success: true, data: newExpence });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get All Expenses
exports.getAllExpences = async (req, res) => {
    try {
        const expences = await Expence.find();
        res.status(200).json({ success: true, data: expences });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Expense by ID
exports.getExpenceById = async (req, res) => {
    try {
        const expence = await Expence.findById(req.params.id);
        if (!expence) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }
        res.status(200).json({ success: true, data: expence });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Expense by ID
exports.updateExpence = async (req, res) => {
    try {
        console.log('data',req.body)
        const updatedExpence = await Expence.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedExpence) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }
        res.status(200).json({ success: true, data: updatedExpence });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete Expense by ID
exports.deleteExpence = async (req, res) => {
    try {
        const deletedExpence = await Expence.findByIdAndDelete(req.params.id);
        if (!deletedExpence) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }
        res.status(200).json({ success: true, message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
