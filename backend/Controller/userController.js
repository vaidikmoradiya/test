const user = require('../Model/userModel');
const address = require('../Model/addressModal')
const bcrypt = require('bcrypt');

exports.getAllUser = async (req, res) => {
    try {
        const userData = await user.find({role:"User"});
        console.log('user',userData);
        if (!userData) {
            return res.status(404).json({ status: false, message: "User Not Found1233" });
        }

        // Fetch addresses for each user
        const usersWithAddresses = await Promise.all(userData.map(async (user) => {
            const addresses = await  address.find({ userId: user._id });
            return {
                ...user.toObject(),
                addresses: addresses || [],
            };
        }));

        return res.status(200).json({
            status: true,
            message: "All Users Found Successfully...",
            data: usersWithAddresses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;

        const userData = await user.findById(id);

        if (!userData) {
            return res.status(404).json({ status: false, message: "User Not Found" });
        }

        // Fetch address(es) for the user
        const addresses = await address.find({ userId: id });

        return res.status(200).json({
            status: true,
            message: "User Found Successfully",
            data: {
                ...userData.toObject(),
                addresses: addresses || []
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.updateUserById = async (req, res) => {
    try {
        let id = req.params.id

        let updateUserId = await user.findById(id)

        if (!updateUserId) {
            return res.status(404).json({ status: 404, success: false, message: "User Not Found" })
        }

        
        if (req.file) {
            req.body.image = req.file.path
        }
        // if (req?.body?.password) {
        //     const salt = await bcrypt.genSalt(10)
        //     req.body.password = await bcrypt.hash(req.body.password, salt)
        // }

        updateUserId = await user.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, success: true, message: "User Updated SuccessFully...", data: updateUserId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteUserById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteUserId = await user.findById(id)

        if (!deleteUserId) {
            return res.status(404).json({ status: 404, success: false, message: "User Not Found" })
        }

        await user.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, success: true, message: "User Delete SuccessFully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.changePassword = async (req, res) => {
    try {
        let id = req.user._id

        let getUser = await user.findById(id)

        if (!getUser) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        let { currentPassword, newPassword, confirmPassword } = req.body

        let checkCurrentPassword = await bcrypt.compare(currentPassword, getUser.password)

        if (!checkCurrentPassword) {
            return res.status(404).json({ status: 404, message: "Invalid Current Password" })
        }

        if (newPassword !== confirmPassword) {
            return res.json({ status: 400, message: "New Password And Confirm Password Not Match" })
        }

        let salt = await bcrypt.genSalt(10);

        let hashPassword = await bcrypt.hash(newPassword, salt);

        await user.findByIdAndUpdate(id, { password: hashPassword }, { new: true });

        return res.status(200).json({ status: 200, message: "Password Update SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}