const mongoose = require("mongoose")

const post = mongoose.Schema({
  nama_tipe: { type: String, required: true },
}, { versionKey: false })


exports.product_itemTypeModels = mongoose.model("products.item_type", post)


