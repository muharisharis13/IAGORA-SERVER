const { ObjectId1 } = require("../../utl/ObjectId")
const { getID } = require("../../utl/token")
const { KolModels } = require("../2.KOL/kol.model")
const { CartModels } = require("../6.CART/cart.model")
const { ChatModel } = require("./chat.model")


// exports.getDetailChat = async (req, res) => {
//   const { id_chat } = req.params
//   try {
//     const getChat = await ChatModel.aggregate([
//       {
//         $match: {
//           _id: ObjectId1(id_chat),
//           id_user: ObjectId1(getID(req))
//         }
//       },
//       {
//         $lookup: {
//           from: "carts",
//           foreignField: "_id",
//           localField: "id_cart",
//           as: "info_cart"
//         }
//       },
//       { $unwind: "$info_cart" }
//     ])

//     const getKol = await KolModels.find()

//     const cart = getChat.map(item => ({
//       id_cart: item.info_cart._id,
//       id_user: item.info_cart.id_user,
//       id_pasar: item.info_cart.id_pasar,
//       id_kol: item.info_cart.id_kol,
//       list_product: item.info_cart.list_product
//     }))[0]

//     const kol = getKol.filter(id => `${id._id}` === `${cart.id_kol}`)[0]


//     const data = getChat.map(item => ({
//       id_chat: item._id,
//       info_kol: {
//         id_kol: kol._id,
//         phone_number: kol.phone_number,
//         full_name: kol.full_name,
//       },
//       info_cart: {
//         id_cart: cart._id,
//         id_user: cart.id_user,
//         id_pasar: cart.id_pasar,
//         list_product: cart.list_product
//       },
//       list_message: item.list_message
//     }))[0]

//     res.status(200).json({
//       status: 200,
//       success: data
//     })


//   } catch (err) {
//     res.status(500).json({
//       status: 500,
//       message: err.message
//     })
//   }
// }

// exports.getChat = async (req, res) => {
//   try {

//     const getChat = await ChatModel.aggregate([
//       {
//         $match: {
//           id_user: ObjectId1(getID(req))
//         }
//       },
//       {
//         $lookup: {
//           from: "carts",
//           foreignField: "_id",
//           localField: "id_cart",
//           as: "info_cart"
//         }
//       },
//       { $unwind: "$info_cart" }
//     ])

//     const getKol = await KolModels.find()

//     const cart = getChat.map(item => ({
//       id_cart: item.info_cart._id,
//       id_user: item.info_cart.id_user,
//       id_pasar: item.info_cart.id_pasar,
//       id_kol: item.info_cart.id_kol,
//       list_product: item.info_cart.list_product
//     }))[0]

//     const kol = getKol.filter(id => `${id._id}` === `${cart.id_kol}`)[0]


//     const data = getChat.map(item => ({
//       id_chat: item._id,
//       info_kol: {
//         id_kol: kol._id,
//         phone_number: kol.phone_number,
//         full_name: kol.full_name,
//       },
//       info_cart: {
//         id_cart: cart._id,
//         id_user: cart.id_user,
//         id_pasar: cart.id_pasar,
//         list_product: cart.list_product
//       },
//       list_message: item.list_message
//     }))

//     res.status(200).json({
//       status: 200,
//       success: data
//     })


//   } catch (err) {
//     res.status(500).json({
//       status: 500,
//       message: err.message
//     })
//   }
// }

// exports.addToChat = async (req, res) => {
//   const { id_cart, id_kol } = req.body
//   try {
//     const post = new ChatModel({
//       id_user: getID(req),
//       id_cart: id_cart
//     })

//     const getCart = await CartModels.findOneAndUpdate({ id_user: getID(req), _id: ObjectId1(id_cart) },
//       {
//         "id_kol": ObjectId1(id_kol)
//       })

//     await post.save()
//       .then(async result => {
//         res.status(200).json({
//           status: 200,
//           success: {
//             save: result,
//             getCart: getCart
//           },
//           message: "success add to chat !"
//         })

//       })


//   } catch (err) {
//     res.status(500).json({
//       status: 500,
//       message: err.message
//     })
//   }
// }