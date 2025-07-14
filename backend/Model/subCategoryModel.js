const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'maincategories'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    subCategoryName: {
        type: String,
    },
    image:{
        type:String,
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('subCategory', subCategorySchema);