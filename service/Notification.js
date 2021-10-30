const fetch = require("node-fetch")


exports.sendNotif = async (body) => {
  const data = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: "POST",
    headers: {
      Authorization: "key=	AAAA_rhf4rk:APA91bHTDNUDIHrhQfD3h32Ff8Eigm_xqiEXtLjEvO7Wg7kYPNJdq3m4RHhSgkPaoyTRaBghWv1Y-EXs6ED5O2a7eXDR8Xpfst97MY1tHyMtWcCi01VMZAZBHJsVos2EXhnWTu9EUPfF",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())

  return data
}