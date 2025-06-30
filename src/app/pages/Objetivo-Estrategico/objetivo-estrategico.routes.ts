import { Routes } from '@angular/router';

export default [
    { path: 'objetivo-institucional', loadComponent: () => import('./objetivoinstitucional/objetivo-institucional.component').then((o) => o.ObjetivoInstitucionalComponent) },
    { path: 'objetivo-institucional/nuevo', loadComponent: () => import('./objetivoinstitucional/objetivo-institucional-nuevo.component').then((o) => o.ObjetivoInstitucionalNuevoComponent) },
    { path: 'objetivo-institucional/editar/:id', loadComponent: () => import('./objetivoinstitucional/objetivo-institucional-editar.component').then((o) => o.ObjetivoInstitucionalEditarComponent) },
    { path: 'objetivo-pnd', loadComponent: () => import('./plannacionaldesarrollo/plan-nacional-desarrollo.component').then((p) => p.PlanNacionalDesarrolloComponent) },
    { path: 'objetivo-pnd/nuevo', loadComponent: () => import('./plannacionaldesarrollo/plan-nacional-desarrollo-nuevo.component').then((p) => p.PlanNacionalDesarrolloNuevoComponent) },
    { path: 'objetivo-pnd/editar/:id', loadComponent: () => import('./plannacionaldesarrollo/plan-nacional-desarrollo-editar.component').then((p) => p.PlanNacionalDesarrolloEditarComponent) },
    { path: 'objetivo-ds', loadComponent: () => import('./objetivodesarrollosostenible/objetivo-desarrollo-sostenible.component').then((o) => o.ObjetivoDesarrolloSostenibleComponent) },
    { path: 'objetivo-ds/nuevo', loadComponent: () => import('./objetivodesarrollosostenible/objetivo-desarrollo-sostenible-nuevo.component').then((o) => o.ObjetivoDesarrolloSostenibleNuevoComponent) },
    { path: 'objetivo-ds/editar/:id', loadComponent: () => import('./objetivodesarrollosostenible/objetivo-desarrollo-sostenible-editar.component').then((o) => o.ObjetivoDesarrolloSostenibleEditarComponent) },
    { path: 'alineacion', loadComponent: () => import('./alineacion/alineacion.component').then((a) => a.AlineacionComponent) },
    { path: 'alineacion/nuevo', loadComponent: () => import('./alineacion/alineacion-nuevo.component').then((a) => a.AlineacionNuevoComponent) },
    { path: 'alineacion/editar/:id', loadComponent: () => import('./alineacion/alineacion-editar.component').then((a) => a.AlineacionEditarComponent) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
