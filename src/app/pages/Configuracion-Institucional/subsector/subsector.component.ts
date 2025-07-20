import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { SubSectorModel } from '../../../models/sub-sector.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AppDialogConfirmation } from '../../../layout/component/app.dialog-confirmation';
import { SubSectorService } from '../../../service/sub-sector.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AppEstadoCi } from "../../../layout/component/app.estado-ci";
import { EstadoConfiguracionInstitucional } from '../../../shared/enums/estado-configuracion-institucional.enum';

@Component({
    selector: 'app-subsector',
    standalone: true,
    template: `<div class="card">
            <app-cabecera-principal [items]="items" titulo="Sub Sectores" linkNuevo="/configuracion-institucional/sub-sectores/nuevo"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="sub_sectores"
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
                                    <p-columnFilter type="text" field="nombreSector" display="menu" placeholder="Buscar por Macro Sector"></p-columnFilter>
                                    <p-sortIcon field="nombreSector"></p-sortIcon>
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
                <ng-template #body let-sub_sector>
                    <tr>
                        <td>
                            <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" [routerLink]="['/configuracion-institucional/sub-sectores/editar', sub_sector.id]" pTooltip="Editar" tooltipPosition="top"></button>
                            @if (sub_sector.estado === EstadoConfiguracionInstitucional.Activo) {
                                <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text" (click)="updateEstado(sub_sector.id)" pTooltip="Inactivar" tooltipPosition="top"></button>
                            } @else {
                                <button pButton icon="pi pi-unlock" severity="warn" class="p-button-rounded p-button-text" (click)="updateEstado(sub_sector.id)" pTooltip="Activar" tooltipPosition="top"></button>
                            }
                            <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deleteUsuario(sub_sector.id)" pTooltip="Eliminar" tooltipPosition="top"></button>
                        </td>
                        <td>{{ sub_sector.codigo }}</td>
                        <td>{{ sub_sector.nombre }}</td>
                        <td>{{ sub_sector.nombreMacroSector }}</td>
                        <td>{{ sub_sector.nombreSector }}</td>
                        <td>
                            <app-estado-ci [estado]="sub_sector.estado"></app-estado-ci>
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
    imports: [AppCabeceraPrincipal, TableModule, IconFieldModule, InputIconModule, RouterModule, ToastModule, AppDialogConfirmation, InputTextModule, ButtonModule, AppEstadoCi],
    providers: [MessageService]
})
export class SubsectorComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] = [];
    sub_sectores: SubSectorModel[] = [];
    loading: boolean = true;
    displayMotivoDialog: boolean = false;
    inactivar: boolean = false;
    tituloMotivo: string = '';
    idAEliminar: number | null = null;
    EstadoConfiguracionInstitucional = EstadoConfiguracionInstitucional;
    constructor(
        private subSectorService: SubSectorService,
        private messageService: MessageService
    ) {

    }

    ngOnInit() {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Configuracion Institucional' }, { label: 'Sub Sectores', route: '/sub-sectores' }];
        this.loadSubSectores();
    }

    loadSubSectores() {
        this.subSectorService.getSubsectores().subscribe({
            next: (data) => {
                this.sub_sectores = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading sub-sectores:', error);
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

    deleteUsuario(arg0: any) {
        this.displayMotivoDialog = true;
        this.inactivar = false;
        this.tituloMotivo = 'Motivo de Eliminación';
        this.idAEliminar = arg0;
    }
    updateEstado(id: number) {
        const subsector = this.sub_sectores.find((s) => s.id === id);
        this.idAEliminar = id;
        if (subsector?.estado === EstadoConfiguracionInstitucional.Activo) {
            this.displayMotivoDialog = true;
            this.inactivar = true;
            this.tituloMotivo = 'Motivo de Inactivación';
            return;
        }
        this.loading = true;
        const log = {
            id,
            motivoInactivacion: 'actualizado desde sistema'
        }
        this.updateSubSectorStatus(log);
    }
    confirmarEliminacion($event: any) {
        const { inactivar } = $event;
        this.loading = true;
        if (inactivar) {
            this.updateSubSectorStatus($event);
            return;
        }

        this.subSectorService.deleteSubSector(this.idAEliminar!, $event).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                this.sub_sectores = this.sub_sectores.filter((s) => s.id !== this.idAEliminar);
            },
            error: (error) => {
                console.error('Error deleting subsector:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el subsector.' });
                this.loading = false;
            },
            complete: () => {
                this.displayMotivoDialog = false;
                this.loading = false;
            }
        });
    }
    private updateSubSectorStatus($event: any) {
        this.subSectorService.patchSubSectorEstado(this.idAEliminar!, $event).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                const subsector = this.sub_sectores.find((s) => s.id === this.idAEliminar);
                if (subsector) {
                    subsector.estado = subsector.estado === EstadoConfiguracionInstitucional.Activo ? EstadoConfiguracionInstitucional.Inactivo : EstadoConfiguracionInstitucional.Activo;
                }
                this.cleanUpdate();
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

    cleanUpdate(){
        this.displayMotivoDialog = false;
        this.idAEliminar = null;
        this.inactivar = false;
        this.tituloMotivo = '';
    }

    dialogo($event: boolean) {
        this.displayMotivoDialog = $event;
    }
}
