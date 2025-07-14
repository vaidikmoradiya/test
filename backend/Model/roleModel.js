const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    roleName: {
        type: String,
        enum: ["Admin", "Service Incharge", "Customer"]
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Role', roleSchema);