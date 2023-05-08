const express = require('express');
const router = express.Router();
const controller = require('../Controllers/registrController.js');

router.post('/',controller.registration);