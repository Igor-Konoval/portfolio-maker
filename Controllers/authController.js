const User = require('../Models/User.js')
const Roles = require('../Models/Role.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config.js');
const { validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const express = require('express');
const server = express();
server.use(cookieParser());

const generateAccessToken = (id, roles, username) => {
    const payload = {
        id,
        roles,
        username
    }
    return jwt.sign(payload, secret, {expiresIn: '24h'});
}

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors});
            }

            const {username, password} = req.body;
            const candidate = await User.findOne({username});
        
            if (candidate) {
                return res.status(400).json('пользователь с таким именем уже существует');
            }
            
            const userRole = await Roles.findOne({value: 'USER'});
            const hashPassword = bcrypt.hashSync(password, 5);
            const user = new User({username, password: hashPassword, roles: [userRole.value]});
            await user.save();

            const token = generateAccessToken(user._id, user.roles, username);
            const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа
            res.cookie('jwt', token, { httpOnly: true, expires: expirationDate });
            res.header('Authorization', token);
            
            return res.redirect('/');
        } catch(e) {
            
            res.status(400).json({message:'registration error', errorsReg: e.message});
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username});
            
            if (!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`});
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({message: `Введен не верный пароль`})
            }

            const token = generateAccessToken(user._id, user.roles, username);
            const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа
            res.cookie('jwt', token, { httpOnly: true, expires: expirationDate });
            res.header('Authorization', token);

            return res.redirect('/cabinet');
        } catch(e) {
            res.status(400).json('login error');
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find({});
            res.json(users);
        } catch(e) {
            res.status(400).json('not admin');
        }
    }

    logOut(req, res) {
        try {
            let token = req.cookies.jwt;
            if (token) {
              res.clearCookie('jwt', { httpOnly: true});
            }
            res.redirect('/');
        } catch (e) {
            res.status(400).json({message: e});
        }
    }
}

module.exports = new AuthController();