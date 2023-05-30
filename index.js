const express = require('express');
const mongoose = require('mongoose');
const { uri } = require('./mongo.js');
const authRouter = require('./Routers/authRouter.js');
const mainRouter = require('./Routers/mainRouter.js');
const storageRouter = require('./GStorage/storageRouter.js');
const cookieParser = require('cookie-parser');
const PORT = 3000;



const bodyParser = require('body-parser');

const server = express();

mongoose.set('strictQuery', false);
server.use(express.json());
server.set('view engine', 'ejs')
server.use(cookieParser());
express.static.mime.types[".js"] = "text/javascript";
server.use(bodyParser.urlencoded({extended: true}));
server.use(express.static('public'))
server.use('/GStorage', express.static('F:/maket/GStorage'));
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