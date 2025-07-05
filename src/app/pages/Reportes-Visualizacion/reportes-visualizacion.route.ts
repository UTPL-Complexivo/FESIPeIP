import { Routes } from '@angular/router';

export default [
    { path: 'configuracion-institucional', loadComponent: () => import('./configuracion-institucional.component').then((c) => c.ConfiguracionInstitucionalComponent) },
    { path: '**', redirectTo: '/' }
] as Routes;
