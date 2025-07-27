import { Routes } from '@angular/router';

export default [
    { path: 'configuracion-institucional', loadComponent: () => import('./configuracion-institucional.component').then((c) => c.ConfiguracionInstitucionalComponent) },
    { path: 'objetivos-estrategicos', loadComponent: () => import('./objetivo-estrategico.component').then((c) => c.ObjetivoEstrategicoComponent) },
    { path: '**', redirectTo: '/' }
] as Routes;
