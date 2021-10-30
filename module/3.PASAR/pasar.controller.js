const { PasarModels } = require("./pasar.model")

exports.getPasar = async (req, res) => {
  try {

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.AddPasar = async (req, res) => {
  const {
    nama_pasar,
    lat,
    long,
    provinsi,
    city,
    address,
    kode_pos
  } = req.body
  try {
    const postPasar = new PasarModels({
      nama_pasar: nama_pasar,
      lat: lat,
      long: long,
      info_address: {
        provinsi: provinsi,
        city: city,
        address: address,
        kode_pos: kode_pos
      }
    })

    const save = await postPasar.save()



    res.status(200).json({
      status: 200,
      success: save,
      message: "success menambahkan pasar"
    })
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}