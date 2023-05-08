const jwt = require('jsonwebtoken');
const { secret } = require('../config.js');

module.exports = function(req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован #1"});
            }
            const decodedData = jwt.verify(token, secret);
            req.user = decodedData;
            next();
        } catch (e) {
            return res.status(403).json({message: "Пользователь не авторизован #2" + e});
        }
    }