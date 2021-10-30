const { wishlist_user_models } = require("./product.wistlist.models")
const { getID } = require('../../utl/token')

// exports.getWishlist = async (req, res)=>{
//   try {

//     const getWishlist = await wishlist_user_models.find({id_user:})

//   } catch (err) {
//     res.status(500).json({
//       status:500,
//       message:err.message
//     })
//   }
// }

exports.postWishlist = async (req, res) => {
  const { id_product } = req.body
  try {

    const post = new wishlist_user_models({
      id_product: id_product,
      id_user: getID(req)
    })

    const save = await post.save()

    res.status(200).json({
      status: 200,
      success: {
        message: "Berhasil Menambahkan ke Wishlist"
      }
    })

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}