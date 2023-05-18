const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
});

let projectId = "direct-mason-384614";
let keyFilename = 'myKey.json';

const storage = new Storage({
    projectId,
    keyFilename,
});

const bucket = storage.bucket("img_bucket_trial");

module.exports = {
    bucket,
    storage,
    multer
}