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

@Component({
    selector: 'app-objetivo-institucional',
    standalone: true,
    template: `
        <div class="card">
            <app-cabecera-principal [items]="items" titulo="Objetivos Institucionales" linkNuevo="/objetivo-estrategico/objetivo-institucional/nuevo"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="objetivo_institucionales"
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
                            <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" [routerLink]="['/objetivo-estrategico/objetivo-institucional/editar', objetivo_institucional.id]" pTooltip="Editar" tooltipPosition="top"></button>
                            @if (objetivo_institucional.estado === 'Activo') {
                                <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text" (click)="updateEstado(objetivo_institucional)" pTooltip="Inactivar" tooltipPosition="top"></button>
                            } @else {
                                <button pButton icon="pi pi-unlock" severity="warn" class="p-button-rounded p-button-text" (click)="updateEstado(objetivo_institucional)" pTooltip="Activar" tooltipPosition="top"></button>
                            }
                            <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deleteOI(objetivo_institucional)" pTooltip="Eliminar" tooltipPosition="top"></button>
                        </td>
                        <td>{{ objetivo_institucional.codigo }}</td>
                        <td>{{ objetivo_institucional.nombre }}</td>
                        <td>
                            <app-estado-general [estado]="objetivo_institucional.estado"></app-estado-general>
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
    imports: [AppCabeceraPrincipal, TableModule, IconFieldModule, InputIconModule, RouterModule, AppEstadoGeneral, ButtonModule, InputTextModule, ToastModule, AppDialogConfirmation],
    providers: [MessageService]
})
export class ObjetivoInstitucionalComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] = [{ icon: 'pi pi-home', route: '/' }, { label: 'Objetivos Estratégicos' }, { label: 'Objetivos Institucionales' }];
    objetivo_institucionales: ObjetivoInstitucionalModel[] = [];
    loading: boolean = true;
    displayMotivoDialog: boolean = false;
    inactivar: boolean = false;
    tituloMotivo: string = 'Motivo de Inactivación';
    idAEliminar: number = 0;
    constructor(
        private oiService: ObjetivoInstitucionalService,
        private messageService: MessageService
    ) {}
    ngOnInit() {
        this.oiService.getObjetivosInstitucionales().subscribe({
            next: (data) => {
                this.objetivo_institucionales = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al cargar los objetivos institucionales:', error);
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
        // Implementar la lógica para actualizar el estado del objetivo institucional
        this.idAEliminar = objetivo_institucional.id;
        if (objetivo_institucional.estado === 'Activo') {
            this.displayMotivoDialog = true;
            this.inactivar = true;
            this.tituloMotivo = 'Motivo de Inactivación';
            return;
        }
        this.loading = true;
        this.oiService.patchObjetivoInstitucionalEstado(objetivo_institucional.id, { id: objetivo_institucional.id, motivoInactivacion: 'activo desde sistema' }).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                objetivo_institucional.estado = objetivo_institucional.estado === 'Activo' ? 'Inactivo' : 'Activo';
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
        this.idAEliminar = objetivo_institucional.id;
        this.displayMotivoDialog = true;
        this.inactivar = false;
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
        if (inactivar) {
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
                        objetivo.estado = 'Inactivo';
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
            return;
        }
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
    }
}
