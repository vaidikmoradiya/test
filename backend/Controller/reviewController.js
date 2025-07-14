const reviewModal = require('../Model/reviewModal');
const productModel = require('../Model/productModel');
const mongoose = require('mongoose');

exports.createReview = async (req, res) => {
    try {
        const { userId, productId, rate, description } = req.body;

        let Data = await reviewModal.findOne({ userId, productId });

        if (Data) {
            return res.status(400).json({ status: false, message: 'Review Already Exist....' })
        }

        reviewData = await reviewModal.create({
            userId,
            productId,
            rate,
            description
        });

        const allReviews = await reviewModal.find({ productId });
        const totalRating = allReviews.reduce((sum, review) => sum + review.rate, 0);
        const rating = totalRating / allReviews.length;

        // Step 3: Update product rating
        await productModel.findByIdAndUpdate(productId, { rating });
        return res.status(201).json({ status: true, message: 'Review Create successfully....', data: reviewData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message })
    }
}

exports.updateReview = async (req, res) => {
    try {

        const id = req.params.id;
        let reviewData = await reviewModal.findById(id);

        if (!reviewData) {
            return res.status(400).json({ status: false, message: 'Review is not Exist....' })
        }

        reviewData = await reviewModal.findByIdAndUpdate(id, { ...req.body }, { new: true });
        console.log(reviewData);
        const productId = reviewData?.productId;
        const allReviews = await reviewModal.find({ productId });
        const totalRating = allReviews.reduce((sum, review) => sum + review.rate, 0);
        const rating = totalRating / allReviews.length;
        await productModel.findByIdAndUpdate(productId, { rating });
        return res.status(200).json({ status: true, message: 'Address Updated Successfully......', data: reviewData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getAllReview = async (req, res) => {
    try {
        const reviewData = await reviewModal.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData"
                },
            }
        ]);
        if (!reviewData.length > 0) {
            return res.status(404).json({ status: false, message: 'review Not Found' })
        }

        return res.status(200).json({ status: true, message: 'All review Found Successfully......', data: reviewData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getReviewById = async (req, res) => {
    try {
        const id = req.params.id;
        const reviewData = await reviewModal.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData"
                },
            }
        ]);
        if (!reviewData.length > 0) {
            return res.status(404).json({ status: false, message: 'review Not Found' })
        }
        return res.status(200).json({ status: true, message: 'review Found Successfully....', data: reviewData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }

}

exports.deleteReview = async (req, res) => {
    try {
        const id = req.params.id;

        const reviewData = await reviewModal.findByIdAndDelete(id);
        if (!reviewData) {
            return res.status(404).json({ status: false, message: 'review Not Found' });
        }

        return res.status(200).json({ status: true, message: 'review Delete Sucessfully......' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getCompnayProfile = async (req, res) => {
    try {
        const happyCustomer = await reviewModal.countDocuments();

        const data = {
            yearsOfExperience: '10+',
            companyGrowth: '75%',
            happyCustomer: happyCustomer,
            teamMembers: 175
        };

        res.status(200).json({
            status: true,
            message: 'Dashboard stats fetched successfully',
            data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message })
    }
}