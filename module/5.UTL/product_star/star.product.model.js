const mongoose = require("mongoose")

const post = mongoose.Schema({
  id_product: { type: mongoose.Types.ObjectId, required: true },
  list_preview: { type: Array } //object field star , id_user, review

  // list_review : [
  //   {
  //     star: { type: Number, required: true, default: 0 },
  //     id_user: { type: mongoose.Types.ObjectId, required: true },
  //     review: { type: String, required: true }

  //   }
  // ]
})

exports.star_productModels = mongoose.model("products.star", post)