const { ObjectId1 } = require("../../utl/ObjectId")
const { CartModels } = require("./cart.model")
const { getID } = require("../../utl/token")
const { PasarModels } = require("../3.PASAR/pasar.model")
const { ProductModels } = require("../4.PRODUCT/product.model")
const { encrypt2 } = require("../../utl/decrypt-encrypt")
const { list_price_productModel } = require("../5.UTL/list_price/list_price.product.model")
const { product_itemCategoriesModels } = require("../5.UTL/product_category/product.item_categories")
const { KolModels } = require("../2.KOL/kol.model");
const { ref, child, get } = require("firebase/database");
const { db_firebase } = require("../../service/firebase");
const { sendNotif } = require("../../service/Notification")
const { UserModels } = require("../1.USERS/users.model")


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


exports.findWingman = async (req, res) => {
  const { id_cart, id_pasar, list_product } = req.body
  try {


    const getPasar = await PasarModels.findOne({ _id: id_pasar })
    const lat = getPasar.lat
    const long = getPasar.long

    const getWingmanModels = await KolModels.find({ active: true });

    const getUser = await UserModels.findOne({ _id: getID(req) })

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



    const wingmanWithDistanceFilterUnder40 = await getRadiusWingman.filter(item => parseFloat(item.radius) <= parseFloat(40.0))
    let getIndex = Math.floor(Math.random() * 2);
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
            console.log("/api/v1/user/wingman/find", {
              getIndex: getIndex,
              result: result
            })
            res.status(200).json({
              // getWingman: getWingman,
              // getRadiusWingman: getRadiusWingman,
              // wingmanWithDistance: wingmanWithDistance,
              // getWingmanModels: getWingmanModels,
              // result: result
              status: 200,
              success: {
                message: "Mencari Wingman"
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
    else {
      console.log("/api/v1/user/wingman/find", {
        getIndex
      })
      res.status(200).json({
        status: 200,
        success: {
          message: "wingman tidak di temukann"
        }
      })
    }

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
    console.log(err.message)
  }
}

exports.getCartProduct = async (req, res) => {
  try {

    const getCart = await CartModels.find({ id_user: getID(req), status: false })
    const getPasar = await PasarModels.find();
    const getProduct = await ProductModels.find();
    const getListPrice = await list_price_productModel.find();
    const getCategory = await product_itemCategoriesModels.find();

    const product = props => getProduct.filter(id => `${id._id}` === `${props}`)[0]

    const list_price = props => getListPrice.filter(id => `${id.id_product}` === `${props}`)[0]



    const data = getCart.map(item => ({
      id_cart: item._id,
      id_pasar: item.id_pasar,
      pasar: getPasar.filter(id => `${id._id}` === `${item.id_pasar}`)[0].nama_pasar,
      id_kol: item.id_kol,
      list_product: item.list_product.map(prod => ({
        id_product: prod.id_product,
        name_product: product(prod.id_product) ? product(prod.id_product).nama_produk : null,
        img: product(prod.id_product) ? product(prod.id_product).img[0] : null,
        avg_price: parseInt(list_price(prod.id_product) ? list_price(prod.id_product).variant.filter(id => `${id.uom}` === `${prod.uom}` && `${id.satuan}` === `${prod.satuan}`)[0].avg_price : 0),
        qty: prod.qty,
        uom: prod.uom,
        satuan: prod.satuan,
        handling_fee: product(prod.id_product) ? getCategory.filter(id => `${id._id}` === `${product(prod.id_product).item_categories}`)[0].handling_fee : null
      }))
    }))

    const data2 = data.map(item => ({
      id_cart: item.id_cart,
      id_pasar: item.id_pasar,
      pasar: item.pasar,
      id_kol: item.id_kol,
      list_product: item.list_product,
    }))

    res.status(200).json({
      status: 200,
      success: data2,
      // success: getCart
    })

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}


exports.addToCartProduct = async (req, res) => {
  const {
    id_pasar,
    id_product,
    qty,
    uom,
    satuan
  } = req.body
  try {

    const getPasar = await CartModels.findOne({ id_user: getID(req), id_pasar: id_pasar }) //check pasar



    if (getPasar) {

      const getProduct = await CartModels.findOne({ id_user: getID(req), id_pasar: id_pasar, list_product: { $elemMatch: { id_product: ObjectId1(id_product), uom: uom } } }) //check product ada atau enggak


      if (getProduct) { //untuk update qty product

        const getOneProduct = getProduct.list_product.filter(id => `${id.id_product}` === `${id_product}` && `${id.uom}` === `${uom}`)[0]

        const updateQty = parseInt(getOneProduct.qty) + parseInt(qty)

        await CartModels.findOneAndUpdate(
          { id_user: getID(req), id_pasar: id_pasar, list_product: { $elemMatch: { id_product: ObjectId1(id_product), uom: uom } } },
          {
            $set: {
              "list_product.$[product].qty": updateQty,
            }
          },
          {
            arrayFilters: [
              {
                "product.id_product": ObjectId1(id_product),
                "product.uom": uom
              }
            ]
          }
        )
        res.status(200).json({
          status: 200,
          // success: updateQtyAndPrice,
          data: encrypt2({ message: "updateQtyAndPrice" })
          // message: "updateQtyAndPrice"
        })
      }
      else { //push product baru di pasar yang sama

        await CartModels.findOneAndUpdate(
          { id_user: getID(req), id_pasar: id_pasar },
          {
            $push: {
              list_product: {
                id_product: ObjectId1(id_product),
                bergain_price: parseInt(0),
                qty: parseInt(qty),
                uom: parseInt(uom),
                satuan: satuan
              }
            }
          }
        )
        res.status(200).json({
          status: 200,
          // success: PushProductBaru,
          data: encrypt2({ message: "PushProductBaru" })
          // message: "PushProductBaru"
        })
      }

    }
    else {

      const post = new CartModels({
        id_user: getID(req),
        id_pasar: id_pasar,
        list_product: [
          {
            id_product: ObjectId1(id_product),
            bergain_price: parseInt(0),
            qty: parseInt(qty),
            uom: parseInt(uom),
            satuan: satuan
          }
        ]
      })
      await post.save()

      res.status(200).json({
        status: 200,
        // success: save,
        data: encrypt2({ message: "success add to cart !" })
        // message: "success add to cart !"
      })
    }



  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}