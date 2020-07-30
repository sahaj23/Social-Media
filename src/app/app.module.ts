import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './post-list/post-list.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {PostsService} from './posts.service'
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import {MatPaginatorModule} from '@angular/material/paginator';
import { LoginComponent } from './auth/login/login/login.component';
import { SignupComponent } from './auth/signup/signup/signup.component';
import {AuthService} from "././auth/auth.service"
import {AuthInterceptor} from "./auth/auth-interceptor"
import {ErrorInterceptor} from "./error-interceptor";
import { ErrorComponent } from './error/error.component'
@NgModule({
  declarations: [AppComponent, PostCreateComponent, HeaderComponent, PostListComponent, LoginComponent, SignupComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    HttpClientModule
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
