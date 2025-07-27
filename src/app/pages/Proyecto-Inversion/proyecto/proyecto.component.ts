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
import { FormsModule } from '@angular/forms';
import { EstadoObjetivosEstrategicos } from '../../../shared/enums/estado-objetivos-estrategicos.enum';
import { TagModule } from 'primeng/tag';
import { ProyectoInversionService } from '../../../service/proyecto-inversion.service';
import { ProyectoInversionEstadoLogModel } from '../../../models/proyecto-inversion-estado-log.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TimelineModule } from 'primeng/timeline';
import { UsuarioService } from '../../../service/usuario.service';
import { UsuarioModel } from '../../../models/usuario.model';
import { AppDialogConfirmation } from '../../../layout/component/app.dialog-confirmation';

@Component({
    selector: 'app-proyecto',
    standalone: true,
    template: `
        <div class="card">
            <app-cabecera-principal [items]="items" [titulo]="getTituloSegunRol()" [linkNuevo]="esExterno() ? '/proyecto-inversion/proyecto/nuevo' : ''"></app-cabecera-principal>
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
                                <!-- Botón ver estados - siempre visible -->
                                <button pButton icon="pi pi-eye" size="small"
                                        class="p-button-rounded p-button-info p-button-text"
                                        (click)="mostrarEstados(proyecto)"
                                        pTooltip="Ver estados del proyecto" tooltipPosition="top"></button>

                                <!-- Botones de edición y eliminación - solo para usuarios externos -->
                                @if (esExterno()) {
                                    <button pButton icon="pi pi-pencil" size="small"
                                            class="p-button-rounded p-button-success p-button-text"
                                            [routerLink]="['/proyecto-inversion/proyecto/editar', proyecto.id]"
                                            pTooltip="Editar proyecto" tooltipPosition="top"></button>
                                    <button pButton icon="pi pi-trash" size="small"
                                            class="p-button-rounded p-button-danger p-button-text"
                                            (click)="eliminarProyecto(proyecto)"
                                            pTooltip="Eliminar proyecto" tooltipPosition="top"></button>
                                }

                                <!-- Botón ver actividades - siempre visible -->
                                <button pButton icon="pi pi-list" size="small"
                                        class="p-button-rounded p-button-warning p-button-text"
                                        (click)="mostrarActividades(proyecto)"
                                        pTooltip="Ver actividades" tooltipPosition="top"></button>

                                <!-- Botón anexos - visible para revisor, externo y autoridad -->
                                @if (esExterno() || esRevisor() || esAutoridadValidante()) {
                                    <button pButton icon="pi pi-paperclip" size="small"
                                            class="p-button-rounded p-button-secondary p-button-text"
                                            [routerLink]="['/proyecto-inversion/proyecto', proyecto.id, 'anexos']"
                                            pTooltip="Ver anexos" tooltipPosition="top"></button>
                                }

                                <!-- Botones de aprobación para Revisor -->
                                @if (esRevisor() && proyecto.estado === EstadoObjetivosEstrategicos.PendienteRevision) {
                                    <button pButton icon="pi pi-check" size="small"
                                            class="p-button-rounded p-button-success p-button-text"
                                            (click)="aprobarRevision(proyecto.id)"
                                            pTooltip="Aprobar para Autoridad" tooltipPosition="top"></button>
                                    <button pButton icon="pi pi-times" size="small"
                                            class="p-button-rounded p-button-danger p-button-text"
                                            (click)="rechazar(proyecto.id, 'revisor')"
                                            pTooltip="Rechazar proyecto" tooltipPosition="top"></button>
                                }

                                <!-- Botones de aprobación para Autoridad -->
                                @if (esAutoridadValidante() && proyecto.estado === EstadoObjetivosEstrategicos.PendienteAutoridad) {
                                    <button pButton icon="pi pi-verified" size="small"
                                            class="p-button-rounded p-button-success p-button-text"
                                            (click)="aprobarAutoridad(proyecto.id)"
                                            pTooltip="Aprobar definitivamente" tooltipPosition="top"></button>
                                    <button pButton icon="pi pi-times" size="small"
                                            class="p-button-rounded p-button-danger p-button-text"
                                            (click)="rechazar(proyecto.id, 'autoridad')"
                                            pTooltip="Rechazar proyecto" tooltipPosition="top"></button>
                                }

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
            [style]="{ width: '60vw', maxWidth: '600px' }"
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
                            @if (estado.motivo && estado.motivo.trim() !== '') {
                                <div class="text-sm text-gray-700 mb-2 p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                                    <i class="pi pi-comment mr-2 text-blue-600"></i>
                                    <strong class="text-blue-800">Comentario:</strong>
                                    <div class="mt-1 text-gray-800">{{ estado.motivo }}</div>
                                </div>
                            }
                            <div class="text-xs text-gray-400">
                                <i class="pi pi-calendar mr-2"></i>
                                ID: {{ estado.proyectoId }}
                            </div>
                        </div>
                    </ng-template>
                    <ng-template #marker let-estado>
                        <div class="flex items-center justify-center w-8 h-8 rounded-full border-2"
                             [ngClass]="getMarkerClass(estado.nombreEstado)">
                            <i [class]="getMarkerIcon(estado.nombreEstado)"></i>
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

        <app-dialog-confirmation [displayMotivoDialog]="displayMotivoDialog" [inactivar]="inactivar" [tituloMotivo]="tituloMotivo" [id]="idAEliminar" (cerrarDialogo)="dialogo($event)" (save)="confirmarEliminacion($event)"></app-dialog-confirmation>
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
        TimelineModule,
        FormsModule,
        AppDialogConfirmation
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
    usuarioActual: UsuarioModel | null = null;

    // Propiedades para el diálogo de actividades
    mostrarDialogoActividades: boolean = false;
    proyectoSeleccionado: ProyectoInversionModel | null = null;
    actividadesProyecto: ActividadModel[] = [];

    // Propiedades para el diálogo de estados
    mostrarDialogoEstados: boolean = false;
    estadosProyecto: ProyectoInversionEstadoLogModel[] = [];
    cargandoEstados: boolean = false;

    // Propiedades para el diálogo de rechazo
    displayMotivoDialog: boolean = false;
    inactivar: number = 0;
    tituloMotivo: string = '';
    idAEliminar: number = 0;
    tipoRechazoActual: 'revisor' | 'autoridad' = 'revisor';

    // Hacer accesible el enum en el template
    EstadoObjetivosEstrategicos = EstadoObjetivosEstrategicos;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private proyectoInversionService: ProyectoInversionService,
        private usuarioService: UsuarioService
    ) {}

    ngOnInit(): void {
        this.cargarUsuarioActual();
    }

    cargarUsuarioActual(): void {
        this.usuarioService.getMe().subscribe({
            next: (usuario) => {
                this.usuarioActual = usuario;
                // Cargar proyectos después de obtener el usuario
                this.cargarProyectos();
            },
            error: (error) => {
                console.error('Error al cargar usuario:', error);
                // Cargar proyectos de todas formas, pero sin filtro de usuario
                this.cargarProyectos();
            }
        });
    }

    cargarProyectos(): void {
        this.loading = true;

        // Usar endpoint específico para usuarios externos
        let serviceCall;

        if (this.esExterno() && this.usuarioActual?.id) {
            serviceCall = this.proyectoInversionService.getProyectosByUserId(this.usuarioActual.id);
        } else {
            serviceCall = this.proyectoInversionService.getAll();
        }

        serviceCall.subscribe({
            next: (proyectos) => {
                // Filtrar proyectos según el rol del usuario (excepto externos que ya tienen filtro en backend)
                this.proyectos = this.esExterno() ? proyectos : this.filtrarProyectos(proyectos);
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

    /**
     * Obtiene las clases CSS para el marker del timeline según el estado
     */
    getMarkerClass(nombreEstado: string): string {
        const estado = nombreEstado?.toLowerCase();

        if (estado?.includes('rechazado') || estado?.includes('inactivo')) {
            return 'border-red-500 bg-red-100';
        } else if (estado?.includes('revision') || estado?.includes('pendiente')) {
            return 'border-blue-500 bg-blue-100';
        } else if (estado?.includes('autoridad') || estado?.includes('pendienteautoridad')) {
            return 'border-orange-500 bg-orange-100';
        } else if (estado?.includes('aprobado') || estado?.includes('activado') || estado?.includes('activo')) {
            return 'border-green-500 bg-green-100';
        }

        // Por defecto
        return 'border-gray-500 bg-gray-100';
    }

    /**
     * Obtiene el icono apropiado para el marker del timeline según el estado
     */
    getMarkerIcon(nombreEstado: string): string {
        const estado = nombreEstado?.toLowerCase();

        if (estado?.includes('rechazado')) {
            return 'pi pi-times text-red-600 text-sm';
        } else if (estado?.includes('inactivo')) {
            return 'pi pi-ban text-red-600 text-sm';
        } else if (estado?.includes('revision') || estado?.includes('pendiente')) {
            return 'pi pi-clock text-blue-600 text-sm';
        } else if (estado?.includes('autoridad') || estado?.includes('pendienteautoridad')) {
            return 'pi pi-user-edit text-orange-600 text-sm';
        } else if (estado?.includes('aprobado')) {
            return 'pi pi-check-circle text-green-600 text-sm';
        } else if (estado?.includes('activado') || estado?.includes('activo')) {
            return 'pi pi-check text-green-600 text-sm';
        }

        // Por defecto
        return 'pi pi-circle text-gray-600 text-sm';
    }

    // Métodos de verificación de roles
    esExterno(): boolean {
        return this.usuarioActual?.roles?.includes('Externo') || false;
    }

    esRevisor(): boolean {
        return this.usuarioActual?.roles?.includes('Revisor') || false;
    }

    esAutoridadValidante(): boolean {
        return this.usuarioActual?.roles?.includes('Autoridad') || false;
    }

    /**
     * Filtra los proyectos según el rol del usuario
     * Nota: Los usuarios externos usan getMisProyectos() y no requieren filtrado adicional
     */
    filtrarProyectos(proyectos: ProyectoInversionModel[]): ProyectoInversionModel[] {
        if (this.esRevisor()) {
            // El revisor solo ve proyectos pendientes de revisión
            return proyectos.filter(proyecto =>
                proyecto.estado === EstadoObjetivosEstrategicos.PendienteRevision
            );
        } else if (this.esAutoridadValidante()) {
            // La autoridad solo ve proyectos pendientes de autorización
            return proyectos.filter(proyecto =>
                proyecto.estado === EstadoObjetivosEstrategicos.PendienteAutoridad
            );
        }

        // Por defecto, devolver todos los proyectos (para roles administrativos)
        return proyectos;
    }

    getTituloSegunRol(): string {
        if (this.esAutoridadValidante()) {
            return 'Proyectos Pendientes de Aprobación (Autoridad)';
        } else if (this.esRevisor()) {
            return 'Proyectos Pendientes de Revisión';
        } else {
            return 'Proyectos de Inversión';
        }
    }

    // Métodos de aprobación/rechazo
    aprobarRevision(proyectoId: number): void {
        const proyecto = this.proyectos.find(p => p.id === proyectoId);
        if (proyecto) {
            this.processApproval(proyecto, 'aprobar');
        }
    }

    aprobarAutoridad(proyectoId: number): void {
        const proyecto = this.proyectos.find(p => p.id === proyectoId);
        if (proyecto) {
            this.processApproval(proyecto, 'aprobar');
        }
    }

    rechazar(proyectoId: number, tipoRechazo: 'revisor' | 'autoridad'): void {
        const proyecto = this.proyectos.find(p => p.id === proyectoId);
        if (!proyecto) return;

        // Configurar el diálogo de rechazo usando el patrón de alineaciones
        this.inactivar = 2; // Indicador para rechazo
        this.idAEliminar = proyectoId;
        this.tipoRechazoActual = tipoRechazo;
        this.displayMotivoDialog = true;
        this.tituloMotivo = `Motivo de Rechazo (${tipoRechazo === 'revisor' ? 'Revisor' : 'Autoridad'}) - ${proyecto.titulo}`;
    }

    confirmarEliminacion(evento: any): void {
        const { inactivar, id, motivoInactivacion } = evento;

        if (inactivar === 2) { // Es un rechazo
            const proyecto = this.proyectos.find(p => p.id === id);
            if (proyecto) {
                this.processApproval(proyecto, 'rechazar', motivoInactivacion);
            }
        }

        this.displayMotivoDialog = false;
    }

    dialogo($event: boolean): void {
        this.displayMotivoDialog = $event;
        if (!$event) {
            // Limpiar datos cuando se cierra el diálogo
            this.tituloMotivo = '';
            this.idAEliminar = 0;
            this.inactivar = 0;
        }
    }

    cerrarDialogoRechazo(): void {
        this.displayMotivoDialog = false;
        this.idAEliminar = 0;
        this.inactivar = 0;
        this.tipoRechazoActual = 'revisor';
    }

    private processApproval(proyecto: ProyectoInversionModel, accion: 'aprobar' | 'rechazar', comentario?: string): void {
        // Determinar el estado basado en la acción y el rol actual
        let estado: string;

        if (accion === 'rechazar') {
            estado = 'Rechazado';
        } else {
            // Si es aprobación, determinar el siguiente estado según el rol
            if (this.esRevisor()) {
                estado = 'PendienteAutoridad'; // Revisor aprueba -> pasa a Autoridad
            } else if (this.esAutoridadValidante()) {
                estado = 'Activo'; // Autoridad aprueba -> estado final activo
            } else {
                estado = 'PendienteRevision'; // Cualquier otro caso
            }
        }

        this.proyectoInversionService.aprobarProyecto(proyecto.id!, estado, comentario).subscribe({
            next: (respuesta) => {
                if (!respuesta.error) {
                    const severity = accion === 'aprobar' ? 'success' : 'warn';
                    const summary = accion === 'aprobar' ? 'Proyecto Aprobado' : 'Proyecto Rechazado';
                    const detail = accion === 'aprobar'
                        ? `El proyecto "${proyecto.titulo}" ha sido aprobado correctamente`
                        : `El proyecto "${proyecto.titulo}" ha sido rechazado`;

                    this.messageService.add({
                        severity: severity,
                        summary: summary,
                        detail: detail
                    });

                    // Recargar los proyectos para actualizar el estado
                    this.cargarProyectos();
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: respuesta.mensaje || 'No se pudo procesar la solicitud'
                    });
                }
            },
            error: (error) => {
                console.error('Error al procesar la aprobación:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo procesar la solicitud de aprobación'
                });
            }
        });
    }
}
