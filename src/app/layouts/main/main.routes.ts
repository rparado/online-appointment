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
                path: 'doctor-detail/:id',
                loadComponent: () => import('../../pages/doctors/doctor-detail/doctor-detail.page').then(m => m.DoctorDetailPage)
              },
              {
                path: 'doctor-appointment',
                loadComponent: () => import('../../pages/doctors-appointment/doctors-appointment.page').then(m => m.DoctorsAppointmentPage)
              },
              {
                path: 'doctor-schedule',
                loadComponent: () => import('../../pages/doctors-schedule/doctors-schedule.page').then(m => m.DoctorsSchedulePage)
              },
              {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full'
              }
        ],
    }

] as Routes;
