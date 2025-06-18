import { Routes } from '@angular/router';

export default [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    {
        path: 'medical-record',
        loadComponent: () => import('./medical-record.page'),
    },
] as Routes;
