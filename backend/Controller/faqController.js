const Faq = require("../Model/faqModel");

const createFaq = async (req,res) => {
    const {categoryId, faqQuestion, faqAnswer} = req.body;
    
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: "Category ID is required"
        });
    }
    
    const newFaq = new Faq({
        categoryId,
        faqQuestion,
        faqAnswer
    });
    try {
        const savedFaq = await newFaq.save();
        res.status(201).json({
            success: true,
            message: "FAQ's created successfully",
            data: savedFaq,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating FAQ's",
            error: error.message,
        });
    }
}

const getAllFaq = async (req,res) => {
    try {
        const faqs = await Faq.find().populate('categoryId', 'categoryName');
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching FAQ's",
            error: error.message,
        });
    }
}

const getFaqById = async (req,res) => {
    const id = req.params.id;
    try {
        const faq = await Faq.findById(id).populate('categoryId', 'categoryName');
        if (!faq) {
            return res.status(404).json({
              success: false,
              message: "FAQ's not found",
            });
        }
        res.status(200).json({
            success:true,
            data:faq
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching FAQ's",
            error: error.message,
        });
    }
}

const updateFaq = async (req,res) => {
    const id = req.params.id;
    const {categoryId, faqQuestion, faqAnswer} = req.body;
    try {
        const faq = await Faq.findByIdAndUpdate(id, {categoryId, faqQuestion, faqAnswer}, {
            new: true,
            runValidators: true
        });

        if (!faq) {
            return res.status(404).json({
            success: false,
            message: "FAQ's not found",
            });
        }
            
        res.status(200).json({
            success: true,
            message: "FAQ's updated successfully",
            data: faq,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating FAQ's",
            error: error.message,
          });
    }
}

const deleteFaq = async (req, res) => {
    try {
        const deletedFaq = await Faq.findByIdAndDelete(req.params.id);

        if (!deletedFaq) {
            return res.status(404).json({
                success: false,
                message: "FAQ's delete not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "FAQ deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting FAQ's",
            error: error.message,
        });
    }
};
 
// Get FAQs by category
const getFaqsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const faqs = await Faq.find({ categoryId }).populate('categoryId', 'categoryName');
        
        res.status(200).json({
            success: true,
            data: faqs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching FAQs by category",
            error: error.message,
        });
    }
};

module.exports = {
    createFaq,
    getAllFaq,
    getFaqById,
    updateFaq,
    deleteFaq,
    getFaqsByCategory
};

