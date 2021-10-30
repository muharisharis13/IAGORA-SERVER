const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { db } = require("./database");
require("dotenv").config();
const {apiRoute} = require('./module/index')


// ====middleware

app.use(cors())
app.options("*", cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use("/uploads", express.static("./uploads"));
app.use("/uploads/view/imgProduct", express.static("./uploads/img_product"))
app.use("/uploads/view/userImgPost", express.static("./uploads/users.img_post"))


// ====ROUTING
apiRoute(app)



// ====DATABASE

db.on("error", console.error.bind(console, "database connect error !"))
db.once('open', ()=>{
  console.log("database sekarang terkoneksi")
})


const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=>{
  console.log(`server is running in ${PORT}`)
})