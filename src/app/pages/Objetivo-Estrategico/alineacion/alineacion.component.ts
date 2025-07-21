import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { AppEstadoOe } from '../../../layout/component/app.estado-oe';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { AlineacionModel } from '../../../models/alineacion.model';
import { SolicitudAprobacionModel } from '../../../models/solicitud-aprobacion.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AppDialogConfirmation } from '../../../layout/component/app.dialog-confirmation';
import { AlineacionService } from '../../../service/alineacion.service';
import { UsuarioService } from '../../../service/usuario.service';
import { AprobacionesService } from '../../../service/aprobaciones.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { EjeColorPipe } from '../../../pipes/eje-color.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { PlanNacionalDesarrolloService } from '../../../service/plan-nacional-desarrollo.service';
import { ObjetivoDesarrolloSostenibleService } from '../../../service/objetivo-desarrollo-sostenible.service';
import { PlanNacionalDesarrolloModel } from '../../../models/plan-nacional-desarrollo.model';
import { ObjetivoDesarrolloSostenibleModel } from '../../../models/objetivo-desarrollo-sostenible.model';
import { UsuarioModel } from '../../../models/usuario.model';
import { EstadoObjetivosEstrategicos } from '../../../shared/enums/estado-objetivos-estrategicos.enum';

// Interfaz para las alineaciones individuales con información completa para agrupación
interface AlineacionCompleta extends AlineacionModel {
    pndEje: string;
    pndCompleto: string;
    iconoODS: string;
    nombreODS: string;
    grupoKey: string; // Para agrupación jerárquica
}

@Component({
    selector: 'app-alineacion',
    standalone: true,
    template: `
        <div class="card">
            <app-cabecera-principal [items]="items" [titulo]="getTituloSegunRol()" [linkNuevo]="esPlanificador() ? '/objetivo-estrategico/alineacion/nuevo' : ''"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="alineacionesCompletas"
                sortField="grupoKey"
                sortMode="single"
                [tableStyle]="{ 'min-width': '80rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="10"
                [rowsPerPageOptions]="[10, 20, 50]"
                rowGroupMode="subheader"
                groupRowsBy="grupoKey"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['pndCompleto', 'nombreOI', 'nombreODS', 'nombreEstado']"
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
                        <th style="width: 20%">Acciones</th>
                        <th style="width: 15%">Estado</th>
                        <th style="width: 65%">Objetivo de Desarrollo Sostenible</th>
                    </tr>
                </ng-template>
                <ng-template #groupheader let-alineacion>
                    <tr pRowGroupHeader>
                        <td colspan="3">
                            <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4" [style.border-left-color]="alineacion.pndEje | ejeColor:'hex'">
                                <div class="flex items-center gap-3">
                                    <div class="w-4 h-4 rounded-full" [style.background-color]="alineacion.pndEje | ejeColor:'hex'"></div>
                                    <div class="flex flex-col">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span [class]="'px-2 py-1 rounded text-white text-xs font-semibold ' + (alineacion.pndEje | ejeColor:'background')">
                                                EJE {{ alineacion.pndEje }}
                                            </span>
                                        </div>
                                        <span class="font-bold text-lg text-gray-800">{{ alineacion.pndCompleto }}</span>
                                        <span class="text-sm text-gray-600 font-medium">{{ alineacion.nombreOI }}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #body let-alineacion>
                    <tr>
                        <td>
                            <div class="flex gap-2 justify-center flex-wrap">
                                <!-- Botones de edición y eliminación (siempre visibles para planificadores) -->
                                @if (esPlanificador()) {
                                    <button pButton icon="pi pi-pencil" size="small"
                                            class="p-button-rounded p-button-success p-button-text"
                                            [routerLink]="['/objetivo-estrategico/alineacion/editar', alineacion.id]"
                                            pTooltip="Editar alineación" tooltipPosition="top"></button>
                                    <button pButton icon="pi pi-trash" size="small"
                                            class="p-button-rounded p-button-danger p-button-text"
                                            (click)="deleteItem(alineacion.id, alineacion.pndCompleto, alineacion.nombreOI, alineacion.nombreODS)"
                                            pTooltip="Eliminar alineación" tooltipPosition="top"></button>
                                }

                                <!-- Botones de aprobación para Revisor -->
                                @if (esRevisor() && alineacion.estado === EstadoObjetivosEstrategicos.PendienteRevision) {
                                    <button pButton icon="pi pi-check" size="small"
                                            class="p-button-rounded p-button-success p-button-text"
                                            (click)="aprobarRevision(alineacion.id)"
                                            pTooltip="Aprobar para Autoridad" tooltipPosition="top"></button>
                                    <button pButton icon="pi pi-times" size="small"
                                            class="p-button-rounded p-button-danger p-button-text"
                                            (click)="rechazar(alineacion.id, 'revisor')"
                                            pTooltip="Rechazar alineación" tooltipPosition="top"></button>
                                }

                                <!-- Botones de aprobación para Autoridad -->
                                @if (esAutoridadValidante() && alineacion.estado === EstadoObjetivosEstrategicos.PendienteAutoridad) {
                                    <button pButton icon="pi pi-verified" size="small"
                                            class="p-button-rounded p-button-success p-button-text"
                                            (click)="aprobarAutoridad(alineacion.id)"
                                            pTooltip="Aprobar definitivamente" tooltipPosition="top"></button>
                                    <button pButton icon="pi pi-times" size="small"
                                            class="p-button-rounded p-button-danger p-button-text"
                                            (click)="rechazar(alineacion.id, 'autoridad')"
                                            pTooltip="Rechazar alineación" tooltipPosition="top"></button>
                                }


                            </div>
                        </td>
                        <td>
                            <app-estado-oe
                                [estado]="alineacion.estado">
                            </app-estado-oe>
                        </td>
                        <td>
                            <div class="flex items-center gap-3">
                                <img [src]="alineacion.iconoODS" [alt]="alineacion.nombreODS"
                                     class="w-12 h-12 rounded-lg shadow-md"
                                     [pTooltip]="alineacion.nombreODS" tooltipPosition="top" />
                                <span class="font-medium">{{ alineacion.nombreODS }}</span>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="3">Al momento no se dispone de información.</td>
                    </tr>
                </ng-template>
                <ng-template #loadingbody>
                    <tr>
                        <td colspan="3">Cargando informacion. Por favor espere.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast position="top-right"></p-toast>
        <app-dialog-confirmation [displayMotivoDialog]="displayMotivoDialog" [inactivar]="inactivar" [tituloMotivo]="tituloMotivo" [id]="idAEliminar" (cerrarDialogo)="dialogo($event)" (save)="confirmarEliminacion($event)"></app-dialog-confirmation>
    `,
    imports: [AppCabeceraPrincipal, TableModule, IconFieldModule, InputIconModule, RouterModule, ToastModule, AppDialogConfirmation, InputTextModule, ButtonModule, EjeColorPipe, TooltipModule, AppEstadoOe],
    providers: [ConfirmationService, MessageService]
})
export class AlineacionComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] = [{ icon: 'pi pi-home', route: '/' }, { label: 'Objetivos Estratégicos' }, { label: 'Alineaciones' }];
    alineaciones: AlineacionModel[] = [];
    alineacionesCompletas: AlineacionCompleta[] = [];
    planesNacionalesDesarrollo: PlanNacionalDesarrolloModel[] = [];
    objetivosDesarrolloSostenible: ObjetivoDesarrolloSostenibleModel[] = [];
    usuarioActual: UsuarioModel | null = null;
    loading: boolean = true;
    displayMotivoDialog: boolean = false;
    inactivar: number = 0;
    tituloMotivo: string = '';
    idAEliminar: number = 0;

    // Hacer accesible el enum en el template
    EstadoObjetivosEstrategicos = EstadoObjetivosEstrategicos;

    constructor(
        private alineacionService: AlineacionService,
        private planNacionalDesarrolloService: PlanNacionalDesarrolloService,
        private objetivoDesarrolloSostenibleService: ObjetivoDesarrolloSostenibleService,
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        private aprobacionesService: AprobacionesService
    ) {}
    ngOnInit(): void {
        this.loading = true;
        // Cargar todos los datos necesarios en paralelo, incluyendo usuario actual
        forkJoin({
            alineaciones: this.alineacionService.getAlineaciones(),
            planesNacionalesDesarrollo: this.planNacionalDesarrolloService.getPlanesNacionalesDesarrollo(),
            objetivosDesarrolloSostenible: this.objetivoDesarrolloSostenibleService.getObjetivosDesarrolloSostenible(),
            usuarioActual: this.usuarioService.getMe()
        }).subscribe({
            next: (data) => {
                this.alineaciones = data.alineaciones;
                this.planesNacionalesDesarrollo = data.planesNacionalesDesarrollo;
                this.objetivosDesarrolloSostenible = data.objetivosDesarrolloSostenible;
                this.usuarioActual = data.usuarioActual;

                // Preparar las alineaciones completas para agrupación
                this.prepararAlineacionesCompletas();
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching data:', error);
                this.loading = false;
            }
        });
    }

    private prepararAlineacionesCompletas(): void {
        // Filtrar alineaciones según el rol del usuario
        let alineacionesFiltradas = this.alineaciones;

        if (this.esAutoridadValidante()) {
            // Autoridad solo ve alineaciones pendientes de autoridad
            alineacionesFiltradas = this.alineaciones.filter(a =>
                a.estado === EstadoObjetivosEstrategicos.PendienteAutoridad
            );
        } else if (this.esRevisor()) {
            // Revisor solo ve alineaciones pendientes de revisión
            alineacionesFiltradas = this.alineaciones.filter(a =>
                a.estado === EstadoObjetivosEstrategicos.PendienteRevision
            );
        }
        // Planificadores ven todas las alineaciones (comportamiento por defecto)

        this.alineacionesCompletas = alineacionesFiltradas.map(alineacion => {
            // Buscar el PND completo para obtener el eje
            const pnd = this.planesNacionalesDesarrollo.find(p => p.id === alineacion.planNacionalDesarrolloId);
            const ods = this.objetivosDesarrolloSostenible.find(o => o.id === alineacion.objetivoDesarrolloSostenibleId);

            const alineacionCompleta: AlineacionCompleta = {
                ...alineacion,
                pndEje: pnd?.eje || '',
                pndCompleto: alineacion.nombrePND || pnd?.nombre || '',
                iconoODS: alineacion.iconoODS || ods?.icono || '',
                nombreODS: alineacion.nombreODS || ods?.nombre || '',
                grupoKey: `${alineacion.nombrePND || pnd?.nombre || ''} - ${alineacion.nombreOI || ''}`
            };

            return alineacionCompleta;
        });

        // Ordenar por PND, luego por OI para que la agrupación funcione correctamente
        this.alineacionesCompletas.sort((a, b) => {
            const pndComparison = a.pndCompleto.localeCompare(b.pndCompleto);
            if (pndComparison !== 0) return pndComparison;
            return a.nombreOI.localeCompare(b.nombreOI);
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    deleteItem(alineacionId: number, pndNombre: string, oiNombre: string, odsNombre: string) {
        this.idAEliminar = alineacionId;
        this.displayMotivoDialog = true;
        this.inactivar = 0;
        this.tituloMotivo = `Motivo de Eliminación - ${pndNombre} → ${oiNombre} → ${odsNombre}`;
    }

    updateEstado(alineacionId: number) {
        // Implementar lógica para cambiar estado si es necesario

    }

    confirmarEliminacion(evento: any) {
        const { inactivar, id, motivoInactivacion } = evento;
        this.loading = true;

        switch (inactivar) {
            case 0:
                // Eliminar
                const motivo = { motivo: motivoInactivacion || 'Eliminación solicitada por el usuario' };
                this.alineacionService.deleteAlineacion(id, motivo).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Alineación eliminada correctamente'
                        });
                        this.recargarAlineaciones();
                    },
                    error: (error) => {
                        console.error('Error al eliminar alineación:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar la alineación'
                        });
                        this.loading = false;
                    },
                    complete: () => {
                        this.loading = false;
                    }
                });
                break;
            case 1:
                // Rechazar por Revisor
                const alineacionRevisor = this.alineaciones.find(a => a.id === id);
                if (alineacionRevisor) {
                    this.processApproval(alineacionRevisor, 'rechazar', motivoInactivacion);
                }
                break;
            case 2:
                // Rechazar por Autoridad
                const alineacionAutoridad = this.alineaciones.find(a => a.id === id);
                if (alineacionAutoridad) {
                    this.processApproval(alineacionAutoridad, 'rechazar', motivoInactivacion);
                }
                break;
            default:
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Acción no válida'
                });
                this.loading = false;
                break;
        }

        this.displayMotivoDialog = false;
    }
    dialogo($event: boolean) {
        this.displayMotivoDialog = $event;
        if (!$event) {
            this.inactivar = 0;
            this.tituloMotivo = '';
            this.idAEliminar = 0;
        }
    }

    /**
     * Métodos para verificar roles del usuario actual
     */
    esPlanificador(): boolean {
        return this.usuarioActual?.roles?.includes('Planificador') || false;
    }

    esRevisor(): boolean {
        return this.usuarioActual?.roles?.includes('Revisor') || false;
    }

    esAutoridadValidante(): boolean {
        return this.usuarioActual?.roles?.includes('Autoridad') || false;
    }

    /**
     * Obtiene el título personalizado según el rol del usuario
     */
    getTituloSegunRol(): string {
        if (this.esAutoridadValidante()) {
            return 'Alineaciones Pendientes de Aprobación (Autoridad)';
        } else if (this.esRevisor()) {
            return 'Alineaciones Pendientes de Revisión';
        } else {
            return 'Alineación Objetivo Estratégico ↔ PND ↔ ODS';
        }
    }

    /**
     * Métodos para manejar aprobaciones y cambios de estado
     */
    aprobarRevision(alineacionId: number): void {
        const alineacion = this.alineaciones.find(a => a.id === alineacionId);
        if (alineacion) {
            this.processApproval(alineacion, 'aprobar');
        }
    }

    aprobarAutoridad(alineacionId: number): void {
        const alineacion = this.alineaciones.find(a => a.id === alineacionId);
        if (alineacion) {
            this.processApproval(alineacion, 'aprobar');
        }
    }

    rechazar(alineacionId: number, tipoRechazo: 'revisor' | 'autoridad'): void {
        const alineacion = this.alineaciones.find(a => a.id === alineacionId);
        if (alineacion) {
            this.idAEliminar = alineacionId;
            this.displayMotivoDialog = true;
            this.inactivar = tipoRechazo === 'revisor' ? 1 : 2;
            this.tituloMotivo = `Motivo de Rechazo - ${alineacion.nombrePND} → ${alineacion.nombreOI} → ${alineacion.nombreODS}`;
        }
    }

    /**
     * Procesa las aprobaciones usando el servicio de aprobaciones
     */
    private processApproval(alineacion: AlineacionModel, accion: 'aprobar' | 'rechazar', comentario?: string): void {
        if (!this.loading) {
            this.loading = true;
        }

        const solicitudAprobacion: SolicitudAprobacionModel = {
            tipoEntidad: 'alineacion',
            id: alineacion.id,
            accion: accion,
            comentario: comentario
        };

        this.aprobacionesService.aprobarSolicitud(solicitudAprobacion).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: mensaje
                    });
                    return;
                }

                const severity = accion === 'aprobar' ? 'success' : 'warn';
                const summary = accion === 'aprobar' ? 'Aprobado' : 'Rechazado';

                this.messageService.add({
                    severity: severity,
                    summary: summary,
                    detail: mensaje
                });

                // Recargar las alineaciones para reflejar los cambios
                this.recargarAlineaciones();
            },
            error: (error: any) => {
                console.error('Error en proceso de aprobación:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo procesar la solicitud de aprobación'
                });
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    /**
     * Método auxiliar para cambiar el estado de una alineación
     */
    private cambiarEstadoAlineacion(alineacionId: number, nuevoEstado: EstadoObjetivosEstrategicos,
                                   mensajeExito: string, mensajeError: string): void {
        // Buscar la alineación actual
        const alineacion = this.alineaciones.find(a => a.id === alineacionId);
        if (!alineacion) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Alineación no encontrada'
            });
            return;
        }

        // Crear una copia con el nuevo estado
        const alineacionActualizada = { ...alineacion, estado: nuevoEstado };

        this.alineacionService.updateAlineacion(alineacionId, alineacionActualizada).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: mensajeExito
                });
                this.recargarAlineaciones();
            },
            error: (error: any) => {
                console.error('Error al cambiar estado:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: mensajeError
                });
            }
        });
    }

    /**
     * Método auxiliar para recargar alineaciones después de cambios de estado
     */
    private recargarAlineaciones(): void {
        this.alineacionService.getAlineaciones().subscribe({
            next: (alineaciones) => {
                this.alineaciones = alineaciones;
                // Aplicar filtros según el rol y reagrupar
                this.prepararAlineacionesCompletas();
            },
            error: (error: any) => {
                console.error('Error al recargar alineaciones:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al recargar la lista de alineaciones'
                });
            }
        });
    }
}
