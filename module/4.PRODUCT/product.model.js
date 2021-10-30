const mongoose = require("mongoose")


const post = mongoose.Schema({
  id_pasar: { type: mongoose.Schema.Types.ObjectId, required: true },
  item_categories: { type: String, required: true },
  item_type: { type: String, required: true },
  nama_produk: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: Array, required: true },
  // characteristics: { type: String, required: true },
  // handling_fee: { type: Number, required: true },
  confirmation: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() }

})

exports.ProductModels = mongoose.model("product", post)