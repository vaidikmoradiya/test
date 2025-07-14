const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    addressId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addresses'  
    },
    product:{
        type:Array
    },
    subTotal:{
        type:String
    },
    discount:{
        type:String
    },
    tax:{
        type:String
    },
    deliveryCharge:{
        type:String
    },
    totalAmount:{
        type:String
    },
    paymentMethod:{
        type:String,
        enum: ["Debit / Credit Card","Net Banking","Paypal"]
    },
    orderStatus:{
        type:String,
        enum: ["Delivered","Pending","Cancelled","Return Pending" , "Return Accepted" , "Return Rejected"]
    },
    otp:{
        type:Number, 
    },
    otpExpiry:{
        type:Number,    
    },
    paymentDetail:{
        type:Object,
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('order', orderSchema);
