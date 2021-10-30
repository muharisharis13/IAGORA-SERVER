const mongoose = require("mongoose")

const list_product = mongoose.Schema({
  title: { type: String, required: true, default: "null" },
  img_product: { type: Array },
  price: { type: Number, required: true, default: "null" },
  desc: { type: String, required: true, default: "null" },
  star: { type: String, default: "5.0" }
})

const post = mongoose.Schema({
  id_postingan: { type: mongoose.Schema.Types.ObjectId, required: true },
  list_product: [list_product]


}, { versionKey: false })

exports.user_product_models = mongoose.model("users.postingans.products", post)