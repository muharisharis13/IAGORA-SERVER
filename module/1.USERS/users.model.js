const mongoose = require("mongoose")

const post = mongoose.Schema({
  phone_number: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  img_profile: { type: String, default: null },

  device_token: { type: String, default: null },
  last_login: { type: Date, default: Date.now() },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
})

exports.UserModels = mongoose.model("user", post)