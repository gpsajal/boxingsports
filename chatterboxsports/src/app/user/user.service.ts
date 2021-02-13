import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User} from './models/index';
import { Observable, of, EMPTY, throwError  } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private BASE_URL = environment.BASE_URL;  
  private USER_ACCOUNT_URL  = this.BASE_URL + 'account';
  private USER_URL  = this.BASE_URL + 'user/';
  private USER_PAYMENT_URL  = this.BASE_URL + 'payment/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient,private router: Router) { }



  /** POST: add a new hero to the server */
  userSignup(user: User): Observable<User> {
    return this.http.post<User>(this.USER_URL+'registration', user, this.httpOptions).pipe(
      tap((newUser: User) => this.log('')),
      catchError(this.handleError<User>('registerUser'))
    );
  }
  
  /** POST: add a new hero to the server */
  // userTourneySignup(user: User): Observable<User> {
  //   return this.http.post<User>(this.USER_URL+'tourneySubscription', user, this.httpOptions).pipe(
  //     tap((newUser: User) => this.log('')),
  //     catchError(this.handleError<User>('tourney Subscription'))
  //   );
  // }
  userTourneySignup(user: User,userId): Observable<User> {
    return this.http.post<User>(this.USER_URL+userId+'/subscriptions', user, this.httpOptions).pipe(
      tap((newUser: User) => this.log('')),
      catchError(this.handleError<User>('tourney Subscription'))
    );
  }

  /** POST: add a new hero to the server */
  userSignin(user: User): Observable<User> {
    return this.http.post<User>(this.USER_ACCOUNT_URL+'login', user, this.httpOptions).pipe(
      tap((newUser: User) => this.log('')),
      catchError(this.handleError<User>('loginUser'))
    );
  }

  // email verify account service 
  deleteUserSubscription(userId,planType): Observable<any>  {
    return this.http.delete<any>(this.USER_URL + userId +'/subscriptions/'+planType, this.httpOptions).pipe(
      catchError(this.handleError<User>('Delete user Subscription'))
    );
  } 

/** check email exist */
checkEmailExist(emailId): Observable<any> {
  return this.http.get<any>(this.USER_ACCOUNT_URL +'/'+emailId, this.httpOptions).pipe(
    tap((newUser: any) => this.log('check user email')),
    catchError(this.handleError<any>('check user email'))
  );
}

/** check email exist */
getStripeSecretToekn(amount): Observable<any> {
  return this.http.post<any>(this.USER_PAYMENT_URL +'intent',{amount: amount,description: "Live+ subscription has been charged of amount 13.99 successful"}, this.httpOptions).pipe(
    tap((newUser: any) => this.log('get payment intent')),
    catchError(this.handleError<any>('get payment intent'))
  );
}

/** check email exist */
getStripeSubscription(subscriptiondata): Observable<any> {
  return this.http.post<any>(this.USER_PAYMENT_URL +'subscription',subscriptiondata, this.httpOptions).pipe(
    tap((newUser: any) => this.log('set subscription')),
    catchError(this.handleError<any>('set subscription'))
  );
}

/** check email exist */
getStripeBuySubscription(subscriptiondata): Observable<any> {
  return this.http.post<any>(this.USER_PAYMENT_URL +'subscription',subscriptiondata, this.httpOptions).pipe(
    tap((newUser: any) => this.log('set subscription')),
    catchError(this.handleError<any>('set subscription'))
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

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  pageNotFoud(): Observable<any>
  {
      this.router.navigate(['pagenotfound']);
      return EMPTY;
  } 

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    //this.messageService.add(`HeroService: ${message}`);
  }
}
