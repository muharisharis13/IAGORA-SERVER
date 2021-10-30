const { Router } = require("express")
const { uploadImgProduct } = require("../../utl/multer")
const { AddProduct, GetAllProduct } = require("./product.controller")
const router = new Router()

router.get("/getAll", GetAllProduct)
router.post("/add", uploadImgProduct, AddProduct)

exports.RouterProduct = router