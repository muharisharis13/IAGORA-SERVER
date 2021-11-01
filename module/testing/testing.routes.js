const {Router} = require("express")
const { uploadImgProduct, processMiddleware, uploadSingle } = require("../../utl/multer")
const { getTesting, tryEncrypt, tryDecrypt, addPhoto, getDataLocation, uploadImage, sendNotifToWingman, uploadImageALibaba } = require("./testing.controller")
const routes = new Router()

routes.get("/sendNotifToWingman", sendNotifToWingman)
routes.post("/img/alibaba", uploadSingle, uploadImageALibaba)
routes.post("/img", processMiddleware, uploadImage)
routes.get("/firebase", getDataLocation)
routes.post("/addPhoto", uploadImgProduct, addPhoto)
routes.post("/decrypt", tryDecrypt)
routes.post("/encrypt", tryEncrypt)
routes.get("/", getTesting)


module.exports = routes