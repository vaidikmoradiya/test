const mongoose = require("mongoose");

const returnOrderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    },
    reason:{
        type:String,
    },
    mobileNo: {
        type: Number,
        require: true
    },
    status:{
        type:String,
        enum:['Accept','Reject']
    },
},{
    timestamps:true,
    versionKey:false
})

module.exports = mongoose.model("returnOrder", returnOrderSchema)