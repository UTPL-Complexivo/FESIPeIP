import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ObjetivoInstitucionalModel } from '../../../models/objetivo-institucional.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
import { AppEstadoGeneral } from '../../../layout/component/app.estado-general';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ObjetivoInstitucionalService } from '../../../service/objetivo-institucional.service';
import { ToastModule } from 'primeng/toast';
import { AppDialogConfirmation } from '../../../layout/component/app.dialog-confirmation';
import { DeleteModel } from '../../../models/delete.model';
import { UsuarioService } from '../../../service/usuario.service';
import { forkJoin } from 'rxjs';
import { UsuarioModel } from '../../../models/usuario.model';
import { AppEstadoOe } from '../../../layout/component/app.estado-oe';
import { EstadoObjetivosEstrategicos } from '../../../shared/enums/estado-objetivos-estrategicos.enum';
import { CommonModule } from '@angular/common';
import { ObjetivosInstitucionalesFilterPipe } from '../../../pipes/objetivos-institucionales-filter.pipe';
import { AprobacionesService } from '../../../service/aprobaciones.service';
import { SolicitudAprobacionModel } from '../../../models/solicitud-aprobacion.model';

@Component({
    selector: 'app-objetivo-institucional',
    standalone: true,
    template: `
        <div class="card">
            <app-cabecera-principal [items]="items" titulo="Objetivos Institucionales" linkNuevo="/objetivo-estrategico/objetivo-institucional/nuevo"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="objetivo_institucionales | objetivosInstitucionalesFilter: (user && user.roles && user.roles[0] ? user.roles[0] : '')"
                [tableStyle]="{ 'min-width': '50rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="5"
                [rowsPerPageOptions]="[5, 10, 20]"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['nombre', 'descripcion', 'codigo', 'estado']"
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
                        <th>Acciones</th>
                        <th pSortableColumn="codigo">
                            <div class="flex justify-between items-center w-full">
                                <span>Codigo</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="codigo" display="menu" placeholder="Buscar por codigo"></p-columnFilter>
                                    <p-sortIcon field="codigo"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="nombre">
                            <div class="flex justify-between items-center w-full">
                                <span>Nombre</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="nombre" display="menu" placeholder="Buscar por nombre"></p-columnFilter>
                                    <p-sortIcon field="nombre"></p-sortIcon>
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
                <ng-template #body let-objetivo_institucional>
                    <tr>
                        <td>
                            @if (user.roles[0] === 'Autoridad' || user.roles[0] === 'Revisor') {
                                @if (objetivo_institucional.estado === EstadoObjetivosEstrategicos.PendienteRevision && user.roles[0] === 'Revisor') {
                                    <button pButton icon="pi pi-check" severity="success" class="p-button-rounded p-button-text" (click)="aprobar(objetivo_institucional)" pTooltip="Aprobar" tooltipPosition="top"></button>
                                }
                                @if (objetivo_institucional.estado === EstadoObjetivosEstrategicos.PendienteAutoridad && user.roles[0] === 'Autoridad') {
                                    <button pButton icon="pi pi-check" severity="success" class="p-button-rounded p-button-text" (click)="aprobar(objetivo_institucional)" pTooltip="Aprobar" tooltipPosition="top"></button>
                                }
                                <button pButton icon="pi pi-times" severity="danger" class="p-button-rounded p-button-text" (click)="rechazar(objetivo_institucional)" pTooltip="Rechazar" tooltipPosition="top"></button>
                            } @else {
                                <button
                                    pButton
                                    icon="pi pi-pencil"
                                    class="p-button-rounded p-button-text"
                                    [routerLink]="['/objetivo-estrategico/objetivo-institucional/editar', objetivo_institucional.id]"
                                    pTooltip="Editar"
                                    tooltipPosition="top"
                                ></button>
                                @if (objetivo_institucional.estado === EstadoObjetivosEstrategicos.Activo || objetivo_institucional.estado === EstadoObjetivosEstrategicos.Inactivo) {
                                    @if (objetivo_institucional.estado === EstadoObjetivosEstrategicos.Activo) {
                                        <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text" (click)="updateEstado(objetivo_institucional)" pTooltip="Inactivar" tooltipPosition="top"></button>
                                    } @else {
                                        <button pButton icon="pi pi-unlock" severity="warn" class="p-button-rounded p-button-text" (click)="updateEstado(objetivo_institucional)" pTooltip="Activar" tooltipPosition="top"></button>
                                    }
                                }
                            }

                            <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deleteOI(objetivo_institucional)" pTooltip="Eliminar" tooltipPosition="top"></button>
                        </td>
                        <td>{{ objetivo_institucional.codigo }}</td>
                        <td>{{ objetivo_institucional.nombre }}</td>
                        <td>
                            <app-estado-oe [estado]="objetivo_institucional.estado"></app-estado-oe>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="5">
                            @if (user && user.roles && user.roles[0] === 'Revisor') {
                                No hay objetivos institucionales pendientes de revisión.
                            } @else if (user && user.roles && user.roles[0] === 'Autoridad') {
                                No hay objetivos institucionales pendientes de autorización.
                            } @else {
                                Al momento no se dispone de información.
                            }
                        </td>
                    </tr>
                </ng-template>
                <ng-template #loadingbody>
                    <tr>
                        <td colspan="5">Cargando informacion. Por favor espere.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast position="top-right"></p-toast>
        <app-dialog-confirmation [displayMotivoDialog]="displayMotivoDialog" [inactivar]="inactivar" [tituloMotivo]="tituloMotivo" [id]="idAEliminar" (cerrarDialogo)="dialogo($event)" (save)="confirmarEliminacion($event)"></app-dialog-confirmation>
    `,
    imports: [AppCabeceraPrincipal, TableModule, IconFieldModule, InputIconModule, RouterModule, ButtonModule, InputTextModule, ToastModule, AppDialogConfirmation, AppEstadoOe, CommonModule, ObjetivosInstitucionalesFilterPipe],
    providers: [MessageService]
})
export class ObjetivoInstitucionalComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] = [{ icon: 'pi pi-home', route: '/' }, { label: 'Objetivos Estratégicos' }, { label: 'Objetivos Institucionales' }];
    objetivo_institucionales: ObjetivoInstitucionalModel[] = [];
    loading: boolean = true;
    displayMotivoDialog: boolean = false;
    inactivar: number = 0;
    tituloMotivo: string = 'Motivo de Inactivación';
    idAEliminar: number = 0;
    user!: UsuarioModel;
    EstadoObjetivosEstrategicos = EstadoObjetivosEstrategicos;
    constructor(
        private oiService: ObjetivoInstitucionalService,
        private messageService: MessageService,
        private userService: UsuarioService,
        private aprobacionesService: AprobacionesService
    ) {}
    ngOnInit() {
        forkJoin({
            user: this.userService.getMe(),
            objetivos: this.oiService.getObjetivosInstitucionales()
        }).subscribe({
            next: ({ user, objetivos }) => {
                this.user = user;

                if (!user || !user.roles || user.roles.length === 0) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener la información del usuario.' });
                    this.loading = false;
                    return;
                }

                // Ahora cargamos todos los objetivos y el pipe se encarga del filtrado
                this.objetivo_institucionales = objetivos;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al cargar los datos:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar toda la información.' });
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

    updateEstado(objetivo_institucional: ObjetivoInstitucionalModel) {
        this.idAEliminar = objetivo_institucional.id;

        // Lógica específica para revisores
        if (this.user.roles[0] === 'Revisor') {
            if (objetivo_institucional.estado === EstadoObjetivosEstrategicos.PendienteRevision) {
                // Revisor aprueba el objetivo (cambia de Pendiente a Activo)
                this.loading = true;
                this.oiService
                    .patchObjetivoInstitucionalEstado(objetivo_institucional.id, {
                        id: objetivo_institucional.id,
                        motivoInactivacion: 'Aprobado por revisor'
                    })
                    .subscribe({
                        next: (response) => {
                            const { error, mensaje } = response;
                            if (error) {
                                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                                return;
                            }
                            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Objetivo institucional aprobado correctamente.' });
                            // Actualizar el estado del objetivo en la lista local
                            // El pipe se encargará de filtrarlo automáticamente
                            const objetivoIndex = this.objetivo_institucionales.findIndex((obj) => obj.id === objetivo_institucional.id);
                            if (objetivoIndex !== -1) {
                                this.objetivo_institucionales[objetivoIndex].estado = EstadoObjetivosEstrategicos.Activo;
                            }
                        },
                        error: (error) => {
                            console.error('Error al aprobar el objetivo institucional:', error);
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo aprobar el objetivo institucional.' });
                            this.loading = false;
                        },
                        complete: () => {
                            this.loading = false;
                        }
                    });
            }
            return;
        }

        // Lógica para otros roles (Administrador, Planificador)
        if (objetivo_institucional.estado === EstadoObjetivosEstrategicos.Activo) {
            this.displayMotivoDialog = true;
            this.inactivar = 1;
            this.tituloMotivo = 'Motivo de Inactivación';
            return;
        }

        this.loading = true;
        this.oiService
            .patchObjetivoInstitucionalEstado(objetivo_institucional.id, {
                id: objetivo_institucional.id,
                motivoInactivacion: 'Activado desde sistema'
            })
            .subscribe({
                next: (response) => {
                    const { error, mensaje } = response;
                    if (error) {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                        return;
                    }
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    objetivo_institucional.estado = objetivo_institucional.estado === EstadoObjetivosEstrategicos.Activo ? EstadoObjetivosEstrategicos.Inactivo : EstadoObjetivosEstrategicos.Activo;
                },
                error: (error) => {
                    console.error('Error al actualizar el estado del objetivo institucional:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado del objetivo institucional.' });
                    this.loading = false;
                },
                complete: () => {
                    this.loading = false;
                }
            });
    }

    deleteOI(objetivo_institucional: ObjetivoInstitucionalModel) {
        // Revisor no puede eliminar objetivos institucionales
        if (this.user.roles[0] === 'Revisor') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Acceso Restringido',
                detail: 'Los revisores no pueden eliminar objetivos institucionales.'
            });
            return;
        }

        this.idAEliminar = objetivo_institucional.id;
        this.displayMotivoDialog = true;
        this.inactivar = 0;
        this.tituloMotivo = 'Motivo de Eliminación';
    }

    dialogo(event: boolean) {
        this.displayMotivoDialog = event;
    }

    confirmarEliminacion(event: any) {
        const { inactivar, id, motivoInactivacion } = event;
        const motivo: DeleteModel = {
            id: event.id,
            motivoInactivacion: event.motivoInactivacion
        };
        this.loading = true;
        switch (inactivar) {
            case 0:
                //Eliminar
                this.oiService.deleteObjetivoInstitucional(id, motivo).subscribe({
                    next: (response) => {
                        const { error, mensaje } = response;
                        if (error) {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                            return;
                        }
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                        this.displayMotivoDialog = false;
                        this.objetivo_institucionales = this.objetivo_institucionales.filter((oi) => oi.id !== id);
                    },
                    error: (error) => {
                        console.error('Error al eliminar el objetivo institucional:', error);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el objetivo institucional.' });
                        this.loading = false;
                    },
                    complete: () => {
                        this.loading = false;
                    }
                });
                break;
            case 1:
                //Inactivar
                this.patchObjetivoEstado(id, motivo);
                break;
            case 2:
                //Rechazar
                const oi = this.objetivo_institucionales.find((oi) => oi.id === id);
                this.processApproval(oi!, 'rechazar', motivoInactivacion);
                break;
            default:
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Acción no válida.' });
                this.loading = false;
                return;
        }
    }

    private patchObjetivoEstado(id: any, motivo: DeleteModel) {
        this.oiService.patchObjetivoInstitucionalEstado(id, motivo).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                this.displayMotivoDialog = false;
                const objetivo = this.objetivo_institucionales.find((oi) => oi.id === id);
                if (objetivo) {
                    objetivo.estado = EstadoObjetivosEstrategicos.Inactivo;
                }
            },
            error: (error) => {
                console.error('Error al inactivar el objetivo institucional:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo inactivar el objetivo institucional.' });
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    aprobar(oi: ObjetivoInstitucionalModel) {
        this.processApproval(oi, 'aprobar');
    }
    private processApproval(oi: ObjetivoInstitucionalModel, accion: any, comentario: string | undefined = undefined) {
        const aprobacion: SolicitudAprobacionModel = {
            tipoEntidad: 'objetivo',
            id: oi.id,
            accion: accion,
            comentario
        };
        this.aprobacionesService.aprobarSolicitud(aprobacion).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                //Recargar tabla de objetivos institucionales
                this.oiService.getObjetivosInstitucionales().subscribe({
                    next: (objetivos) => {
                        this.objetivo_institucionales = objetivos;
                    },
                    error: (error) => {
                        console.error('Error al recargar los objetivos institucionales:', error);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo recargar la lista de objetivos institucionales.' });
                    }
                });
            },
            error: (error) => {
                console.error('Error al aprobar el objetivo institucional:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo aprobar el objetivo institucional.' });
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    rechazar(oi: ObjetivoInstitucionalModel) {
        this.idAEliminar = oi.id;
        this.displayMotivoDialog = true;
        this.inactivar = 2;
        this.tituloMotivo = 'Motivo de Rechazo';
    }
}
