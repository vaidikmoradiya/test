const mongoose = require("mongoose");

const termConditionSchema = mongoose.Schema({
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

module.exports = mongoose.model("TermCondition", termConditionSchema);
