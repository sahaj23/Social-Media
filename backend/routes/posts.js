const express=require('express')
const checkAuth=require('../middleware/check-auth')
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




router.post("",checkAuth,multer({ storage: storage }).single("image"),(req,res,next)=>{

    const url=req.protocol+"://"+req.get('host');
    const post=new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath:url+"/images/"+req.file.filename,
        creator:req.userData.userId
    });
    
    post.save().then((result)=>{
        res.status(201).json({message:"Post successfully created!",post:{
            id:result._id,
            title:result.title,
            content:result.content,
            imagePath:result.imagePath,
            creator:result.creator
        }});
    }).catch(err=>{
        res.status(500).json({message:"Post creation failed!"})
    });
    
   // next();
})


router.get("",(req,res,next)=>{

    const pageSize=+req.query.pageSize;
    const currPage=+req.query.page;
    let query=Post.find();
    let fetchedPosts;
    if(pageSize && currPage){
        
        query=Post.find().skip((currPage-1)*pageSize).limit(pageSize)
    }
   query.then(documents=>{
    fetchedPosts=documents;
    return Post.countDocuments();
   }).then(count=>{
    res.status(200).json({
        message:"Successful",
        posts:fetchedPosts,
        maxPosts:count
    })
   }).catch(err=>{
    res.status(500).json({message:"Fetching posts failed!"})
});
   
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
    }).catch(err=>{
        res.status(500).json({message:"Fetching post failed!"})
    });
})

router.put("/:id",checkAuth,multer({ storage: storage }).single("image"),(req,res,next)=>{
    
    let imagePath=req.body.image;
    if(req.file){
        const url=req.protocol+"://"+req.get('host');
        imagePath=url+"/images/"+req.file.filename
    }
    Post.updateOne({_id:req.params.id,creator:req.userData.userId},{_id:req.body.id,title:req.body.title,content:req.body.content,  imagePath: imagePath}).then((result)=>{
        if(result.nModified>0){
        res.status(200).json({
            message:"Post updated successfully! "+imagePath,
            post:{id:req.body.id,title:req.body.title,content:req.body.content,imagePath:imagePath,creator:req.userData.userId}
        })
    }
    else{
        res.status(401).json({message:"Unauthorized"});
    }
    }).catch(err=>{
        res.status(500).json({message:"Couldn't updated post!"})
    });
})

router.delete("/:id",checkAuth,(req,res,next)=>{
    
   Post.deleteOne({_id:req.params.id,creator:req.userData.userId}).then((result)=>{
        
       if(result.n>0){
        res.status(201).json({
            message:"Post deleted successfully!"
        })
       }
       res.status(401).json({message:"Unauthorized"});
   }).catch(err=>{
    res.status(500).json({message:"Deleting post failed!"})
});
    
 })



 module.exports=router;