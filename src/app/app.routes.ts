import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ConfiguratorComponent } from './configurator/configurator.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'configurator', component: ConfiguratorComponent }
];
