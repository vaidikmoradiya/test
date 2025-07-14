const mongoose = require('mongoose')

const cartModal = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    qty: {
        type: Number,
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('cart', cartModal);