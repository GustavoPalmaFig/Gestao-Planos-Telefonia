import { Routes } from '@angular/router';
import { PlanosComponent } from '../app/components/planos/planos.component';
import { ClientesComponent } from '../app/components/clientes/clientes.component';
import { HomePageComponent } from '../app/components/home-page/home-page.component';

export const routes: Routes = [
  { path: 'planos', component: PlanosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: '', component: HomePageComponent }
];