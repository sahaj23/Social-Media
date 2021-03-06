const express=require('express');
const app=express();
const path = require("path");
const bodyParser=require('body-parser')
const postsRoutes=require('./routes/posts')
const usersRoutes=require('./routes/users')
const mongoose=require('mongoose')
app.use(bodyParser.json());
mongoose.connect("mongodb+srv://sahaj:Sahaj@123@cluster0.jxz9u.mongodb.net/<dbname>?retryWrites=true&w=majority",{ useNewUrlParser: true ,useUnifiedTopology: true}).then(()=>{
    console.log("Successfully connected to mongo db!");
}).catch(()=>{
    console.log("Connection to mongodb failed");
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("../backend/images")));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization'); // If needed
    next();
})

app.use("/api/posts",postsRoutes)
app.use("/api/users",usersRoutes)
module.exports=app;