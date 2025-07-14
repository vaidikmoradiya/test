const mongoose = require("mongoose");

const reasonCancellationSchema = mongoose.Schema({
  reasonCancel: {
    type: String,
    require: true,
  },
  status: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("ReasonCancellation", reasonCancellationSchema);