const express = require('express');
const router = express.Router();
const controller = require('../Controllers/mainController.js');

router.get('/', controller.home);
router.get('/form_registration', controller.reqRegistr);
router.get('/registration', controller.reqRegistr);
router.get('/login', controller.reqLogin);
router.get('/form_login', controller.reqLogin);
router.get('/edit_elem_cabinet/:username', controller.allElementsCabinet);
router.get('/cabinet', controller.cabinet);
router.post('/edit_cabinet', controller.editCabinet);
router.get('/cabinet/:username', controller.userCabinet);
module.exports = router;