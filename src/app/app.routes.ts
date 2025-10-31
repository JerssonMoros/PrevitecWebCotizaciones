import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ConfiguratorComponent } from './features/configurator/configurator.component';

export const routes: Routes = [
  { 
    path: 'home', 
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'configurator', 
    loadComponent: () => import('./features/configurator/configurator.component').then(m => m.ConfiguratorComponent) 
  },
  { 
    path: 'gallery', 
    component: HomeComponent 
  },
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
];
