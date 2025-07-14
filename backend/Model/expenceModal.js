const mongoose = require('mongoose');

const expenceSchema = new mongoose.Schema({
    expenceName: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('expence', expenceSchema);