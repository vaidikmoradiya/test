const mongoose = require('mongoose');

const sizeSchema = mongoose.Schema({
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mainCategory'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategory'
    },
    sizeName: {
        type: String
    },
    size: {
        type: String
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'unit'
    }
}, {
    timesteps: true,
    versionKey: false
});

module.exports = mongoose.model('size', sizeSchema);