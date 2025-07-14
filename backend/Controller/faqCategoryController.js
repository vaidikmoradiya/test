const FaqCategory = require("../Model/faqCategoryModel");

// Create new FAQ category
const createFaqCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    
    // Check if category already exists
    const existingCategory = await FaqCategory.findOne({ categoryName });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "FAQ Category already exists"
      });
    }
    
    const faqCategory = new FaqCategory({
      categoryName
    });

    const savedFaqCategory = await faqCategory.save();
    res.status(201).json({
      success: true,
      message: "FAQ Category created successfully",
      data: savedFaqCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating FAQ Category",
      error: error.message,
    });
  }
};

// Get all FAQ categories
const getAllFaqCategories = async (req, res) => {
  try {
    const faqCategories = await FaqCategory.find();
    res.status(200).json({
      success: true,
      data: faqCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching FAQ Categories",
      error: error.message,
    });
  }
};

// Get FAQ category by ID
const getFaqCategoryById = async (req, res) => {
  try {
    const faqCategory = await FaqCategory.findById(req.params.id);
    
    if (!faqCategory) {
      return res.status(404).json({
        success: false,
        message: "FAQ Category not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: faqCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching FAQ Category",
      error: error.message,
    });
  }
};

// Update FAQ category
const updateFaqCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    
    const faqCategory = await FaqCategory.findByIdAndUpdate(
      req.params.id,
      { categoryName },
      { new: true, runValidators: true }
    );
    
    if (!faqCategory) {
      return res.status(404).json({
        success: false,
        message: "FAQ Category not found",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "FAQ Category updated successfully",
      data: faqCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating FAQ Category",
      error: error.message,
    });
  }
};

// Delete FAQ category
const deleteFaqCategory = async (req, res) => {
  try {
    const faqCategory = await FaqCategory.findByIdAndDelete(req.params.id);
    
    if (!faqCategory) {
      return res.status(404).json({
        success: false,
        message: "FAQ Category not found",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "FAQ Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting FAQ Category",
      error: error.message,
    });
  }
};

module.exports = {
  createFaqCategory,
  getAllFaqCategories,
  getFaqCategoryById,
  updateFaqCategory,
  deleteFaqCategory,
};