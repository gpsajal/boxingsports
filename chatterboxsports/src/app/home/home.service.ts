import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, EMPTY, throwError  } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private BASE_URL = environment.BASE_URL;  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient,private router: Router) { }

  /*Api call for get live channel data  */
// getLiveChannel(channelType){
//   var url = this.BASE_URL + "channelvideos/"+channelType; 
//   return this.http.get<string[]>(url).pipe(
//     tap((response: any) => {
//       this.log('get live channel data')
//     }),
//     catchError(this.handleError<any>('get live channel data'))
//   );
// }

/** POST: add a new hero to the server */
getLiveChannel(channelType,page,limit): Observable<any> {
  var url = this.BASE_URL + "channelvideos/"+channelType; 
  return this.http.post<any>(url, {"page":page,"limit":limit}, this.httpOptions).pipe(
    tap((newUser: any) => this.log('get live channel data')),
    catchError(this.handleError<any>('get live channel data'))
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
