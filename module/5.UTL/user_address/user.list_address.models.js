const mongoose = require("mongoose")


const list_address = mongoose.Schema({
  full_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  provinsi: { type: String, required: true },
  kota: { type: String, required: true },
  kelurahan: { type: String, required: true },
  kecamatan: { type: String, required: true },
  kode_pos: { type: String, required: true },
  note: { type: String, required: true },
  main: { type: Boolean, default: false },
  alamat: { type: String, required: true }
})

const post = mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, required: true },
  list_address: [list_address],
})

exports.user_listAddressModels = mongoose.model("users.list_address", post)