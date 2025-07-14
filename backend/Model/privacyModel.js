const mongoose = require("mongoose");

const privacySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: [{
    type: String,
    required: true,
  }],
  listItems: [{
    type: String,
  }]
});

module.exports = mongoose.model("Privacy", privacySchema);
