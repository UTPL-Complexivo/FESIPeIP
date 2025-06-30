import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ObjetivoInstitucionalComponent } from '../objetivoinstitucional/objetivo-institucional.component';
import { PlanNacionalDesarrolloModel } from '../../../models/plan-nacional-desarrollo.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
import { AppEstadoGeneral } from '../../../layout/component/app.estado-general';
import { ToastModule } from 'primeng/toast';
import { AppDialogConfirmation } from '../../../layout/component/app.dialog-confirmation';
import { PlanNacionalDesarrolloService } from '../../../service/plan-nacional-desarrollo.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DeleteModel } from '../../../models/delete.model';
import { EjeColorPipe } from '../../../pipes/eje-color.pipe';

@Component({
    selector: 'app-plan-nacional-desarrollo',
    standalone: true,
    template: `
        <div class="card">
            <app-cabecera-principal [items]="items" titulo="Objetivos Plan Nacional Desarrollo" linkNuevo="/objetivo-estrategico/objetivo-pnd/nuevo"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="objetivo_pnds"
                [tableStyle]="{ 'min-width': '50rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="10"
                [rowsPerPageOptions]="[5, 10, 20]"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['nombre', 'descripcion', 'codigo', 'estado', 'eje']"
                rowGroupMode="subheader"
                groupRowsBy="eje"
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
                        <th class="w-60">Acciones</th>
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
                <ng-template #groupheader let-objetivo_pnd>
                    <tr pRowGroupHeader>
                        <th colspan="6" class="text-left">
                            <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4" [style.border-left-color]="objetivo_pnd.eje | ejeColor:'hex'">
                                <div class="w-4 h-4 rounded-full" [style.background-color]="objetivo_pnd.eje | ejeColor:'hex'"></div>
                                <span [class]="'px-2 py-1 rounded text-white text-sm font-semibold ' + (objetivo_pnd.eje | ejeColor:'background')">
                                    EJE {{ objetivo_pnd.eje }}
                                </span>
                            </div>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-objetivo_pnd>
                    <tr>
                        <td>
                            <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" [routerLink]="['/objetivo-estrategico/objetivo-pnd/editar', objetivo_pnd.id]" pTooltip="Editar" tooltipPosition="top"></button>
                            @if (objetivo_pnd.estado === 'Activo') {
                                <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text" (click)="updateEstado(objetivo_pnd)" pTooltip="Inactivar" tooltipPosition="top"></button>
                            } @else {
                                <button pButton icon="pi pi-unlock" severity="warn" class="p-button-rounded p-button-text" (click)="updateEstado(objetivo_pnd)" pTooltip="Activar" tooltipPosition="top"></button>
                            }
                            <button pButton icon="pi pi-trash" severity="danger" class="p-button-rounded p-button-text" (click)="deletePND(objetivo_pnd)" pTooltip="Eliminar" tooltipPosition="top"></button>
                        </td>

                        <td>{{ objetivo_pnd.codigo }}</td>
                        <td>{{ objetivo_pnd.nombre }}</td>
                        <td>
                            <app-estado-general [estado]="objetivo_pnd.estado"></app-estado-general>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="6">Al momento no se dispone de información.</td>
                    </tr>
                </ng-template>
                <ng-template #loadingbody>
                    <tr>
                        <td colspan="6">Cargando informacion. Por favor espere.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast position="top-right"></p-toast>
        <app-dialog-confirmation [displayMotivoDialog]="displayMotivoDialog" [inactivar]="inactivar" [tituloMotivo]="tituloMotivo" [id]="idAEliminar" (cerrarDialogo)="dialogo($event)" (save)="confirmarEliminacion($event)"></app-dialog-confirmation>
    `,
    imports: [AppCabeceraPrincipal, TableModule, IconFieldModule, InputIconModule, RouterModule, AppEstadoGeneral, ToastModule, AppDialogConfirmation, ButtonModule, InputTextModule, EjeColorPipe],
    providers: [MessageService]
})
export class PlanNacionalDesarrolloComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] = [{ icon: 'pi pi-home', route: '/' }, { label: 'Objetivos Estratégicos' }, { label: 'Objetivos PND' }];
    objetivo_pnds: PlanNacionalDesarrolloModel[] = [];
    loading: boolean = true;
    displayMotivoDialog: boolean = false;
    inactivar: boolean = false;
    tituloMotivo: string = '';
    idAEliminar: number = 0;

    constructor(
        private messageService: MessageService,
        private pndService: PlanNacionalDesarrolloService
    ) {}
    ngOnInit() {
        this.pndService.getPlanesNacionalesDesarrollo().subscribe({
            next: (data) => {
                this.objetivo_pnds = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al cargar los objetivos PND:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los objetivos PND.' });
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

    deletePND(pnd: PlanNacionalDesarrolloModel) {
        this.displayMotivoDialog = true;
        this.inactivar = false;
        this.tituloMotivo = 'Motivo de Eliminación';
        this.idAEliminar = pnd.id;
    }
    updateEstado(pnd: PlanNacionalDesarrolloModel) {
        this.idAEliminar = pnd.id;
        if (pnd.estado === 'Activo') {
            this.displayMotivoDialog = true;
            this.inactivar = true;
            this.tituloMotivo = 'Motivo de Inactivación';
            return;
        }
        this.loading = true;
        this.pndService.patchPlanNacionalDesarrolloEstado(pnd.id, { id: pnd.id, motivoInactivacion: 'activado desde el sistema' }).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    pnd.estado = pnd.estado === 'Activo' ? 'Inactivo' : 'Activo';
                }
            },
            error: (error) => {
                console.error('Error al actualizar el estado del PND:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado del PND.' });
            },
            complete: () => {
                this.loading = false;
            }
        });
    }
    dialogo($event: boolean) {
        this.displayMotivoDialog = $event;
    }
    confirmarEliminacion($event: any) {
        const { id, inactivar } = $event;
        let pnd = this.objetivo_pnds.find((p) => p.id === id);
        let deletePND: DeleteModel = {
            id: this.idAEliminar,
            motivoInactivacion: $event.motivoInactivacion || 'Eliminado desde el sistema'
        }
        if (inactivar) {
            if (pnd) pnd.estado = pnd?.estado === 'Activo' ? 'Inactivo' : 'Activo';
            this.loading = true;
            this.pndService.patchPlanNacionalDesarrolloEstado(this.idAEliminar, deletePND).subscribe({
                next: (response) => {
                    const { error, mensaje } = response;
                    if (error) {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    }
                },
                error: (error) => {
                    console.error('Error al actualizar el estado del PND:', error);
                    if (pnd) pnd.estado = pnd.estado === 'Activo' ? 'Inactivo' : 'Activo';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado del PND.' });
                    this.loading = false;
                },
                complete: () => {
                    this.loading = false;
                }
            });
            return;
        }
        this.pndService.deletePlanNacionalDesarrollo(id, deletePND).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    this.objetivo_pnds = this.objetivo_pnds.filter((p) => p.id !== id);
                }
            },
            error: (error) => {
                console.error('Error al eliminar el PND:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el PND.' });
            },
            complete: () => {
                this.displayMotivoDialog = false;
                this.loading = false;
            }
        });
    }
}
