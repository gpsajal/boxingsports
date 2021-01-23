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
    userId: number;
    fullname: string;
    getLoggedInUser: any = {};
    private BASE_URL = environment.BASE_URL;
    @Output() getLoggedInUserName: EventEmitter<any> = new EventEmitter();
    constructor(private router: Router, private http: HttpClient, ) {
    }

    // login service
    userSignIn(email: string, pass: string): Observable<User> {
        return this.http.post<User>(this.BASE_URL+'/login', { email: email, pass: pass }, httpOptions).pipe(
        tap( 
          response => {  
            console.log(response['data']);
            console.log(response['data'].first_name);
              localStorage.setItem('loggedInUser', JSON.stringify({ email: response['data'].email_address, first_name: response['data'].first_name,last_name: response['data'].last_name}));
              this.getLoggedInUserName.emit(true);
          },
          error => { 
            this.getLoggedInUserName.emit(false);
          }
        ),
        catchError(this.handleError<User>('login'))
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
