import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService, LogoutOptions } from '@auth0/auth0-angular';
import { UsuarioService } from '../../../service/usuario.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem, MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { BadgeModule } from 'primeng/badge';

@Component({
    selector: 'app-usuarios',
    standalone: true,
    template: `<div class="card">
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
            <p-toolbar>
                <ng-template #start>
                    <button pButton type="button" icon="pi pi-plus" label="Nuevo registro" class="p-button-success" [routerLink]="['/gestion-usuarios/usuarios/nuevo']"></button>
                </ng-template>
                <ng-template #end>
                    <p-checkbox inputId="includeDeleted" [(ngModel)]="includeDeleted" binary="true" (onChange)="loadUsuariosData()"></p-checkbox>
                    <label for="includeDeleted" class="ml-2">Incluir eliminados</label>
                </ng-template>
            </p-toolbar>
            <p-table
                #dt1
                [value]="usuarios"
                [tableStyle]="{ 'min-width': '50rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="5"
                [rowsPerPageOptions]="[5, 10, 20]"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['nombre', 'correo', 'userName', 'estado', 'tipoUsuario']"
            >
                <ng-template #caption>
                    <div class="flex justify-between items-center flex-column sm:flex-row">
                        <button pButton label="Limpiar Filtro General" class="p-button-outlined mb-2" icon="pi pi-filter-slash" (click)="clear(dt1)"></button>
                        <p-iconfield iconPosition="left" class="ml-auto">
                            <p-inputicon>
                                <i class="pi pi-search"></i>
                            </p-inputicon>
                            <input pInputText type="text" (input)="onGlobalFilter(dt1, $event)" placeholder="Filtro General" />
                        </p-iconfield>
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th>Acciones</th>
                        <th pSortableColumn="nombre">
                            <div class="flex justify-between items-center w-full">
                                <span>Nombre</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="nombre" display="menu" placeholder="Buscar por nombre"></p-columnFilter>
                                    <p-sortIcon field="nombre"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="correo">
                            <div class="flex justify-between items-center w-full">
                                <span>Correo</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="correo" display="menu" placeholder="Buscar por correo"></p-columnFilter>
                                    <p-sortIcon field="correo"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="userName">
                            <div class="flex justify-between items-center w-full">
                                <span>Usuario</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="userName" display="menu" placeholder="Buscar por usuario"></p-columnFilter>
                                    <p-sortIcon field="userName"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="estado">
                            <div class="flex justify-between items-center w-full">
                                <span>Estado</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="estado" display="menu" placeholder="Buscar por estado"></p-columnFilter>
                                    <p-sortIcon field="estado"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="roles">
                            <div class="flex justify-between items-center w-full">
                                <span>Roles</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="roles" display="menu" placeholder="Buscar por roles"></p-columnFilter>
                                    <p-sortIcon field="roles"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-usuario>
                    <tr>
                        <td>
                            <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" [routerLink]="['/usuarios', usuario.id]" pTooltip="Editar" tooltipPosition="top"></button>
                            @if (usuario.estado === 'Activo') {
                                <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text" (click)="updateEstado(usuario.id, true)" pTooltip="Inactivar" tooltipPosition="top"></button>
                            } @else {
                                <button pButton icon="pi pi-unlock" severity="warn" class="p-button-rounded p-button-text" (click)="updateEstado(usuario.id, false)" pTooltip="Activar" tooltipPosition="top"></button>
                            }
                            <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deleteUsuario(usuario.id)" pTooltip="Eliminar" tooltipPosition="top"></button>
                            <button pButton icon="pi pi-send" severity="secondary" class="p-button-rounded p-button-text" (click)="resetPassword(usuario.id)" pTooltip="Resetear Password" tooltipPosition="top"></button>
                        </td>
                        <td>{{ usuario.nombre }}</td>
                        <td>{{ usuario.correo }}</td>
                        <td>{{ usuario.userName }}</td>
                        <td>
                            @if(usuario.estado === 'Activo') {
                                <p-badge value="Activo" severity="success" badgeSize="large" />
                            } @else {
                                <p-badge value="Inactivo" severity="danger" badgeSize="large" />
                            }
                        <td>
                            @for (item of usuario.roles; track $index) {
                                 <p-badge [value]="item" severity="info" badgeSize="large"/>
                            }
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast position="top-right"></p-toast>`,
    imports: [CommonModule, BreadcrumbModule, RouterModule, TableModule, ButtonModule, TooltipModule, ToastModule, CheckboxModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, ToolbarModule, BadgeModule],
    providers: [MessageService]
})
export class UsuariosComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    loading: boolean = true;
    includeDeleted: boolean = false;
    estados: any[] = [
        { name: 'Activo', code: 'Activo' },
        { name: 'Inactivo', code: 'Inactivo' }
    ];
    constructor(
        public auth: AuthService,
        private usuarioService: UsuarioService,
        private messageService: MessageService
    ) {}
    usuarios: any[] = [];
    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Gestión de Usuarios' }, { label: 'Usuarios', route: '/usuarios' }];
        this.loadUsuariosData();
    }

    loadUsuariosData() {
        this.usuarioService.getUsuarios().subscribe({
            next: (data) => {
                this.usuarios = data;
                if (!this.includeDeleted) {
                    this.usuarios = data.filter((usuario) => !usuario.eliminado);
                }
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching usuarios:', error);
            }
        });
    }

    deleteUsuario(id: string) {
        this.loading = true;
        this.usuarioService.deleteUsuario(id).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    this.usuarios = this.usuarios.filter((u) => u.id !== id);
                }
            },
            error: (error) => {
                console.error('Error deleting usuario:', error);
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    updateEstado(id: string, estado: boolean) {
        this.loading = true;
        this.usuarioService.patchEstado(id).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    const usuario = this.usuarios.find((u) => u.id === id);
                    if (usuario) {
                        usuario.estado = estado ? 'Inactivo' : 'Activo';
                    }
                }
            },
            error: (error) => {
                console.error('Error updating estado:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado.' });
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    resetPassword(id: string) {
        this.loading = true;
        this.usuarioService.patchResetPassword(id).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                }
            },
            error: (error) => {
                console.error('Error resetting password:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo resetear la contraseña.' });
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
}
