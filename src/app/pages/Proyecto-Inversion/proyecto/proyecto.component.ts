import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { AppEstadoOe } from '../../../layout/component/app.estado-oe';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ProyectoInversionModel } from '../../../models/proyecto-inversion.model';
import { ActividadModel } from '../../../models/actividad.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { EstadoObjetivosEstrategicos } from '../../../shared/enums/estado-objetivos-estrategicos.enum';
import { TagModule } from 'primeng/tag';
import { ProyectoInversionService } from '../../../service/proyecto-inversion.service';
import { ProyectoInversionEstadoLogModel } from '../../../models/proyecto-inversion-estado-log.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TimelineModule } from 'primeng/timeline';

@Component({
    selector: 'app-proyecto',
    standalone: true,
    template: `
        <div class="card">
            <app-cabecera-principal [items]="items" titulo="Proyectos de Inversión" linkNuevo="/proyecto-inversion/proyecto/nuevo"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="proyectos"
                [tableStyle]="{ 'min-width': '80rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="10"
                [rowsPerPageOptions]="[10, 20, 50]"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['cup', 'titulo', 'descripcion', 'estado']"
            >
                <ng-template #caption>
                    <div class="flex justify-between items-center flex-column sm:flex-row">
                        <button pButton label="Limpiar Filtro General" class="p-button-outlined mb-2" icon="pi pi-filter-slash" (click)="clear(dt1)"></button>
                        <p-iconfield iconPosition="left" class="ml-auto">
                            <p-inputicon>
                                <i class="pi pi-search"></i>
                            </p-inputicon>
                            <input pInputText #filter type="text" (input)="onGlobalFilter(dt1, $event)" placeholder="Filtro General" />
                        </p-iconfield>
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th style="width: 15%">Acciones</th>
                        <th pSortableColumn="cup" style="width: 15%">
                            <div class="flex justify-between items-center w-full">
                                <span>CUP</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="cup" display="menu" placeholder="Buscar por CUP"></p-columnFilter>
                                    <p-sortIcon field="cup"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="titulo" style="width: 30%">
                            <div class="flex justify-between items-center w-full">
                                <span>Título</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="titulo" display="menu" placeholder="Buscar por título"></p-columnFilter>
                                    <p-sortIcon field="titulo"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th style="width: 25%">Descripción</th>
                        <th pSortableColumn="estado" style="width: 10%">
                            <div class="flex justify-between items-center w-full">
                                <span>Estado</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="estado" display="menu" placeholder="Buscar por estado"></p-columnFilter>
                                    <p-sortIcon field="estado"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="fechaCreacion" style="width: 5%">
                            <div class="flex justify-between items-center w-full">
                                <span>Fecha Creación</span>
                                <div class="flex items-center gap-2">
                                    <p-sortIcon field="fechaCreacion"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-proyecto>
                    <tr>
                        <td>
                            <div class="flex gap-2 justify-center">
                                <button pButton icon="pi pi-eye" size="small"
                                        class="p-button-rounded p-button-info p-button-text"
                                        (click)="mostrarEstados(proyecto)"
                                        pTooltip="Ver estados del proyecto" tooltipPosition="top"></button>
                                <button pButton icon="pi pi-pencil" size="small"
                                        class="p-button-rounded p-button-success p-button-text"
                                        [routerLink]="['/proyecto-inversion/proyecto/editar', proyecto.id]"
                                        pTooltip="Editar proyecto" tooltipPosition="top"></button>
                                <button pButton icon="pi pi-list" size="small"
                                        class="p-button-rounded p-button-warning p-button-text"
                                        (click)="mostrarActividades(proyecto)"
                                        pTooltip="Ver actividades" tooltipPosition="top"></button>
                                <button pButton icon="pi pi-paperclip" size="small"
                                        class="p-button-rounded p-button-secondary p-button-text"
                                        [routerLink]="['/proyecto-inversion/proyecto', proyecto.id, 'anexos']"
                                        pTooltip="Ver anexos" tooltipPosition="top"></button>
                                <button pButton icon="pi pi-trash" size="small"
                                        class="p-button-rounded p-button-danger p-button-text"
                                        (click)="eliminarProyecto(proyecto)"
                                        pTooltip="Eliminar proyecto" tooltipPosition="top"></button>
                            </div>
                        </td>
                        <td>
                            <span class="font-bold text-primary">{{ proyecto.cup }}</span>
                        </td>
                        <td>
                            <div class="font-medium">{{ proyecto.titulo }}</div>
                        </td>
                        <td>
                            <div class="text-sm text-gray-600" [innerHTML]="truncateText(proyecto.descripcion, 100)"></div>
                        </td>
                        <td>
                            <app-estado-oe [estado]="proyecto.estado"></app-estado-oe>
                        </td>
                        <td>
                            <span class="text-sm">{{ formatDate(proyecto.fechaCreacion) }}</span>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="6" class="text-center">
                            No se encontraron proyectos de inversión.
                        </td>
                    </tr>
                </ng-template>
                <ng-template #loadingbody>
                    <tr>
                        <td colspan="6" class="text-center">
                            Cargando proyectos. Por favor espere.
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast position="top-right"></p-toast>
        <p-confirmDialog></p-confirmDialog>

        <!-- Dialog para mostrar actividades -->
        <p-dialog
            [header]="'Actividades del Proyecto: ' + (proyectoSeleccionado?.titulo || '')"
            [(visible)]="mostrarDialogoActividades"
            [modal]="true"
            [style]="{ width: '50vw', maxWidth: '800px' }"
            [draggable]="false"
            [resizable]="false">

            @if (actividadesProyecto.length > 0) {
                <div class="grid">
                    @for (actividad of actividadesProyecto; track actividad.id) {
                        <div class="col-12 md:col-6 mb-3">
                            <div class="p-3 border border-gray-300 rounded-lg bg-gray-50">
                                <h4 class="font-semibold text-gray-800 mb-2">{{ actividad.nombre }}</h4>
                                <p class="text-sm text-gray-600">Código: {{ actividad.codigo }}</p>
                            </div>
                        </div>
                    }
                </div>
            } @else {
                <div class="text-center py-8">
                    <i class="pi pi-inbox text-4xl text-gray-400 mb-4 block"></i>
                    <p class="text-gray-500">Este proyecto no tiene actividades asociadas</p>
                </div>
            }

            <div class="flex justify-end mt-4">
                <button pButton
                        label="Cerrar"
                        icon="pi pi-times"
                        class="p-button-text"
                        (click)="cerrarDialogoActividades()">
                </button>
            </div>
        </p-dialog>

        <!-- Dialog para mostrar estados del proyecto -->
        <p-dialog
            [header]="'Estados del Proyecto: ' + (proyectoSeleccionado?.titulo || '')"
            [(visible)]="mostrarDialogoEstados"
            [modal]="true"
            [style]="{ width: '60vw', maxWidth: '900px' }"
            [draggable]="false"
            [resizable]="false">

            @if (cargandoEstados) {
                <div class="text-center py-8">
                    <i class="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4 block"></i>
                    <p class="text-gray-500">Cargando historial de estados...</p>
                </div>
            } @else if (estadosProyecto.length > 0) {
                <p-timeline [value]="estadosProyecto" align="alternate" styleClass="customized-timeline">
                    <ng-template #content let-estado>
                        <div class="p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-semibold text-lg text-gray-800">{{ estado.nombreEstado }}</h4>
                                <span class="text-sm text-gray-500">{{ formatDateTime(estado.fecha) }}</span>
                            </div>
                            <div class="text-sm text-gray-600 mb-2">
                                <i class="pi pi-user mr-2"></i>
                                <strong>Usuario:</strong> {{ estado.nombreUsuario }}
                            </div>
                            <div class="text-xs text-gray-400">
                                <i class="pi pi-calendar mr-2"></i>
                                ID: {{ estado.proyectoId }}
                            </div>
                        </div>
                    </ng-template>
                    <ng-template #marker let-estado>
                        <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-100">
                            <i class="pi pi-check text-blue-600 text-sm"></i>
                        </div>
                    </ng-template>
                </p-timeline>
            } @else {
                <div class="text-center py-8">
                    <i class="pi pi-info-circle text-4xl text-gray-400 mb-4 block"></i>
                    <p class="text-gray-500">No hay historial de estados disponible para este proyecto</p>
                </div>
            }

            <div class="flex justify-end mt-4">
                <button pButton
                        label="Cerrar"
                        icon="pi pi-times"
                        class="p-button-text"
                        (click)="cerrarDialogoEstados()">
                </button>
            </div>
        </p-dialog>
    `,
    imports: [
        CommonModule,
        AppCabeceraPrincipal,
        TableModule,
        IconFieldModule,
        InputIconModule,
        RouterModule,
        ToastModule,
        InputTextModule,
        ButtonModule,
        TooltipModule,
        AppEstadoOe,
        TagModule,
        ConfirmDialogModule,
        DialogModule,
        TimelineModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class ProyectoComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    items: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proyecto de Inversión' },
        { label: 'Proyectos' }
    ];

    proyectos: ProyectoInversionModel[] = [];
    loading: boolean = true;

    // Propiedades para el diálogo de actividades
    mostrarDialogoActividades: boolean = false;
    proyectoSeleccionado: ProyectoInversionModel | null = null;
    actividadesProyecto: ActividadModel[] = [];

    // Propiedades para el diálogo de estados
    mostrarDialogoEstados: boolean = false;
    estadosProyecto: ProyectoInversionEstadoLogModel[] = [];
    cargandoEstados: boolean = false;

    // Hacer accesible el enum en el template
    EstadoObjetivosEstrategicos = EstadoObjetivosEstrategicos;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private proyectoInversionService: ProyectoInversionService
    ) {}

    ngOnInit(): void {
        this.cargarProyectos();
    }

    cargarProyectos(): void {
        this.loading = true;

        this.proyectoInversionService.getAll().subscribe({
            next: (proyectos) => {
                this.proyectos = proyectos;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al cargar proyectos:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los proyectos de inversión'
                });
                this.loading = false;
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table): void {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    eliminarProyecto(proyecto: ProyectoInversionModel): void {
        this.confirmationService.confirm({
            message: `¿Está seguro de que desea eliminar el proyecto "${proyecto.titulo}"?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, Eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.proyectoInversionService.delete(proyecto.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Proyecto eliminado correctamente'
                        });
                        this.cargarProyectos(); // Recargar la lista
                    },
                    error: (error) => {
                        console.error('Error al eliminar proyecto:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar el proyecto'
                        });
                    }
                });
            }
        });
    }

    truncateText(text: string, length: number): string {
        if (text.length <= length) {
            return text;
        }
        return text.substring(0, length) + '...';
    }

    formatDate(date: Date): string {
        if (!date) return '';
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    mostrarActividades(proyecto: ProyectoInversionModel): void {
        this.proyectoSeleccionado = proyecto;
        this.actividadesProyecto = proyecto.actividades || [];
        this.mostrarDialogoActividades = true;
    }

    cerrarDialogoActividades(): void {
        this.mostrarDialogoActividades = false;
        this.proyectoSeleccionado = null;
        this.actividadesProyecto = [];
    }

    mostrarEstados(proyecto: ProyectoInversionModel) {
        this.proyectoSeleccionado = proyecto;
        this.cargandoEstados = true;
        this.mostrarDialogoEstados = true;
        
        this.proyectoInversionService.getEstados(proyecto.id).subscribe({
            next: (estados) => {
                this.estadosProyecto = estados;
                this.cargandoEstados = false;
            },
            error: (error) => {
                console.error('Error al obtener estados del proyecto:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar el historial de estados'
                });
                this.estadosProyecto = [];
                this.cargandoEstados = false;
            }
        });
    }

    cerrarDialogoEstados() {
        this.mostrarDialogoEstados = false;
        this.estadosProyecto = [];
        this.proyectoSeleccionado = null;
    }

    formatDateTime(date: Date | string): string {
        if (!date) return '';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
