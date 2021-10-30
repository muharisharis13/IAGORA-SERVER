const { KolModels } = require("./kol.model")
const { PasarModels } = require("../3.PASAR/pasar.model")
const crypto = require('crypto')
const { createTokenKol, getID } = require("../../utl/token")
const { insetifKOLModels } = require("../5.UTL/insetif/insetif.KOL.model")
const { ProductModels } = require("../4.PRODUCT/product.model")
const { list_price_productModel } = require("../5.UTL/list_price/list_price.product.model")


exports.getProductbyIdPasar = async (req, res) => {
  const { id_pasar } = req.params
  try {

    const getListPrice = await list_price_productModel.find()

    await ProductModels.find({ id_pasar: id_pasar })
      .then(result => {

        const data = result.map(item => ({
          id_product: item._id,
          price: parseInt(getListPrice.find(id => `${id.id_product}` === `${item._id}`) ? getListPrice.find(id => `${id.id_product}` === `${item._id}`).variant[0].avg_price : "null"),
          // price: parseInt(getListPrice.find(id => `${id.id_product}` === `${item._id}`).variant[0].avg_price),
          id_pasar: item.id_pasar,
          item_categories: item.item_categories,
          item_type: item.item_type,
          product_name: item.nama_produk,
          desc: item.desc,
          img: item.img[0],
          characteristics: item.characteristics,
          handling_fee: item.handling_fee,
          created_at: item.created_at,
          updated_at: item.updated_at
        }))

        res.status(200).json({
          status: 200,
          success: data
        })
      })


  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.getPasar = async (req, res) => {
  try {

    const getPasar = await PasarModels.find()

    await KolModels.findOne({ _id: getID(req) })
      .then(result => {

        const data = result.list_pasar.map(item => getPasar.filter(id => `${id._id}` === `${item.id_pasar}`)[0]).map(item => ({
          id_pasar: item._id,
          nama_pasar: item.nama_pasar,
          lat: item.lat,
          long: item.long,
          info_address: item.info_address
        }))

        res.status(200).json({
          status: 200,
          success: data
        })
      })

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.getInfoKol = async (req, res) => {

  try {
    await KolModels.findOne({ _id: getID(req) })
      .then(result => {
        res.status(200).json({
          status: 200,
          success: {
            id_kol: result._id,
            phone_number: result.phone_number,
            full_name: result.full_name,
            email: result.email,
            img_profile: result.img_profile,
            balance: result.balance,
          }
        })
      })

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.getKol = async (req, res) => {
  const { id_pasar } = req.body
  try {

    const getKol = await KolModels.find({ id_pasar: id_pasar })
    const getPasar = await PasarModels.find()
    const getinsetifKol = await insetifKOLModels.find()


    const data = getKol.map(item => ({
      id_kol: item._id,
      info_pasar: {
        id_pasar: getPasar.filter(id => `${id._id}` === `${item.id_pasar}`)[0]._id,
        info_address: getPasar.filter(id => `${id._id}` === `${item.id_pasar}`)[0].info_address,
        nama_pasar: getPasar.filter(id => `${id._id}` === `${item.id_pasar}`)[0].nama_pasar
      },
      full_name: item.full_name,
      img_profile: item.img_profile,
      insetif: getinsetifKol.filter(id => `${id.id_kol}` === `${item._id}`)[0].insetif,
      rate: "0",
      quote: "ini quote belum ada API dan Rate belum ada API",

    }))

    res.status(200).json({
      status: 200,
      success: data
    })

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.LoginKolController = async (req, res) => {
  const {
    phone_number,
    password,
    device_token
  } = req.body
  try {

    await KolModels.findOne({
      phone_number: phone_number,
      password: crypto.createHash('md5').update(password).digest('hex')
    })
      .then(async result => {

        if (result) {
          res.status(200).json({
            status: 200,
            success: {
              token: createTokenKol({ payload: { data: result } })
            }
          })

          await KolModels.findOneAndUpdate({
            phone_number: phone_number,
            password: crypto.createHash('md5').update(password).digest('hex')
          },
            {
              last_login: Date.now(),
              device_token: device_token
            })

        }
        else {
          res.status(200).json({
            status: 200,
            success: "phone number atau user salah !"
          })

        }
      })

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.RegisterKolController = async (req, res) => {
  const {
    phone_number,
    full_name,
    password, email, id_pasar } = req.body
  try {
    const post = new KolModels({
      id_pasar: id_pasar,
      email: email,
      phone_number: phone_number,
      full_name: full_name,
      password: crypto.createHash('md5').update(password).digest('hex')
    })

    await post.save()
      .then(result => {
        new insetifKOLModels({ id_kol: result._id }).save()

        res.status(200).json({
          status: 200,
          success: result
        })

      })


  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}