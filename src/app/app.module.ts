import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import {PostsService} from './posts.service'
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import {AuthService} from "././auth/auth.service"
import {AuthInterceptor} from "./auth/auth-interceptor"
import {ErrorInterceptor} from "./error-interceptor";
import { ErrorComponent } from './error/error.component'
import {AngularMaterialModule} from "./angular-material.module"
import {PostModule} from "./post.module"
import {AuthModule} from "./auth.module"

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    PostModule,
    AuthModule
  ],
  providers: [PostsService,AuthService,{
    provide:HTTP_INTERCEPTORS,
    useClass:AuthInterceptor,
    multi:true
  },{
    provide:HTTP_INTERCEPTORS,
    useClass:ErrorInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent],
  entryComponents:[ErrorComponent]
})
export class AppModule {}
