import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { RolModel } from '../../../models/rol.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { RolService } from '../../../service/rol.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
@Component({
    selector: 'app-rol',
    standalone: true,
    template: `<div class="card">
            <div class="font-semibold text-xl">Roles</div>
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
                    <button pButton type="button" icon="pi pi-plus" label="Nuevo registro" class="p-button-success" [routerLink]="['/gestion-usuarios/roles/nuevo']"></button>
                </ng-template>
            </p-toolbar>
            <p-table
                #dt1
                [value]="roles"
                [tableStyle]="{ 'min-width': '50rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="5"
                [rowsPerPageOptions]="[5, 10, 20]"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['nombre', 'descripcion', 'estado']"
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
                        <th pSortableColumn="descripcion">
                            <div class="flex justify-between items-center w-full">
                                <span>Descripción</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="descripcion" display="menu" placeholder="Buscar por descripcion"></p-columnFilter>
                                    <p-sortIcon field="descripcion"></p-sortIcon>
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
                    </tr>
                </ng-template>
                <ng-template #body let-rol>
                    <tr>
                        <td>
                            <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" [routerLink]="['/gestion-usuarios/roles', rol.id]" pTooltip="Editar" tooltipPosition="top"></button>
                            @if (rol.estado === 'Activo') {
                                <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text" (click)="updateEstado(rol.id)" pTooltip="Inactivar" tooltipPosition="top"></button>
                            } @else {
                                <button pButton icon="pi pi-unlock" severity="warn" class="p-button-rounded p-button-text" (click)="updateEstado(rol.id)" pTooltip="Activar" tooltipPosition="top"></button>
                            }
                            <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deleteUsuario(rol.id)" pTooltip="Eliminar" tooltipPosition="top"></button>
                        </td>
                        <td>{{ rol.nombre }}</td>
                        <td>{{ rol.descripcion }}</td>
                        <td>
                            @if (rol.estado === 'Activo') {
                                <p-badge value="Activo" severity="success" badgeSize="large"></p-badge>
                            } @else {
                                <p-badge value="Inactivo" severity="danger" badgeSize="large"></p-badge>
                            }
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast position="top-right"></p-toast>`,
    imports: [BreadcrumbModule, RouterModule, CommonModule, ToolbarModule, TableModule, IconFieldModule, InputIconModule, ToastModule, ButtonModule, TooltipModule, InputTextModule, BadgeModule],
    providers: [MessageService]
})
export class RolComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] | undefined;
    roles: RolModel[] = [];
    loading: boolean = true;
    constructor(
        private messageService: MessageService,
        private rolService: RolService
    ) {}
    ngOnInit() {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Gestión de Usuarios' }, { label: 'Roles', route: '/roles' }];
        this.getRoles();
    }

    getRoles() {
        this.loading = true;
        this.rolService.getRoles().subscribe({
            next: (data) => {
                this.roles = data;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los roles.' });
                this.loading = false;
            }
        });
    }
    resetPassword(arg0: any) {
        throw new Error('Method not implemented.');
    }
    deleteUsuario(id: string) {
        this.rolService.deleteRol(id).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                this.getRoles();
            },
            error: (error) => {
                console.error('Error al eliminar el rol:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el rol.' });
            }
        });
    }
    updateEstado(id: string) {
        this.rolService.patchEstado(id).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                const rol = this.roles.find((r) => r.id === id);
                if (rol) {
                    rol.estado = rol.estado === 'Activo' ? 'Inactivo' : 'Activo';
                }
            },
            error: (error) => {
                console.error('Error al actualizar el estado del rol:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado del rol.' });
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
