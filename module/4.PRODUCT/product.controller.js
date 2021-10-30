const { list_price_productModel } = require("../5.UTL/list_price/list_price.product.model")
const { product_itemCategoriesModels } = require("../5.UTL/product_category/product.item_categories")
const { star_productModels } = require("../5.UTL/product_star/star.product.model")
const { ProductModels } = require("./product.model")
const { PasarModels } = require("../3.PASAR/pasar.model")
const { encrypt2 } = require("../../utl/decrypt-encrypt")
const { product_itemTypeModels } = require("../5.UTL/product_type/product.item_type")
const { getStorage, ref, uploadBytes } = require("firebase/storage")
const { storage_firebase } = require("../../service/firebase")
const { bucket } = require("../../utl/google-cloud-storage/bucket")
const { wishlist_user_models } = require("../4.PRODUCT.WISTLIST/product.wistlist.models")
const { getID } = require("../../utl/token")

exports.getDetailProduct = async (req, res) => {
  const { id } = req.params
  try {

    const product = await ProductModels.findOne({ _id: id })
    const list_price = await list_price_productModel.find()
    const star = await star_productModels.find()
    const pasar = await PasarModels.find()
    const getType = await product_itemCategoriesModels.find()
    const getCategories = await product_itemTypeModels.find()
    const getWishlist = await wishlist_user_models.find()

    const info_pasar = (props) => (
      {
        id_pasar: pasar.filter(id => `${id._id}` === `${props}`)[0]._id,
        nama_pasar: pasar.filter(id => `${id._id}` === `${props}`)[0].nama_pasar,
        lat: pasar.filter(id => `${id._id}` === `${props}`)[0].lat,
        long: pasar.filter(id => `${id._id}` === `${props}`)[0].long,
        info_address: pasar.filter(id => `${id._id}` === `${props}`)[0].info_address
      }
    )




    const data = {
      id_product: product._id,
      info_pasar: info_pasar(product.id_pasar),
      desc: product.desc,
      // item_categories: product.item_type, //type === categories
      item_categories: getCategories.find(cat => `${cat._id}` === `${product.item_type}`).nama_tipe,
      item_type: getType.find(cat => `${cat._id}` === `${product.item_categories}`).nama_kategori, //type === category
      handling_fee: getType.find(cat => `${cat._id}` === `${product.item_categories}`).handling_fee,
      nama_produk: product.nama_produk,
      img: product.img,
      // characteristics: product.characteristics,
      // handling_fee: product.handling_fee,
      list_variant: list_price.filter(id => `${id.id_product}` === `${product._id}`)[0].variant,
      review: star.filter(id => `${id.id_product}` === `${product._id}`)[0].list_preview,
      created_at: product.created_at,
      updated_at: product.updated_at,
      wishlist: req.headers.authorization ? getWishlist.filter(id => `${id.id_product}` === `${product._id}`).length > 0 ? true : false : false,
    }

    res.status(200).json({
      status: 200,
      data: encrypt2({ success: data })
      // success: data
    })


  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.GetAllProduct = async (req, res) => {

  try {

    const product = await ProductModels.find({ confirmation: true })
    const list_price = await list_price_productModel.find()
    const star = await star_productModels.find()
    const pasar = await PasarModels.find()

    const info_pasar = (props) => (
      {
        id_pasar: pasar.filter(id => `${id._id}` === `${props}`)[0]._id,
        nama_pasar: pasar.filter(id => `${id._id}` === `${props}`)[0].nama_pasar,
        lat: pasar.filter(id => `${id._id}` === `${props}`)[0].lat,
        long: pasar.filter(id => `${id._id}` === `${props}`)[0].long,
        info_address: pasar.filter(id => `${id._id}` === `${props}`)[0].info_address
      }
    )

    const rate = (props) => star.filter(id => `${id.id_product}` === `${props}`)[0]

    const list_price1 = (props) => list_price.filter(id => `${id.id_product}` === `${props}`)[0]



    const data = product.map(item => (

      {
      id_product: item._id,
        info_pasar: info_pasar(item.id_pasar),
      item_type: item.item_type,
      nama_produk: item.nama_produk,
        img: item.img[0],
        list_variant: list_price1(item._id) ? list_price1(item._id).variant[0] : "empty",
        rate: JSON.stringify(rate(item._id) ? rate(item._id).list_preview.length : "empty"),
        created_at: item.created_at,
        updated_at: item.updated_at,
      }
    ))

    res.status(200).json({
      status: 200,
      data: encrypt2({ success: data })
      // success: data
    })


  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.AddProduct = async (req, res) => {
  const {
    id_pasar,
    item_categories,
    item_type,
    nama_produk,
    variant,  //array field object : highest_price , lowest_price, avg_price, uom, satuan
    desc
  } = req.body
  try {

    var counter = 0;

    let arrayURL = [];

    if (!req.files) {
      res.status(400).send('No file uploaded.');
      return;
    }

    //  Create a new blob in the bucket and upload the file data.
    req.files.forEach((fil) => {
      const newFilename = `${Date.now()}-${fil.originalname}`
      const blob = bucket.file(`product-shopping/${newFilename}`);
      const blobStream = blob.createWriteStream();


      blobStream.on("error", err => res.status(400).json({
        status: 400,
        message: `blobStream ${err}`
      }))

      blobStream.on('finish', async () => {
        counter += 1
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`

        arrayURL.push(publicUrl)
        const imageDetail = fil
        imageDetail.image = publicUrl

        if (counter >= 2) {
          const post = new ProductModels({ //post product
            id_pasar: id_pasar,
            item_categories: item_type,
            item_type: item_categories,
            desc: desc,
            nama_produk: nama_produk,
            img: arrayURL,
          })

          await post.save()
            .then(async result => {

              const postList = new list_price_productModel({ //post list_price
                id_product: result._id,
                variant: variant.map(item => JSON.parse(item))
              })

              const saveList = await postList.save()

              const postStar = new star_productModels({ //post star
                id_product: result._id
              })

              const saveStar = await postStar.save()

              console.log("ini variant", variant)
              res.status(200).json({
                status: 200,
                success: {
                  message: "Berhasil Menambahkan Barang"
                }
                // success: {
                //   product: result,
                //   list_price: saveList,
                //   list_review: saveStar
                // }
              })




            })
        }

      });

      blobStream.end(fil.buffer);
    });




  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}