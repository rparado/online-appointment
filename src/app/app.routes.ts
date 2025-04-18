import { Routes } from '@angular/router';
import {PATH} from '@oda/config/path';

export const routes: Routes = [
  // {
  //   path: 'home',
  //   loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  // },
  {
    path: '',
    redirectTo: PATH.INTRO,
    pathMatch: 'full',
  },
  {
    path: PATH.INTRO,
    loadComponent: () => import('./pages/intro/intro.page').then( m => m.IntroPage)
  },
];
