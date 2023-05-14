const jwt = require('jsonwebtoken');
const EditCabinet = require('../Models/EditCabinet.js');
const User = require('../Models/User.js');
const BlocksCabinet = require('../Models/BlocksCabinet.js');
const { secret } = require('../config.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const server = express();
server.use(cookieParser());

server.use(bodyParser.urlencoded({ extended: false }));


class homeController {
    home(req, res) { 
        try {
            let token = req.cookies.jwt;
            let username = "non user";
            if (token) {
                let decodedToken = jwt.verify(token, secret);
                username = decodedToken.username;
            }
            res.render('mainIndex', {title: 'Main', username});
        } catch (e) {
            res.status(403).json({message:"error", error: e});
        }   
    }
    
    async allElementsCabinet(req, res) {
        try {
            let { username } = req.params;
            let user;
            let id;
            console.log(username);
            if (username !== 'undefined') {
                user = await User.findOne({ username });
                id = user._id;
            } else {
                let token = req.cookies.jwt;
                if (token) {
                    let decodedToken = jwt.verify(token, secret);
                    id = decodedToken.id;
                    username = decodedToken.username;
                }
            }

            let editCabArr = [];
            let editBlocksArr = [];

            let editCab = await EditCabinet.findById(id);
            
            if (editCab) {
                let editEl = await editCab.value;
                editCabArr.push(...editEl);
            }

            let editBlocks = await BlocksCabinet.findById(id);
            
            if (editBlocks) {
                let allBlocks = await editBlocks.value;
                editBlocksArr.push(...allBlocks);
            }

            console.log(editCabArr,'/n', editBlocksArr);
            
            return res.json({ dataOne: editCabArr, dataTwo: editBlocksArr});
        } catch (e) {
            res.status(403).json({message:"error", error: e});
        }
    }

    async userCabinet(req, res) {
        let { username } = req.params;
        try {
            let user = await User.findOne({ username });

            if (!user) {
                return res.status(404).render('404', { title: 'Not Found' });
            }

            let editCabArr = [];
            let editBlocksArr = [];
            let id = user._id;

            let editCab = await EditCabinet.findById(id);
            let checkDb = true;
            
            if (editCab) {
                let editEl = await editCab.value;
                editCabArr.push(...editEl);
            } else {
                checkDb = false;
            }

            let editBlocks = await BlocksCabinet.findById(id);
            
            if (editBlocks) {
                let allBlocks = await editBlocks.value;
                editBlocksArr.push(...allBlocks);

            } else {
                checkDb = false;
            }
            
            let token = req.cookies.jwt;
            username = "non user";
            if (token) {
                let decodedToken = jwt.verify(token, secret);
                username = decodedToken.username;
            }
            console.log(checkDb);
            if (checkDb) {
                return res.render('clientCabinet', {title: 'your cabinet', username, dataOne: editCabArr, dataTwo: editBlocksArr});
            } else {
                return res.render('clientCabinet', {title: 'cabinet', username});
            }

        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', e: error.message });
        }
    }
    
    async cabinet(req, res) {  //constructor cabinet for edits
        try {
            let token = req.cookies.jwt;
            let username = "non user";
            if (token) {
                let editCabArr = [];
                let editBlocksArr = [];
                let decodedToken = jwt.verify(token, secret);
                username = decodedToken.username;
                const id = decodedToken.id;
                let checkDb = true;

                let editCab = await EditCabinet.findById(id);
                
                if (editCab) {
                    let editEl = editCab.value;
                    editCabArr.push(...editEl);
                } else {
                    checkDb = false;
                }
    
                let editBlocks = await BlocksCabinet.findById(id);
                
                if (editBlocks) {
                    let allBlocks = editBlocks.value;
                    editBlocksArr.push(...allBlocks);
                } else {
                    checkDb = false;
                }

                if (checkDb) {
                    return res.render('cabinet', {title: 'edit cabinet', username, dataOne: editCabArr, dataTwo: editBlocksArr});
                } else {
                    return res.render('cabinet', {title: 'cabinet', username});
                }
            } else {
                return res.render('./modules/login', {title: 'login', username});
            }
            
        } catch (e) {
            res.status(403).json({message:"error", error: e});
        }
    }

    reqRegistr(req, res) {
        res.render('./modules/registr', {title: 'registr form', username: "non user"});
    }

    reqLogin(req, res) {
        res.render('./modules/login', {title: 'login', username: "non user"});
    }

    async editCabinet(req, res) {
        const token = req.cookies.jwt;
        const elEditForms = req.body;
        let elEditArr = [];

        for (let item of Object.values(elEditForms)) {
            elEditArr.push(item);
        }
        
        let blocksArr = elEditArr.slice(-6);
        elEditArr = elEditArr.slice(0, elEditArr.length - 6);
    
        let username = "non user";
        if (token) {
            let decodedToken = jwt.verify(token, secret);
            username = decodedToken.username;
            const id = decodedToken.id;
            let editCab = await EditCabinet.findById(id);
            
            if (!editCab) {
                editCab = new EditCabinet({
                _id: id,
                value: elEditArr
            });
            await editCab.save();
            } else {
                editCab.value = elEditArr;
            }
            await editCab.save();

            let editBlocks = await BlocksCabinet.findById(id);
            
            if (!editBlocks) {
                editBlocks = new BlocksCabinet({
                _id: id,
                value: blocksArr
            });
            await editBlocks.save();
            } else {
                editBlocks.value = blocksArr;
            }
            await editBlocks.save();
    
            return res.render('cabinet', {title: 'cabinet', username});
        } else {
            return res.render('./modules/login', {title: 'login', username});
        }
    }
    
}

module.exports = new homeController();