import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadComponent: () => import('./components/home-page/home-page.component').then(m => m.HomePageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'planos',
    loadComponent: () => import('./components/planos/planos.component').then(m => m.PlanosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clientes',
    loadComponent: () => import('./components/clientes/clientes.component').then(m => m.ClientesComponent),
    canActivate: [AuthGuard]
  },
];