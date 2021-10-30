const mongoose = require("mongoose")


const post = mongoose.Schema({
  id_product: { type: mongoose.Schema.Types.ObjectId, required: true },
  variant: { type: Array }, //field object : highest_price , lowest_price, avg_price, uom
  // variant: [
  //   {
  //     highest_price: { type: Number, required: true },
  //     lowest_price: { type: Number, required: true },
  //     avg_price: { type: Number, required: true },
  //     uom: { type: Number, required: true }
  //   }
  // ],
})

exports.list_price_productModel = mongoose.model("products.list_price", post)