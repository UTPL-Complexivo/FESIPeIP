import { Routes } from '@angular/router';

export default [
    { path: 'proyecto', loadComponent: () => import('./proyecto/proyecto.component').then((t) => t.ProyectoComponent) },
    { path: 'proyecto/nuevo', loadComponent: () => import('./proyecto/proyecto-nuevo.component').then((t) => t.ProyectoNuevoComponent) },
    { path: 'proyecto/editar/:id', loadComponent: () => import('./proyecto/proyecto-editar.component').then((t) => t.ProyectoEditarComponent) },
    { path: 'proyecto/:id/anexos', loadComponent: () => import('./proyecto-anexos/proyecto-anexos.component').then((t) => t.ProyectoAnexosComponent) },
    { path: 'tipologia', loadComponent: () => import('./tipologia/tipologia.component').then((t) => t.TipologiaComponent) },
    { path: 'tipologia/nuevo', loadComponent: () => import('./tipologia/tipologia-nuevo.component').then((t) => t.TipologiaNuevoComponent) },
    { path: 'tipologia/editar/:id', loadComponent: () => import('./tipologia/tipologia-editar.component').then((t) => t.TipologiaEditarComponent) },
    { path: 'actividad', loadComponent: () => import('./actividad/actividad.component').then((t) => t.ActividadComponent) },
    { path: 'actividad/nuevo', loadComponent: () => import('./actividad/actividad-nuevo.component').then((t) => t.ActividadNuevoComponent) },
    { path: 'actividad/editar/:id', loadComponent: () => import('./actividad/actividad-editar.component').then((t) => t.ActividadEditarComponent) },
    { path: 'tipologia-actividad', loadComponent: () => import('./tipologia-actividad/tipologia-actividad.component').then((t) => t.TipologiaActividadComponent) },
    { path: 'tipologia-actividad/nuevo', loadComponent: () => import('./tipologia-actividad/tipologia-actividad-nuevo.component').then((t) => t.TipologiaActividadNuevoComponent) },
    { path: 'tipologia-actividad/editar/:id', loadComponent: () => import('./tipologia-actividad/tipologia-actividad-editar.component').then((t) => t.TipologiaActividadEditarComponent) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
