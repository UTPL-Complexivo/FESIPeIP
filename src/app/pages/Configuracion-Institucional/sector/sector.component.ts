import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { SectorModel } from '../../../models/sector.model';
import { AppDialogConfirmation } from '../../../layout/component/app.dialog-confirmation';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectControlValueAccessor } from '@angular/forms';
import { SectorService } from '../../../service/sector.service';
import { AppEstadoGeneral } from '../../../layout/component/app.estado-general';

@Component({
    selector: 'app-sector',
    standalone: true,
    template: `<div class="card">
            <app-cabecera-principal [items]="items" titulo="Sectores" linkNuevo="/configuracion-institucional/sectores/nuevo"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="sectores"
                [tableStyle]="{ 'min-width': '50rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="5"
                [rowsPerPageOptions]="[5, 10, 20]"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['nombre', 'codigo', 'nombreMacroSector', 'estado']"
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
                <ng-template #body let-sector>
                    <tr>
                        <td>
                            <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" [routerLink]="['/configuracion-institucional/sectores/editar', sector.id]" pTooltip="Editar" tooltipPosition="top"></button>
                            @if (sector.estado === 'Activo') {
                                <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text" (click)="updateEstado(sector.id)" pTooltip="Inactivar" tooltipPosition="top"></button>
                            } @else {
                                <button pButton icon="pi pi-unlock" severity="warn" class="p-button-rounded p-button-text" (click)="updateEstado(sector.id)" pTooltip="Activar" tooltipPosition="top"></button>
                            }
                            <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deleteUsuario(sector.id)" pTooltip="Eliminar" tooltipPosition="top"></button>
                        </td>
                        <td>{{ sector.codigo }}</td>
                        <td>{{ sector.nombre }}</td>
                        <td>{{ sector.nombreMacroSector }}</td>
                        <td>
                            <app-estado-general [estado]="sector.estado"></app-estado-general>
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
    imports: [AppCabeceraPrincipal, TableModule, AppDialogConfirmation, IconFieldModule, InputIconModule, RouterModule, BadgeModule, ToastModule, InputTextModule, ButtonModule, AppEstadoGeneral],
    providers: [MessageService]
})
export class SectorComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] = [];
    sectores: SectorModel[] = [];
    loading: boolean = true;
    displayMotivoDialog: boolean = false;
    inactivar: boolean = false;
    tituloMotivo: string = '';
    idAEliminar: number | null = null;

    constructor(
        private sectorService: SectorService,
        private messageService: MessageService
    ) {}
    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Configuracion Institucional' }, { label: 'Sectores', route: '/sectores' }];
        this.getSectores();
    }

    getSectores() {
        this.loading = true;
        this.sectorService.getSectores().subscribe({
            next: (data) => {
                this.sectores = data;
            },
            error: (error) => {
                console.error('Error al obtener los sectores:', error);
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

    deleteUsuario(id: number) {
        this.displayMotivoDialog = true;
        this.inactivar = false;
        this.tituloMotivo = 'Motivo de eliminación';
        this.idAEliminar = id;
    }
    updateEstado(id: number) {
        const sector = this.sectores.find((s) => s.id === id);
        if (!sector) {
            console.error('Sector no encontrado:', id);
            return;
        }
        if (sector.estado === 'Activo') {
            this.displayMotivoDialog = true;
            this.inactivar = true;
            this.tituloMotivo = 'Motivo de inactivación';
            this.idAEliminar = id;
            return;
        }
        const dto = {
            id: sector.id,
            motivoInactivacion: 'activación del sector'
        };
        this.loading = true;
        this.sectorService.patchEstado(id, dto).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    console.error('Error al activar el sector:', mensaje);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                this.getSectores();
            },
            error: (error) => {
                console.error('Error al activar el sector:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo activar el sector.' });
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    confirmarEliminacion($event: any) {
        console.log('Confirmar eliminación:', $event);
        if (this.inactivar) {
            this.sectorService.patchEstado(this.idAEliminar!, $event).subscribe({
                next: (response) => {
                    const { error, mensaje } = response;
                    if (error) {
                        this.displayMotivoDialog = false;
                        this.idAEliminar = null;
                        this.inactivar = false;
                        this.tituloMotivo = '';
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                        return;
                    }
                    this.displayMotivoDialog = false;
                    this.idAEliminar = null;
                    this.inactivar = false;
                    this.tituloMotivo = '';
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    this.getSectores();
                },
                error: (error) => {
                    console.error('Error al inactivar el sector:', error);
                }
            });
            return;
        }

        this.sectorService.deleteSector(this.idAEliminar!, $event).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.displayMotivoDialog = false;
                    this.idAEliminar = null;
                    this.inactivar = false;
                    this.tituloMotivo = '';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.displayMotivoDialog = false;
                this.idAEliminar = null;
                this.inactivar = false;
                this.tituloMotivo = '';
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                this.getSectores();
            },
            error: (error) => {
                console.error('Error al eliminar el sector:', error);
            }
        });
    }
    dialogo($event: boolean) {
        this.displayMotivoDialog = $event;
    }
}
