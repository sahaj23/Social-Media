
import {HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse} from "@angular/common/http"

import {catchError} from "rxjs/operators"
import { throwError } from "rxjs";
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(private dialog:MatDialog){}
    intercept(req:HttpRequest<any>, next:HttpHandler){
        let errorMsg="An Unknown error occured";
       return next.handle(req).pipe(catchError((error:HttpErrorResponse)=>{
           if(error.error.message){
               errorMsg=error.error.message;
           }
           console.log(errorMsg);
           this.dialog.open(ErrorComponent,{data:{message:error}})
            return throwError(error);
       }));
    }
}