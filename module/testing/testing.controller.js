const http_status = require("http-status");
const { encrypt2, decrypt2, decrypt1, decrypt } = require("../../utl/decrypt-encrypt");
const { testingModels } = require("./testing.model");
const { ref, child, get } = require("firebase/database");
const { db_firebase } = require("../../service/firebase");
const { PasarModels } = require("../3.PASAR/pasar.model");
const { KolModels } = require("../2.KOL/kol.model");
const { sendNotif } = require("../../service/Notification");
const Cloud = require("@google-cloud/storage");
const serviceKey = require("../../utl/google-cloud-storage/iagora-wingman-test-e124037e7982.json");
const { processMiddleware } = require("../../utl/multer");
const { format } = require("util");
require("dotenv").config();
// var co = require('co');
// var OSS = require('ali-oss');

const { Storage } = Cloud;

const client_email = process.env.GC_CLIENT_EMAIL;
const privet_key = process.env.GC_PRIVATE_KEY;

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: process.env.GC_PROJECT_ID,
  credentials: {
    client_email: client_email,
    private_key: privet_key,
  },
})

const bucket = storage.bucket("iagora2")

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}
function getDistanceFromLatLonInKm({ lat1, lon1, lat2, lon2 }) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}


exports.uploadImageALibaba = async (req, res) => {
  try {

    const ossClient = new AlibabOss();

    const result = await ossClient.uploadBuffer("woolha-alibaba", `${req.file.originalname}`, req.file.buffer);
    console.log(result);

    res.json({
      status: 200,
      success: "ok"
    })

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}


exports.sendNotifToWingman = async (req, res) => {
  try {


    let bodyNotif = {
      to: `c0rFcyabQtqClc37Fdh_1D:APA91bHGECHNAy-5NQyCgXCGabMfPXt6LNWFbAWajBM1082YFKwWDVMD5p4t8PZrFucvGZ0uNQApFeJMHOQMN5x-ImViTZFvEj0v6f18LqRroscLy9d4SQwoLNcBkFyxfE6_pIN-109a`,
      priority: 'high',
      soundName: "default",
      notification: {
        title: "Test Notification",
        body: `ini test notif`
      },
      data: {
        type: "new-order",
        data_order: {
          id_product: "23asdadsaasd"
        }
      }
    }

    await sendNotif(bodyNotif)
      .then((result) => {

        res.status(200).json({
          result: result
        })
      })
      .catch(errNottif => {
        res.status(400).json({
          status: 400,
          messageNotif: errNottif.message
        })
      })



  }
  catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}



exports.uploadImage = async (req, res) => {
  const newFilename = `${Date.now()} - ${req.file.originalname}`;
  const blob = bucket.file(`product-shopping/${newFilename}`);
  const blobStream = blob.createWriteStream()

  blobStream.on("error", err => console.log(err))

  blobStream.on("finish", () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`

    const imageDetail = req.file
    imageDetail.image = publicUrl

    res.json({
      status: 200,
      success: {
        imageDetail: imageDetail.image,
        publicUrl: publicUrl,
      }
    })
  })

  blobStream.end(req.file.buffer)
  try {

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}


exports.getDataLocation = async (req, res) => {
  try {

    const getPasar = await PasarModels.findOne({ _id: "6153e0c0cdcb3eb5fcf2e542" })
    const lat = getPasar.lat
    const long = getPasar.long

    const getWingmanModels = await KolModels.find()


    let getWingman
    let getRadiusWingman

    const db_wingman = ref(db_firebase);
    await get(child(db_wingman, `/Geolocation`))
      .then(snapshot => {
        // set wingman ke variable baru
        getWingman = Object.keys(snapshot.val()).map(item => ({ id_wingman: item, "data": snapshot.val()[item] }))

        // mapping wingman dari let getWingman dan mengukur radius jarak wingman dengan pasar
        getRadiusWingman = getWingman.map(item => ({
          id_wingman: item.id_wingman,
          radius: getDistanceFromLatLonInKm({ lat1: parseFloat(item.data.latitude), lon1: parseFloat(item.data.longitude), lat2: parseFloat(lat), lon2: parseFloat(long) })
        }))

      })
      .catch(err => {
        console.log("errnya", err)
      })


    const wingmanWithDistance = getRadiusWingman.filter(item => parseFloat(item.radius) <= parseFloat(40.0))

    const getWingmanDeviceToken = getWingmanModels.find(id => `${id._id}` === `${wingmanWithDistance[0].id_wingman}`)




    let bodyNotif = {
      to: `fS5ooStzQa-kguU3dCEHUB:APA91bGZyl71P2eIOJEncxMtC488jdwjLBqyaCJIVlFmbguBx2zJ8U2I9RQ5w5nIg_bAmr2hQacWaWMvQkpq1QDs78vlaee76cWVSj1MNwjoYLd27vepNMjUB_Ih_xYWpxBaPm_yLHNk`,
      priority: 'high',
      soundName: "default",
      notification: {
        title: "Orderan Masuk",
        body: `Segera Check Apps`
      }
    }

    await sendNotif(bodyNotif)
      .then((result) => {

        res.status(200).json({
          getWingman: getWingman,
          getRadiusWingman: getRadiusWingman,
          wingmanWithDistance: wingmanWithDistance,
          getWingmanModels: getWingmanModels,
          result: result
        })
      })
      .catch(errNottif => {
        res.status(400).json({
          status: 400,
          messageNotif: errNottif.message
        })
      })





  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.getTesting = (req, res) => {
  try {
    res.status(http_status.OK).json('berhasil dibuat')
  } catch (e) {
    res.status(http_status.BAD_REQUEST).json(e)
  }
}

exports.addPhoto = async (req, res) => {
  try {

    if (req.files) {
      const URL = process.env.URL
      const post = new testingModels({
        img: req.files.map(item => `${URL}/uploads/view/imgProduct/${item.filename}`)
      })

      await post.save()
        .then(result => {

        res.status(200).json({
          status: 200,
          success: result
        })
      })


    }
    else {
      res.status(400).json({
        status: 400,
        message: "No file"
      })
    }



  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message
    })
  }
}

exports.tryDecrypt = (req, res) => {
  const { data } = req.body
  try {

    if (data) {
      res.status(200).json(decrypt2(data))

    }
    else {
      res.status(400).json({
        status: 400,
        message: "Bad Request"
      })
    }

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }

}

exports.tryEncrypt = (req, res) => {
  const { data } = req.body
  try {

    if (data) {
      res.status(200).json({
        encrypt: data,
        final_encrypt: encrypt2(data)
      })

    }
    else {

      res.status(400).json({
        status: 400,
        message: "Bad Request"
      })
    }


  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }

}