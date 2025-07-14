const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    mobileNo: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    gender:{
        type: String,
        require: true
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User",
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);