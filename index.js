require('dotenv').config()
const express =  require ('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const {routes} = require('./Routes/NetflixRoutes.js');


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true})) ;
app.set('view engine','ejs') ;

const port = process.env.PORT  ;
const mongooseUrl = process.env.MONGOOSEURL 

app.use("/",routes);


mongoose.connect(mongooseUrl)
 .then((res)=>{
     console.log("Database is connected")
    app.listen(port ,()=>{
   console.log(`Server is started on port ${port} ` );
})
 })
 .catch((error)=>{
   console.log(error)
 })


