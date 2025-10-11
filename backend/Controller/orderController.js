const orderModal = require('../Model/OrderModal');
const productModal = require('../Model/productModel');
const mongoose = require('mongoose');
const Stock = require("../Model/stockModel");
const Razorpay = require('razorpay');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
}); 

exports.createOrder = async (req, res) => {
  try {
    const { userId, addressId, product, discount, paymentMethod } = req.body;
    const productIds = product.map(p => p.productId);
 
    // 1. Fetch product details
    const productDetails = await productModal.find({ _id: { $in: productIds } });
 
    // 2. Check stock availability
    for (let p of product) {
      const prodDetail = productDetails.find(d => d._id.toString() === p.productId);
 
      if (!prodDetail) {
        return res.status(400).json({
          status: false,
          message: `Product not found for ID: ${p.productId}`,
        });
      }
 
      const stockItem = await Stock.findOne({ product: prodDetail._id });
 
      if (!stockItem) {
        return res.status(400).json({
          status: false,
          message: `Stock not found for product: ${prodDetail.productName || prodDetail._id}`,
        });
      }
 
      if (stockItem.qty < p.qty) {
        return res.status(400).json({
          status: false,
          message: `Insufficient stock for product: ${prodDetail.productName || prodDetail._id}. Available: ${stockItem.qty}, Requested: ${p.qty}`,
        });
      }
    }
    // 3. Calculate pricing
    let subTotal = 0;
    product.forEach(p => {
      const prodDetail = productDetails.find(d => d._id.toString() === p.productId);
      subTotal += prodDetail.discountedPrice * p.qty;
    });
 
    const tax = 18;
    const deliveryCharge = 0;
    console.log("deliveryCharge....",discount);
    const discounted = Math.round((subTotal * discount) / 100);
    console.log("discounted....",discounted);
    const discountedPrice = subTotal - discounted;
    console.log("discountedPrice....",discountedPrice);
    const taxed = Math.round((discountedPrice * tax) / 100);
    console.log("taxed....",taxed);
    const taxedPrice = discountedPrice + taxed;
    console.log("taxedPrice....",taxedPrice);
    const totalAmount = Math.round(taxedPrice + deliveryCharge);
    console.log("totalAmount....",totalAmount);
    const options = {
      amount: parseInt(totalAmount) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
  };
 
  console.log(options.amount);
 
 
  const paymentDetail = await razorpay.orders.create(options);
    // 4. Create order
    const newOrder = await orderModal.create({
      userId,
      addressId,
      product,
      subTotal,
      discount: discounted,
      tax: taxed,
      deliveryCharge,
      totalAmount,
      orderStatus: 'Pending',
      paymentDetail
    });
 
    // 5. Update product stock
    for (let p of product) {
      const prodDetail = productDetails.find(d => d._id.toString() === p.productId);
      if (prodDetail) {
        const updatedStock = await Stock.findOneAndUpdate(
          { product: prodDetail._id },
          { $inc: { qty: -p.qty } },
          { new: true, select: 'qty' }
        );
        if (updatedStock.qty <= 0) {
          await Stock.updateOne({ product: prodDetail._id }, { $set: { stockStatus: false } });
        }
      }
    }
 
    return res.status(201).json({
      status: true,
      message: "Order created successfully.",
      data: newOrder,
    });
 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};
exports.updateOrder = async (req, res) => {
    try {
        console.log(req.body);
        const id = req.params.id;
        let orderData = await orderModal.findById(id);
        const { orderStatus } = req.body;

        if (orderData.length <= 0 ) {
            return res.status(404).json({ status: false, message: "Order Not Found." });
        }
        orderData = await orderModal.findByIdAndUpdate(id, { orderStatus }, { new: true });

        return res.status(200).json({ status: true, message: 'Order Updated Successfully......', data: orderData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getAllOrder = async (req, res) => {
  try {
    const orderData = await orderModal.aggregate([
      // Join with user data
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $unwind: {
          path: '$userData',
          preserveNullAndEmptyArrays: true
        }
      },
      // Join with address data
      {
        $lookup: {
          from: 'addresses',
          localField: 'addressId',
          foreignField: '_id',
          as: 'addressData'
        }
      },
      {
        $unwind: {
          path: '$addressData',
          preserveNullAndEmptyArrays: true
        }
      },
      // Unwind the product array to work with each product
      {
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: true
        }
      },
      // Convert string ID to ObjectId
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
      // Join with products collection
      {
        $lookup: {
          from: 'products',
          localField: 'product.productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: {
          path: '$productDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      // Group back by order ID
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          addressId: { $first: '$addressId' },
          subTotal: { $first: '$subTotal' },
          discount: { $first: '$discount' },
          tax: { $first: '$tax' },
          deliveryCharge: { $first: '$deliveryCharge' },
          totalAmount: { $first: '$totalAmount' },
          paymentMethod: { $first: '$paymentMethod' },
          orderStatus: { $first: '$orderStatus' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          userData: { $first: '$userData' },
          addressData: { $first: '$addressData' },
          products: {
            $push: {
              productId: '$product.productId',
              qty: '$product.qty',
              details: '$productDetails'
            }
          }
        }
      }
    ]);

    if (orderData.length <= 0 ) {
      return res.status(404).json({ status: false, message: 'Order Not Found' });
    }

    // Process each order to add progressive status and expected delivery date
    const processedOrders = orderData.map(order => {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      orderDate.setHours(0, 0, 0, 0); // Reset time to start of day
      
      // Calculate days since order
      const daysSinceOrder = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
      
      // Determine progressive status
      let progressiveStatus = 'Order Confirmed';
      
      if (order.orderStatus !== 'Return Pending' && order.orderStatus !== 'Return Accepted' && order.orderStatus !== 'Return Rejected' && order.orderStatus !== 'Return Refunded') {
        if (daysSinceOrder >= 1) {
          progressiveStatus = 'Shipped';
        }
        if (daysSinceOrder >= 2) {
          progressiveStatus = 'Out for Delivery';
        }
        if (daysSinceOrder >= 3) {
          progressiveStatus = 'Delivered';
          order.orderStatus = 'Delivered'; // Update actual order status
        }
      }
     
     
      
      // Calculate expected delivery date (order date + 3 days)
      const expectedDeliveryDate = new Date(orderDate);
      expectedDeliveryDate.setDate(orderDate.getDate() + 3);
      
      // Add progressive status and expected delivery date to each product
      order.products = order.products.map(product => ({
        ...product,
        progressiveStatus,
        expectedDeliveryDate: expectedDeliveryDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        deliveryDate: expectedDeliveryDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).replace(/\s/g, ' ')
      }));
      
      // Add progressive status to order level
      order.progressiveStatus = progressiveStatus;
      
      return order;
    });

    return res.status(200).json({
      status: true,
      message: 'All Orders Found Successfully',
      data: processedOrders
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};
exports.getOrderById = async (req, res) => {
    try {
        const id = req.params.id;

        const orderData = await orderModal.aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(id) }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userData'
            }
          },
          {
            $unwind: {
              path: '$userData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'addresses',
              localField: 'addressId',
              foreignField: '_id',
              as: 'addressData'
            }
          },
          {
            $unwind: {
              path: '$addressData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $unwind: {
              path: '$product',
              preserveNullAndEmptyArrays: true
            }
          },
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
          {
            $lookup: {
              from: 'products',
              localField: 'product.productId',
              foreignField: '_id',
              as: 'productDetails'
            }
          },
          {
            $unwind: {
              path: '$productDetails',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $group: {
              _id: '$_id',
              userId: { $first: '$userId' },
              addressId: { $first: '$addressId' },
              subTotal: { $first: '$subTotal' },
              discount: { $first: '$discount' },
              tax: { $first: '$tax' },
              deliveryCharge: { $first: '$deliveryCharge' },
              totalAmount: { $first: '$totalAmount' },
              paymentMethod: { $first: '$paymentMethod' },
              orderStatus: { $first: '$orderStatus' },
              createdAt: { $first: '$createdAt' },
              updatedAt: { $first: '$updatedAt' },
              userData: { $first: '$userData' },
              addressData: { $first: '$addressData' },
              paymentDetail :{$first: '$paymentDetail'},
              products: {
                $push: {
                  productId: '$product.productId',
                  qty: '$product.qty',
                  details: '$productDetails'
                }
              }
            }
          }
        ]);

        if (orderData.length <= 0 ) {
            return res.status(404).json({ status: false, message: 'Order Not Found' });
        }

        // Process the order to add progressive status and expected delivery date
        const order = orderData[0];
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        orderDate.setHours(0, 0, 0, 0); // Reset time to start of day
        
        // Calculate days since order
        const daysSinceOrder = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
        
        // Determine progressive status
        let progressiveStatus = 'Order Confirmed';
        
        if (daysSinceOrder >= 1) {
          progressiveStatus = 'Shipped';
        }
        if (daysSinceOrder >= 2) {
          progressiveStatus = 'Out for Delivery';
        }
        if (daysSinceOrder >= 3) {
          progressiveStatus = 'Delivered';
          order.orderStatus = 'Delivered'; // Update actual order status
        }
        
        // Calculate expected delivery date (order date + 3 days)
        const expectedDeliveryDate = new Date(orderDate);
        expectedDeliveryDate.setDate(orderDate.getDate() + 3);
        
        // Add progressive status and expected delivery date to each product
        order.products = order.products.map(product => ({
          ...product,
          progressiveStatus,
          expectedDeliveryDate: expectedDeliveryDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          deliveryDate: expectedDeliveryDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }).replace(/\s/g, ' ')
        }));
        
        // Add progressive status to order level
        order.progressiveStatus = progressiveStatus;

        return res.status(200).json({ status: true, message: 'Order Found Successfully....', data: [order] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }

}

exports.deleteOrder = async (req, res) => {
    try {
        const id = req.params.id;

        const orderData = await orderModal.findByIdAndDelete(id);
        if (orderData.length <= 0 ) {
            return res.status(404).json({ status: false, message: 'OrderNot Found' });
        }

        return res.status(200).json({ status: true, message: 'Order Delete Sucessfully......' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}