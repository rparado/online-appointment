import { Routes } from '@angular/router';

export default [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    {
        path: 'appointment',
        loadComponent: () => import('./appointment.page'),
    },
] as Routes;
