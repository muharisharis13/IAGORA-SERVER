const jwt = require("jsonwebtoken")
const jwt_decode = require("jwt-decode")
const status = require("http-status")
const { encrypt2 } = require("./decrypt-encrypt")


exports.createTokenKol = function ({ payload }) {
  return jwt.sign(payload, process.env.KEY_TOKEN_KOL)
}

exports.checkTokenKol = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.KEY_TOKEN_KOL);
    req.userData = decoded;
    next();

  } catch (err) {
    return res.status(status.BAD_REQUEST).json({
      status: status.BAD_REQUEST,
      data: encrypt2({ message: 'Auth Failed' })
    })
  }
}
exports.createTokenUser = function ({ payload }) {
  return jwt.sign(payload, process.env.KEY_TOKEN_USER)
}

exports.checkTokenUser = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.KEY_TOKEN_USER);
    req.userData = decoded;
    next();

  } catch (err) {
    return res.status(status.BAD_REQUEST).json({
      status: status.BAD_REQUEST,
      data: encrypt2({ message: 'Auth Failed' })
    })
  }
}

exports.getID = function getId(req) {
  return jwt_decode(req.headers.authorization.split(" ")[1]).data._id
}

exports.getDeviceToken = function (req) {
  return jwt_decode(req.headers.authorization.split(" ")[1]).data.device_token
}