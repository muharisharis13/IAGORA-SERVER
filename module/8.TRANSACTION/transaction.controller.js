const { ObjectId1 } = require("../../utl/ObjectId")
const { getID, getDeviceToken } = require("../../utl/token")
const { ProductModels } = require("../4.PRODUCT/product.model")
const { list_price_productModel } = require("../5.UTL/list_price/list_price.product.model")
const { CartModels } = require("../6.CART/cart.model")
const { TransactionModels } = require("./transaction.model")
const { sendNotif } = require("../../service/Notification")
const { UserModels } = require("../1.USERS/users.model")
const moment = require("moment")
const schedule = require("node-schedule")
const { PasarModels } = require("../3.PASAR/pasar.model")
const { KolModels } = require("../2.KOL/kol.model");
const { ref, child, get } = require("firebase/database");
const { db_firebase } = require("../../service/firebase");
const { product_itemCategoriesModels } = require("../5.UTL/product_category/product.item_categories")
const { user_listAddressModels } = require("../5.UTL/user_address/user.list_address.models")


function deg2rad(deg) {
  return deg * (Math.PI / 180)
}
function getDistanceFromLatLonInKm({ lat1, lon1, lat2, lon2 }) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

exports.KOLChangeToWaitingPayment = async (req, res) => {
  const { id_transaction } = req.body
  try {

    await TransactionModels.findByIdAndUpdate({ _id: id_transaction }, {
      status: "WAITING_PAYMENT",
      expired: new Date(Date.now() + 3600 * 1000).toUTCString()
    })
      .then(async result => {

        await UserModels.findOne({ _id: ObjectId1(result.id_user) })
          .then(resultUser => {
            let body = {
              to: `${resultUser.device_token}`,
              priority: 'high',
              soundName: "default",
              notification: {
                title: "Menunggu Pembayaran",
                body: `Segera Lakukan Pembayaran Sampai ${moment(new Date(Date.now() + 3600 * 1000)).locale("id").format("DD MMM, LT")}`
              }
            }




            sendNotif(body)
              .then(() => {

                res.status(200).json({
                  status: 200,
                  success: result
                })

              })
              .catch(errNottif => {
                res.status(400).json({
                  status: 400,
                  messageNotif: errNottif.message
                })
              })

          })



      })

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.KOLgetWaitingTransactionDetailss = async (req, res) => {
  const { status, id } = req.params
  try {

    const getTransaction = await TransactionModels.aggregate([
      {
        $match: {
          id_kol: ObjectId1(getID(req)),
          status: status,
          _id: ObjectId1(id)
        }
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "id_user",
          as: "id_user"
        }
      },
      {
        $unwind: "$id_user"
      },
      {
        $lookup: {
          from: "kols",
          foreignField: "_id",
          localField: "id_kol",
          as: "id_kol"
        }
      },
      {
        $unwind: "$id_kol"
      },
      {
        $lookup: {
          from: "pasars",
          foreignField: "_id",
          localField: "id_pasar",
          as: "id_pasar"
        }
      },
      {
        $unwind: "$id_pasar"
      },
    ])

    const getProduct = await ProductModels.find()
    const getListPriceProduct = await list_price_productModel.find()
    const getCategory = await product_itemCategoriesModels.find()
    const getAddressUser = await user_listAddressModels.find()



    const data = getTransaction.map(item => ({
      id_transaction: item._id,
      data_user: {
        id_user: item.id_user._id,
        phone_number: item.id_user.phone_number,
        full_name: item.id_user.full_name,
        img_profile: JSON.stringify(item.id_user.img_profile)
      },
      list_product: item.list_product.map(prod => ({
        id_product: prod.id_product,
        product_name: getProduct.filter(id => `${id._id}` === `${prod.id_product}`)[0].nama_produk,
        uom: prod.uom,
        avg_price: parseInt(getListPriceProduct.filter(id => `${id.id_product}` === `${prod.id_product}`)[0].variant.filter(variant => `${prod.uom}` === `${variant.uom}`)[0].avg_price),
        bergain_price: prod.bergain_price,
        qty: prod.qty,
        handling_fee: getCategory.filter(cat => `${cat._id}` === `${getProduct.filter(id => `${id._id}` === `${prod.id_product}`)[0].item_categories}`)[0].handling_fee,
        satuan: prod.satuan
      })),
      address: getAddressUser.find(id => `${item.id_user._id}` === `${id.id_user}`).list_address.find(id => id.main === true),
      no_order: item.no_order,
      status: item.status,
      transaction_date: new Date(item.created_at).getTime()
    }))

    const data2 = data.map(item => ({
      id_transaction: item.id_transaction,
      data_user: item.data_user,
      list_product: item.list_product,
      grand_total: item.list_product.length > 1 ? item.list_product.reduce(function (acc, obj) { return acc + obj.avg_price; }, 0) : item.list_product[0].avg_price,
      biaya_penanganan: item.list_product.length > 1 ? item.list_product.reduce(function (acc, obj) { return acc + obj.handling_fee; }, 0) : item.list_product[0].handling_fee,
      adress: {
        details: `${item.address.alamat}, ${item.address.kota}, ${item.address.kelurahan}, ${item.address.kecamatan}, ${item.address.provinsi}, ${item.address.kode_pos}`,
        note: item.address.note,
        full_name: item.address.full_name,
        phone_number: item.address.phone_number,
      },
      layanan_pengiriman: "null",
      no_order: item.no_order,
      status: item.status,
      transaction_date: item.transaction_date
    }))

    res.status(200).json({
      status: 200,
      success: data2[0],
      // success: getTransaction,
    })

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.KOLgetWaitingTransaction = async (req, res) => {
  const { status } = req.params
  try {

    const getTransaction = await TransactionModels.aggregate([
      {
        $match: { id_kol: ObjectId1(getID(req)), status: status }
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "id_user",
          as: "id_user"
        }
      },
      {
        $unwind: "$id_user"
      },
      {
        $lookup: {
          from: "kols",
          foreignField: "_id",
          localField: "id_kol",
          as: "id_kol"
        }
      },
      {
        $unwind: "$id_kol"
      },
      {
        $lookup: {
          from: "pasars",
          foreignField: "_id",
          localField: "id_pasar",
          as: "id_pasar"
        }
      },
      {
        $unwind: "$id_pasar"
      },


    ])

    const getProduct = await ProductModels.find()
    const getListPriceProduct = await list_price_productModel.find()



    const data = getTransaction.map(item => ({
      id_transaction: item._id,
      data_user: {
        id_user: item.id_user._id,
        phone_number: item.id_user.phone_number,
        full_name: item.id_user.full_name,
        img_profile: JSON.stringify(item.id_user.img_profile)
      },
      list_product: item.list_product.map(prod => ({
        id_product: prod.id_product,
        product_name: getProduct.filter(id => `${id._id}` === `${prod.id_product}`)[0].nama_produk,
        uom: prod.uom,
        avg_price: parseInt(getListPriceProduct.filter(id => `${id.id_product}` === `${prod.id_product}`)[0].variant.filter(variant => `${prod.uom}` === `${variant.uom}`)[0].avg_price),
        bergain_price: prod.bergain_price,
        qty: prod.qty,
        // total: prod.total,
        satuan: prod.satuan
      })),
      no_order: item.no_order,
      status: item.status,
      transaction_date: new Date(item.created_at).getTime()
    }))

    const data2 = data.map(item => ({
      id_transaction: item.id_transaction,
      data_user: item.data_user,
      list_product: item.list_product,
      grand_total: item.list_product.length > 1 ? item.list_product.reduce(function (acc, obj) { return acc + obj.avg_price; }, 0) : item.list_product[0].avg_price,
      no_order: item.no_order,
      status: item.status,
      transaction_date: item.transaction_date
    }))

    res.status(200).json({
      status: 200,
      success: data2,
      // success: getTransaction,
    })

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}


const transactionExpired = async () => {
  console.log("transactionExpired")
  const getTransaction = await TransactionModels.find()
  const getExpired = getTransaction.filter(exp => new Date(exp.expired).getTime() <= new Date().getTime())
  if (getExpired.length > 0) {
    getExpired.map(async item => {
      await TransactionModels.findOneAndUpdate({ _id: item._id }, {
        status: "CANCEL"
      })

    })
  }

  // console.log("muharis")

}

// schedule.scheduleJob('*/1 * * * *', function () {
//   transactionExpired()
// });


exports.getWaitingTransaction = async (req, res) => {
  const { status } = req.params
  try {


    await TransactionModels.find({ status: status, id_user: getID(req) })
      .then(async result => {

        const getExpired = result.filter(exp => new Date(exp.expired).getTime() <= new Date().getTime())

        if (getExpired.length > 0) {
          getExpired.map(async item => {
            await TransactionModels.findOneAndUpdate({ _id: item._id, id_user: getID(req) }, {
              status: "CANCEL"
            })
              .then(async result1 => {
                const getTransaction = await TransactionModels.aggregate([
                  {
                    $match: { id_user: ObjectId1(getID(req)), status: status }
                  },
                  {
                    $lookup: {
                      from: "users",
                      foreignField: "_id",
                      localField: "id_user",
                      as: "id_user"
                    }
                  },
                  {
                    $unwind: "$id_user"
                  },
                  {
                    $lookup: {
                      from: "kols",
                      foreignField: "_id",
                      localField: "id_kol",
                      as: "id_kol"
                    }
                  },
                  {
                    $unwind: "$id_kol"
                  },
                  {
                    $lookup: {
                      from: "pasars",
                      foreignField: "_id",
                      localField: "id_pasar",
                      as: "id_pasar"
                    }
                  },
                  {
                    $unwind: "$id_pasar"
                  },


                ])

                const getProduct = await ProductModels.find()
                const getListPriceProduct = await list_price_productModel.find()



                const data = getTransaction.map(item => ({
                  id_transaction: item._id,

                  kol_info: {
                    id_kol: item.id_kol._id,
                    phone_number: item.id_kol.phone_number,
                    full_name: item.id_kol.full_name,
                    img_profile: item.id_kol.img_profile
                  },
                  pasar_info: {
                    id_pasar: item.id_pasar._id,
                    nama_pasar: item.id_pasar.nama_pasar,
                  },
                  list_product: item.list_product.map(prod => ({
                    id_product: prod.id_product,
                    product_name: getProduct.filter(id => `${id._id}` === `${prod.id_product}`)[0].nama_produk,
                    uom: prod.uom,
                    img: getProduct.filter(id => `${id._id}` === `${prod.id_product}`)[0].img[0],
                    avg_price: parseInt(getListPriceProduct.filter(id => `${id.id_product}` === `${prod.id_product}`)[0].variant.filter(variant => `${prod.uom}` === `${variant.uom}`)[0].avg_price), //avg_price harga induk tokda berubah
                    bergain_price: prod.bergain_price,
                    qty: prod.qty,
                    total: prod.total,
                    satuan: prod.satuan
                  })),
                  no_order: item.no_order,
                  status: item.status,
                  transaction_date: new Date(item.created_at).getTime(),
                  // expired: new Date(item.expired).toUTCString()
                  expired: new Date(item.expired).getTime()
                }))

                res.status(200).json({
                  status: 200,
                  success: data
                })

              })
          })
        }
        else {
          const getTransaction = await TransactionModels.aggregate([
            {
              $match: { id_user: ObjectId1(getID(req)), status: status }
            },
            {
              $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "id_user",
                as: "id_user"
              }
            },
            {
              $unwind: "$id_user"
            },
            {
              $lookup: {
                from: "kols",
                foreignField: "_id",
                localField: "id_kol",
                as: "id_kol"
              }
            },
            {
              $unwind: "$id_kol"
            },
            {
              $lookup: {
                from: "pasars",
                foreignField: "_id",
                localField: "id_pasar",
                as: "id_pasar"
              }
            },
            {
              $unwind: "$id_pasar"
            },


          ])

          const getProduct = await ProductModels.find()
          const getListPriceProduct = await list_price_productModel.find()



          const data = getTransaction.map(item => ({
            id_transaction: item._id,

            kol_info: {
              id_kol: item.id_kol._id,
              phone_number: item.id_kol.phone_number,
              full_name: item.id_kol.full_name,
              img_profile: item.id_kol.img_profile
            },
            pasar_info: {
              id_pasar: item.id_pasar._id,
              nama_pasar: item.id_pasar.nama_pasar,
            },
            list_product: item.list_product.map(prod => ({
              id_product: prod.id_product,
              product_name: getProduct.filter(id => `${id._id}` === `${prod.id_product}`)[0].nama_produk,
              uom: prod.uom,
              img: getProduct.filter(id => `${id._id}` === `${prod.id_product}`)[0].img[0],
              avg_price: parseInt(getListPriceProduct.filter(id => `${id.id_product}` === `${prod.id_product}`)[0].variant.filter(variant => `${prod.uom}` === `${variant.uom}`)[0].avg_price),
              bergain_price: prod.bergain_price,
              qty: prod.qty,
              total: prod.total,
              satuan: prod.satuan
            })),
            no_order: item.no_order,
            status: item.status,
            transaction_date: new Date(item.created_at).getTime(),
            // expired: new Date(item.expired).toUTCString()
            expired: new Date(item.expired).getTime()
          }))

          res.status(200).json({
            status: 200,
            success: data
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

exports.cancelTransaction = async (req, res) => {
  const { id_cart, id_user, id_pasar, list_product, index = 0 } = req.body
  try {

    console.log({
      id_pasar,
      id_user,
      id_cart
    })
    const getPasar = await PasarModels.findOne({ _id: id_pasar })
    const lat = getPasar.lat
    const long = getPasar.long

    const getWingmanModels = await KolModels.find();

    const getUser = await UserModels.findOne({ _id: id_user })

    let getWingman
    let getRadiusWingman


    const db_wingman = ref(db_firebase);
    await get(child(db_wingman, `/Geolocation`))
      .then(snapshot => {
        getWingman = Object.keys(snapshot.val()).map(item => ({
          id_wingman: item,
          data: snapshot.val()[item]
        }))

        getRadiusWingman = getWingman.map(item => ({
          id_wingman: item.id_wingman,
          radius: getDistanceFromLatLonInKm({ lat1: parseFloat(item.data.latitude), lon1: parseFloat(item.data.longitude), lat2: parseFloat(lat), lon2: parseFloat(long) })
        }))
      })
      .catch(err => {
        console.log("errnya", err)
      })



    const wingmanWithDistanceFilterUnder40 = await getRadiusWingman.slice(0, 5).sort((a, b) => (a.radius > b.radius) ? 1 : ((b.radius > a.radius) ? -1 : 0)).filter(item => parseFloat(item.radius) <= parseFloat(40.0))

    let getIndex = Math.floor(Math.random() * 2);
    // parseInt(index) + parseInt(1)
    // Math.floor(Math.random() * 5);
    const getWingmanDeviceToken = wingmanWithDistanceFilterUnder40.length > 0 ?
      wingmanWithDistanceFilterUnder40[getIndex] ?
        await getWingmanModels.filter(id => `${id._id}` === `${wingmanWithDistanceFilterUnder40[getIndex].id_wingman}`)
        : []
      : []


    console.log("ini wingman", getWingmanDeviceToken)

    if (getWingmanDeviceToken.length > 0) {
      let bodyNotif = {
        to: `${getWingmanDeviceToken[0].device_token}`,
        priority: 'high',
        soundName: "default",
        data: {
          notification: {
            title: "Orderan Masuk",
            body: `Segera Check Apps`,
            image: ""
          },
          details: {
            id_cart: id_cart,
            id_user: getUser._id,
            id_pasar: id_pasar,
            data_user: {
              phone_number: getUser.phone_number,
              full_name: getUser.full_name,
              img_profile: getUser.img_profile
            },
            list_product: list_product,
            index: getIndex
          },
          type: "new-order",

        }
      }

      await sendNotif(bodyNotif)
        .then((result) => {
          console.log("/api/v1/kol/canceled", {
            result: result,
            getIndex: getIndex
          })
          res.status(200).json({
            // getWingman: getWingman,
            // getRadiusWingman: getRadiusWingman,
            // wingmanWithDistance: wingmanWithDistance,
            // getWingmanModels: getWingmanModels,
            // result: result
            status: 200,
            success: {
              message: "Mencari Wingman Lain, yang lama gak mau",
              index: getIndex,
              result
            }
          })
        })
        .catch(errNottif => {
          console.log(getIndex)
          res.status(400).json({
            status: 400,
            messageNotif: errNottif.message
          })
        })

    }
    else {

      let bodyNotif = {
        to: `${getUser.device_token}`,
        priority: 'high',
        soundName: "default",
        notification: {
          title: "WINGMAN KOSONG",
          body: `Segera Check Apps`,
          image: ""
        },
        // data: {
        //   notification: {
        //     title: "Orderan Masuk",
        //     body: `Segera Check Apps`,
        //     image: ""
        //   },
        //   details: {
        //     id_cart: id_cart,
        //     data_user: {
        //       id_user: getUser._id,
        //       phone_number: getUser.phone_number,
        //       full_name: getUser.full_name,
        //       img_profile: getUser.img_profile
        //     },
        //     id_pasar: id_pasar,
        //     list_product: list_product,
        //     index: getIndex
        //   },
        //   type: "new-order",

        // }
      }

      await sendNotif(bodyNotif)
        .then((result) => {
          res.status(200).json({
            status: 200,
            success: {
              message: "wingmannya sudah habiss, ini index terakhir",
              index: getIndex,
              result
            }
          })
        })
        .catch(errNottif => {
          res.status(400).json({
            status: 400,
            messageNotif: errNottif.message
          })
        })


    }

  } catch (err) {
    console.log("INI ERRROR", err.message)
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}


exports.createTransaction = async (req, res) => {
  const { id_cart, id_user, id_pasar, list_product } = req.body
  try {


    const getCart = await CartModels.findOne({ _id: id_cart, id_user: id_user })
    const getTransaction = await TransactionModels.findOne({ id_user: ObjectId1(id_user), id_pasar: id_pasar, id_kol: getID(req), id_cart: id_cart })


    if (getCart) {

      if (getCart.list_product.length <= 1) { // ini kalo data product di cart di bawah 1 product

          const post = new TransactionModels({
            id_user: id_user,
            id_kol: getID(req),
            id_pasar: id_pasar,
            id_cart: id_cart,
            list_product: list_product,
            no_order: `IGR${Date.now()}`
          })

          await post.save()
            .then(async result1 => {
              await CartModels.findOneAndDelete({ _id: id_cart })

              res.status(200).json({
                status: 200,
                // code: "length product kurang dari 1",
                success: {
                  message: "success create order !",
                  // data: result1

                }
              })

            })


      }
      else {   //ini jika product di atas 1 yang berada di cart



          const post = new TransactionModels({
            id_user: id_user,
            id_kol: getID(req),
            id_pasar: id_pasar,
            id_cart: id_cart,
            list_product: list_product,
            no_order: `IGR${Date.now()}`
          })

          await post.save()


          list_product.map(item => {
            CartModels.updateOne({ _id: ObjectId1(id_cart), id_user: ObjectId1(id_user) },
              {
                $pull: {

                  list_product: {
                    id_product: ObjectId1(item.id_product),
                    uom: item.uom,
                  }
                }
              }, { multi: true }
            )
              .then(async result1 => {
                const dataProduct = await CartModels.findOne({ _id: ObjectId1(id_cart), id_user: ObjectId1(id_user) })

                if (dataProduct.list_product.length === 0) {
                  await CartModels.findOneAndDelete({ _id: ObjectId1(id_cart), id_user: ObjectId1(id_user) })
                }
                res.status(200).json({
                  status: 200,
                  // code: "length product lebih dari 1",
                  success: {
                    message: "success create order !",
                    // data: result1

                  }
                })
            })

          })




      }


    }
    else {
      res.status(400).json({
        status: 400,
        message: "no id cart"
      })

    }







  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}