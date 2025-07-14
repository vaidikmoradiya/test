const TermCondition = require("../Model/termConditionModel");

// Create new term and condition
const createTermCondition = async (req, res) => {
  try {
    const { title, description,listItems } = req.body;
    const termCondition = new TermCondition({
      title,
      description,
      listItems
    });

    const savedTermCondition = await termCondition.save();
    res.status(201).json({
      success: true,
      message: "Term & Condition created successfully",
      data: savedTermCondition,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating Term & Condition",
      error: error.message,
    });
  }
};

// Get all terms and conditions
const getAllTermConditions = async (req, res) => {
  try {
    const termConditions = await TermCondition.find();
    res.status(200).json(termConditions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Term & Conditions",
      error: error.message,
    });
  }
};

// Get term and condition by ID
const getTermConditionById = async (req, res) => {
  try {
    const termCondition = await TermCondition.findById(req.params.id);
    if (!termCondition) {
      return res.status(404).json({ 
        success: false,
        message: "Term and condition not found" 
      });
    }
    res.status(200).json({
      success: true,
      data: termCondition
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Term & Condition",
      error: error.message,
    });
  }
};

// Update term and condition
const updateTermCondition = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedTermCondition = await TermCondition.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!updatedTermCondition) {
      return res.status(404).json({ message: "Term and condition not found" });
    }
    res.status(200).json({
      success: true,
        message: "Term & condition updated successfully",
        data: updatedTermCondition,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating Term & Condition",
      error: error.message,
    });
  }
};

// Delete term and condition
const deleteTermCondition = async (req, res) => {
  try {
    const deletedTermCondition = await TermCondition.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTermCondition) {
      return res.status(404).json({
        success: false,
        message: "Term & condition not found" 
      });
    }
    res.status(200).json({
      success: true,
      message: "Term & condition deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting Term & Condition",
      error: error.message,
    });
  }
};

module.exports = {
  createTermCondition,
  getAllTermConditions,
  getTermConditionById,
  updateTermCondition,
  deleteTermCondition,
};
