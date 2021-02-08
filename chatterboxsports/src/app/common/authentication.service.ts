import { Injectable, EventEmitter, Output } from '@angular/core';
import { of ,Observable,throwError, EMPTY} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User} from '../user/models/index';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthenticationService {
    fullname: string;
    getLoggedInUser: any = {};
    userId:any;
    userEmail:string;
    firstName:string;
    lastName:string;
    isTourneyUser:number;
    token:any;
    private BASE_URL = environment.BASE_URL;
    private USER_LOGIN_URL  = this.BASE_URL + 'account';
    private USER_URL  = this.BASE_URL + 'user';
    @Output() getLoggedInUserName: EventEmitter<any> = new EventEmitter();
    @Output() checktourneyUser: EventEmitter<any> = new EventEmitter();
    @Output() getUserfullname: EventEmitter<any> = new EventEmitter();
    constructor(private router: Router, private http: HttpClient, ) {
    }

    // login service
    userSignIn(email: string, password: string): Observable<User> {
        return this.http.post<User>(this.USER_LOGIN_URL+'/login', { email: email, password: password }, httpOptions).pipe(
        tap( 
          response => {  
            //console.log(response['data']);
            //console.log(response['data'].first_name);
              localStorage.setItem('loggedInUser', JSON.stringify({ userId:response['data'].user_id,email: response['data'].email_address, first_name: response['data'].first_name,last_name: response['data'].last_name,isTourneyUser:response['data'].isTourneyUser,token:response['data'].token,subscriptions:response['data'].subscriptions}));
              var fullname = response['data'].first_name+' '+response['data'].last_name;
              this.getLoggedInUserName.emit(true);
              this.getUserfullname.emit(fullname);
              if(response['data'].isTourneyUser != undefined && response['data'].isTourneyUser == 1)
              {
                this.checktourneyUser.emit(true);
              }
          },
          error => { 
            this.getLoggedInUserName.emit(false);
          }
        ),
        catchError(this.handleError<User>('login'))
        );
    } 

     // function for get auth token
     getAuthToken() {
      if(localStorage.getItem('loggedInUser')) 
      {
        this.getLoggedInUser =  JSON.parse(localStorage.getItem('loggedInUser'));
        this.token = this.getLoggedInUser.token;
        if(this.token)
        {
          return this.getLoggedInUser;
        }
        else
        {
          return '';
        }
      }
      else
      {
        return '';
      }
    }

  /*function for logout user*/ 
  logout(checkstatuscode): Observable<any> {
    if(localStorage.getItem('currentUser')) {
      this.getLoggedInUser =  JSON.parse(localStorage.getItem('loggedInUser'));
      this.userId = this.getLoggedInUser.userId;
    }
    if(checkstatuscode == 401){
      this.getLoggedInUserName.emit(false);
      this.getUserfullname.emit('');
      localStorage.removeItem('loggedInUser');
      window.location.reload();
    }
    
    return this.http.post<any>(this.USER_LOGIN_URL +'/logout',{},httpOptions).pipe(
      tap(
        data  => {
          this.getLoggedInUserName.emit(false);
           this.getUserfullname.emit('');
          localStorage.removeItem('loggedInUser');
            if(checkstatuscode == 401)
            {
              this.router.navigate(['/']);
            }
            else
            {
              this.router.navigate(['/']);
            }
         
          setTimeout(()=>{
              window.location.reload();
          },200);
        },
        error =>{
        }
      ),
      catchError(this.handleError<User>('Logout user'))
    );
  }


   /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      if (error.status === 400) {
        return throwError (error);
      }else if(error.status === 409){
        return throwError (error);
      }else if(error.status === 403){
        return throwError (error);
      }else if(error.status === 404){
        return this.pageNotFoud();
      }
      return of(result as T);
    };
  }

  pageNotFoud(): Observable<any>
  {
      this.router.navigate(['pagenotfound']);
      return EMPTY;
  } 
  
    /** function use for loging */
    private log(message: string) {
      //this.messageService.add('HeroService: ' + message);
    }

}
