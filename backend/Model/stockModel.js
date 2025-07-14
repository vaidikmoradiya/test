const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({
  mainCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mainCategory'
  },
  category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
  },
  subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategory'
  },
  product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
  },
  stockStatus: {
    type: String,
    require: true,
  },
  qty: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("Stock", stockSchema);
