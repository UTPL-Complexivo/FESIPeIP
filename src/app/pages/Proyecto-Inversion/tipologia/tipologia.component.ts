import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TipologiaModel } from '../../../models/tipologia.model';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { AppDialogConfirmation } from '../../../layout/component/app.dialog-confirmation';
import { AppEstadoGeneral } from '../../../layout/component/app.estado-general';
import { TipologiaService } from '../../../service/tipologia.service';
import { DeleteModel } from '../../../models/delete.model';
import { AppEstadoCi } from '../../../layout/component/app.estado-ci';
import { EstadoConfiguracionInstitucional } from '../../../shared/enums/estado-configuracion-institucional.enum';

@Component({
    selector: 'app-tipologia',
    standalone: true,
    template: `<div class="card">
            <app-cabecera-principal [items]="items" titulo="Tipologías" linkNuevo="/proyecto-inversion/tipologia/nuevo"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="tipologias"
                [tableStyle]="{ 'min-width': '50rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="5"
                [rowsPerPageOptions]="[5, 10, 20]"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['nombre', 'codigo', 'descripcion', 'estado']"
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
                                <span>Código</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="codigo" display="menu" placeholder="Buscar por código"></p-columnFilter>
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
                                    <p-columnFilter type="text" field="descripcion" display="menu" placeholder="Buscar por descripción"></p-columnFilter>
                                    <p-sortIcon field="descripcion"></p-sortIcon>
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
                <ng-template #body let-tipologia>
                    <tr>
                        <td>
                            <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" [routerLink]="['/proyecto-inversion/tipologia/editar', tipologia.id]" pTooltip="Editar" tooltipPosition="top"></button>
                            @if (tipologia.estado === EstadoConfiguracionInstitucional.Activo) {
                                <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text" (click)="updateEstado(tipologia.id)" pTooltip="Inactivar" tooltipPosition="top"></button>
                            } @else {
                                <button pButton icon="pi pi-unlock" severity="warn" class="p-button-rounded p-button-text" (click)="updateEstado(tipologia.id)" pTooltip="Activar" tooltipPosition="top"></button>
                            }
                            <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deleteTipologia(tipologia.id)" pTooltip="Eliminar" tooltipPosition="top"></button>
                        </td>
                        <td>{{ tipologia.codigo }}</td>
                        <td>{{ tipologia.nombre }}</td>
                        <td>{{ tipologia.descripcion }}</td>
                        <td>
                            <app-estado-ci [estado]="tipologia.estado"></app-estado-ci>
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
                        <td colspan="5">Cargando información. Por favor espere.</td>
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
        AppEstadoCi
    ],
    providers: [MessageService]
})
export class TipologiaComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] = [];
    tipologias: TipologiaModel[] = [];
    loading: boolean = true;
    displayMotivoDialog: boolean = false;
    idAEliminar: number | null = null;
    inactivar: boolean = false;
    tituloMotivo: string = 'Motivo de eliminación';
    EstadoConfiguracionInstitucional = EstadoConfiguracionInstitucional;
    constructor(
        private messageService: MessageService,
        private tipologiaService: TipologiaService
    ) {}

    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Proyecto de Inversión' }, { label: 'Tipologías', route: '/proyecto-inversion/tipologia' }];
        this.getTipologias();
    }

    getTipologias() {
        this.loading = true;
        this.tipologiaService.getTipologias().subscribe({
            next: (data) => {
                this.tipologias = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al obtener las tipologías:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar las tipologías.' });
                this.loading = false;
            }
        });
    }

    deleteTipologia(id: number) {
        if (this.tipologias.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay tipologías disponibles para eliminar.' });
            return;
        }
        this.tituloMotivo = 'Motivo de eliminación';
        this.inactivar = false;
        this.idAEliminar = id;
        this.displayMotivoDialog = true;
    }

    updateEstado(id: number) {
        if (this.tipologias.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay tipologías disponibles para actualizar.' });
            return;
        }
        const tipologia = this.tipologias.find((t) => t.id === id);
        if (tipologia?.estado === EstadoConfiguracionInstitucional.Activo) {
            this.tituloMotivo = 'Motivo de inactivación';
            this.inactivar = true;
            this.idAEliminar = id;
            this.displayMotivoDialog = true;
            return;
        }

        this.loading = true;
        this.tipologiaService.patchTipologiaEstado(id, { id, motivoInactivacion: 'Activado desde el sistema' }).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    this.getTipologias();
                }
            },
            error: (error) => {
                console.error('Error al actualizar el estado de la tipología:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado de la tipología.' });
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

    confirmarEliminacion($event: any) {
        const { inactivar, id, motivo } = $event;
        this.inactivar = inactivar;
        this.loading = true;
        let tipologia = this.tipologias.find((t) => t.id === id);
        let deleteTipologia: DeleteModel = {
            id: this.idAEliminar!,
            motivoInactivacion: $event.motivoInactivacion || 'Eliminado desde el sistema'
        };

        if (this.inactivar) {
            this.tipologiaService.patchTipologiaEstado(this.idAEliminar!, deleteTipologia).subscribe({
                next: (response) => {
                    const { error, mensaje } = response;
                    if (error) {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                        return;
                    }
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    if (tipologia) tipologia.estado = tipologia?.estado === EstadoConfiguracionInstitucional.Activo ? EstadoConfiguracionInstitucional.Inactivo : EstadoConfiguracionInstitucional.Activo;
                },
                error: (error) => {
                    console.error('Error al actualizar el estado de la tipología:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado de la tipología.' });
                    this.loading = false;
                },
                complete: () => {
                    this.loading = false;
                }
            });
            return;
        }

        this.tipologiaService.deleteTipologia(id, deleteTipologia).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    this.tipologias = this.tipologias.filter((t) => t.id !== id);
                }
            },
            error: (error) => {
                console.error('Error al eliminar la tipología:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la tipología.' });
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
