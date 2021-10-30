const testingRoutes = require("./testing/testing.routes");
const { RouterUser } = require("./1.USERS/users.route");
const { RouterKol } = require("./2.KOL/kol.route");
const { RouterPasar } = require("./3.PASAR/pasar.route");
const { RouterProduct } = require("./4.PRODUCT/product.route");

exports.apiRoute = (app) => {
  app.use("/api/v1/testing", testingRoutes);
  app.use("/api/v1/user", RouterUser);
  app.use("/api/v1/kol", RouterKol);
  app.use("/api/v1/pasar", RouterPasar);
  app.use("/api/v1/product", RouterProduct);


  app.get("/hello", (req,res)=>{
    res.send("Welcome To Private Route")
  });
}