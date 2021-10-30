exports.createTransaction = async (req, res) => {
  const { id_cart, id_user, id_pasar, list_product } = req.body
  try {


    const getCart = await CartModels.findOne({ _id: id_cart, id_user: id_user })
    const getTransaction = await TransactionModels.findOne({ id_user: ObjectId1(id_user), id_pasar: id_pasar, id_kol: getID(req), id_cart: id_cart })


    if (getCart) {

      if (getCart.list_product.length <= 1) { // ini kalo data product di cart di bawah 1 product


        if (getTransaction !== null) { //jika transaction ada

          list_product.map(async item => {
            await TransactionModels.findOneAndUpdate({ id_user: ObjectId1(id_user), id_pasar: id_pasar, id_kol: getID(req), id_cart: id_cart }, {
              $push: {
                list_product: {
                  id_product: ObjectId1(item.id_product),
                  bergain_price: parseInt(item.bergain_price),
                  qty: parseInt(item.qty),
                  uom: parseInt(item.uom),
                  satuan: item.satuan
                }
              }
            })
              .then(async adaTransaction => {
                await CartModels.findOneAndDelete({ _id: id_cart })

                res.status(200).json({
                  status: 200,
                  code: "length product kurang dari 1",
                  success: {
                    message: "berhasil menambah data product baru ke transaction yang ada",
                    data: adaTransaction
                  }
                })
              })



          })


        }
        else { // jika transaction nya enggak ada

          // res.json({
          //   success: "tidak ada transaction"
          // })

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
                code: "length product kurang dari 1",
                success: {
                  message: "success create order !",
                  data: result1

                }
              })

            })
        }


      }
      else {   //ini jika product di atas 1 yang berada di cart


        if (getTransaction !== null) { //jika transaction nya ada

          list_product.map(async item => {
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
              .then(async cart => {

                await TransactionModels.findOneAndUpdate({ id_user: ObjectId1(id_user), id_pasar: id_pasar, id_kol: getID(req), id_cart: id_cart }, {
                  $push: {
                    list_product: {
                      id_product: ObjectId1(item.id_product),
                      bergain_price: parseInt(item.bergain_price),
                      qty: parseInt(item.qty),
                      uom: parseInt(item.uom),
                      satuan: item.satuan
                    }
                  }
                })
                  .then(async adaTransaction => {

                    const dataProduct = await CartModels.findOne({ _id: ObjectId1(id_cart), id_user: ObjectId1(id_user) })

                    if (dataProduct.list_product.length === 0) {
                      await CartModels.findOneAndDelete({ _id: ObjectId1(id_cart), id_user: ObjectId1(id_user) })
                    }
                    res.status(200).json({
                      status: 200,
                      code: "length product lebih dari 1",
                      success: {
                        message: "berhasil menambah data product baru ke transaction yang ada",
                        data: adaTransaction
                      }
                    })

                  })
              })

          })
        }
        else { //jika transaction nya tidak ada

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
                  code: "length product lebih dari 1",
                  success: {
                    message: "success create order !",
                    data: result1

                  }
                })
              })

          })




        }


      }



      // res.status(200).json({
      //   status: 200,
      //   success: getCart.list_product.length
      // })
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