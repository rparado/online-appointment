import { Routes } from '@angular/router';
import {PATH} from '@oda/config/path';
import { AuthGuard } from './guards/auth.guard';
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
  {
    path: PATH.REGISTER,
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  // {
  //   path: 'profile',
  //   loadChildren: () => import('./pages/profile-update/profile.route'),
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'appointment',
  //   loadChildren: () => import('./pages/appointment/appointment.route'),
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'doctors',
  //   loadChildren: () => import('./pages/doctors/doctor.route'),
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'doctor-detail/:id',
  //   loadChildren: () => import('./pages/doctors/doctor-detail/doctor-detail.page'),
  //   canActivate: [AuthGuard],
  // },
  {
      path: 'apps',
      canActivate: [AuthGuard],
      children: [{ path: '', loadChildren: () => import('./layouts/main/main.routes') }],
  },
  { path: '**', redirectTo: PATH.INTRO, pathMatch: 'full' },
  {
    path: 'form',
    loadComponent: () => import('./pages/medical-record/form/form.page').then( m => m.FormPage)
  },
  {
    path: 'view-medical-record',
    loadComponent: () => import('./pages/medical-record/view-medical-record/view-medical-record.page').then( m => m.ViewMedicalRecordPage)
  },
];
