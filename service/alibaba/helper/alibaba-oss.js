const _ = require("lodash");
const OSS = require("ali-oss");
const fs = require("fs");
require("dotenv").config()




const client = new OSS({
  accessKeyId: process.env.ALIBABA_ACCESS_KEY,
  accessKeySecret: process.env.ALIBABA_ACCESS_KEY_SECRET,
  bucket: "iagora",
  region: "Indonesia (Jakarta)"
});


async function put() {
  try {
    // Specify the full paths of the object and the local file. The full path of the OSS object cannot contain bucket names. 
    // If the path of the local file is not specified, the local file is uploaded from the path of the project to which the sample program belongs. 
    const result = await client.put('exampleobject.txt', path.normalize('D:\\localpath\\examplefile.txt'));
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

put();