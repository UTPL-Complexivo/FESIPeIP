import { Routes } from '@angular/router';

export default [
    { path: 'logs', loadComponent: () => import('./auditoria.component').then((a) => a.AuditoriaComponent) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
