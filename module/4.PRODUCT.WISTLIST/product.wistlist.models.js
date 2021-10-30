const mongoose = require("mongoose");


const post = mongoose.Schema({
  id_product: { type: mongoose.Schema.Types.ObjectId, required: true },
  id_user: { type: mongoose.Schema.Types.ObjectId, required: true }
}, { versionKey: false })

exports.wishlist_user_models = mongoose.model("users.wishlist", post)