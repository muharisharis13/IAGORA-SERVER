const mongoose = require("mongoose")

const listPasar = mongoose.Schema({
  id_pasar: { type: mongoose.Schema.Types.ObjectId, required: true }
}, { _id: false })

const post = mongoose.Schema({
  list_pasar: [listPasar],
  phone_number: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  img_profile: { type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" },
  device_token: { type: String, default: "null" },
  balance: { type: Number, default: 0 },
  last_login: { type: Date, default: Date.now() },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
})

exports.KolModels = mongoose.model("kol", post)