require('dotenv').config();
const express =  require ('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const passport =require('passport');
const passportLocalMongoose =require('passport-local-mongoose');
const API = process.env.API ;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const findOrCreate = require('mongoose-findorcreate');
const myModule = require('../Models/models.js');
const path = require('path');


const routes = express.Router();

// routes.use(express.static("public"));

routes.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false,
}))



routes.use(bodyParser.urlencoded({ extended: true }));
routes.use(bodyParser.json());


routes.use(passport.initialize());
routes.use(passport.session());


// // use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(myModule.userdetail.authenticate()));

// use static serialize and deserialize of model for passport session support
// passport.serializeUser(userdetail.serializeUser());
// passport.deserializeUser(userdetail.deserializeUser());
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


passport.use(new GoogleStrategy({
  clientID:     process.env.CLIENT_ID ,
  clientSecret: process.env.CLIENT_SECRET ,
  callbackURL: "http://localhost:5500/auth/google/netflix",
  useProfileUrl: "https://www.googleapis.com/oauth2/v3/userinfo" ,
  passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done)
 {
   console.log(profile)
  myModule.userdetail.findOrCreate({ googleId: profile.id ,
    username: profile.displayName}, function (err, user) {
    return done(err, user);
  });
}
));


routes.get("/",function(req,res){
  res.render("home.ejs")
})

routes.get("/auth/google", passport.authenticate('google', { scope: ["profile"] }));


routes.get("/auth/google/netflix",
passport.authenticate('google', { failureRedirect: "/login" }),
function(req, res) {
  // Successful authentication, redirect to secrets.
  res.redirect("/netflix");
});


routes.get("/login",function(req,res){
  res.render('login.ejs');
})
routes.get("/register",function(req,res){
  res.render('register.ejs');
})



routes.get("/logout",function(req,res,next){
req.logout(function(err) {
  if (err) { return next(err); }
  res.redirect('/');
});
})
routes.get("/secrets",function(req,res){
if(req.isAuthenticated()){
   myModule.userdetail.findById(req.user.id)
  .then((founduser)=>{
    res.render("secrets",{userwithInfo:founduser.userInfo})
    }) 
  .catch((err)=>{
   console.log(err)
   })
     } else{
       res.redirect("/login");
    }
})

routes.get("/netflix",function(req,res){
if(req.isAuthenticated()){
  // res.sendFile(__dirname + "/../public/home.html");  
  const filePath = path.join(__dirname, '..', 'public', 'home.html');
  res.sendFile(filePath);
    } else{
      res.redirect("/login");
    }
})
routes.get("/submit",function(req,res){
res.render("submit.ejs");
})
routes.post("/submit",function(req,res){
const userInfo = new myModule.personalDetail({
 username : req.body.name ,
 email : req.body.email ,
 phone : req.body.phone ,
 info : req.body.info 
})
 userInfo.save();
myModule.userdetail.findById(req.user.id)
   .then((foundUser)=>{
    if(foundUser){
      foundUser.userInfo = userInfo ;
      if( foundUser.save()){
        res.redirect("/")
      } else{
        console.log("sorry any problem ")
      }
     }
   })
   .catch((err)=>{
   console.log(err);
   })
})
routes.post('/register',function(req,res){
const Username = req.body.username;
const Userpassword = req.body.password;
console.log(Username,Userpassword);
 myModule.userdetail.register(new myModule.userdetail({username:Username}), Userpassword)
 .then((user)=>{
  passport.authenticate("local")(req,res , function(){
  res.redirect("/netflix")
  })
 })
 .catch((err)=>{
 console.log(err);
 res.redirect("/register")
 })
})

routes.post('/login',function(req,res){

const user = new myModule.userdetail ({
  username: req.body.username,
  password:req.body.password
})

req.login(user,function(err){
  if(err){
    console.log(err)
  }else{
    passport.authenticate("local")(req,res,function(){
      if(passport.authenticate){
        res.redirect("/netflix");
      }else{
        alert("Username and Password not match")
      }
    })
  }
})

})  


module.exports ={
   routes 
};
