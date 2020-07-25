import { Component, OnInit, Input } from '@angular/core';
import {Post} from '../post.model'
import { PostsService } from '../posts.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

   posts :Post[]=[];
  isLoading=false;
  constructor(public postsService:PostsService) { 
    
  }

  ngOnInit(): void {
    this.postsService.getPosts();
    this.isLoading=true;
    this.postsService.getPostsUpdateListener().subscribe((posts:Post[])=>{
      this.posts=posts;
      this.isLoading=false;
      //alert("called")
    })
  }
  
  onDelete(postId:string){
    this.postsService.deletePost(postId);
  }
}
