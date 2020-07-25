const express=require('express')

const router=express.Router()
const Post=require('../models/post');
const app = require('../app');

router.post("",(req,res,next)=>{
    const post=new Post({
        title:req.body.title,
        content:req.body.content
    });
    post.save().then((result)=>{
        res.status(201).json({message:"Post successfully created!",postId:result._id});
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

router.put("/:id",(req,res,next)=>{
    Post.updateOne({_id:req.params.id},{_id:req.body.id,title:req.body.title,content:req.body.content}).then(()=>{
        res.status(200).json({
            message:"Post updated successfully",
            post:{id:req.body.id,title:req.body.title,content:req.body.content}
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