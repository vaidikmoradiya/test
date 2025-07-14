const orderModal = require('../Model/OrderModal');
const productModal = require('../Model/productModel');
const mongoose = require('mongoose');
const Stock = require("../Model/stockModel"); 

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
    const deliveryCharge = 150;
    const discounted = (subTotal * discount) / 100;
    const discountedPrice = subTotal - discounted;
    const taxed = (discountedPrice * tax) / 100;
    const taxedPrice = discountedPrice + taxed;
    const totalAmount = taxedPrice + deliveryCharge;
 
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
    return res.status(200).json({
      status: true,
      message: 'All Orders Found Successfully',
      data: orderData
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

        return res.status(200).json({ status: true, message: 'Order Found Successfully....', data: orderData });
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