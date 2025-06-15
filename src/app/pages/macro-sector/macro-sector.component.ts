import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { MacroSectorModel } from '../../models/macro-sector.model';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MacroSectorService } from '../../service/macro-sector.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AppCabeceraPrincipal } from '../../layout/component/app.cabecera-principal';
import { AppDialogConfirmation } from '../../layout/component/app.dialog-confirmation';
import { AppEstadoGeneral } from "../../layout/component/app.estado-general";

@Component({
    selector: 'app-macro-sector',
    standalone: true,
    template: `<div class="card">
            <app-cabecera-principal [items]="items" titulo="Macro Sectores" linkNuevo="/configuracion-institucional/macro-sectores/nuevo"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="macro_sectores"
                [tableStyle]="{ 'min-width': '50rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="5"
                [rowsPerPageOptions]="[5, 10, 20]"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['nombre', 'codigo', 'estado']"
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
                <ng-template #body let-macro_sector>
                    <tr>
                        <td>
                            <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" [routerLink]="['/configuracion-institucional/macro-sectores/editar', macro_sector.id]" pTooltip="Editar" tooltipPosition="top"></button>
                            @if (macro_sector.estado === 'Activo') {
                                <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text" (click)="updateEstado(macro_sector.id)" pTooltip="Inactivar" tooltipPosition="top"></button>
                            } @else {
                                <button pButton icon="pi pi-unlock" severity="warn" class="p-button-rounded p-button-text" (click)="updateEstado(macro_sector.id)" pTooltip="Activar" tooltipPosition="top"></button>
                            }
                            <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deleteUsuario(macro_sector.id)" pTooltip="Eliminar" tooltipPosition="top"></button>
                        </td>
                        <td>{{ macro_sector.codigo }}</td>
                        <td>{{ macro_sector.nombre }}</td>
                        <td>
                            <app-estado-general [estado]="macro_sector.estado"></app-estado-general>
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
    imports: [
    RouterModule,
    CommonModule,
    ToolbarModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    BadgeModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FloatLabelModule,
    AppCabeceraPrincipal,
    AppDialogConfirmation,
    AppEstadoGeneral
],
    providers: [MessageService]
})
export class MacroSectorComponent implements OnInit {

    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] = [];
    macro_sectores: MacroSectorModel[] = [];
    loading: boolean = true;
    displayMotivoDialog: boolean = false;
    idAEliminar: number | null = null;
    inactivar: boolean = false;
    tituloMotivo: string = 'Motivo de eliminación';
    constructor(
        private macroSectorService: MacroSectorService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Configuracion Institucional' }, { label: 'MacroSector', route: '/macro-sectores' }];
        this.getMacroSectores();
    }

    getMacroSectores() {
        this.loading = true;
        this.macroSectorService.getMacroSectores().subscribe({
            next: (data) => {
                this.macro_sectores = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al obtener los macro sectores:', error);
                this.loading = false;
            }
        });
    }

    deleteUsuario(id: number) {
        if (this.macro_sectores.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay macro sectores disponibles para eliminar.' });
            return;
        }
        this.tituloMotivo = 'Motivo de eliminación';
        this.inactivar = false;
        this.idAEliminar = id;
        this.displayMotivoDialog = true;
    }
    updateEstado(id: number) {
        if (this.macro_sectores.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay macro sectores disponibles para actualizar.' });
            return;
        }
        const macroSector = this.macro_sectores.find((ms) => ms.id === id);
        if (macroSector?.estado === 'Activo') {
            this.tituloMotivo = 'Motivo de inactivación';
            this.inactivar = true;
            this.idAEliminar = id;
            this.displayMotivoDialog = true;
            return;
        }

        this.macroSectorService.patchMacroSectorEstado(id, { id, motivoInactivacion: 'Activado desde plataforma' }).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                this.getMacroSectores();
            },
            error: (error) => {
                console.error('Error al actualizar el estado del macro sector:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado del macro sector.' });
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

    confirmarEliminacion($event: any) {
        const {inactivar, id, motivo} = $event;
        this.inactivar = inactivar;
        this.loading = true;

        if (this.inactivar) {
            this.macroSectorService.patchMacroSectorEstado(this.idAEliminar!, $event).subscribe({
                next: (response) => {
                    const { error, mensaje } = response;
                    if (error) {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                        return;
                    }
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    this.getMacroSectores();
                },
                error: (error) => {
                    console.error('Error al inactivar el macro sector:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo inactivar el macro sector.' });
                    this.loading = false;
                },
                complete: () => {
                    this.loading = false;
                    this.displayMotivoDialog = false;
                    this.idAEliminar = null;
                }
            });
            return;
        }

        this.macroSectorService.deleteMacroSector(this.idAEliminar!, $event).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                this.getMacroSectores();
            },
            error: (error) => {
                console.error('Error al eliminar el macro sector:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el macro sector.' });
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
                this.displayMotivoDialog = false;
                this.idAEliminar = null;
            }
        });
    }

    dialogo($event: boolean) {
        this.displayMotivoDialog = $event;
    }
}
