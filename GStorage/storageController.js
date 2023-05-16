const storageModel = require('./storageModel.js');
const User = require('../Models/User.js');
const ImgCabinet = retuire('../Models/ImgCabinet.js');

class storageController {
    async getFilesMethod(req, res) {
        try {
          let { username } = req.params;
          let user = await User.findOne({ username });
          let id = user._id;
          let userImages = await ImgCabinet.findById(id);
          const collImgs = userImages.value;
          
          const [files] = await storageModel.bucket.getFiles({
            prefix: `${userName}/`,
          });

          res.send([files]);
          console.log("Success");
        } catch (error) {
          res.send("Error:" + error);
        }
    }

    async postFilesMethod(req, res) {
        console.log("Made it /upload");
        try {
          if (req.file) {
            console.log("File found, trying to upload...");
            const blob = storageModel.bucket.file(req.file.originalname);
            const blobStream = blob.createWriteStream();
      
            blobStream.on("finish", () => {
              res.status(200).send("Success");
              console.log("Success");
            });
            blobStream.end(req.file.buffer);
          } else throw "error with img";
        } catch (error) {
          res.status(500).send(error);
        }
    }
}

module.exports = new storageController();