const mongoose = require("mongoose")

const post = mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, required: true },
  id_cart: { type: mongoose.Schema.Types.ObjectId, required: true },
  list_message: { type: Array }
})


exports.ChatModel = mongoose.model("chat", post)