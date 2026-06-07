import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { AuditoriaService, AuditoriaFiltros } from '../../../service/auditoria.service';
import { AuditEventModel } from '../../../models/audit-event.model';

interface SelectItem {
    label: string;
    value: string;
}

@Component({
    selector: 'app-auditoria',
    standalone: true,
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-2">Logs de Auditoría</div>
            <p-breadcrumb class="max-w-full mb-4" [model]="items">
                <ng-template #item let-item>
                    <ng-container *ngIf="item.route; else elseBlock">
                        <a [routerLink]="item.route" class="p-breadcrumb-item-link">
                            <span [ngClass]="[item.icon ? item.icon : '', 'text-color']"></span>
                            <span class="text-primary font-semibold">{{ item.label }}</span>
                        </a>
                    </ng-container>
                    <ng-template #elseBlock>
                        <span class="text-color">{{ item.label }}</span>
                    </ng-template>
                </ng-template>
            </p-breadcrumb>

            <!-- Filtros -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Módulo <span class="text-red-500">*</span></label>
                    <p-dropdown
                        [options]="modulosOptions"
                        [(ngModel)]="filtros.modulo"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccionar módulo"
                        [style]="{'width': '100%'}"
                    ></p-dropdown>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Entidad</label>
                    <p-dropdown
                        [options]="entidadesOptions"
                        [(ngModel)]="filtros.entidad"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Todas las entidades"
                        [showClear]="true"
                        [style]="{'width': '100%'}"
                    ></p-dropdown>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Acción</label>
                    <p-dropdown
                        [options]="accionesOptions"
                        [(ngModel)]="filtros.accion"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Todas las acciones"
                        [showClear]="true"
                        [style]="{'width': '100%'}"
                    ></p-dropdown>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Límite de resultados</label>
                    <p-dropdown
                        [options]="limitOptions"
                        [(ngModel)]="filtros.limit"
                        optionLabel="label"
                        optionValue="value"
                        [style]="{'width': '100%'}"
                    ></p-dropdown>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Desde</label>
                    <p-calendar
                        [(ngModel)]="filtros.desde"
                        [showTime]="true"
                        [showIcon]="true"
                        dateFormat="dd/mm/yy"
                        placeholder="Fecha inicio"
                        [style]="{'width': '100%'}"
                    ></p-calendar>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Hasta</label>
                    <p-calendar
                        [(ngModel)]="filtros.hasta"
                        [showTime]="true"
                        [showIcon]="true"
                        dateFormat="dd/mm/yy"
                        placeholder="Fecha fin"
                        [style]="{'width': '100%'}"
                    ></p-calendar>
                </div>
                <div class="flex items-end gap-2">
                    <button pButton type="button" icon="pi pi-search" label="Buscar" class="p-button-primary" (click)="buscar()" [disabled]="!filtros.modulo"></button>
                    <button pButton type="button" icon="pi pi-refresh" label="Limpiar" class="p-button-outlined" (click)="limpiar()"></button>
                </div>
            </div>

            <!-- Tabla -->
            <p-table
                #dt1
                [value]="logs"
                [tableStyle]="{ 'min-width': '80rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="10"
                [rowsPerPageOptions]="[10, 20, 50, 100]"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['modulo', 'accion', 'entidad', 'usuario_id', 'detalles']"
            >
                <ng-template #caption>
                    <div class="flex justify-between items-center flex-column sm:flex-row">
                        <button pButton label="Limpiar Filtro" class="p-button-outlined mb-2" icon="pi pi-filter-slash" (click)="clear(dt1)"></button>
                        <p-iconfield iconPosition="left" class="ml-auto">
                            <p-inputicon>
                                <i class="pi pi-search"></i>
                            </p-inputicon>
                            <input pInputText #filter type="text" (input)="onGlobalFilter(dt1, $event)" placeholder="Buscar en tabla..." />
                        </p-iconfield>
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th pSortableColumn="fecha_hora" style="width: 14%">
                            <div class="flex justify-between items-center w-full">
                                <span>Fecha / Hora</span>
                                <p-sortIcon field="fecha_hora"></p-sortIcon>
                            </div>
                        </th>
                        <th pSortableColumn="modulo" style="width: 12%">
                            <div class="flex justify-between items-center w-full">
                                <span>Módulo</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="modulo" display="menu" placeholder="Filtrar módulo"></p-columnFilter>
                                    <p-sortIcon field="modulo"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="entidad" style="width: 12%">
                            <div class="flex justify-between items-center w-full">
                                <span>Entidad</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="entidad" display="menu" placeholder="Filtrar entidad"></p-columnFilter>
                                    <p-sortIcon field="entidad"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="accion" style="width: 10%">
                            <div class="flex justify-between items-center w-full">
                                <span>Acción</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="accion" display="menu" placeholder="Filtrar acción"></p-columnFilter>
                                    <p-sortIcon field="accion"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="usuario_id" style="width: 18%">
                            <div class="flex justify-between items-center w-full">
                                <span>Usuario ID</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="usuario_id" display="menu" placeholder="Filtrar usuario"></p-columnFilter>
                                    <p-sortIcon field="usuario_id"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th style="width: 34%">Detalles</th>
                    </tr>
                </ng-template>
                <ng-template #body let-log>
                    <tr>
                        <td>{{ log.fecha_hora | date: 'dd/MM/yyyy HH:mm:ss' }}</td>
                        <td>
                            <p-tag [value]="log.modulo" severity="info"></p-tag>
                        </td>
                        <td>{{ log.entidad }}</td>
                        <td>
                            <p-tag [value]="log.accion" [severity]="getAccionSeverity(log.accion)"></p-tag>
                        </td>
                        <td>{{ log.usuario_id || '-' }}</td>
                        <td>
                            <span class="text-xs font-mono break-all">{{ log.detalles }}</span>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="6" class="text-center py-8 text-gray-500">
                            @if (!buscado) {
                                <span><i class="pi pi-filter mr-2"></i>Seleccione un módulo y haga clic en "Buscar" para ver los logs.</span>
                            } @else {
                                <span><i class="pi pi-inbox mr-2"></i>No se encontraron registros con los filtros aplicados.</span>
                            }
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast position="top-right"></p-toast>
    `,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        BreadcrumbModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        TooltipModule,
        TableModule,
        IconFieldModule,
        InputIconModule,
        DropdownModule,
        CalendarModule,
        TagModule,
        CardModule
    ],
    providers: [MessageService]
})
export class AuditoriaComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    items: MenuItem[] = [];
    logs: AuditEventModel[] = [];
    loading = false;
    buscado = false;

    filtros: AuditoriaFiltros = {
        modulo: '',
        entidad: undefined,
        accion: undefined,
        desde: undefined,
        hasta: undefined,
        limit: 100
    };

    modulosOptions: SelectItem[] = [
        { label: 'Usuarios', value: 'Usuarios' },
        { label: 'Roles', value: 'Roles' },
        { label: 'Instituciones', value: 'Instituciones' },
        { label: 'Macro Sectores', value: 'MacroSectores' },
        { label: 'Sectores', value: 'Sectores' },
        { label: 'Subsectores', value: 'Subsectores' },
        { label: 'Objetivo Institucional', value: 'ObjetivoInstitucional' },
        { label: 'Objetivo PND', value: 'ObjetivoPND' },
        { label: 'Objetivo DS', value: 'ObjetivoDS' },
        { label: 'Alineaciones', value: 'Alineaciones' },
        { label: 'Proyectos de Inversión', value: 'ProyectosInversion' },
        { label: 'Tipologías', value: 'Tipologias' },
        { label: 'Actividades', value: 'Actividades' }
    ];

    entidadesOptions: SelectItem[] = [
        { label: 'Usuario', value: 'Usuario' },
        { label: 'Rol', value: 'Rol' },
        { label: 'Institución', value: 'Institucion' },
        { label: 'MacroSector', value: 'MacroSector' },
        { label: 'Sector', value: 'Sector' },
        { label: 'Subsector', value: 'Subsector' },
        { label: 'ObjetivoInstitucional', value: 'ObjetivoInstitucional' },
        { label: 'ObjetivoPND', value: 'ObjetivoPND' },
        { label: 'ObjetivoDS', value: 'ObjetivoDS' },
        { label: 'Alineacion', value: 'Alineacion' },
        { label: 'ProyectoInversion', value: 'ProyectoInversion' },
        { label: 'Tipologia', value: 'Tipologia' },
        { label: 'Actividad', value: 'Actividad' }
    ];

    accionesOptions: SelectItem[] = [
        { label: 'Crear', value: 'Crear' },
        { label: 'Actualizar', value: 'Actualizar' },
        { label: 'Eliminar', value: 'Eliminar' },
        { label: 'Consultar', value: 'Consultar' },
        { label: 'Login', value: 'Login' },
        { label: 'Logout', value: 'Logout' },
        { label: 'Aprobar', value: 'Aprobar' },
        { label: 'Rechazar', value: 'Rechazar' }
    ];

    limitOptions: SelectItem[] = [
        { label: '50 registros', value: '50' },
        { label: '100 registros', value: '100' },
        { label: '200 registros', value: '200' },
        { label: '500 registros', value: '500' }
    ];

    constructor(
        private auditoriaService: AuditoriaService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.items = [
            { icon: 'pi pi-home', route: '/' },
            { label: 'Auditoría' },
            { label: 'Logs', route: '/auditoria/logs' }
        ];
        this.filtros.limit = 100;
    }

    buscar(): void {
        if (!this.filtros.modulo) {
            this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debe seleccionar un módulo para buscar.' });
            return;
        }
        this.loading = true;
        this.buscado = true;
        this.auditoriaService.getLogs(this.filtros).subscribe({
            next: (data) => {
                this.logs = data;
                this.loading = false;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los logs de auditoría.' });
                this.loading = false;
            }
        });
    }

    limpiar(): void {
        this.filtros = { modulo: '', entidad: undefined, accion: undefined, desde: undefined, hasta: undefined, limit: 100 };
        this.logs = [];
        this.buscado = false;
        if (this.filter?.nativeElement) this.filter.nativeElement.value = '';
    }

    getAccionSeverity(accion: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (accion?.toLowerCase()) {
            case 'crear': return 'success';
            case 'actualizar': return 'info';
            case 'eliminar': return 'danger';
            case 'aprobar': return 'success';
            case 'rechazar': return 'danger';
            default: return 'secondary';
        }
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table): void {
        table.clear();
        if (this.filter?.nativeElement) this.filter.nativeElement.value = '';
    }
}
