import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  isUserAuthenticated:boolean=false;
  private authListenerSubs:Subscription;
  constructor(private authService:AuthService) { }
  

  ngOnInit(): void {
    this.isUserAuthenticated=this.authService.getIsAuth();
    this.authListenerSubs=this.authService.getAuthStatusListener().subscribe(result=>{
      this.isUserAuthenticated=result;
    })
  }
  logOut(){
    this.authService.logOut();
  }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
