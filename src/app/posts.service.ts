
import {Post} from './post.model'
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, ɵConsole } from '@angular/core';
import {map} from 'rxjs/operators'
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
@Injectable()
export class PostsService{
    posts:Post[]=[];
    postsUpdated=new Subject<{posts:Post[],postCount:number}>();
    constructor(private http:HttpClient,private router:Router){
       // this.getPosts();
    }
    getPosts(currPage:number,pageSize:number){
        const query="?page="+currPage+"&pageSize="+pageSize;
        this.http.get<{message:string, posts:any,maxPosts:number}>("http://localhost:3000/api/posts"+query).
        pipe(map((postData)=>{
            
            return {posts:postData.posts.map(post=>{
                return {
                title:post.title,
                content:post.content,
                id:post._id,
                imagePath:post.imagePath,
                creator:post.creator,
                }
            }),
        maxPosts:postData.maxPosts
        };
        })).
        subscribe((transformedPostsData)=>{
            this.posts=transformedPostsData.posts;
            this.postsUpdated.next({posts:[...this.posts],postCount:transformedPostsData.maxPosts});
        });
        
    }

    getPostsUpdateListener(){
        return this.postsUpdated.asObservable();
    }
    addPost(title:string, content:string,image:File){
    
        const postData=new FormData();
    postData.append("title",title);
    postData.append("content",content);
    postData.append("image",image);
    

        this.http.post<{message:string,post:Post}>("http://localhost:3000/api/posts",postData).subscribe((result)=>{
            this.router.navigate(["/"]);
        });
        
        
    }

    updatePost(id:string,title:string,content:string,image:File | string){
        let postData;
        if(typeof(image)==="object"){
            postData=new FormData();
            postData.append("id",id);
            postData.append("title",title);
            postData.append("content",content);
            postData.append("image",image,title);
        }
        else{
             postData={
                id:id,
                title:title,
                content:content,
                image:image,
                creator:null
            }
        }

        
        this.http.put("http://localhost:3000/api/posts/"+id,postData).subscribe((updatedPost)=>{
            this.router.navigate(["/"]);
        })
        
    }
    getPost(postId){
        return this.http.get<{_id:string,title:string,content:string,imagePath:string,creator:string}>("http://localhost:3000/api/posts/"+postId);
    }
    deletePost (postId: string){
        return this.http.delete("http://localhost:3000/api/posts/"+postId);
    }
}