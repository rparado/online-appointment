import { Routes } from '@angular/router';
import { DoctorsPage } from './doctors.page';
import { DoctorDetailPage } from './doctor-detail/doctor-detail.page';

export default [
    {
        path: 'doctors',
        component: DoctorsPage
    },
    {
        path: 'doctor-detail/:id',
        component: DoctorDetailPage
    },
] as Routes;
