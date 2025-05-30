import { Routes } from '@angular/router';

export default [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    {
        path: 'doctor-appointment',
        loadComponent: () => import('./doctors-appointment.page'),
    },
] as Routes;
