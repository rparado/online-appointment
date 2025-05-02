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
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile-update/profile-update.page').then( m => m.ProfileUpdatePage),
    canActivate: [AuthGuard],
  },
  {
    path: 'appointment',
    loadComponent: () => import('./pages/appointment/appointment.page').then( m => m.AppointmentPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'doctors',
    loadComponent: () => import('./pages/doctors/doctors.page').then( m => m.DoctorsPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'doctor-detail/:id',
    loadComponent: () => import('./pages/doctors/doctor-detail/doctor-detail.page').then( m => m.DoctorDetailPage),
    canActivate: [AuthGuard],
  },
];
