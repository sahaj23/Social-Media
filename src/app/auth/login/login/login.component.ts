import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

   isLoading=false;
  constructor(private authService:AuthService) { }

  private authStatusListener:Subscription;
  ngOnInit(): void {
    this.authStatusListener=this.authService.getAuthStatusListener().subscribe(status=>{
      this.isLoading=status;
    })
  }
  onLogin(form:NgForm){
    this.isLoading=true;
    this.authService.login(form.value.email,form.value.password);
  }

  ngOnDestroy(){
    this.authStatusListener.unsubscribe();
  }
}
