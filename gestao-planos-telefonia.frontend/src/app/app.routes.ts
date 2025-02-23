import { Routes } from '@angular/router';
import { PlanosComponent } from '../components/planos/planos.component';
import { ClientesComponent } from '../components/clientes/clientes.component';
import { HomePageComponent } from '../components/home-page/home-page.component';

export const routes: Routes = [
  { path: 'planos', component: PlanosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: '', component: HomePageComponent }
];