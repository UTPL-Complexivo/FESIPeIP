import { Routes } from '@angular/router';
import { AuthRoleGuard } from '../../helpers/auth-role.guard';

export default [
    {
        path: 'objetivo-institucional',
        loadComponent: () => import('./objetivoinstitucional/objetivo-institucional.component').then((o) => o.ObjetivoInstitucionalComponent),
        canActivate: [AuthRoleGuard],
        data: { expectedRoles: ['Revisor', 'Planificador', 'Autoridad'] }
    },
    {
        path: 'objetivo-institucional/nuevo',
        loadComponent: () => import('./objetivoinstitucional/objetivo-institucional-nuevo.component').then((o) => o.ObjetivoInstitucionalNuevoComponent),
        canActivate: [AuthRoleGuard],
        data: { expectedRoles: ['Planificador'] }
    },
    {
        path: 'objetivo-institucional/editar/:id',
        loadComponent: () => import('./objetivoinstitucional/objetivo-institucional-editar.component').then((o) => o.ObjetivoInstitucionalEditarComponent),
        canActivate: [AuthRoleGuard],
        data: { expectedRoles: ['Planificador'] }
    },

    // Rutas accesibles para Revisor, Administrador y Planificador
    {
        path: 'alineacion',
        loadComponent: () => import('./alineacion/alineacion.component').then((a) => a.AlineacionComponent),
        canActivate: [AuthRoleGuard],
        data: { expectedRoles: ['Revisor', 'Planificador','Autoridad'] }
    },
    {
        path: 'alineacion/nuevo',
        loadComponent: () => import('./alineacion/alineacion-nuevo.component').then((a) => a.AlineacionNuevoComponent),
        canActivate: [AuthRoleGuard],
        data: { expectedRoles: ['Planificador'] }
    },
    {
        path: 'alineacion/editar/:id',
        loadComponent: () => import('./alineacion/alineacion-editar.component').then((a) => a.AlineacionEditarComponent),
        canActivate: [AuthRoleGuard],
        data: { expectedRoles: ['Planificador'] }
    },

    // Rutas SOLO para Administrador y Planificador (NO accesibles para Revisor)
    {
        path: 'objetivo-pnd',
        loadComponent: () => import('./plannacionaldesarrollo/plan-nacional-desarrollo.component').then((p) => p.PlanNacionalDesarrolloComponent),
        canActivate: [AuthRoleGuard],
        data: { expectedRoles: ['Planificador'] }
    },
    {
        path: 'objetivo-pnd/nuevo',
        loadComponent: () => import('./plannacionaldesarrollo/plan-nacional-desarrollo-nuevo.component').then((p) => p.PlanNacionalDesarrolloNuevoComponent),
        canActivate: [AuthRoleGuard],
        data: { expectedRoles: ['Planificador'] }
    },
    {
        path: 'objetivo-pnd/editar/:id',
        loadComponent: () => import('./plannacionaldesarrollo/plan-nacional-desarrollo-editar.component').then((p) => p.PlanNacionalDesarrolloEditarComponent),
        canActivate: [AuthRoleGuard],
        data: { expectedRoles: ['Planificador'] }
    },
    {
        path: 'objetivo-ds',
        loadComponent: () => import('./objetivodesarrollosostenible/objetivo-desarrollo-sostenible.component').then((o) => o.ObjetivoDesarrolloSostenibleComponent),
        canActivate: [AuthRoleGuard],
        data: { expectedRoles: ['Planificador'] }
    },
    {
        path: 'objetivo-ds/nuevo',
        loadComponent: () => import('./objetivodesarrollosostenible/objetivo-desarrollo-sostenible-nuevo.component').then((o) => o.ObjetivoDesarrolloSostenibleNuevoComponent),
        canActivate: [AuthRoleGuard],
        data: { expectedRoles: ['Planificador'] }
    },
    {
        path: 'objetivo-ds/editar/:id',
        loadComponent: () => import('./objetivodesarrollosostenible/objetivo-desarrollo-sostenible-editar.component').then((o) => o.ObjetivoDesarrolloSostenibleEditarComponent),
        canActivate: [AuthRoleGuard],
        data: { expectedRoles: ['Planificador'] }
    },

    { path: '**', redirectTo: '/notfound' }
] as Routes;
