import { Routes } from '@angular/router';
import { AuthRoleGuard } from '../../helpers/auth-role.guard';

export default [
    { path: 'proyecto', loadComponent: () => import('./proyecto/proyecto.component').then((t) => t.ProyectoComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Revisor', 'Externo','Autoridad'] } },
    { path: 'proyecto/nuevo', loadComponent: () => import('./proyecto/proyecto-nuevo.component').then((t) => t.ProyectoNuevoComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Revisor', 'Externo','Autoridad'] } },
    { path: 'proyecto/editar/:id', loadComponent: () => import('./proyecto/proyecto-editar.component').then((t) => t.ProyectoEditarComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Revisor', 'Externo','Autoridad'] } },
    { path: 'proyecto/:id/anexos', loadComponent: () => import('./proyecto-anexos/proyecto-anexos.component').then((t) => t.ProyectoAnexosComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Revisor', 'Externo','Autoridad'] } },
    { path: 'tipologia', loadComponent: () => import('./tipologia/tipologia.component').then((t) => t.TipologiaComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Planificador'] } },
    { path: 'tipologia/nuevo', loadComponent: () => import('./tipologia/tipologia-nuevo.component').then((t) => t.TipologiaNuevoComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Planificador'] } },
    { path: 'tipologia/editar/:id', loadComponent: () => import('./tipologia/tipologia-editar.component').then((t) => t.TipologiaEditarComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Planificador'] } },
    { path: 'actividad', loadComponent: () => import('./actividad/actividad.component').then((t) => t.ActividadComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Planificador'] } },
    { path: 'actividad/nuevo', loadComponent: () => import('./actividad/actividad-nuevo.component').then((t) => t.ActividadNuevoComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Planificador'] } },
    { path: 'actividad/editar/:id', loadComponent: () => import('./actividad/actividad-editar.component').then((t) => t.ActividadEditarComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Planificador'] } },
    { path: 'tipologia-actividad', loadComponent: () => import('./tipologia-actividad/tipologia-actividad.component').then((t) => t.TipologiaActividadComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Planificador'] } },
    { path: 'tipologia-actividad/nuevo', loadComponent: () => import('./tipologia-actividad/tipologia-actividad-nuevo.component').then((t) => t.TipologiaActividadNuevoComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Planificador'] } },
    { path: 'tipologia-actividad/editar/:id', loadComponent: () => import('./tipologia-actividad/tipologia-actividad-editar.component').then((t) => t.TipologiaActividadEditarComponent), canActivate: [AuthRoleGuard], data: { expectedRoles: ['Planificador'] } },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
