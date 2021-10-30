const mongoose = require("mongoose")

const post = mongoose.Schema({
  img: { type: Array }
})


exports.testingModels = mongoose.model("testing", post)