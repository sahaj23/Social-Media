import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login/login/login.component';
import { SignupComponent } from './auth/signup/signup/signup.component';
import { FormsModule } from '@angular/forms';
import {AngularMaterialModule} from "./angular-material.module"
@NgModule({
    declarations: [LoginComponent, SignupComponent],
    imports: [ CommonModule,FormsModule,AngularMaterialModule],
    exports: [],
    providers: [],
})
export class AuthModule {}