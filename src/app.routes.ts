import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from '@auth0/auth0-angular';
import { AuthRoleGuard } from './app/helpers/auth-role.guard';
export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivateChild: [AuthGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'gestion-usuarios', loadChildren: () => import('./app/pages/Gestion-Usuarios/usuarios.routes'), data: { expectedRoles: ['Administrador'] }, canActivate: [AuthRoleGuard] },
            { path: 'configuracion-institucional', loadChildren: () => import('./app/pages/Configuracion-Institucional/configuracion-institucional.routes'), data: { expectedRoles: ['Planificador'] }, canActivate: [AuthRoleGuard] },
            { path: 'objetivo-estrategico', loadChildren: () => import('./app/pages/Objetivo-Estrategico/objetivo-estrategico.routes'), data: { expectedRoles: ['Planificador'] }, canActivate: [AuthRoleGuard] },
            { path: 'proyecto-inversion', loadChildren: () => import('./app/pages/Proyecto-Inversion/proyecto-inversion.route'), data: { expectedRoles: ['Planificador'] }, canActivate: [AuthRoleGuard] },
            { path: 'reportes', loadChildren: () => import('./app/pages/Reportes-Visualizacion/reportes-visualizacion.route'), data: { expectedRoles: ['Planificador', 'Administrador'] }, canActivate: [AuthRoleGuard] },
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: 'callback', loadComponent: () => import('./app/helpers/callback.component').then(c => c.CallbackComponent) },
    { path: '**', redirectTo: '/notfound' }
];
