const returnOrderModel = require('../Model/returnOrderModal');
const orderModal = require('../Model/OrderModal');
const userModal = require('../Model/userModel');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.returnOrderOTP = async (req, res) => {
    try {
        const { orderId, phone } = req.body;

        if (!orderId) {
            return res.status(400).json({ status: false, message: 'Missing required fields' });
        }

        // const userData = await userModal.findOne({ _id: userId });
        const orderData = await orderModal.findOne({ _id: orderId })
        if (!orderData) {
            return res.status(404).json({ status: false, message: 'order Not Found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        orderData.otp = otp;
        orderData.otpExpiry = otpExpiry;

        await sendOtpPhone(phone, otp);
        await orderData.save();

        return res.status(200).json({ status: true, message: 'OTP sent successfully' });

    } catch (error) {
        console.error('Error in returnOrderOTP:', error.message);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const sendOtpPhone = async (phone, otp) => {
    try {
        console.log(phone)
        const messageBody = `Your OTP code is: ${otp}`;

        client.messages
            .create({
                from: '+12678057672',
                to: `${phone}`,
                body: messageBody
            })
            .then(message => console.log('OTP SMS sent successfully. SID:', message))

        return true;
    } catch (error) {
        console.error('Failed to send OTP email:', error.message);
        throw new Error('Failed to send OTP email');
    }
};

exports.createRetrunOrder = async (req, res) => {
    try {
        const { userId, orderId, reason, mobileNo, otp } = req.body;

        let Data = await returnOrderModel.findOne({ userId, orderId });
        const orderData = await orderModal.findOne({ _id: orderId })

        if (Data) {
            return res.status(400).json({ status: false, message: 'Return order Already Exist....' })
        }

        if (otp === orderData.otp) {
            returnOrderData = await returnOrderModel.create({
                userId,
                orderId,
                reason,
                mobileNo
            });
            orderData.orderStatus = "Return Pending";
            orderData.save();
            return res.status(201).json({ status: true, message: 'Return order Create successfully....', data: returnOrderData })
        }
        else {
            return res.status(400).json({ status: false, message: 'invalid otp....' })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message })
    }
}

exports.updateRetrunOrder = async (req, res) => {
    try {
 
        const id = req.params.id;
        const {status} = req.body
        let returnOrderData = await returnOrderModel.findById(id);
        let orderData = await orderModal.findById(returnOrderData.orderId);
        if (!returnOrderData) {
            return res.status(400).json({ status: false, message: 'Return order is not Exist....' })
        }
        if(status){
            if(status === "Accept"){
                orderData.orderStatus = "Return Accepted"
            }
            else{
                orderData.orderStatus ="Return Rejected"
            }
            orderData.save();
        }
 
        returnOrderData = await returnOrderModel.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.status(200).json({ status: true, message: 'Return order Updated Successfully......', data: returnOrderData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getAllReturnOrder = async (req, res) => {
    try {
        const returnOrderData = await returnOrderModel.aggregate([
            // Lookup User Data
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            // Lookup Order Data
            {
                $lookup: {
                    from: "orders",
                    localField: "orderId",
                    foreignField: "_id",
                    as: "orderData"
                }
            },
            // Unwind orderData
            {
                $unwind: {
                    path: "$orderData",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Unwind each product inside orderData.product array
            {
                $unwind: {
                    path: "$orderData.product",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Lookup Product Details for each productId
            {
                $lookup: {
                    from: "products",
                    let: { prodId: { $toObjectId: "$orderData.product.productId" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$prodId"] } } }
                    ],
                    as: "orderData.product.productDetail"
                }
            },
            // Flatten productDetail array
            {
                $addFields: {
                    "orderData.product.productDetail": { $arrayElemAt: ["$orderData.product.productDetail", 0] }
                }
            },
            // Re-group back the products under each order
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    orderId: { $first: "$orderId" },
                    reason: { $first: "$reason" },
                    description: { $first: "$description" },
                    userData: { $first: "$userData" },
                    createdAt: { $first: "$createdAt" },
                    orderData: {
                        $push: {
                            _id: "$orderData._id",
                            product: "$orderData.product",
                            subTotal: "$orderData.subTotal",
                            totalAmount: "$orderData.totalAmount",
                            orderStatus: "$orderData.orderStatus"
                        }
                    }
                }
            }
        ]);
 
        if (!returnOrderData.length) {
            return res.status(404).json({ status: false, message: 'Return order Not Found' });
        }
 
        return res.status(200).json({
            status: true,
            message: 'All Return orders Found Successfully with Product Details.',
            data: returnOrderData
        });
 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};
 
 
exports.getReturnOrderById = async (req, res) => {
    try {
        const id = req.params.id;
 
        const returnOrderData = await returnOrderModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            // Lookup User Data
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            // Lookup Order Data
            {
                $lookup: {
                    from: "orders",
                    localField: "orderId",
                    foreignField: "_id",
                    as: "orderData"
                }
            },
            // Unwind orderData
            {
                $unwind: {
                    path: "$orderData",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Unwind each product in orderData.product array
            {
                $unwind: {
                    path: "$orderData.product",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Lookup Product Details for each productId
            {
                $lookup: {
                    from: "products",
                    let: { prodId: { $toObjectId: "$orderData.product.productId" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$prodId"] } } }
                    ],
                    as: "orderData.product.productDetail"
                }
            },
            // Flatten productDetail array
            {
                $addFields: {
                    "orderData.product.productDetail": { $arrayElemAt: ["$orderData.product.productDetail", 0] }
                }
            },
            // Group back products under orderData
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    orderId: { $first: "$orderId" },
                    reason: { $first: "$reason" },
                    description: { $first: "$description" },
                    userData: { $first: "$userData" },
                    orderData: {
                        $push: {
                            _id: "$orderData._id",
                            product: "$orderData.product",
                            subTotal: "$orderData.subTotal",
                            totalAmount: "$orderData.totalAmount",
                            orderStatus: "$orderData.orderStatus"
                        }
                    }
                }
            }
        ]);
 
        if (!returnOrderData.length) {
            return res.status(404).json({ status: false, message: 'Return order Not Found' });
        }
 
        return res.status(200).json({
            status: true,
            message: 'Return order Found Successfully with Product Details.',
            data: returnOrderData[0]  // Single return order by ID
        });
 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};
 

exports.deleteReturnOrder = async (req, res) => {
    try {
        const id = req.params.id;

        const returnOrderData = await returnOrderModel.findByIdAndDelete(id);
        if (!returnOrderData) {
            return res.status(404).json({ status: false, message: 'Return order Not Found' });
        }

        return res.status(200).json({ status: true, message: 'Return order Delete Sucessfully......' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}