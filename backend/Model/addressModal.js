const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    address: {
        type: String
    },
    pincode: {
        type: String,
    },
    country:{
        type: String,
    },
    state:{
        type: String,
    },
    city:{
        type: String,
    },
    fullName:{
        type: String,
    },
    contactNo:{
        type: String,
    },
    addressType:{
        type: String,
        enum: ["Home","Office","Other"]
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Address', addressSchema);
