import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TipologiaActividadModel } from '../../../models/tipologia-actividad.model';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { AppDialogConfirmation } from '../../../layout/component/app.dialog-confirmation';
import { TipologiaActividadService } from '../../../service/tipologia-actividad.service';

@Component({
    selector: 'app-tipologia-actividad',
    standalone: true,
    template: `<div class="card">
            <app-cabecera-principal [items]="items" titulo="Tipologías - Actividades" linkNuevo="/proyecto-inversion/tipologia-actividad/nuevo"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="tipologiasActividades"
                [tableStyle]="{ 'min-width': '50rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="10"
                [rowsPerPageOptions]="[5, 10, 20]"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['tipologiaNombre', 'tipologiaCodigo', 'actividadNombre']"
                dataKey="id"
                [rowGroupMode]="'subheader'"
                groupRowsBy="tipologiaCodigo"
                sortField="tipologiaCodigo"
                [sortOrder]="1"
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
                <ng-template #groupheader let-rowData>
                    <td colspan="2">
                        <div class="flex align-items-center gap-3 p-3 font-bold" [ngClass]="getColorClass(rowData.tipologiaCodigo)">
                            <i class="pi pi-tag"></i>
                            <span>{{ rowData.tipologiaCodigo }} - {{ rowData.tipologiaNombre }}</span>
                        </div>
                    </td>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th>Acciones</th>
                        <th pSortableColumn="actividadNombre">
                            <div class="flex justify-between items-center w-full">
                                <span>Actividad</span>
                                <div class="flex items-center gap-2">
                                    <p-columnFilter type="text" field="actividadNombre" display="menu" placeholder="Buscar por actividad"></p-columnFilter>
                                    <p-sortIcon field="actividadNombre"></p-sortIcon>
                                </div>
                            </div>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-tipologiaActividad>
                    <tr>
                        <td>
                            <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" [routerLink]="['/proyecto-inversion/tipologia-actividad/editar', tipologiaActividad.id]" pTooltip="Editar" tooltipPosition="top"></button>
                            <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deleteTipologiaActividad(tipologiaActividad.id)" pTooltip="Eliminar" tooltipPosition="top"></button>
                        </td>
                        <td>{{ tipologiaActividad.actividadNombre }}</td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="2">Al momento no se dispone de información.</td>
                    </tr>
                </ng-template>
                <ng-template #loadingbody>
                    <tr>
                        <td colspan="2">Cargando información. Por favor espere.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast position="top-right"></p-toast>
        <app-dialog-confirmation [displayMotivoDialog]="displayMotivoDialog" [inactivar]="false" [tituloMotivo]="'Confirmar eliminación'" [id]="idAEliminar" (cerrarDialogo)="dialogo($event)" (save)="confirmarEliminacion($event)"></app-dialog-confirmation>`,
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
        FloatLabelModule,
        AppCabeceraPrincipal,
        AppDialogConfirmation
    ],
    providers: [MessageService]
})
export class TipologiaActividadComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] = [];
    tipologiasActividades: TipologiaActividadModel[] = [];
    loading: boolean = true;
    displayMotivoDialog: boolean = false;
    idAEliminar: number | null = null;

    constructor(
        private messageService: MessageService,
        private tipologiaActividadService: TipologiaActividadService
    ) {
    }

    ngOnInit(): void {
        this.items = [
            { icon: 'pi pi-home', route: '/' },
            { label: 'Proyecto de Inversión' },
            { label: 'Tipologías - Actividades', route: '/proyecto-inversion/tipologia-actividad' }
        ];
        this.getTipologiasActividades();
    }

    getTipologiasActividades() {
        this.loading = true;
        this.tipologiaActividadService.getTipologiasActividades().subscribe({
            next: (data) => {
                this.tipologiasActividades = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al obtener las tipologías-actividades:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar las tipologías-actividades.' });
                this.loading = false;
            }
        });
    }

    getColorClass(tipologiaCodigo: string): string {
        // Generar un hash simple basado en el código de tipología
        let hash = 0;
        for (let i = 0; i < tipologiaCodigo.length; i++) {
            hash = tipologiaCodigo.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Array de clases de colores de Tailwind CSS
        const colores = [
            'bg-blue-50 text-blue-800',
            'bg-green-50 text-green-800',
            'bg-purple-50 text-purple-800',
            'bg-orange-50 text-orange-800',
            'bg-pink-50 text-pink-800',
            'bg-indigo-50 text-indigo-800',
            'bg-red-50 text-red-800',
            'bg-yellow-50 text-yellow-800',
            'bg-teal-50 text-teal-800',
            'bg-cyan-50 text-cyan-800'
        ];

        // Seleccionar color basado en el hash
        const indice = Math.abs(hash) % colores.length;
        return colores[indice];
    }

    deleteTipologiaActividad(id: number) {
        if (this.tipologiasActividades.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay tipologías-actividades disponibles para eliminar.' });
            return;
        }
        this.idAEliminar = id;
        this.displayMotivoDialog = true;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    confirmarEliminacion($event: any) {
        this.loading = true;

        this.tipologiaActividadService.deleteTipologiaActividad(this.idAEliminar!).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    this.tipologiasActividades = this.tipologiasActividades.filter((ta) => ta.id !== this.idAEliminar);
                }
            },
            error: (error) => {
                console.error('Error al eliminar la tipología-actividad:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la tipología-actividad.' });
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
