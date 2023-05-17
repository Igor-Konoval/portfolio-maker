const express = require('express');
const router = express.Router();
const storageController = require('./storageController.js');
const storageModel = require('./storageModel.js');

router.get("/upload", storageController.getFilesMethod);
router.post("/upload", storageModel.multer.single("imgfile"), storageController.postFilesMethod);

module.exports = router;