import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { UsuarioService } from '../../service/usuario.service';
import { SkeletonModule } from 'primeng/skeleton';

const ROLE_MENU_MAP: Record<string, MenuItem[]> = {
    administrador: [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
        },
        {
            label: 'Gestión de Usuarios',
            items: [
                { label: 'Usuarios', icon: 'pi pi-fw pi-id-card', routerLink: ['/gestion-usuarios/usuarios'] },
                { label: 'Roles', icon: 'pi pi-fw pi-check-square', routerLink: ['/gestion-usuarios/roles'] }
            ]
        }
    ],
    planificador: [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
        },
        {
            label: 'Configuración Institucional',
            items: [
                { label: 'Macro Sectores', icon: 'pi pi-fw pi-building', routerLink: ['/configuracion-institucional/macro-sectores'] },
                { label: 'Sectores', icon: 'pi pi-fw pi-book', routerLink: ['/configuracion-institucional/sectores'] },
                { label: 'Subsectores', icon: 'pi pi-fw pi-briefcase', routerLink: ['/configuracion-institucional/sub-sectores'] },
                { label: 'Instituciones', icon: 'pi pi-fw pi-building-columns', routerLink: ['/configuracion-institucional/instituciones'] }
            ]
        },
        {
            label: 'Objetivos Estratégicos',
            items: [
                { label: 'Objetivos Institucionales', icon: 'pi pi-fw pi-bullseye', routerLink: ['/objetivo-estrategico/objetivo-institucional'] },
                { label: 'Objetivos PND', icon: 'pi pi-fw pi-bolt', routerLink: ['/objetivo-estrategico/objetivo-pnd'] },
                { label: 'O. Desarrollo Sostenible', icon: 'pi pi-fw pi-chart-scatter', routerLink: ['/objetivo-estrategico/objetivo-ds'] },
                { label: 'Alineaciones', icon: 'pi pi-fw pi-book', routerLink: ['/objetivo-estrategico/alineacion'] },
            ]
        },{
          label: 'Proyectos de Inversión'  ,
          items:[
            {label: 'Tipologías de intervencion', icon: 'pi pi-fw pi-cog', routerLink: ['/proyecto-inversion/tipologia']},
          ]
        }
    ]
};
@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, SkeletonModule],
    template: `
    @if(loading) {
        <p-skeleton width="5rem" styleClass="mb-2 mt-4" />
        <p-skeleton styleClass="mb-2 mt-4" height="2rem" />
        <p-skeleton width="5rem" styleClass="mb-2 mt-4" />
        <p-skeleton styleClass="mb-2 mt-4" height="2rem" />
        <p-skeleton styleClass="mb-2 mt-4" height="2rem" />
        <p-skeleton styleClass="mb-2 mt-4" height="2rem" />
        <p-skeleton styleClass="mb-2 mt-4" height="2rem" />
    }
    @else {
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    }
    `
})
export class AppMenu {
    model: MenuItem[] = [];
    loading: boolean = true;
    constructor(private userService: UsuarioService) {}
    ngOnInit() {
        this.getMenuItems();
    }

    getMenuItems(): void {
        this.userService.getMe().subscribe({
            next: (user) => {
                this.model = [];
                if (user && user.roles && user.roles.length > 0) {
                    const rol = user.roles[0].toLowerCase();
                    this.model = ROLE_MENU_MAP[rol] ?? [];
                }
            },
            error: (error) => {
                console.error('Error al obtener el usuario:', error);
                this.model = [];
            },
            complete: () => {
                this.loading = false;
            }
        });
    }
}
