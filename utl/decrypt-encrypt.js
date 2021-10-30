const CryptoJS = require('crypto-js')
const crypto = require('crypto')

exports.decrypt = (encryptStr) => {
  encryptStr = CryptoJS.enc.Base64.parse(encryptStr);
  let encryptData = encryptStr.toString(CryptoJS.enc.Utf8);
  encryptData = JSON.parse(encryptData);
  let iv = CryptoJS.enc.Base64.parse(encryptData.iv);
  var decrypted = CryptoJS.AES.decrypt(encryptData.value, CryptoJS.enc.Base64.parse(`S@F!9upNmx9nS3mCzRSpw4rU9mrN5T75`), { //key nyaaa
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  try {
    decrypted = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }
  catch (err) {
    decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
  }

  return decrypted;
};


exports.decrypt1 = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, 'S@F!9upNmx9nS3mCzRSpw4rU9mrN5T75');
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
}

// exports.decrypt2 = (data) => {
//   const algorithm = "aes-256-cbc";
//   const Securitykey = "gS6HT5h8lIlBxya5XVsmeDCoUl6vHhdI";
//   const initVector = Securitykey.substring(0, 16);

//   const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

//   let decryptedData = decipher.update(data, "binary", "utf-8");

//   decryptedData += decipher.final("utf8");

//   return decryptedData

// }
exports.decrypt2 = (data) => {
  // const algorithm = "aes-256-cbc";
  const Securitykey = "S@F!9upNmx9nS3mCzRSpw4rU9mrN5T75";
  const initVector = Securitykey.substring(0, 16);
  encryptdata = Buffer.from(data, 'base64').toString('binary');

  var decipher = crypto.createDecipheriv('aes-256-cbc', Securitykey, initVector),
    decoded = decipher.update(encryptdata, 'binary', 'utf8');

  decoded += decipher.final('utf8');

  let result

  try {
    result = JSON.parse(decoded)
  }
  catch (err) {
    result = decoded
  }
  return result;

}

exports.encrypt2 = (data) => {
  const algorithm = "aes-256-cbc";
  const Securitykey = "S@F!9upNmx9nS3mCzRSpw4rU9mrN5T75";
  const initVector = Securitykey.substring(0, 16);

  var encipher = crypto.createCipheriv(algorithm, Securitykey, initVector),
    encryptdata = encipher.update(JSON.stringify(data), 'utf8', 'binary');

  encryptdata += encipher.final('binary');
  encode_encryptdata = Buffer.from(encryptdata, 'binary').toString('base64');
  return encode_encryptdata;
}