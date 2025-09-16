const Stock = require("../Model/stockModel");
const productModal = require('../Model/productModel');
const mongoose = require('mongoose');

// Helper: Recalculate and update a product's stockStatus based on total qty in Stock collection
async function recalculateProductStockStatus(productId) {
  try {
    const objectId = new mongoose.Types.ObjectId(productId);
    const result = await Stock.aggregate([
      { $match: { product: objectId } },
      {
        $group: {
          _id: '$product',
          totalQty: { $sum: { $ifNull: ['$qty', 0] } }
        }
      }
    ]);

    const totalQty = result && result.length > 0 ? result[0].totalQty : 0;
    const hasStock = totalQty > 0;
    await productModal.findByIdAndUpdate(objectId, { stockStatus: hasStock });
  } catch (err) {
    console.error('Failed to recalculate product stock status:', err.message);
  }
}
// Create new stock
const createStock = async (req, res) => {
  try {
    const { mainCategory, category, subCategory, product, stockStatus, qty } =
      req.body;

    const newStock = await Stock.create({
      mainCategory,
      category,
      subCategory,
      product,
      stockStatus,
      qty,
    });

    // Update product stockStatus based on current total qty
    await recalculateProductStockStatus(product);

    res.status(201).json({
      success: true,
      message: "Stock created successfully",
      data: newStock,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating stock",
      error: error.message,
    });
  }
};

// Update stock
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedStock = await Stock.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedStock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    // Recalculate product stock status after update
    if (updatedStock && updatedStock.product) {
      await recalculateProductStockStatus(updatedStock.product);
    }

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: updatedStock,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating stock",
      error: error.message,
    });
  }
};

// Delete stock
const deleteStockById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStock = await Stock.findByIdAndDelete(id);
    
    if (!deletedStock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    // Recalculate product stock status after deletion
    if (deletedStock && deletedStock.product) {
      await recalculateProductStockStatus(deletedStock.product);
    }

    res.status(200).json({
      success: true,
      message: "Stock deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting stock",
      error: error.message,
    });
  }
};

// Get all stocks
const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().populate('mainCategory').populate('category').populate('subCategory').populate('product');
    res.status(200).json({
      success: true,
      data: stocks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching stocks",
      error: error.message,
    });
  }
};

// Get stock by ID
const getStockById = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id);

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    res.status(200).json({
      success: true,
      data: stock,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching stock",
      error: error.message,
    });
  }
};

module.exports = {
  createStock,
  updateStock,
  deleteStockById,
  getAllStocks,
  getStockById,
};
