const mongoose = require("mongoose")


const post = mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, required: true },
  img: { type: Array },
  caption: { type: String, required: true },
  created_at: { type: Date, default: new Date() }

}, { versionKey: false })


exports.users_postingan_models = mongoose.model("users.postingan", post)