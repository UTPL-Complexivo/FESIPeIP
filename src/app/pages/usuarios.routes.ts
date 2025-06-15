import { Routes } from '@angular/router';

export default [
    { path: 'usuarios', loadComponent: () => import('./usuarios/usuarios.component').then((u) => u.UsuariosComponent) },
    { path: 'usuarios/nuevo', loadComponent: () => import('./usuarios/usuarios-nuevo.component').then((u) => u.UsuariosNuevoComponent) },
    { path: 'usuarios/:id', loadComponent: () => import('./usuarios/usuarios-editar.component').then((u) => u.UsuariosEditarComponent) },
    { path: 'roles', loadComponent: () => import('./roles/rol.component').then((r) => r.RolComponent) },
    { path: 'roles/nuevo', loadComponent: () => import('./roles/rol-nuevo.component').then((r) => r.RolNuevoComponent) },
    { path: 'roles/:id', loadComponent: () => import('./roles/rol-editar.component').then((r) => r.RolEditarComponent) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
