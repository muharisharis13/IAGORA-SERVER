const mongoose = require("mongoose")


const post = mongoose.Schema({
  nama_pasar: { type: String, required: true },
  lat: { type: String, required: true },
  long: { type: String, required: true },
  info_address: {
    provinsi: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    kode_pos: { type: String, required: true },
    main: { type: Boolean, default: false }
  }

})


exports.PasarModels = mongoose.model("pasar", post)