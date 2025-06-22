import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { InstitucionModel } from '../../../models/institucion.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
import { AppEstadoGeneral } from '../../../layout/component/app.estado-general';
import { ToastModule } from 'primeng/toast';
import { AppDialogConfirmation } from '../../../layout/component/app.dialog-confirmation';
import { InstitucionService } from '../../../service/institucion.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-institucion',
    standalone: true,
    template: `<div class="card">
            <app-cabecera-principal [items]="items" titulo="Instituciones" linkNuevo="/configuracion-institucional/instituciones/nuevo"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="instituciones"
                [tableStyle]="{ 'min-width': '50rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="5"
                [rowsPerPageOptions]="[5, 10, 20, 50, 100]"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['nombre', 'codigo', 'nombreMacroSector', 'nombreSector', 'estado']"
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
                        <th pSortableColumn="nombreMacroSector">
                            <div class="flex justify-between items-center w-full">
                                <span>Macro Sector</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="nombreMacroSector" display="menu" placeholder="Buscar por Macro Sector"></p-columnFilter>
                                    <p-sortIcon field="nombreMacroSector"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="nombreSector">
                            <div class="flex justify-between items-center w-full">
                                <span>Sector</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="nombreSector" display="menu" placeholder="Buscar por Sector"></p-columnFilter>
                                    <p-sortIcon field="nombreSector"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="nombreSubsector">
                            <div class="flex justify-between items-center w-full">
                                <span>Sub Sector</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="nombreSubsector" display="menu" placeholder="Buscar por Sub Sector"></p-columnFilter>
                                    <p-sortIcon field="nombreSubsector"></p-sortIcon>
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
                <ng-template #body let-institucion>
                    <tr>
                        <td>
                            <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" [routerLink]="['/configuracion-institucional/instituciones/editar', institucion.id]" pTooltip="Editar" tooltipPosition="top"></button>
                            @if (institucion.estado === 'Activo') {
                                <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text" (click)="updateEstado(institucion.id)" pTooltip="Inactivar" tooltipPosition="top"></button>
                            } @else {
                                <button pButton icon="pi pi-unlock" severity="warn" class="p-button-rounded p-button-text" (click)="updateEstado(institucion.id)" pTooltip="Activar" tooltipPosition="top"></button>
                            }
                            <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deleteUsuario(institucion.id)" pTooltip="Eliminar" tooltipPosition="top"></button>
                        </td>
                        <td>{{ institucion.codigo }}</td>
                        <td>{{ institucion.nombre }}</td>
                        <td>{{ institucion.nombreMacroSector }}</td>
                        <td>{{ institucion.nombreSector }}</td>
                        <td>{{ institucion.nombreSubsector }}</td>
                        <td>
                            <app-estado-general [estado]="institucion.estado"></app-estado-general>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="4">Al momento no se dispone de información.</td>
                    </tr>
                </ng-template>
                <ng-template #loadingbody>
                    <tr>
                        <td colspan="4">Cargando informacion. Por favor espere.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast position="top-right"></p-toast>
        <app-dialog-confirmation [displayMotivoDialog]="displayMotivoDialog" [inactivar]="inactivar" [tituloMotivo]="tituloMotivo" [id]="idAEliminar" (cerrarDialogo)="dialogo($event)" (save)="confirmarEliminacion($event)"></app-dialog-confirmation>`,
    imports: [AppCabeceraPrincipal, TableModule, IconFieldModule, InputIconModule, RouterModule, AppEstadoGeneral, ToastModule, AppDialogConfirmation, InputTextModule, ButtonModule],
    providers: [MessageService]
})
export class InstitucionComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] = [];
    instituciones: InstitucionModel[] = [];
    loading: boolean = true;
    displayMotivoDialog: boolean = false;
    inactivar: boolean = false;
    tituloMotivo: string = '';
    idAEliminar: number = 0;
    constructor(
        private institucionService: InstitucionService,
        private messageService: MessageService
    ) {}
    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Configuracion Institucional' }, { label: 'Instituciones', route: '/instituciones' }];
        this.loadInstituciones();
    }

    loadInstituciones() {
        this.loading = true;
        this.institucionService.getInstituciones().subscribe({
            next: (data) => {
                this.instituciones = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading instituciones:', error);
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
    deleteUsuario(id: number) {
        this.idAEliminar = id;
        this.inactivar = false;
        this.tituloMotivo = 'Eliminar Institución';
        this.displayMotivoDialog = true;
    }
    updateEstado(id: number) {
        //verificar si la institución está activa o inactiva
        const institucion = this.instituciones.find((i) => i.id === id);
        if (institucion && institucion.estado === 'Activo') {
            this.idAEliminar = id;
            this.inactivar = true;
            this.tituloMotivo = 'Inactivar Institución';
            this.displayMotivoDialog = true;
            return;
        }
        this.idAEliminar = id;
        this.patchInstitutionState({ inactivar: this.inactivar, id: this.idAEliminar, motivoInactivacion: 'reactivacion desde sistema' });
    }

    confirmarEliminacion($event: any) {
        const { inactivar } = $event;
        if (inactivar) {
            this.patchInstitutionState($event);
            return;
        }
        if (this.idAEliminar > 0) {
            this.institucionService.deleteInstitucion(this.idAEliminar, $event).subscribe({
                next: (response) => {
                    const { error, mensaje } = response;
                    if (error) {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                        return;
                    }
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    this.instituciones = this.instituciones.filter((i) => i.id !== this.idAEliminar);
                    this.limpiarCamposEditarEliminar();
                },
                error: (error) => {
                    console.error('Error al eliminar la institución:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la institución.' });
                },
                complete: () => {
                    this.displayMotivoDialog = false;
                }
            });
        }
    }
    private patchInstitutionState($event: any) {
        this.institucionService.patchEstadoInstitucion(this.idAEliminar, $event).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                const institucion = this.instituciones.find((i) => i.id === this.idAEliminar);
                if (institucion) {
                    institucion.estado = institucion.estado === 'Activo' ? 'Inactivo' : 'Activo';
                }
                this.limpiarCamposEditarEliminar();
            },
            error: (error) => {
                console.error('Error al actualizar el estado de la institución:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado de la institución.' });
            },
            complete: () => {
                this.displayMotivoDialog = false;
            }
        });
    }

    dialogo($event: boolean) {
        this.displayMotivoDialog = $event;
    }

    limpiarCamposEditarEliminar() {
        this.idAEliminar = 0;
        this.inactivar = false;
        this.tituloMotivo = '';
    }
}
