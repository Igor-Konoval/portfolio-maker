const express = require('express');
const router = express.Router();
const controller = require('../Controllers/authController.js');
const authMiddleWaree = require('../MiddleWaree/authMiddlleWaree.js')
const authMiddleWareeFirst = require('../MiddleWaree/authMiddleWareeFirst.js')
const { check } = require('express-validator');


router.post('/registration', [
    check('username', 'пустое поле имени').isEmpty(), 
    check('password', 'ошибка длинны пароля').isLength({min:'4', max:'26'})],controller.registration)
router.post('/login', controller.login)
router.get('/users', authMiddleWaree(["ADMIN"]), controller.getUsers)
router.get('/logout_user', controller.logOut);


module.exports = router;