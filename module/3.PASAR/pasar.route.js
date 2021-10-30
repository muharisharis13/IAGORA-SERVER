const { Router } = require("express")
const { AddPasar } = require("./pasar.controller")

const router = new Router()

router.post("/add", AddPasar)

exports.RouterPasar = router