
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AuthData} from './auth-data.model'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable()
export class AuthService{
    private token:string;
    private authStatusListener=new Subject<boolean>();
    private isAuth=false;
    private tokenTimer:any;
    private userId:string;
    constructor(private http:HttpClient,private router:Router){}
    getIsAuth(){
        return this.isAuth;
    }
    getUserId(){
        return this.userId;
    }
    getToken(){
        return this.token;
    }
    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }
    createUser(email,password){

        const user:AuthData={
            email:email,
            password:password
        }
        this.http.post("http://localhost:3000/api/users/signup",user).subscribe(res=>{
            this.router.navigate(["/"])
        },error=>{
            this.authStatusListener.next(false);
        })
    }

    login(email,password){

        const user:AuthData={
            email:email,
            password:password
        }
        this.http.post<{token:string,expiresIn:number,userId:string}>("http://localhost:3000/api/users/login",user).subscribe(res=>{
            this.token=res.token;
            if(this.token){
                this.isAuth=true;
                this.authStatusListener.next(true);
                const curr=new Date();
                this.userId=res.userId
                const expiresIn=new Date(curr.getTime()+res.expiresIn*1000)
                this.saveAuthData(res.token,expiresIn,this.userId)
                this.setAuthTimer(res.expiresIn);
                this.router.navigate(["/"]);
            }
            
        },error=>{
            this.authStatusListener.next(false);
        })
    }

    logOut(){
        this.token=null;
        this.isAuth=false;
        this.authStatusListener.next(false);
        this.clearAuthData();
        clearTimeout(this.tokenTimer);
        this.router.navigate(["/"]);
    }

    autoAuthUser(){
        const authData=this.getAuthData();  
        if(authData){
        const curr=new Date();
        const expiresIn=authData.expiresIn.getTime()-curr.getTime();
        
        if(expiresIn>0){
            this.token=authData.token;
            this.setAuthTimer(expiresIn/1000)
            this.isAuth=true;
            this.authStatusListener.next(true);
        }
    }
    }
    private setAuthTimer(time:number){
        this.tokenTimer=setTimeout(()=>{
            this.logOut();
        },time*1000);
    }
    private saveAuthData(token:string, expiredIn:Date,userId:string){
        localStorage.setItem("token",token);
        localStorage.setItem("expiresIn",expiredIn.toISOString());
        localStorage.setItem("userId",this.userId)
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiresIn")
        localStorage.removeItem("userId")
    }

    private getAuthData(){
        const token=localStorage.getItem("token");
        const expiresIn=new Date(localStorage.getItem("expiresIn"));
        const userId=localStorage.getItem("userId");
        if(!token || !expiresIn) return;
        return {
            token:token,
            expiresIn:expiresIn,
            userId:userId
        }
    }
}