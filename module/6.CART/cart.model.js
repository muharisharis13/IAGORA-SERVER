const mongoose = require('mongoose')

const post = mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, rqeuired: true },
  id_pasar: { type: mongoose.Schema.Types.ObjectId, required: true },
  id_kol: { type: String, default: "" },
  list_product: { type: Array }, // id_product , price , qty , selected default false
  status: { type: Boolean, default: false },
})


exports.CartModels = mongoose.model("cart", post)