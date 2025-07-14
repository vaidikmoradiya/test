const mongoose = require("mongoose");
 
const cancleOrderSchema = mongoose.Schema({
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
    comment:{
        type:String,
    }
},{
    timesteps:true,
    versionKey:false
})
 
module.exports = mongoose.model("cancleOrder", cancleOrderSchema)