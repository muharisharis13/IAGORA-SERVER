const { getID } = require("../../../utl/token")
const { user_product_models } = require("../USERS.PRODUCT/users.product.models")
const { users_postingan_models } = require("./users.postingan.models")
const { ObjectId1 } = require("../../../utl/ObjectId")
const { bucket } = require("../../../utl/google-cloud-storage/bucket")


exports.getPostingan = async (req, res) => {
  try {

    const getPostingan = await users_postingan_models.find()
    const getProduct = await user_product_models.find()

    const dataMap = getPostingan.map(item => ({
      id_postingan: item._id,
      img: item.img,
      caption: item.caption,
      created_at: item.created_at,
      list_product: getProduct.find(prod => `${prod.id_postingan}` === `${item._id}`).list_product.map(prod => ({
        id_product: prod._id,
        img_product: prod.img_product,
        price: prod.price,
        desc: prod.desc,
        star: prod.star
      }))
    }))



    res.status(200).json({
      status: 200,
      success: dataMap
    })


  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}


exports.addPostingan = async (req, res) => {
  const { caption } = req.body
  try {

    // if (!req.files) {
    //   res.status(400).send('No file uploaded.');
    //   return;
    // }

    // req.files.forEach((fil)=>{
    //   const newFileName = `${Date.now()}-${fil.originalname}`
    //   const blob = bucket.file(`posted-user/${newFileName}`);
    //   const blobStream = blob.createWriteStream();


    //   blobStream.on("error", err => res.status(400).json({
    //     status: 400,
    //     message: `blobStream ${err}`
    //   }))

    //   blobStream.on('finish', async () => {
    //     counter += 1
    //     // The public URL can be used to directly access the file via HTTP.
    //     const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`

    //     arrayURL.push(publicUrl)
    //     const imageDetail = fil
    //     imageDetail.image = publicUrl

    //     if (counter >= 2) {
    //       const post = new ProductModels({ //post product
    //         id_pasar: id_pasar,
    //         item_categories: item_type,
    //         item_type: item_categories,
    //         desc: desc,
    //         nama_produk: nama_produk,
    //         img: arrayURL,
    //       })

    //       await post.save()
    //         .then(async result => {

    //           const postList = new list_price_productModel({ //post list_price
    //             id_product: result._id,
    //             variant: variant.map(item => JSON.parse(item))
    //           })

    //           const saveList = await postList.save()

    //           const postStar = new star_productModels({ //post star
    //             id_product: result._id
    //           })

    //           const saveStar = await postStar.save()

    //           console.log("ini variant", variant)
    //           res.status(200).json({
    //             status: 200,
    //             success: {
    //               message: "Berhasil Menambahkan Barang"
    //             }
    //             // success: {
    //             //   product: result,
    //             //   list_price: saveList,
    //             //   list_review: saveStar
    //             // }
    //           })




    //         })
    //     }

    //   });

    //   blobStream.end(fil.buffer);
    // })


    if (req.files) {
      const URL = process.env.URL
      const post = new users_postingan_models({
        id_user: getID(req),
        caption: caption,
        img: ["https://storage.googleapis.com/iagora2/product-shopping/1635235441701-Screenshot_2021-10-22-17-15-21-743_com.ssd.iagora_user_dev.jpg", "https://storage.googleapis.com/iagora2/product-shopping/1635235441707-Screenshot_2021-10-22-17-15-12-140_com.ssd.iagora_user_dev.jpg"]
        // img: req.files.map(item => `${URL}/uploads/view/userImgPost/${item.filename}`)
      })

      await post.save()
        .then(async result => {

          const post_product = new user_product_models({
            id_postingan: result._id,
            list_product: [
              {
                title: "muharis",
                img_product: ["https://storage.googleapis.com/iagora2/product-shopping/1635235441701-Screenshot_2021-10-22-17-15-21-743_com.ssd.iagora_user_dev.jpg", "https://storage.googleapis.com/iagora2/product-shopping/1635235441707-Screenshot_2021-10-22-17-15-12-140_com.ssd.iagora_user_dev.jpg"],
                price: 2000,
                desc: "ini desc aja biasa aja",
              }
            ]
          })

          await post_product.save()
            .then(() => {
              res.status(200).json({
                status: 200,
                success: result
              })

            })
        })


    }
    else {
      res.status(400).json({
        status: 400,
        message: "No files"
      })
    }


  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}