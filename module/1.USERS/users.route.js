const { Router } = require("express")
const { uploadFileUserPostingan } = require("../../utl/multer")
const { checkTokenUser } = require("../../utl/token")
const { addPostingan, getPostingan } = require("../1.USER.FEED/USERS.POSTINGAN/users.postingan.controller")
const { getKol } = require("../2.KOL/kol.controller")
const { GetAllProduct, getDetailProduct } = require("../4.PRODUCT/product.controller")
const { addToCartProduct, getCartProduct, findWingman } = require("../6.CART/cart.controller")
const { createTransaction, getWaitingTransaction } = require("../8.TRANSACTION/transaction.controller")
const { RegisterUserController, LoginUserController, UserInfoController, addAddressController, SetMainAddressController, ForgotPassword } = require("./users.controller");
const schedule = require('node-schedule');
const { postWishlist } = require("../4.PRODUCT.WISTLIST/product.wistlist.controller")

const router = new Router()

router.post("/product/wishlist/add", checkTokenUser, postWishlist)
router.get("/feed/getAll/eksplorasi", getPostingan)
router.post("/feed/post", checkTokenUser, uploadFileUserPostingan, addPostingan)
router.get("/transaction/:status", checkTokenUser, getWaitingTransaction)
router.post("/prosesOrder", checkTokenUser, createTransaction)
router.post("/getKol", checkTokenUser, getKol)
router.post("/wingman/find", checkTokenUser, findWingman)
router.get("/getCart", checkTokenUser, getCartProduct)
router.post("/addToCart", checkTokenUser, addToCartProduct)
router.get("/getDetail/:id", getDetailProduct)
router.get("/getAll", GetAllProduct)
router.post('/email/sendForgot', ForgotPassword)
router.post('/address/setMain', checkTokenUser, SetMainAddressController)
router.post('/address/add', checkTokenUser, addAddressController)
router.get('/info', checkTokenUser, UserInfoController)
router.post('/login', LoginUserController)
router.post('/register', RegisterUserController)

// schedule.scheduleJob('* * * * *', function () {
//   console.log("muharis")
// });



exports.RouterUser = router