
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
    postsUpdated=new Subject<Post[]>();
    constructor(private http:HttpClient,private router:Router){
       // this.getPosts();
    }
    getPosts(){
        this.http.get<{message:string, posts:any}>("http://localhost:3000/api/posts").
        pipe(map((postData)=>{
            return postData.posts.map(post=>{
                return {
                title:post.title,
                content:post.content,
                id:post._id,
                imagePath:post.imagePath
                }
            });
        })).
        subscribe((transformedPosts)=>{
            this.posts=transformedPosts;
            this.postsUpdated.next([...this.posts]);
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

            const post={id:result.post.id,title:title, content:content,imagePath:result.post.imagePath};
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        });
        this.router.navigate(["/"]);
        
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
                image:image
            }
        }

        
        this.http.put("http://localhost:3000/api/posts/"+id,postData).subscribe((updatedPost)=>{
            let index=-1;
            console.log(postData)
            for(let i=0;i<this.posts.length;i++){
                if(this.posts[i].id==id){
                    index=i;
                    break;
                }
            }
            const post:Post={id:id,title:title, content:content,imagePath:updatedPost.post.image};
            this.posts[index]=post;
            this.postsUpdated.next([...this.posts])

        })
        this.router.navigate(["/"]);
    }
    getPost(postId){
        return this.http.get<{_id:string,title:string,content:string,imagePath:string}>("http://localhost:3000/api/posts/"+postId);
    }
    deletePost (postId: string){
        this.http.delete("http://localhost:3000/api/posts/"+postId).subscribe(()=>{
            
            this.posts=this.posts.filter(post=>postId!=post.id);
            this.postsUpdated.next([...this.posts])
         });
    }
}