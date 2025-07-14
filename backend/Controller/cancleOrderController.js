const cancleOrderModal = require('../Model/cancleOrderModal');
const OrderModal = require('../Model/OrderModal')
const mongoose = require('mongoose');

exports.createCancleOrder = async (req, res) => {
    try {
        const { userId ,orderId , reason ,comment } = req.body;
 
        let cancleOrderData = await cancleOrderModal.findOne({orderId});
 
        if (cancleOrderData) {
            return res.status(400).json({ status: false, message: 'order already cancle Already Exist....' })
        }
        let orderData = await OrderModal.findOne({ _id : orderId});
 
        cancleOrderData = await cancleOrderModal.create({
            userId,
            orderId ,
            reason ,
            comment
        });
 
        orderData.orderStatus = "Cancelled";
 
        orderData.save();
        return res.status(201).json({ status: true, message: 'order cancle  successfully....', data: cancleOrderData  })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message })
    }
}
 

exports.updateCancleOrder = async (req, res) => {
    try {

        const id = req.params.id;
        const { orderId  } = req.body;
        let cancleOrderData = await cancleOrderModal.findById(id);

        if (!cancleOrderData ) {
            return res.status(404).json({ status: false, message: " order already cancle ." });
        }

        cancleOrderData  = await cancleOrderModal.findByIdAndUpdate(id,{ ...req.body }, { new: true });

        if(orderId){
            let orderData = await OrderModal.findOne({ _id : orderId});
            orderData.orderStatus = "Cancelled";
            orderData.save();
        }


        return res.status(200).json({ status: true, message: 'order cancle Successfully......', data: cancleOrderData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getAllCancleOrder = async (req, res) => {
    try {
        const cancleOrderData = await cancleOrderModal.aggregate([
            // Join user
            {
                $lookup: {
                    from: 'users',
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            // Join order
            {
                $lookup: {
                    from: 'orders',
                    localField: "orderId",
                    foreignField: "_id",
                    as: "orderData"
                }
            },
            { $unwind: { path: "$orderData", preserveNullAndEmptyArrays: true } },
            // Unwind products array inside orderData
            {
                $unwind: {
                    path: "$orderData.product",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Lookup product details
            {
                $lookup: {
                    from: 'products',
                    let: { prodId: { $toObjectId: "$orderData.product.productId" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$prodId"] } } }
                    ],
                    as: "productDetails"
                }
            },
            {
                $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Rebuild each product object (qty + product details)
            {
                $addFields: {
                    "productWithQty": {
                        $mergeObjects: [
                            { qty: "$orderData.product.qty" },
                            "$productDetails"
                        ]
                    }
                }
            },
            // Group back by cancel order (_id), and push products array
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    orderId: { $first: "$orderId" },
                    reason: { $first: "$reason" },
                    comment: { $first: "$comment" },
                    createdAt: { $first: "$createdAt" },
                    userData: { $first: "$userData" },
                    orderDetails: { $first: "$orderData" },
                    products: { $push: "$productWithQty" }
                }
            },
            // Finally, reconstruct orderData with products array
            {
                $addFields: {
                    "orderDetails.product": "$products"
                }
            },
            // Optional: Clean up temporary fields
            {
                $project: {
                    products: 0
                }
            }
        ]);
 
        if (!cancleOrderData.length) {
            return res.status(404).json({ status: false, message: 'Cancel order not found' });
        }
 
        return res.status(200).json({
            status: true,
            message: 'All cancel orders found successfully.',
            data: cancleOrderData.map(order => ({
                _id: order._id,
                userId: order.userId,
                orderId: order.orderId,
                userData: order.userData,
                orderData: order.orderDetails,
                reason: order.reason,
                comment: order.comment,
                createdAt: order.createdAt,
            }))
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

exports.getCancleOrderById = async (req, res) => {
    try {
        const id = req.params.id;
 
        const cancleOrderData = await cancleOrderModal.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            // Join user
            {
                $lookup: {
                    from: 'users',
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            // Join order
            {
                $lookup: {
                    from: 'orders',
                    localField: "orderId",
                    foreignField: "_id",
                    as: "orderData"
                }
            },
            { $unwind: { path: "$orderData", preserveNullAndEmptyArrays: true } },
            // Unwind products array inside orderData
            {
                $unwind: {
                    path: "$orderData.product",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Lookup product details
            {
                $lookup: {
                    from: 'products',
                    let: { prodId: { $toObjectId: "$orderData.product.productId" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$prodId"] } } }
                    ],
                    as: "productDetails"
                }
            },
            {
                $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Merge qty + product details
            {
                $addFields: {
                    "productWithQty": {
                        $mergeObjects: [
                            { qty: "$orderData.product.qty" },
                            "$productDetails"
                        ]
                    }
                }
            },
            // Group products back
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    orderId: { $first: "$orderId" },
                    reason: { $first: "$reason" },
                    comment: { $first: "$comment" },
                    createdAt: { $first: "$createdAt" },
                    userData: { $first: "$userData" },
                    orderDetails: { $first: "$orderData" },
                    products: { $push: "$productWithQty" }
                }
            },
            // Attach products into orderData
            {
                $addFields: {
                    "orderDetails.product": "$products"
                }
            },
            // Clean up
            {
                $project: {
                    products: 0
                }
            }
        ]);
 
        if (!cancleOrderData || !cancleOrderData.length) {
            return res.status(404).json({ status: false, message: 'Cancel order not found' });
        }
 
        return res.status(200).json({
            status: true,
            message: 'Cancel order found successfully.',
            data: cancleOrderData[0]   // Since this is by ID, return single object
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

exports.deleteCancleOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const cancleOrderData = await cancleOrderModal.findByIdAndDelete(id);
        if (!cancleOrderData) {
            return res.status(404).json({ status: false, message: 'cancle order Not Found' });
        }

        return res.status(200).json({ status: true, message: 'cancle orderDelete Sucessfully......' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}