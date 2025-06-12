import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService, LogoutOptions } from '@auth0/auth0-angular';
import { UsuarioService } from '../../service/usuario.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-usuarios',
    standalone: true,
    template: ` <div class="card">
        <div class="font-semibold text-xl">Usuarios</div>
        <p-breadcrumb class="max-w-full" [model]="items">
            <ng-template #item let-item>
                <ng-container *ngIf="item.route; else elseBlock">
                    <a [routerLink]="item.route" class="p-breadcrumb-item-link">
                        <span [ngClass]="[item.icon ? item.icon : '', 'text-color']"></span>
                        <span class="text-primary font-semibold">{{ item.label }}</span>
                    </a>
                </ng-container>
                <ng-template #elseBlock>
                    <a [href]="item.url">
                        <span class="text-color">{{ item.label }}</span>
                    </a>
                </ng-template>
            </ng-template>
        </p-breadcrumb>
        <p-table [value]="usuarios" [tableStyle]="{ 'min-width': '50rem' }">
            <ng-template #caption>
                <p-button icon="pi pi-file" label="Nuevo Registro" [routerLink]="['/usuarios/nuevo']" />
            </ng-template>
            <ng-template #header>
                <tr>
                    <th>Acciones</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Usuario</th>
                    <th>Estado</th>
                    <th>Tipo</th>
                </tr>
            </ng-template>
            <ng-template #body let-usuario>
                <tr>
                    <td>
                        <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" [routerLink]="['/usuarios', usuario.id]" pTooltip="Editar" tooltipPosition="top"></button>
                        @if (usuario.estado === 'Activo') {
                            <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text" (click)="usuario.estado = 'Inactivo'" pTooltip="Inactivar" tooltipPosition="top"></button>
                        } @else {
                            <button pButton icon="pi pi-unlock" severity="warn" class="p-button-rounded p-button-text" (click)="usuario.estado = 'Activo'" pTooltip="Activar" tooltipPosition="top"></button>
                        }
                        <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deleteUsuario(usuario.id)" pTooltip="Eliminar" tooltipPosition="top"></button>
                        <button pButton icon="pi pi-send" severity="secondary" class="p-button-rounded p-button-text" (click)="resetPassword(usuario.id)" pTooltip="Resetear Password" tooltipPosition="top"></button>
                    </td>
                    <td>{{ usuario.nombre }}</td>
                    <td>{{ usuario.correo }}</td>
                    <td>{{ usuario.userName }}</td>
                    <td>{{ usuario.estado }}</td>
                    <td>{{ usuario.tipoUsuario }}</td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    imports: [CommonModule, BreadcrumbModule, RouterModule, TableModule, ButtonModule, TooltipModule],
    providers: []
})
export class UsuariosComponent implements OnInit {
    resetPassword(arg0: any) {
        throw new Error('Method not implemented.');
    }
    items: MenuItem[] | undefined;

    home: MenuItem | undefined;
    constructor(
        public auth: AuthService,
        private usuarioService: UsuarioService
    ) {}
    usuarios: any[] = [];
    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Gestión de Usuarios' }, { label: 'Usuarios', route: '/usuarios' }];
        // Initialization logic can go here
        this.usuarioService.getUsuarios().subscribe({
            next: (data) => {
                this.usuarios = data;
            },
            error: (error) => {
                console.error('Error fetching usuarios:', error);
            }
        });
    }

    deleteUsuario(arg0: any) {
        throw new Error('Method not implemented.');
    }
}
