import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable, of, EMPTY, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../common/index';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token:string
  userid:string
  setheaders:any = {};
  getLoggedInUser: any = {};
  lang:string;
  constructor(private injector: Injector, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const auth = this.injector.get(AuthenticationService);
    this.getLoggedInUser = auth.getAuthToken();
    if(this.getLoggedInUser){
      this.token = 'Bearer '+this.getLoggedInUser.token;
      this.userid =  this.getLoggedInUser.userId;
    }else{
      this.token = '';
      this.userid = '';
    }
    const authToken = this.token;
    const userid = this.userid;
    
    
    
    // Clone the request and set the new header in one step.
    if(this.token  == '')
    {
      this.setheaders = req.clone({ headers: new HttpHeaders({
         'Content-Type':'application/json'
      }) });
    }
    else
    {
        this.setheaders = req.clone({ headers: new HttpHeaders({
          'Authorization': authToken,
           'Content-Type':'application/json'
        }) });
    }

    const authReq = this.setheaders;
    return next.handle(authReq).pipe(
      tap(
        event => this.handleResponse(req, event),
        error => this.handleError(req, error)
      )
    );
    
  }

  handleResponse(req: HttpRequest<any>, event) {
   // console.log('Handling response for ', req.url, event);
    if (event instanceof HttpResponse) {
    //  // console.log('Request for ', req.url,
    //       ' Response Status ', event.status,
    //       ' With body ', event.body);
    }
  }

  handleError(req: HttpRequest<any>, event) {
    event.error = event.error;
        if (event.status === 401) {
          return this.redirectToHttpErrorPages(event.status);
        }else if(event.status === 404){
          return this.redirectToHttpErrorPages(event.status);
        }else if(event.status === 500 || event.status === 504){
          return this.redirectToHttpErrorPages(event.status);
        } else {
          return throwError(event);
        }
  }

  redirectToHttpErrorPages(statuscode): Observable<any>
  {
    if(statuscode === 404){
      this.router.navigate(['pagenotfound']);
      return EMPTY;
    }else if(statuscode === 500 || statuscode === 504){
      this.router.navigate(['500']);
      return EMPTY;
    }else if(statuscode === 401){
     //const authservice = this.injector.get(AuthenticationService);
     //authservice.logout(statuscode);
      return EMPTY;
    }
  } 
}
