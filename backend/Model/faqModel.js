const mongoose = require("mongoose");

const faqSchema = mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'faqCategory',
    required: true
  },
  faqQuestion: {
    type: String,
    require: true,
  },
  faqAnswer: {
    type: String,
    require: true,
  },
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("faq", faqSchema);
