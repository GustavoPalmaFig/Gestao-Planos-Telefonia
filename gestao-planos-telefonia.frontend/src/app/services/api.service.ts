import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  // private messageService = inject(MessageService);
  
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';

    if (error.error instanceof ErrorEvent) { //client side error
      return throwError(() => new Error(`Erro do cliente: ${error.error.message}`));
    } 
  
    switch (error.status) {
      case 409:
        errorMessage = 'Este e-mail já está sendo utilizado.';
        break;
      case 400:
        errorMessage = 'Dados inválidos. Preencha corretamente.';
        break;
      default:
        errorMessage = `Erro inesperado. Código: ${error.status} - ${error.message}`;
        break;
    }

    // this.messageService.add({ severity: 'Error', summary: 'Erro', detail: errorMessage, life: 3000 });
    return throwError(() => new Error(errorMessage));
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(url, body, { headers }).pipe(
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