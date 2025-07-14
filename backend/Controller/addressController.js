const addressModal = require('../Model/addressModal');
const mongoose = require('mongoose');

exports.createAddress = async (req, res) => {
    try {
        const { userId , address , pincode, country ,state ,city,fullName,contactNo,addressType } = req.body;

        let Data = await addressModal.findOne({ userId, address });

        if (Data) {
            return res.status(400).json({ status: false, message: 'Address Already Exist....' })
        }

        addressData = await addressModal.create({
            userId,
            address,
            pincode,
            country,
            state,
            city,
            fullName,
            contactNo,
            addressType
        });
        return res.status(201).json({ status: true, message: 'address Create successfully....', data: addressData  })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message })
    }
}

exports.updateAddress = async (req, res) => {
    try {

        const id = req.params.id;
        let addressData = await addressModal.findById(id);

        if (!addressData) {
            return res.status(404).json({ status: false, message: "Address Not Found." });
        }

        addressData = await addressModal.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: true, message: 'Address Updated Successfully......', data: addressData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getAllAddress = async (req, res) => {
    try {
        const addressData = await addressModal.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            }
        ]);
        if (!addressData.length > 0) {
            return res.status(404).json({ status: false, message: 'address Not Found' })
        }

        return res.status(200).json({ status: true, message: 'All address Found Successfully......', data: addressData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getAddressById = async (req, res) => {
    try {
        const id = req.params.id;

        const addressData = await addressModal.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            }
        ]);

        if (!addressData ) {
            return res.status(404).json({ status: false, message: 'address Not Found' });
        }

        return res.status(200).json({ status: true, message: 'address Found Successfully....', data: addressData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }

}

exports.deleteAddress = async (req, res) => {
    try {
        const id = req.params.id;

        const addressData = await addressModal.findByIdAndDelete(id);
        if (!addressData) {
            return res.status(404).json({ status: false, message: 'address Not Found' });
        }

        return res.status(200).json({ status: true, message: 'address Delete Sucessfully......' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}