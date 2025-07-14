const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'maincategories'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategory'
    },
    productName: {
        type: String,
        require: true
    },
    sizeNameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'size'
    },
    size: {
        type: String
    },
    unit: {
        type: String
    },
    stockStatus: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number
    },
    discount: {
        type: Number
    },
    discountedPrice:{
        type:Number
    },
    productImage: [{
        type: String
    }],
    shortDescription: {
        type: String
    },
    description: {
        type: String
    },
    rating:{
        type: Number,
        default: 0
    },
    data: {
       type:Array
    },
    status:{
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model('Product', productSchema);