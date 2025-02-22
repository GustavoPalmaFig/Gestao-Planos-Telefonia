import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { Plano } from '../models/plano';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {
  private apiRoot = environment.apiRoot + '/Plano';

  constructor(private apiService: ApiService) { }

  getAllPlanos(): Observable<Plano[]> {
    return this.apiService.get<Plano[]>(`${this.apiRoot}/GetAllPlanos`);
  }

  getPlanoById(id: string): Observable<Plano> {
    return this.apiService.get<Plano>(`${this.apiRoot}/GetPlanoById/${id}`);
  }

  createPlano(plano: Plano): Observable<Plano> {
    delete plano.id;
    return this.apiService.post<Plano>(`${this.apiRoot}/CreatePlano`, plano);
  }

  updatePlano(plano: Plano): Observable<Plano> {
    return this.apiService.put<Plano>(`${this.apiRoot}/UpdatePlano/${plano.id}`, plano);
  }

  deletePlano(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.apiRoot}/DeletePlano/${id}`);
  }
}