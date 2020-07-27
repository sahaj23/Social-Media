const express=require('express')

const router=express.Router()
const Post=require('../models/post');
const app = require('../app');
const multer=require('multer')


const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      cb(error, "../backend/images");
    },
    filename: (req, file, cb) => {
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
        const n=name.split('.').slice(0, -1).join('.');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, n + "-" + Date.now() + "." + ext);
    }
  });




router.post("",multer({ storage: storage }).single("image"),(req,res,next)=>{

    const url=req.protocol+"://"+req.get('host');
    const post=new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath:url+"/images/"+req.file.filename
    });
    post.save().then((result)=>{
        res.status(201).json({message:"Post successfully created!",post:{
            id:result._id,
            title:result.title,
            content:result.content,
            imagePath:result.imagePath
        }});
    });
    
   // next();
})


router.get("",(req,res,next)=>{

   Post.find().then(documents=>{

    res.status(200).json({
        message:"Successful",
        posts:documents
    })
   })
   
})

router.get("/:id",(req,res,next)=>{
    Post.findById(req.params.id).then(post=>{
        if(post==null){
            res.status(404).json({message:"Post not found!"});
        }
        else{
            res.status(200).json(
                post
            )
        }
    })
})

router.put("/:id",multer({ storage: storage }).single("image"),(req,res,next)=>{
    
    let imagePath=req.body.image;
    if(req.file){
        const url=req.protocol+"://"+req.get('host');
        imagePath=url+"/images/"+req.file.filename
    }
    Post.updateOne({_id:req.params.id},{_id:req.body.id,title:req.body.title,content:req.body.content,  imagePath: imagePath}).then(()=>{
        res.status(200).json({
            message:"Post updated successfully! "+imagePath,
            post:{id:req.body.id,title:req.body.title,content:req.body.content,imagePath:imagePath}
        })
    })
})

router.delete("/:id",(req,res,next)=>{
    
   Post.deleteOne({_id:req.params.id}).then(()=>{

       res.status(201).json({
           message:"Post deleted successfully!"
       })
   }).catch(()=>{
       console.log("Error in delete endpoint!")
   })
    
 })



 module.exports=router;