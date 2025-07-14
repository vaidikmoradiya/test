const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'  
    },
    rate:{
        type:Number
    },
    description:{
        type:String
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('review', reviewSchema);
