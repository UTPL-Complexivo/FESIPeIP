import { Routes } from '@angular/router';

export default [
    { path: 'tipologia', loadComponent: () => import('./tipologia/tipologia.component').then((t) => t.TipologiaComponent) },
    { path: 'tipologia/nuevo', loadComponent: () => import('./tipologia/tipologia-nuevo.component').then((t) => t.TipologiaNuevoComponent) },
    { path: 'tipologia/editar/:id', loadComponent: () => import('./tipologia/tipologia-editar.component').then((t) => t.TipologiaEditarComponent) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
