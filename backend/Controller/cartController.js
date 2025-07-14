const mongoose = require('mongoose');
const cartModal = require('../Model/cartModal')

exports.createCart = async (req, res) => {
    const { productId, qty, userId } = req.body
    let cartData = await cartModal.findOne({ userId, productId });
    if (cartData) {
        cartData.qty += 1;
        cartData.save();
        return res.status(201).json({
            status: true,
            message: "qty add successfully",
            data: cartData
        });
    }

    cartData = await cartModal.create({
        userId,
        productId,
        qty
    })
    return res.status(201).json({
        status: true,
        message: "Cart Data created successfully",
        data: cartData
    });
}

exports.getCartByuser = async (req, res) => {
    const userId = req.params;
    try {
        const cartData = await cartModal.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                }
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
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
        ]);
        res.status(200).json({ success: true, data: cartData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.updatecart = async (req, res) => {
    const { id } = req.params;

    let cartData = await cartModal.findById(id);
    if (!cartData) {
        return res.status(400).json({ status: false, message: "cart not found" })
    }

    cartData = await cartModal.findByIdAndUpdate(id, { ...req.body })

    return res.status(201).json({
        status: true,
        message: "cart update successfully",
        data: cartData
    });
}

exports.deleteCart = async (req, res) => {
    try {
        const cartData = await cartModal.findById(req.params.id);
        if (!cartData) {
            return res.status(404).json({ success: false, error: ' cart  not found' });
        }
        await cartModal.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, msg: ' cart delete successfully !!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}