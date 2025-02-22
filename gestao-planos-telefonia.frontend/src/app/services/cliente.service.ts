import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { Cliente } from '../models/cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiRoot = environment.apiRoot + '/Cliente';

  constructor(private apiService: ApiService) { }

  getAllClientes(): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(`${this.apiRoot}/GetAllClientes`);
  }

  getClienteById(id: string): Observable<Cliente> {
    return this.apiService.get<Cliente>(`${this.apiRoot}/GetClienteById/${id}`);
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    delete cliente.id;
    return this.apiService.post<Cliente>(`${this.apiRoot}/CreateCliente`, cliente);
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.apiService.put<Cliente>(`${this.apiRoot}/UpdateCliente/${cliente.id}`, cliente);
  }

  deleteCliente(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.apiRoot}/DeleteCliente/${id}`);
  }
}