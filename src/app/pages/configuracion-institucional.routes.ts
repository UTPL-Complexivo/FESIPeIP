import { Routes } from '@angular/router';

export default [
    { path: 'macro-sectores', loadComponent: () => import('./macro-sector/macro-sector.component').then((m) => m.MacroSectorComponent) },
    { path: 'macro-sectores/editar/:id', loadComponent: () => import('./macro-sector/macro-sector-editar.component').then((m) => m.MacroSectorEditarComponent) },
    { path: 'macro-sectores/nuevo', loadComponent: () => import('./macro-sector/macro-sector-nuevo.component').then((m) => m.MacroSectorNuevoComponent) },
    { path: 'sectores', loadComponent: () => import('./sector/sector.component').then((s) => s.SectorComponent) },
    { path: 'sectores/editar/:id', loadComponent: () => import('./sector/sector-editar.component').then((s) => s.SectorEditarComponent) },
    { path: 'sectores/nuevo', loadComponent: () => import('./sector/sector-nuevo.component').then((s) => s.SectorNuevoComponent) },
    { path: 'sub-sectores', loadComponent: () => import('./subsector/subsector.component').then((s) => s.SubsectorComponent) },
    { path: 'sub-sectores/editar/:id', loadComponent: () => import('./subsector/subsector-editar.component').then((s) => s.SubsectorEditarComponent) },
    { path: 'sub-sectores/nuevo', loadComponent: () => import('./subsector/subsector-nuevo.component').then((s) => s.SubsectorNuevoComponent) },
    { path: 'instituciones', loadComponent: () => import('./institucion/institucion.component').then((i) => i.InstitucionComponent) },
    { path: 'instituciones/nuevo', loadComponent: () => import('./institucion/institucion-nuevo.component').then((i) => i.InstitucionNuevoComponent) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
