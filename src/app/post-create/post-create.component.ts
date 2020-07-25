import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Form, NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit{

  mode:string='create';
  postId:string=null;
  post: Post=null;
  isLoading=false;
  form:FormGroup;
  imagePreview:string='';
  constructor(public postsService:PostsService,private route:ActivatedRoute){}


  ngOnInit(){

    this.form=new FormGroup({
      title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
      content:new FormControl(null,{validators:[Validators.required]}),
      image:new FormControl(null,{validators:[Validators.required]})
    })
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has("postId")){
        
        this.mode='edit';
        this.postId=paramMap.get('postId');
        this.isLoading=true;
        this.postsService.getPost(this.postId).subscribe((post)=>{
          this.post={id:post._id,title:post.title,content:post.content};
          this.isLoading=false;
          console.log(post)
          this.form.setValue({title:this.post.title,content:this.post.content})
        });
        
      }
      else{
        this.mode='create';
        this.postId=null;
        this.post=null;
      }
    })
  }

  onImageChange(event:Event){
    const file=(event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.updateValueAndValidity();

    const reader=new FileReader();
    reader.onload=()=>{
      this.imagePreview=<string>reader.result;
    }
    reader.readAsDataURL(file);
    console.log(file)
  }
  onSavePost() {

    if(!this.form.valid) return;
    this.isLoading=true;
    if(this.mode=='create'){
      this.postsService.addPost(this.form.value.title,this.form.value.content);
    }
    else{
      this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content);
    }
    this.form.reset();
  }
}
