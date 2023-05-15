const express = require('express');
const router = express.Router();
const storageController = require('./storageController.js');
const storageModel = require('./storageModel.js');

router.post("/upload", storageModel.multer('imgfile'), storageController.postFilesMethod);

module.exports = router;