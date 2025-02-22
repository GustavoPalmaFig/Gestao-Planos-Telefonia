import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url).pipe(
      catchError(this.handleError)
    );
  }
}