const mongoose = require("mongoose");

const faqCategorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("faqCategory", faqCategorySchema);