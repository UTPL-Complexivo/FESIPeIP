import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ObjetivoDesarrolloSostenibleModel } from '../../../models/objetivo-desarrollo-sostenible.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
import { AppEstadoGeneral } from '../../../layout/component/app.estado-general';
import { ToastModule } from 'primeng/toast';
import { AppDialogConfirmation } from '../../../layout/component/app.dialog-confirmation';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ObjetivoDesarrolloSostenibleService } from '../../../service/objetivo-desarrollo-sostenible.service';
import { DeleteModel } from '../../../models/delete.model';
import { EstadoConfiguracionInstitucional } from '../../../shared/enums/estado-configuracion-institucional.enum';
import { AppEstadoCi } from "../../../layout/component/app.estado-ci";

@Component({
    selector: 'app-objetivo-desarrollo-sostenible',
    standalone: true,
    template: `
        <div class="card">
            <app-cabecera-principal [items]="items" titulo="Objetivos Institucionales" linkNuevo="/objetivo-estrategico/objetivo-ds/nuevo"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="odss"
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
                        <th pSortableColumn="descripcion">
                            <div class="flex justify-between items-center w-full">
                                <span>Descripción</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="descripcion" display="menu" placeholder="Buscar por nombre"></p-columnFilter>
                                    <p-sortIcon field="descripcion"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                        <th pSortableColumn="icono">
                            <div class="flex justify-between items-center w-full"></div>
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
                <ng-template #body let-ods>
                    <tr>
                        <td>
                            <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" [routerLink]="['/objetivo-estrategico/objetivo-ds/editar', ods.id]" pTooltip="Editar" tooltipPosition="top"></button>
                            @if (ods.estado === EstadoConfiguracionInstitucional.Activo) {
                                <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text" (click)="updateEstado(ods)" pTooltip="Inactivar" tooltipPosition="top"></button>
                            } @else {
                                <button pButton icon="pi pi-unlock" severity="warn" class="p-button-rounded p-button-text" (click)="updateEstado(ods)" pTooltip="Activar" tooltipPosition="top"></button>
                            }
                            <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deleteItem(ods)" pTooltip="Eliminar" tooltipPosition="top"></button>
                        </td>
                        <td>{{ ods.codigo }}</td>
                        <td>{{ ods.nombre }}</td>
                        <td>{{ ods.descripcion }}</td>
                        <td>
                            <img [src]="ods.icono" alt="Icono ODS" class="w-24 rounded" />
                        </td>
                        <td>
                            <app-estado-ci [estado]="ods.estado"></app-estado-ci>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="5">Al momento no se dispone de información.</td>
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
    imports: [AppCabeceraPrincipal, TableModule, IconFieldModule, InputIconModule, RouterModule, AppEstadoGeneral, ToastModule, AppDialogConfirmation, InputTextModule, ButtonModule, AppEstadoCi],
    providers: [ConfirmationService, MessageService]
})
export class ObjetivoDesarrolloSostenibleComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] = [{ icon: 'pi pi-home', route: '/' }, { label: 'Objetivos Estratégicos' }, { label: 'Objetivos Desarrollo Sostenible' }];
    odss: ObjetivoDesarrolloSostenibleModel[] = [];
    loading: boolean = true;
    displayMotivoDialog: boolean = false;
    inactivar: boolean = false;
    tituloMotivo: string = '';
    idAEliminar: number = 0;
    EstadoConfiguracionInstitucional = EstadoConfiguracionInstitucional;
    constructor(
        private messageService: MessageService,
        private odsService: ObjetivoDesarrolloSostenibleService
    ) {}

    ngOnInit(): void {
        this.getObjetivosDesarrolloSostenible();
    }

    getObjetivosDesarrolloSostenible() {
        this.loading = true;
        this.odsService.getObjetivosDesarrolloSostenible().subscribe({
            next: (data) => {
                this.odss = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al cargar los ODS:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los ODS.' });
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

    deleteItem(ods: ObjetivoDesarrolloSostenibleModel) {
        this.inactivar = false;
        this.tituloMotivo = 'Motivo Eliminar ODS';
        this.idAEliminar = ods.id;
        this.displayMotivoDialog = true;
    }
    updateEstado(ods: ObjetivoDesarrolloSostenibleModel) {
        const { estado, id } = ods;
        this.idAEliminar = id;
        if (estado === EstadoConfiguracionInstitucional.Activo) {
            this.inactivar = true;
            this.tituloMotivo = 'Motivo Inactivar ODS';
            this.displayMotivoDialog = true;
            return;
        }

        const eliminar: DeleteModel = {
            id: id,
            motivoInactivacion: 'activado desde sistema'
        };
        this.updateObjetivoEstado(eliminar);
    }

    confirmarEliminacion($event: any) {
        const { inactivar } = $event;
        if (inactivar) {
            this.updateObjetivoEstado($event);
            return;
        }

        this.loading = true;
        this.odsService.deleteObjetivoDesarrolloSostenible(this.idAEliminar, $event).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                this.odss = this.odss.filter((ods) => ods.id !== this.idAEliminar);
            },
            error: (error) => {
                console.error('Error al eliminar el ODS:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el ODS.' });
            },
            complete: () => {
                this.loading = false;
                this.displayMotivoDialog = false;
            }
        });
    }
    private updateObjetivoEstado($event: any) {
        this.loading = true;
        const ods = this.odss.find((o) => o.id === $event.id);
        if (ods) ods.estado = ods?.estado === EstadoConfiguracionInstitucional.Activo ? EstadoConfiguracionInstitucional.Inactivo : EstadoConfiguracionInstitucional.Activo;
        this.odsService.patchObjetivoDesarrolloSostenibleEstado(this.idAEliminar, $event).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    if (ods) ods.estado = ods?.estado === EstadoConfiguracionInstitucional.Activo ? EstadoConfiguracionInstitucional.Inactivo : EstadoConfiguracionInstitucional.Activo;
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error al inactivar el ODS:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo inactivar el ODS.' });
                if (ods) ods.estado = ods?.estado === EstadoConfiguracionInstitucional.Activo ? EstadoConfiguracionInstitucional.Inactivo : EstadoConfiguracionInstitucional.Activo;
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
                this.displayMotivoDialog = false;
            }
        });
    }

    dialogo($event: boolean) {
        this.displayMotivoDialog = $event;
    }
}
