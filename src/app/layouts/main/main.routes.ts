import { MainComponent } from './main.component';
import { PATH } from '@oda/config/path';
import { Routes } from '@angular/router';

export default [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: 'profile',
                loadComponent: () => import('../../pages/profile-update/profile-update.page').then(m => m.ProfileUpdatePage)
              },
              {
                path: 'appointments',
                loadComponent: () => import('../../pages/appointment/appointment.page').then(m => m.AppointmentPage)
              },
              {
                path: 'doctors',
                loadComponent: () => import('../../pages/doctors/doctors.page').then(m => m.DoctorsPage)
              },
              {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full'
              }
        ],
    }

] as Routes;
