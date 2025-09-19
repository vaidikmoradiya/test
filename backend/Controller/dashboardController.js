const orderModal = require('../Model/OrderModal');
const productModal = require('../Model/productModel');
const returnModal = require('../Model/returnOrderModal');
const userModal = require('../Model/userModel');
const expenceModal = require('../model/expenceModal');
// const mongoose = require('mongoose');
 
// Get Best Selling Products
exports.getBestSellerProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
 
    const bestSellerProducts = await orderModal.aggregate([
      // Unwind products array
      { $unwind: "$product" },
 
      // Convert productId string to ObjectId
      {
        $addFields: {
          'product.productId': {
            $convert: {
              input: '$product.productId',
              to: 'objectId',
              onError: null,
              onNull: null
            }
          }
        }
      },
 
      // Group by productId and total quantity
      {
        $group: {
          _id: "$product.productId",
          totalOrdered: { $sum: "$product.qty" },
          count: { $sum: 1 }
        }
      },
 
      // Lookup Product details
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
 
      // Lookup Main Category
      {
        $lookup: {
          from: "maincategories",    // Collection name (check your exact collection name if needed)
          localField: "productDetails.mainCategoryId",
          foreignField: "_id",
          as: "mainCategoryData"
        }
      },
      { $unwind: { path: "$mainCategoryData", preserveNullAndEmptyArrays: true } },
 
      // Lookup Category
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.categoryId",
          foreignField: "_id",
          as: "categoryData"
        }
      },
      { $unwind: { path: "$categoryData", preserveNullAndEmptyArrays: true } },
 
      // Lookup SubCategory
      {
        $lookup: {
          from: "subcategories",
          localField: "productDetails.subCategoryId",
          foreignField: "_id",
          as: "subCategoryData"
        }
      },
      { $unwind: { path: "$subCategoryData", preserveNullAndEmptyArrays: true } },
 
      // Sort by total ordered
      { $sort: { totalOrdered: -1 } },
 
      // Limit results
      { $limit: limit }
    ]);
 
    if (bestSellerProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No best seller products found"
      });
    }
 
    return res.status(200).json({
      success: true,
      message: "Best seller products retrieved successfully",
      count: bestSellerProducts.length,
      data: bestSellerProducts
    });
 
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving best seller products",
      error: error.message
    });
  }
};
 
exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
 
    // ===== Lifetime totals =====
    const totalOrders = await orderModal.countDocuments();
    const totalProducts = await productModal.countDocuments();
    const totalUsers = await userModal.countDocuments({ role: "User" });
 
    // Count lifetime return orders
    const totalReturns = await orderModal.countDocuments({
      orderStatus: { $in: ["Return Pending", "Return Accepted", "Return Rejected"] }
    });
 
    // ===== Current month data =====
    const currentOrders = await orderModal.countDocuments({ createdAt: { $gte: firstDayCurrentMonth, $lte: now } });
    const currentReturns = await orderModal.countDocuments({
      createdAt: { $gte: firstDayCurrentMonth, $lte: now },
      orderStatus: { $in: ["Return Pending", "Return Accepted", "Return Rejected"] }
    });
    const currentProducts = await productModal.countDocuments({ createdAt: { $gte: firstDayCurrentMonth, $lte: now } });
    const currentUsers = await userModal.countDocuments({ role: "User", createdAt: { $gte: firstDayCurrentMonth, $lte: now } });
 
    // ===== Previous data (before this month) =====
    const prevOrders = await orderModal.countDocuments({ createdAt: { $lt: firstDayCurrentMonth } });
    const prevReturns = await orderModal.countDocuments({
      createdAt: { $lt: firstDayCurrentMonth },
      orderStatus: { $in: ["Return Pending", "Return Accepted", "Return Rejected"] }
    });
    const prevProducts = await productModal.countDocuments({ createdAt: { $lt: firstDayCurrentMonth } });
    const prevUsers = await userModal.countDocuments({ role: "User", createdAt: { $lt: firstDayCurrentMonth } });
 
    // ===== Growth calculation =====
    const calcGrowth = (current, prev) => {
      if (prev === 0) {
        if (current === 0) return "0%";
        return `${(current * 100).toFixed(2)}%`;
      }
      const growth = ((current - prev) / prev) * 100;
      return `${growth >= 0 ? "+" : ""}${growth.toFixed(2)}%`;
    };
 
    // ===== Return trend (how many returns out of total orders) =====
    const returnRate = totalOrders > 0 ? ((totalReturns / totalOrders) * 100).toFixed(2) : "0.00";
 
    // ===== Reshape into metrics format =====
    const metrics = [
      {
        title: "Total Orders",
        value: totalOrders,
        trend: calcGrowth(currentOrders, prevOrders),
      },
      {
        title: "Total Products",
        value: totalProducts,
        trend: calcGrowth(currentProducts, prevProducts),
      },
      {
        title: "Return Orders",
        value: totalReturns,
        trend: `${returnRate}%`, // returns as percentage of total orders
      },
      {
        title: "Active Users",
        value: totalUsers,
        trend: calcGrowth(currentUsers, prevUsers),
      }
    ];
 
    return res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: metrics
    });
 
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving dashboard data",
      error: error.message
    });
  }
};
 
exports.getOrderSummary = async (req, res) => {
  try {
    const orders = await orderModal.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      }
    ]);
 
 
    // Optional: Reformat as key-value pair
   
    res.status(200).json({
      success: true,
      message: "order summary retrieved successfully",
      data: orders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
 
exports.getIncomeAndExpense = async (req, res) => {
  try {
    // Get Income from orders
    const income = await orderModal.aggregate([
      {
        $match: {
          orderStatus: "Delivered"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalIncome: { $sum: { $toDouble: "$totalAmount" } }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalIncome: 1
        }
      }
    ]);
 
    // Get Expense from expenses
    const expense = await expenceModal.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalExpense: { $sum: { $toDouble: "$price" } }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalExpense: 1
        }
      }
    ]);
 
    res.status(200).json({
      income,
      expense
    });
 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
exports.getRevenueByLocation = async (req, res) => {
  try {
    const countryRevenue = await orderModal.aggregate([
      {
        $match: {
          orderStatus: "Delivered"
        }
      },
      {
        $lookup: {
          from: "addresses",
          localField: "addressId",
          foreignField: "_id",
          as: "addressData"
        }
      },
      { $unwind: "$addressData" },
 
      {
        $group: {
          _id: "$addressData.country",
          totalRevenue: { $sum: { $toDouble: "$totalAmount" } }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 5
      }
    ]);
 
    // ✅ Calculate total revenue across these top 5 countries
    const grandTotalRevenue = countryRevenue.reduce((acc, curr) => acc + curr.totalRevenue, 0);
 
    // ✅ Convert each country's revenue into percentage
    const result = countryRevenue.map(item => ({
      country: item._id,
      revenuePercent: parseFloat(((item.totalRevenue / grandTotalRevenue) * 100).toFixed(2))   // keep 2 decimal places
    }));
 
    res.status(200).json({ success: true, data: result });
 
  } catch (error) {
    console.error("Error in getRevenueByLocation:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};