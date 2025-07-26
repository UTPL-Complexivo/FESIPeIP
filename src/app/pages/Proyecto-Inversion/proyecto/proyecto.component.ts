import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { AppEstadoOe } from '../../../layout/component/app.estado-oe';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ProyectoInversionModel } from '../../../models/proyecto-inversion.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { EstadoObjetivosEstrategicos } from '../../../shared/enums/estado-objetivos-estrategicos.enum';
import { TagModule } from 'primeng/tag';
import { ProyectoInversionService } from '../../../service/proyecto-inversion.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-proyecto',
    standalone: true,
    template: `
        <div class="card">
            <app-cabecera-principal [items]="items" titulo="Proyectos de Inversión" linkNuevo="/proyecto-inversion/proyecto/nuevo"></app-cabecera-principal>
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
                                <button pButton icon="pi pi-eye" size="small"
                                        class="p-button-rounded p-button-info p-button-text"
                                        [routerLink]="['/proyecto-inversion/proyecto/ver', proyecto.id]"
                                        pTooltip="Ver detalles" tooltipPosition="top"></button>
                                <button pButton icon="pi pi-pencil" size="small"
                                        class="p-button-rounded p-button-success p-button-text"
                                        [routerLink]="['/proyecto-inversion/proyecto/editar', proyecto.id]"
                                        pTooltip="Editar proyecto" tooltipPosition="top"></button>
                                <button pButton icon="pi pi-list" size="small"
                                        class="p-button-rounded p-button-warning p-button-text"
                                        [routerLink]="['/proyecto-inversion/proyecto', proyecto.id, 'actividades']"
                                        pTooltip="Ver actividades" tooltipPosition="top"></button>
                                <button pButton icon="pi pi-paperclip" size="small"
                                        class="p-button-rounded p-button-secondary p-button-text"
                                        [routerLink]="['/proyecto-inversion/proyecto', proyecto.id, 'anexos']"
                                        pTooltip="Ver anexos" tooltipPosition="top"></button>
                                <button pButton icon="pi pi-trash" size="small"
                                        class="p-button-rounded p-button-danger p-button-text"
                                        (click)="eliminarProyecto(proyecto)"
                                        pTooltip="Eliminar proyecto" tooltipPosition="top"></button>
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
        ConfirmDialogModule
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

    // Hacer accesible el enum en el template
    EstadoObjetivosEstrategicos = EstadoObjetivosEstrategicos;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private proyectoInversionService: ProyectoInversionService
    ) {}

    ngOnInit(): void {
        this.cargarProyectos();
    }

    cargarProyectos(): void {
        this.loading = true;

        this.proyectoInversionService.getAll().subscribe({
            next: (proyectos) => {
                this.proyectos = proyectos;
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
}
