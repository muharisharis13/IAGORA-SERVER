const { UserModels } = require("./users.model")
const crypto = require("crypto")
const { createTokenUser, getID } = require('../../utl/token')
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const { decrypt2, encrypt2 } = require("../../utl/decrypt-encrypt");


const OAuth2 = google.auth.OAuth2;
const { TransactionModels } = require("../8.TRANSACTION/transaction.model")
const { ObjectId1 } = require("../../utl/ObjectId");
const { user_listAddressModels } = require("../5.UTL/user_address/user.list_address.models");

const oauth2Client = new OAuth2(
  "571957853463-1tr91joqiar9g9hi414b9c1tbtmhpevk.apps.googleusercontent.com", // ClientID
  "lWwCPwJI3G4dmo1-MsC2JwYB", // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: "1//04D0m7bSlPc0yCgYIARAAGAQSNwF-L9IrJXLLppeK6ZIYVvW4JqEmg77_lToONQv27ZZWsB1--dKKsnMWN5jZDlhNYucVv9PA9VQ"
});
const accessToken = oauth2Client.getAccessToken()



exports.SetMainAddressController = async (req, res) => {
  const { id_address } = req.body

  try {

    const getListAddress = await user_listAddressModels.findOne({ id_user: getID(req) })

    if (getListAddress.list_address.find(main => main.main === true) !== null) { // kalo ada salah satu yang true

      await user_listAddressModels.findOneAndUpdate({ id_user: getID(req) }, {
        $set: {
          "list_address.$[address].main": false
        }
      },
        {
          arrayFilters: [
            {
              "address.main": true
            }
          ]
        }
      )
        .then(async () => {
          await user_listAddressModels.findOneAndUpdate({ id_user: getID(req) }, {
            $set: {
              "list_address.$[address].main": true
            }
          },
            {
              arrayFilters: [
                {
                  "address._id": ObjectId1(id_address)
                }
              ]
            }
          )
            .then(() => {
              res.json({
                success: "success set main"
              })
            })
        })

    }
    else { //jika main nya semua false
      await user_listAddressModels.findOneAndUpdate({ id_user: getID(req) }, {
        $set: {
          "list_address.$[address].main": true
        }
      },
        {
          arrayFilters: [
            {
              "address._id": ObjectId1(id_address)
            }
          ]
        }
      )
        .then(() => {
          res.json({
            success: "success set main"
          })

        })


    }




  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.addAddressController = async (req, res) => {
  const {
    provinsi,
    kota,
    kelurahan,
    kecamatan,
    note,
    kode_pos,
    full_name,
    phone_number
  } = req.body


  try {

    const get_user = await user_listAddressModels.findOne({ id_user: getID(req) })


    if (get_user) {

      const post1 = await user_listAddressModels.updateOne({ id_user: ObjectId1(getID(req)) }, {
        $push: {
          "list_address": {
            full_name: full_name,
            phone_number: phone_number,
            provinsi: provinsi,
            kota: kota,
            kelurahan: kelurahan,
            kecamatan: kecamatan,
            kode_pos: kode_pos,
            note: note
          }
        }
      })

      res.status(200).json({
        status: 200,
        success: post1
      })
    }
    else {
      const post = new user_listAddressModels({
        id_user: getID(req),
        list_address: [
          {
            full_name: full_name,
            phone_number: phone_number,
            provinsi: provinsi,
            kota: kota,
            kelurahan: kelurahan,
            kecamatan: kecamatan,
            kode_pos: kode_pos,
            note: note
          }
        ]
      })

      const save = await post.save()

      res.status(200).json({
        status: 200,
        success: save
      })

    }


  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.ForgotPassword = async (req, res) => {
  const { email } = req.body
  try {

    if (email) {
      const new_password = crypto.randomBytes(5).toString("hex")
      const profile = await UserModels.findOneAndUpdate({ email: email },
        {
          password: crypto.createHash('md5').update(new_password).digest('hex')
        }
      )

      if (profile) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: "OAuth2",
            user: "muharisrvp44@gmail.com",
            clientId: "571957853463-1tr91joqiar9g9hi414b9c1tbtmhpevk.apps.googleusercontent.com",
            clientSecret: "lWwCPwJI3G4dmo1-MsC2JwYB",
            refreshToken: "1//04D0m7bSlPc0yCgYIARAAGAQSNwF-L9IrJXLLppeK6ZIYVvW4JqEmg77_lToONQv27ZZWsB1--dKKsnMWN5jZDlhNYucVv9PA9VQ",
            accessToken: accessToken
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        var mailOptions = {
          from: 'muharisrvp44@gmail.com',
          to: `${email}`,
          subject: 'FORGOT PASSWORD',
          generateTextFromHTML: true,
          html: `<b>YOUR RESET PASSWOR, ${new_password}</b> <br />
          <p>please input your reset password !</p>
          `
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.status(400).json({
              message: error
            })
          } else {
            res.status(200).json({
              success: profile,
              message: "success send reset password"
            })
            res.redirect("/hello")
          }
        });

      }
      else {
        res.status(400).json({
          message: "email not found !"
        })
      }




    }
    else {
      res.status(400).json({
        message: "email is required"
      })
    }


  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message
    })
  }
}

exports.UserInfoController = async (req, res) => {
  try {

    const getUser = await UserModels.findOne({ _id: getID(req) })
    const getTransaction = await TransactionModels.find({ id_user: getID(req) })
    const WAITING_CONFIRMATION = getTransaction.filter(status => `${status.status}` === "WAITING_CONFIRMATION").length
    const WAITING_PAYMENT = getTransaction.filter(status => `${status.status}` === "WAITING_PAYMENT").length
    const ON_PROCESS = getTransaction.filter(status => `${status.status}` === "ON_PROCESS").length
    const SENDING = getTransaction.filter(status => `${status.status}` === "SENDING").length

    const data1 = {
      id_user: getUser._id,
      phone_number: getUser.phone_number,
      full_name: getUser.full_name,
      img_profile: getUser.img_profile,
      email: getUser.email,
      main_address: "belum ada DB",
      list_address: "belum add DB",
      status_order: {
        WAITING_CONFIRMATION: WAITING_CONFIRMATION,
        WAITING_PAYMENT: WAITING_PAYMENT,
        ON_PROCESS: ON_PROCESS,
        SENDING: SENDING,
      }
    }


    res.status(200).json({
      status: 200,
      data: encrypt2({
        success: data1
      }),
      // data: data1
      })
  } catch (err) {
    res.status(500).json({
      status: 500,
      data: encrypt2({
        message: err.message
      })
    })
  }
}

exports.LoginUserController = async (req, res) => {
  const { data } = req.body
  try {

    if (data) {
      const result_dec = decrypt2(data) //DECRYPT DATA


      await UserModels.findOne({
        phone_number: result_dec.phone_number,
        password: crypto.createHash('md5').update(result_dec.password).digest('hex')
      })
        .then(async result => {

          if (result) {


            res.status(200).json({
              status: 200,
              data: encrypt2({
                success: {
                  token: createTokenUser({ payload: { data: result } })
                }
              })
            })

            await UserModels.findOneAndUpdate({
              phone_number: result_dec.phone_number,
              password: crypto.createHash('md5').update(result_dec.password).digest('hex')
            },
              {
                last_login: Date.now(),
                device_token: result_dec.device_token
              })

          }
          else {
            res.status(400).json({
              status: 400,
              data: encrypt2({ message: "phone number atau user salah !" })
            })

          }
        })
    }
    else {
      res.status(400).json({
        status: 400,
        data: encrypt2({ message: "Field Data Required !" })
      })
    }


  } catch (err) {
    res.status(500).json({
      status: 500,
      data: encrypt2({
        message: err.message
      })
    })
  }
}

exports.RegisterUserController = async (req, res) => {
  const { data } = req.body //full_name , phone number, email, password, device_token


  try {

    if (data) {
      const result_data = decrypt2(data)
      const post = new UserModels({
        full_name: result_data.full_name,
        phone_number: result_data.phone_number,
        email: result_data.email,
        password: crypto.createHash('md5').update(result_data.password).digest('hex'),
        device_token: result_data.device_token
      })

      const save = await post.save()


      res.status(200).json({
        status: 200,
        data: encrypt2({
          success: {
            token: createTokenUser({ payload: { data: save } })
          }
        })
      })

    }
    else {
      const error = {
        message: "required data"
      }
      res.status(400).json({
        status: 400,
        data: encrypt2(error)
      })
    }




  } catch (err) {



    if (err.keyValue.phone_number) {
      res.status(400).json({
        status: 400,
        data: encrypt2({ message: `Duplicate phone number` }),
      })

    }
    else if (err.keyValue.email) {
      res.status(400).json({
        status: 400,
        data: encrypt2({ message: `Duplicate email` }),
      })
    }
    else {
      res.status(500).json({
        status: 500,
        data: encrypt2({ message: "Network Error" })
      })
    }
  }
}

// exports.getUser = async (req, res)=>{
//   try {
//     await UserModels.findOne({_id : getID(req)})
//     .then()
//   } catch (err) {
//     res.status(500).json({
//       status:500,
//       message:err.message
//     })
//   }
// }