const { product_itemTypeModels } = require("./product_type/product.item_type")
const { product_itemCategoriesModels } = require("./product_category/product.item_categories")


exports.getTypeAndCategory_controller = async (req, res) => {
  try {

    const getCat = await product_itemTypeModels.find()
    const getType = await product_itemCategoriesModels.find()


    res.status(200).json({
      status: 200,
      success: {
        categories: getCat.map(item => ({
          id_categories: item._id,
          category_name: item.nama_tipe
        })),
        type: getType.map(item => ({
          id_type: item._id,
          type_name: item.nama_kategori,
          handling_fee: item.handling_fee
        }))
      }
    })

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}