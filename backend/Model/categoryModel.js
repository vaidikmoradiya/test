const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'maincategories'
    },
    categoryName: {
        type: String
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

module.exports = mongoose.model('Category', categorySchema);
