const jwt = require('jsonwebtoken');
const storageModel = require('./storageModel.js');
const User = require('../Models/User.js');
const ImgCabinet = require('../Models/ImgCabinet.js');
const { secret } = require('../config.js');

class storageController {
  async getFilesMethod(req, res) {
      try {
        const usernameExport = req.query.usernameExport;
        let user = await User.findOne({ username: usernameExport });
        let id = user._id;
        let userImages = await ImgCabinet.findById(id);
        if (!userImages) {
          userImages = new ImgCabinet({
            _id: id,
            value: []
          });
      
          await userImages.save();
        }
        const collImgs = userImages.value;

        res.send(collImgs);
      } catch (error) {
        res.send("Error:" + error);
      }
  }

  async postFilesMethod(req, res) {
    console.log("Made it /upload");
    try {
      if (req.file) {
        // console.log("File found, trying to upload...");
        const blob = storageModel.bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream();

        const nameAndIndexImg = req.file.originalname.split('_');  
        const token = req.cookies.jwt;
        let id = '';
        let imgBd = '';
        
        if (token) {
          const decodedToken = jwt.verify(token, secret);
          id = decodedToken.id;
          imgBd = await ImgCabinet.findById(id);
          
          if (!imgBd) {
            imgBd = new ImgCabinet({
              _id: id,
              value: [req.file.originalname]
            });
        
            await imgBd.save();
          
          } else {
            const existingFile = imgBd.value.find(value => value.startsWith(`${nameAndIndexImg[0]}_${nameAndIndexImg[1]}_`));
        
            if (existingFile) {

              await storageModel.bucket.file(existingFile).delete();
              const updatedValue = imgBd.value.map(value => {

                if (value === existingFile) {
                  return req.file.originalname;
                }
                return value;
              });
        
              imgBd.value = updatedValue;
              await imgBd.save();
            } else {
              imgBd.value.push(req.file.originalname);
              await imgBd.save();
            }
          }
        } else {
          return res.status(403).json({message:"error", info: "you must be logged in"});
        }
        blobStream.on("finish", () => {
          res.status(200).send("Success");
          console.log("Success");
        });
        blobStream.end(req.file.buffer);
      } else throw new Error("error with img");
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log(error);
    }
  }
}

module.exports = new storageController();