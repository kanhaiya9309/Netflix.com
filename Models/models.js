const mongoose = require('mongoose') ;
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');


const personalDetails  = new mongoose.Schema( {
  username : String ,
  email : String ,
  phone : Number ,
  info : String
}) 

const personalDetail = new mongoose.model('personalDetail',personalDetails);


const userPass = new mongoose.Schema( {
username : { type: String },
password: { type: String ,},
userInfo  : personalDetails ,
googleId : String 
}) 


userPass.plugin(passportLocalMongoose);

userPass.plugin(findOrCreate);


const userdetail = new mongoose.model('userdetail',userPass);

module.exports = {
  userdetail,
  personalDetail
}


