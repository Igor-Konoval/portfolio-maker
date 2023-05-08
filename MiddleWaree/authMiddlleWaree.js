const jwt = require('jsonwebtoken')
const { secret } = require('../config.js');
const cookieParser = require('cookie-parser');
const express = require('express');
const server = express();
server.use(cookieParser());

module.exports = function(roles) {
    return function(req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }

        try {
            
            const token = req.headers.authorization.split(' ')[1];
            const token2 = req.cookies.jwt;
            console.log(token2 + ' ' + 'cookie');
            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"});
            }
            const {roles: userRoles, id, username} = jwt.verify(token, secret);
            console.log(token);
            console.log(id, username, jwt.verify(token, secret));
            let hasRole = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            })
            if (!hasRole) {
                return res.status(403).json({message: "У вас нет доступа"});
            }
            next();
        } catch (e) {
            return res.status(403).json({message: "Пользователь не авторизован"});
        }
    }
}
