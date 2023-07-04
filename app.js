//jshint esversion:6
require('dotenv').config();
const express =require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require ("mongoose-encryption");
const app= express();

console.log(process.env.SECRET);
const secret=process.env.SECRET;
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://127.0.0.1:27017/SecretsDB",{useNewUrlParser:true});

const userSchema= new mongoose.Schema({
    email: String,
    password:String
});

userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

const User= new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});

app.listen(3000,function(){
    console.log("Server is started on port 3000.");
})

app.post("/register",async function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    await newUser.save();
    res.render("secrets");
});

app.post("/login",async function(req,res){
    const userName=req.body.username;
    const password=req.body.password;
    const foundUser= await User.findOne({email:userName});
    if(foundUser.password===password){
        res.render("secrets");

    }
})