import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {Post} from '../post.model'
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {
  totalPosts=10;
  postsPerPage=5;
  pageSizeOptions=[1,2,5,10];
  currentPage=1;
   posts :Post[]=[];
  isLoading=false;
  isUserAutheticated=false;
  userAuthSub:Subscription;
  userId:string;
  constructor(public postsService:PostsService,private authService:AuthService) { 
    
  }

  ngOnInit(): void {
    this.postsService.getPosts(this.currentPage,this.postsPerPage);
    this.isLoading=true;
    this.userId=this.authService.getUserId();
    this.postsService.getPostsUpdateListener().subscribe((postData:{posts:Post[],postCount:number})=>{
      this.posts=postData.posts;
      this.totalPosts=postData.postCount;
      this.isLoading=false;
    })
    this.isUserAutheticated=this.authService.getIsAuth();
    this.userAuthSub=this.authService.getAuthStatusListener().subscribe(result=>{
      this.isUserAutheticated=result;
      this.userId=this.authService.getUserId()
    })
  }
  onPageChanged(pageData:PageEvent){
    this.isLoading=true;
    this.currentPage=pageData.pageIndex+1;
    this.postsPerPage=pageData.pageSize;
    this.postsService.getPosts(this.currentPage,this.postsPerPage);
  }
  onDelete(postId:string){
    this.isLoading=true;
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.currentPage,this.postsPerPage);
    })
  }

  ngOnDestroy(){
    this.userAuthSub.unsubscribe();
  }
}
