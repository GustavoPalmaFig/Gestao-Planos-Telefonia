import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading = signal<boolean>(false);

  setLoading(isLoading: boolean) {
    this.loading.set(isLoading);
  }
}