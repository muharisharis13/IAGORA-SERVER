const { Router } = require("express")
const { uploadImgProduct } = require("../../utl/multer")
const { checkTokenKol } = require("../../utl/token")
const { AddProduct } = require("../4.PRODUCT/product.controller")
const { getTypeAndCategory_controller } = require("../5.UTL/utl.controller")
const { KOLgetWaitingTransaction, KOLChangeToWaitingPayment, createTransaction, cancelTransaction, KOLgetWaitingTransactionDetailss } = require("../8.TRANSACTION/transaction.controller")
const { addPhoto } = require("../testing/testing.controller")
const { RegisterKolController, LoginKolController, getKol, getPasar, getProductbyIdPasar, getInfoKol, setActive } = require("./kol.controller")
const router = new Router()


router.post("/canceled", checkTokenKol, cancelTransaction)
router.post("/accepted", checkTokenKol, createTransaction)
router.get("/product/typeAndCategory", checkTokenKol, getTypeAndCategory_controller)
router.post("/product/add", checkTokenKol, uploadImgProduct, AddProduct)
router.post("/addPhoto", uploadImgProduct, addPhoto)
router.get('/getProduct/:id_pasar', checkTokenKol, getProductbyIdPasar)
router.get('/getPasar', checkTokenKol, getPasar)
router.post('/changeToWaitingPayment', checkTokenKol, KOLChangeToWaitingPayment)
router.get('/transaction/:status/:id', checkTokenKol, KOLgetWaitingTransactionDetailss)
router.get('/transaction/:status', checkTokenKol, KOLgetWaitingTransaction)


router.get("/active/:active", checkTokenKol, setActive)
router.post('/getKol', getKol)
router.get('/info', checkTokenKol, getInfoKol)
router.post('/login', LoginKolController)
router.post('/add', RegisterKolController)

exports.RouterKol = router