//creating a server 
//const http=require("http")
/*import http from "http";//upar line ka alt

//const gfName=require("./features");

//import gfName from "./features.js";
//import { gfName2,gfName3 } from "./features.js";

import * as myObj from "./features.js";
//console.log(gfName);
//console.log(gfName2); 
//console.log(gfName3);
import {generateLove} from "./features.js";
import fs from "fs"
import path from "path"

console.log(path.extname("/home/random/index.js"));
//path library imported to get the extreme name 

//const home=fs.readFile("./index.html",()=>{
//    console.log("File Read");
//});//asyncronous code toh 

//console.log(home);

console.log(generateLove());
console.log(myObj);//generating object 

const server=http.createServer((req,res)=>{
    //res.end("Noice");//response ending it so no endless loading 
    //console.log("Servered");
    //console.log(req.url);//url of request by the client
    if(req.url === "/about"){
        //res.end("About");
        res.end(`<h1>Love is ${generateLove()} </h1>`);
        //routing witht a function in other code written 
    }
    else if(req.url==="/"){
        //res.end("Home");
        //console.log(home);
        fs.readFile("./index.html",(err,home)=>{
            console.log("File Read");
            res.end(home);
        });//reading data from a html file to a routed server 
         //res.end(home);
    }
    else if(req.url==="/contact"){
        res.end("Contact");
    }
    else{
        res.end("Page Not found");
    }//routing shown gg 
});//when server hit then coming(*2)
//nothing in console as of now only serv created 

server.listen(5000,()=>{
    console.log("working");
}); */
//EXPRESS BASICS START
import express from 'express';
import path from "path";

import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"backend"
}).then(()=>console.log("DB Connected"))
.catch((e)=>console.log(e));
//database connected 

const messageSchema=new mongoose.Schema({
    name:String,
    email:String,
});//message schema of the db to be returned

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
});//message schema of the db to be returned


//const Msg=mongoose.model("messages",messageSchema);//collection name in the DB server
//messageschema is json object in here for the db  data
const Msg=mongoose.model("User",userSchema);//collection name in the DB server


const app=express();//server created 
//using the static file at it 
//using middlewares
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended:true})); //now in the console we r getting the valyes which we r submitting in the form 
app.use(cookieParser());

const users=[];//the array to store the results of form 
/*app.get("/getproducts",(req,res)=>{
    //res.send("Hi");//body of the route 
    //res.statusCode(404);
    //res.sendStatus(404);//status codes and sending them 
    /*res.json({
        success:true,
        products:[],
    });//api being formed */
/*    const pathloc=path.resolve();
    res.sendFile(path.join(pathloc,"./index.html"));
    //passing html file to the response routing 

    //res.sendFile("./index.html");
});*/
app.set("view engine","ejs");
//this set so no extension required always for all files 
const isAuthenticated = async (req,res,next)=>{
    const { token }=req.cookies;
    if(token){
        //decoding the id from the token 
        const decoded=jwt.verify(token,"sjdhsjsdhjd");
        //console.log(decoded);

        req.user=await Msg.findById(decoded._id);//user woll have the data
        next();
        //res.render("logout");
    }
    else{
        res.redirect("/login");
        //res.render("login");
    } 
};

app.get("/",isAuthenticated,(req,res) =>{
    //res.render("index",{name:"Anurag"});

    /*const { token }=req.cookies;
    //console.log(req.cookies);
    //res.render("login");
    //res.sendFile("index.html");
    if(token){
        res.render("logout");
    }
    else{
        res.render("login");
    } */
    //console.log(req.user);
    res.render("logout",{name:req.user.name});
});
//adding data to mongodb in the backend
/*app.get("/add", async (req,res) =>{
     //res.send("Nice");
    await Msg.create({name:"Anurag2",email:"sample2@gmail.com"});//.then(()=>{
    res.send("Nice");
    //});
});*/
//register page for the login 
app.get("/register",(req,res) =>{
    res.render("register");
});
//post request for the login 
app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    let user=await Msg.findOne({email});
    if(!user) return res.redirect("/register");
    //if user found 

    //const isMatch=user.password===password;

    const isMatch=await bcrypt.compare(password,user.password);
    
    if(!isMatch) return res.render("login",{message:"Incorrect Password"});

    const token=jwt.sign({_id:user._id},
        "sjdhsjsdhjd");//token created
        //console.log(token);
    res.cookie("token",token,{
        expires:new Date(Date.now()+60*1000),
    });
    res.redirect("/");
});
app.post("/register",async (req,res)=>{
    //cookie key value pair
    /* res.cookie("token","iamin",{
        httpOnly:true,expires:new Date(Date.now()+60*1000),
    });
    res.redirect("/"); */
    const {name,email,password}=req.body;
    let user= await Msg.findOne({ email });

    if(user){
        return res.redirect("/login");
        //return console.log("Register first");
    }
    const hashedPassword=await bcrypt.hash(password,10);

    user= await Msg.create({
        name,
        email,
        password:hashedPassword,
    });

    const token=jwt.sign({_id:user._id},
        "sjdhsjsdhjd");//token created
        console.log(token);
    res.cookie("token",token,{
        expires:new Date(Date.now()+60*1000),
    });
    res.redirect("/");
});
app.get("/logout",(req,res) => {
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
    res.redirect("/");
}) //login and logout  button working and the cookie storing and removing the details of the user leaving and entering the site
/*app.get("/success",(req,res) =>{
    res.render("success");
    //res.sendFile("index.html");
});//redirect to this page on succ submission 
*/

/*app.post("/contact", async (req,res)=>{ //post request from the url of the form mentioned 
    //console.log(req.body);
    //users.push({username:req.body.name , email:req.body.email});
//sending from the form to the mongodb
    await Msg.create({ name:req.body.name,email:req.body.email});
    //res.render("success");//success file on the same page
    res.redirect("/success");
}); */


/*app.get("/users",(req,res)=>{
    res.json({
        users,
    });
});//to get the user data filling the form 
*/

app.listen(5000,()=>{
    console.log("Server is working");
});
