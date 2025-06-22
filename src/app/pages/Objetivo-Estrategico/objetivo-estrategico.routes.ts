import { Routes } from '@angular/router';

export default [
    { path: 'objetivo-institucional', loadComponent: () => import('./objetivoinstitucional/objetivo-institucional.component').then((o) => o.ObjetivoInstitucionalComponent) },
    { path: 'objetivo-institucional/nuevo', loadComponent: () => import('./objetivoinstitucional/objetivo-institucional-nuevo.component').then((o) => o.ObjetivoInstitucionalNuevoComponent) },
    { path: 'objetivo-institucional/editar/:id', loadComponent: () => import('./objetivoinstitucional/objetivo-institucional-editar.component').then((o) => o.ObjetivoInstitucionalEditarComponent) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
