const mongoose = require("mongoose")

const post = mongoose.Schema({
  id_kol: { type: mongoose.Types.ObjectId, required: true },
  insetif: { type: Number, default: 0 }
})




exports.insetifKOLModels = mongoose.model("kols.insetif", post)