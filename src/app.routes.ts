import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from '@auth0/auth0-angular';
export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivateChild: [AuthGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'usuarios', loadComponent: () => import('./app/pages/usuarios/usuarios.component').then(u => u.UsuariosComponent) },
            { path: 'usuarios/nuevo', loadComponent: () => import('./app/pages/usuarios/usuarios-nuevo.component').then(u => u.UsuariosNuevoComponent) },
            { path: 'usuarios/:id', loadComponent: () => import('./app/pages/usuarios/usuarios-editar.component').then(u => u.UsuariosEditarComponent) },
            { path: 'roles', loadComponent: () => import('./app/pages/roles/rol.component').then(r => r.RolComponent) },
            { path: 'roles/nuevo', loadComponent: () => import('./app/pages/roles/rol-nuevo.component').then(r => r.RolNuevoComponent) },
            { path: 'roles/:id', loadComponent: () => import('./app/pages/roles/rol-editar.component').then(r => r.RolEditarComponent) },
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: 'callback', loadComponent: () => import('./app/helpers/callback.component').then(c => c.CallbackComponent) },
    { path: '**', redirectTo: '/notfound' }
];
