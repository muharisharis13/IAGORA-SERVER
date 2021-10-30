const uploadArray = () => {
  var counter = 0;
  if (!req.files) {
    res.status(400).send('No file uploaded.');
    return;
  }

  //  Create a new blob in the bucket and upload the file data.
  req.files.forEach((fil) => {
    const newFilename = `${Date.now()}-${fil.originalname}`
    const blob = bucket.file(`product-shopping/${newFilename}`);
    const blobStream = blob.createWriteStream();


    blobStream.on("error", err => res.status(400).json({
      status: 400,
      message: `blobStream ${err}`
    }))

    blobStream.on('finish', () => {
      counter += 1
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`

      const imageDetail = fil
      imageDetail.image = publicUrl

      if (counter >= 2) {
        res.status(200).json({
          status: 200,
          success: {
            data: publicUrl,
            imageDetail
          }
        })
      }

    });

    blobStream.end(fil.buffer);
  });

}

const uploadSingle = () => {

  if (!req.file) {
    res.status(400).json({
      status: 400,
      message: "Please Upload Images !"
    })
  }


  const newFilename = `${Date.now()}-${req.file.originalname}`
  const blob = bucket.file(`product-shopping/${newFilename}`);

  const blobStream = blob.createWriteStream();



  blobStream.on("error", err => res.status(400).json({
    status: 400,
    message: `blobStream ${err}`
  }))



  console.log({
    bucket_name: bucket.name,
    blob_name: blob.name
  })
  try {
    blobStream.on("finish", () => {
      const publicUrl = `https//storage.googleapis.com/${bucket.name}/${blob.name}`

      const imageDetail = req.file
      imageDetail.image = publicUrl
      res.status(200).json({
        status: 200,
        success: {
          data: publicUrl
        }
      })


    })
  } catch (err) {
    console.log("error dia", err)
  }





}