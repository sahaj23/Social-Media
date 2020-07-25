const express=require('express');
const app=express();
const bodyParser=require('body-parser')
const postsRoutes=require('./routes/posts')
const mongoose=require('mongoose')
app.use(bodyParser.json());
mongoose.connect("mongodb+srv://sahaj:Sahaj@123@cluster0.jxz9u.mongodb.net/<dbname>?retryWrites=true&w=majority",{ useNewUrlParser: true ,useUnifiedTopology: true}).then(()=>{
    console.log("Successfully connected to mongo db!");
}).catch(()=>{
    console.log("Connection to mongodb failed");
})

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    next();
})

app.use("/api/posts",postsRoutes)
module.exports=app;