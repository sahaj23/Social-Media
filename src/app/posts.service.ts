
import {Post} from './post.model'
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, ɵConsole } from '@angular/core';
import {map} from 'rxjs/operators'
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Router } from '@angular/router';
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
                id:post._id
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
    addPost(title:string, content:string){
    
        const post={id:null,title:title, content:content};

        this.http.post<{message:string,postId:string}>("http://localhost:3000/api/posts",post).subscribe((message)=>{

            post.id=message.postId;
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        });
        this.router.navigate(["/"]);
        
    }

    updatePost(id:string,title:string,content:string){
        const post:Post={id:id,title:title, content:content};
        this.http.put("http://localhost:3000/api/posts/"+id,post).subscribe((updatedPost)=>{
            let index=-1;
            for(let i=0;i<this.posts.length;i++){
                if(this.posts[i].id==id){
                    index=i;
                    break;
                }
            }
            this.posts[index]=post;
            this.postsUpdated.next([...this.posts])

        })
        this.router.navigate(["/"]);
    }
    getPost(postId){
        return this.http.get<{_id:string,title:string,content:string}>("http://localhost:3000/api/posts/"+postId);
    }
    deletePost (postId: string){
        this.http.delete("http://localhost:3000/api/posts/"+postId).subscribe(()=>{
            
            this.posts=this.posts.filter(post=>postId!=post.id);
            this.postsUpdated.next([...this.posts])
         });
    }
}