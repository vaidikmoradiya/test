const mongoose = require("mongoose");

const contactUsSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phoneNo: {
        type: Number,
        require: true
    },
    subject: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("ContactUs", contactUsSchema)