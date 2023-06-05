const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const authRouter = require('./Routers/authRouter.js');
const mainRouter = require('./Routers/mainRouter.js');
const storageRouter = require('./GStorage/storageRouter.js');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;
const uri = process.env.ATLAS_URI || 'mongodb+srv://igorkonoval:Vfhuj1981lbrfz2013@portfolio-maker-serverl.ix0zmzw.mongodb.net/?retryWrites=true&w=majority';


const bodyParser = require('body-parser');

const server = express();
const createPath = (file) => path.resolve(__dirname, file);
mongoose.set('strictQuery', false);
server.use(express.json());
server.set('view engine', 'ejs')
server.use(cookieParser());
express.static.mime.types[".js"] = "text/javascript";
server.use(bodyParser.urlencoded({extended: true}));
server.use(express.static('public'))
server.use('/GStorage', express.static(createPath('GStorage')));/* 'F:/maket/GStorage' */
server.use('/auth', authRouter);
server.use('/', mainRouter);
server.use('/', storageRouter);

console.log(uri);
( async ()=> {
  try {
   server.listen(PORT, ()=>{console.log('server is start');});
   await mongoose.connect(uri);
   
   console.log("Сервер ожидает подключения...");
  } catch (e) {
    return console.log(`server is fall ` + e);
  }
})()



process.on("SIGINT", async() => {
      
  await mongoose.disconnect();
  console.log("Приложение завершило работу");
  process.exit();
});