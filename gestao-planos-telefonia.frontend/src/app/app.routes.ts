import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'planos',
    loadComponent: () => import('./components/planos/planos.component').then(m => m.PlanosComponent)
  },
  {
    path: 'clientes',
    loadComponent: () => import('./components/clientes/clientes.component').then(m => m.ClientesComponent)
  },
];