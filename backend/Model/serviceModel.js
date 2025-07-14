const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    isImageOnly: {
        type: Boolean,
        default: false
    },
    hasButton: {
        type: Boolean,
        default: false
    },
    buttonText: {
        type: String,
        default: 'Explore More'
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Service', serviceSchema); 