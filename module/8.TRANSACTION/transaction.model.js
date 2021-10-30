const mongoose = require("mongoose")
const moment = require("moment")

const post = new mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, required: true },
  id_kol: { type: mongoose.Schema.Types.ObjectId, required: true },
  id_pasar: { type: mongoose.Schema.Types.ObjectId, required: true },
  id_cart: { type: mongoose.Schema.Types.ObjectId, required: true },
  list_product: { type: Array },
  // id_pengiriman: { type: mongoose.Schema.Types.ObjectId, required: true },
  no_order: { type: String, required: true, unique: true },
  status: { type: String, required: true, default: "WAITING_CONFIRMATION" },
  created_at: { type: Date, default: new Date() },
  expired: { type: Date, default: new Date(Date.now() + 21600 * 1000) }
})

exports.TransactionModels = mongoose.model("transaction", post)