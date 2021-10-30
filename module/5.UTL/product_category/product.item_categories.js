const mongoose = require("mongoose")

const post = mongoose.Schema({
  nama_kategori: { type: String, required: true },
  handling_fee: { type: Number, required: true }
}, { versionKey: false })

exports.product_itemCategoriesModels = mongoose.model("products.item_categories", post)


