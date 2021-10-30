const multer = require("multer");
const util = require("util")

var maxSize = 1 * 1024 * 1024;

exports.processMiddleware = util.promisify(multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSize }
}).single("img"))








let storageFileProduct = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, './uploads/img_product')
  // },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
})

exports.uploadSingle = util.promisify(
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxSize
    }
  }).single("img_single")
)

exports.uploadImgProduct = util.promisify(
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxSize
    }
  }).array("img")
)

// exports.uploadImgProduct = multer({ storage: storageFileProduct }).array("img")






let storageFileUserPostingan = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/users.img_post')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
})

// exports.uploadFileUserPostingan = multer({ storage: storageFileUserPostingan, limits: maxSize }).array("imgPosting")

exports.uploadFileUserPostingan = util.promisify(
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxSize
    }
  }).array("imgPosting")
)