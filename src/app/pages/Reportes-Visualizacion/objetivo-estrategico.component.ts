import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { AppCabeceraPrincipal } from '../../layout/component/app.cabecera-principal';
import { AppToolbarReporte } from '../../layout/component/app.toolbar-reporte';
import { FiltroObjetivoEstrategicoModel } from '../../models/filtro-objetivo-estrategico.model';
import { ReporteObjetivoEstrategicoModel } from '../../models/reporte-objetivo-estrategico.model';
import { ReporteObjetivoEstrategicoService } from '../../service/reporte-objetivo-estrategico.service';
import { ObjetivoInstitucionalService } from '../../service/objetivo-institucional.service';
import { PlanNacionalDesarrolloService } from '../../service/plan-nacional-desarrollo.service';
import { ObjetivoDesarrolloSostenibleService } from '../../service/objetivo-desarrollo-sostenible.service';
import { ObjetivoInstitucionalModel } from '../../models/objetivo-institucional.model';
import { PlanNacionalDesarrolloModel } from '../../models/plan-nacional-desarrollo.model';
import { ObjetivoDesarrolloSostenibleModel } from '../../models/objetivo-desarrollo-sostenible.model';
import { EstadoObjetivosEstrategicos } from '../../shared/enums/estado-objetivos-estrategicos.enum';

@Component({
    selector: 'app-objetivo-estrategico',
    standalone: true,
    template: `
        <div class="card">
            <div class="col-12">
                <app-cabecera-principal [nuevo]="false" [items]="items" titulo="Reportes - Objetivos Estratégicos" linkNuevo=""> </app-cabecera-principal>
                <!-- Toolbar de Exportación -->
                <div class="col-12" *ngIf="datos.length > 0">
                    <app-toolbar-reporte
                        titulo=""
                        [loadingPDF]="exportandoPDF"
                        [loadingExcel]="exportandoExcel"
                        [loadingJSON]="exportandoJSON"
                        [disabled]="datos.length === 0"
                        (exportExcel)="exportarExcel()"
                        (exportPDF)="exportarPDF()"
                        (exportJSON)="exportarJSON()"
                    >
                    </app-toolbar-reporte>
                </div>
            </div>

            <!-- Filtros -->
            <div class="col-12">
                <p-card header="Filtros de Búsqueda">
                    <form [formGroup]="filtroForm" class="grid">
                        <div class="field col-12 md:col-3">
                            <label for="objetivoInstitucional">Objetivo Institucional</label>
                            <p-select
                                id="objetivoInstitucional"
                                formControlName="nombreObjetivoInstitucional"
                                [options]="objetivosInstitucionales"
                                placeholder="Seleccione un Objetivo Institucional"
                                optionLabel="nombre"
                                optionValue="id"
                                [showClear]="true"
                                [filter]="true"
                                filterBy="nombre"
                                class="w-full"
                            >
                            </p-select>
                        </div>

                        <div class="field col-12 md:col-3">
                            <label for="planNacional">Plan Nacional</label>
                            <p-select
                                id="planNacional"
                                formControlName="nombrePlanNacional"
                                [options]="planesNacionales"
                                placeholder="Seleccione un Plan Nacional"
                                optionLabel="nombre"
                                optionValue="id"
                                [showClear]="true"
                                [filter]="true"
                                filterBy="nombre"
                                class="w-full"
                            >
                            </p-select>
                        </div>

                        <div class="field col-12 md:col-3">
                            <label for="ods">ODS</label>
                            <p-select
                                id="ods"
                                formControlName="nombreODS"
                                [options]="ods"
                                placeholder="Seleccione un ODS"
                                optionLabel="nombre"
                                optionValue="id"
                                [showClear]="true"
                                [filter]="true"
                                filterBy="nombre"
                                class="w-full"
                            >
                            </p-select>
                        </div>

                        <div class="field col-12 mt-5">
                            <div class="flex gap-2">
                                <button pButton type="button" label="Buscar" icon="pi pi-search" class="p-button-primary" (click)="buscarDatos()" [loading]="cargandoDatos"></button>
                                <button pButton type="button" label="Limpiar" icon="pi pi-refresh" class="p-button-secondary" (click)="limpiarFiltros()"></button>
                            </div>
                        </div>
                    </form>
                </p-card>
            </div>

            <!-- Tabla de Datos -->
            <div class="col-12 mt-5">
                <p-card header="Datos de Objetivos Estratégicos">
                    <p-table
                        [value]="datos"
                        [loading]="cargandoDatos"
                        [paginator]="true"
                        [rows]="10"
                        [rowsPerPageOptions]="[5, 10, 20, 50]"
                        [tableStyle]="{ 'min-width': '50rem' }"
                        [globalFilterFields]="['nombre', 'estado']"
                    >
                        <ng-template pTemplate="header">
                            <tr>
                                <th>Nombre del Objetivo Estratégico</th>
                                <th>Estado</th>
                                <th>Cantidad de Planes Nacionales</th>
                                <th>Acciones</th>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="body" let-fila let-rowIndex="rowIndex">
                            <tr>
                                <td>{{ fila.nombre }}</td>
                                <td>
                                    <span class="p-tag" [class]="getEstadoClass(fila.estado)">
                                        {{ fila.estado }}
                                    </span>
                                </td>
                                <td>{{ fila.planesNacionales?.length || 0 }}</td>
                                <td>
                                    <button
                                        pButton
                                        type="button"
                                        [icon]="isRowExpanded(rowIndex) ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
                                        class="p-button-text"
                                        (click)="toggleRow(rowIndex)"
                                        pTooltip="Ver planes nacionales"
                                    ></button>
                                </td>
                            </tr>
                            <tr *ngIf="isRowExpanded(rowIndex)">
                                <td colspan="4">
                                    <div class="p-3">
                                        <h5>Planes Nacionales Asociados</h5>
                                        <div class="grid" *ngIf="fila.planesNacionales && fila.planesNacionales.length > 0; else noPlanes">
                                            <div class="col-12" *ngFor="let plan of fila.planesNacionales">
                                                <p-card>
                                                    <ng-template pTemplate="header">
                                                        <div class="flex justify-content-between align-items-center p-2">
                                                            <h6 class="m-0">{{ plan.nombre }}</h6>
                                                            <span class="p-tag p-tag-info">{{ plan.estado }}</span>
                                                        </div>
                                                    </ng-template>

                                                    <div class="grid">
                                                        <div class="col-12 md:col-6" *ngIf="plan.ods && plan.ods.length > 0">
                                                            <h6>ODS Asociados:</h6>
                                                            <div class="flex flex-wrap gap-1">
                                                                <span
                                                                    class="p-tag p-tag-success"
                                                                    *ngFor="let ods of plan.ods"
                                                                    pTooltip="{{ ods.nombre }}"
                                                                >
                                                                    {{ ods.nombre.length > 20 ? (ods.nombre | slice:0:20) + '...' : ods.nombre }}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div class="col-12 md:col-6" *ngIf="plan.alineaciones && plan.alineaciones.length > 0">
                                                            <h6>Alineaciones:</h6>
                                                            <div class="flex flex-wrap gap-1">
                                                                <span
                                                                    class="p-tag p-tag-warning"
                                                                    *ngFor="let alineacion of plan.alineaciones"
                                                                >
                                                                    {{ alineacion.nombre }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </p-card>
                                            </div>
                                        </div>
                                        <ng-template #noPlanes>
                                            <p class="text-center text-muted">No hay planes nacionales asociados</p>
                                        </ng-template>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="4" class="text-center">No se encontraron datos. Utilice los filtros para buscar información.</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            </div>
        </div>

        <p-toast position="top-right"></p-toast>
    `,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonModule, CardModule, SelectModule, InputTextModule, TableModule, ToastModule, TooltipModule, AppCabeceraPrincipal, AppToolbarReporte],
    providers: [MessageService]
})
export class ObjetivoEstrategicoComponent implements OnInit {
    items: MenuItem[] = [];
    filtroForm: FormGroup;
    datos: ReporteObjetivoEstrategicoModel[] = [];
    cargandoDatos: boolean = false;
    exportandoPDF: boolean = false;
    exportandoExcel: boolean = false;
    exportandoJSON: boolean = false;
    expandedRows: Set<number> = new Set();

    // Listas para los selects
    objetivosInstitucionales: ObjetivoInstitucionalModel[] = [];
    planesNacionales: PlanNacionalDesarrolloModel[] = [];
    ods: ObjetivoDesarrolloSostenibleModel[] = [];

    constructor(
        private fb: FormBuilder,
        private reporteService: ReporteObjetivoEstrategicoService,
        private objetivoInstitucionalService: ObjetivoInstitucionalService,
        private planNacionalService: PlanNacionalDesarrolloService,
        private odsService: ObjetivoDesarrolloSostenibleService,
        private messageService: MessageService
    ) {
        this.filtroForm = this.fb.group({
            nombreObjetivoInstitucional: [''],
            nombrePlanNacional: [''],
            nombreODS: ['']
        });

        // Configurar suscripciones para cascada
        // Ya no hay cascada, se removió alineaciones
    }

    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Reportes y Visualización' }, { label: 'Objetivos Estratégicos' }];

        this.cargarDatosIniciales();
    }

    cargarDatosIniciales() {
        // Cargar objetivos institucionales
        this.objetivoInstitucionalService.getObjetivosInstitucionales().subscribe({
            next: (data: ObjetivoInstitucionalModel[]) => {
                this.objetivosInstitucionales = data.filter((obj) => obj.estado === EstadoObjetivosEstrategicos.Activo);
            },
            error: (error: any) => {
                console.error('Error al cargar objetivos institucionales:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los objetivos institucionales'
                });
            }
        });

        // Cargar planes nacionales
        this.planNacionalService.getPlanesNacionalesDesarrollo().subscribe({
            next: (data: PlanNacionalDesarrolloModel[]) => {
                this.planesNacionales = data;
            },
            error: (error: any) => {
                console.error('Error al cargar planes nacionales:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los planes nacionales'
                });
            }
        });

        // Cargar ODS
        this.odsService.getObjetivosDesarrolloSostenible().subscribe({
            next: (data: ObjetivoDesarrolloSostenibleModel[]) => {
                this.ods = data;
            },
            error: (error: any) => {
                console.error('Error al cargar ODS:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los ODS'
                });
            }
        });
    }

    buscarDatos() {
        this.cargandoDatos = true;

        // Convertir IDs a nombres para el filtro
        const filtro: FiltroObjetivoEstrategicoModel = {
            nombreObjetivoInstitucional: this.obtenerNombreObjetivoInstitucional(),
            nombrePlanNacional: this.obtenerNombrePlanNacional(),
            nombreODS: this.obtenerNombreODS(),
            nombreAlineacion: undefined
        };

        this.reporteService.getData(filtro).subscribe({
            next: (data) => {
                this.datos = data;
                this.cargandoDatos = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Se encontraron ${this.datos.length} registros`
                });
            },
            error: (error) => {
                console.error('Error al obtener datos:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los datos'
                });
                this.cargandoDatos = false;
            }
        });

    }

    obtenerNombreObjetivoInstitucional(): string | undefined {
        const id = this.filtroForm.get('nombreObjetivoInstitucional')?.value;
        return id ? this.objetivosInstitucionales.find((obj) => obj.id === id)?.nombre : undefined;
    }

    obtenerNombrePlanNacional(): string | undefined {
        const id = this.filtroForm.get('nombrePlanNacional')?.value;
        return id ? this.planesNacionales.find((plan) => plan.id === id)?.nombre : undefined;
    }

    obtenerNombreODS(): string | undefined {
        const id = this.filtroForm.get('nombreODS')?.value;
        return id ? this.ods.find((od) => od.id === id)?.nombre : undefined;
    }

    limpiarFiltros() {
        this.filtroForm.reset();
        this.datos = [];
        this.expandedRows.clear();
    }

    toggleRow(rowIndex: number) {
        if (this.expandedRows.has(rowIndex)) {
            this.expandedRows.delete(rowIndex);
        } else {
            this.expandedRows.add(rowIndex);
        }
    }

    isRowExpanded(rowIndex: number): boolean {
        return this.expandedRows.has(rowIndex);
    }

    getEstadoClass(estado: string): string {
        switch (estado.toLowerCase()) {
            case 'activo':
                return 'p-tag-success';
            case 'inactivo':
            case 'rechazado':
                return 'p-tag-danger';
            case 'pendiente revision':
            case 'pendiente autoridad':
                return 'p-tag-warning';
            default:
                return 'p-tag-secondary';
        }
    }

    exportarPDF() {
        if (this.datos.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'No hay datos para exportar'
            });
            return;
        }

        this.exportandoPDF = true;
        const filtro: FiltroObjetivoEstrategicoModel = {
            nombreObjetivoInstitucional: this.obtenerNombreObjetivoInstitucional(),
            nombrePlanNacional: this.obtenerNombrePlanNacional(),
            nombreODS: this.obtenerNombreODS(),
            nombreAlineacion: undefined
        };

        this.reporteService.exportToPDF(filtro).subscribe({
            next: (blob) => {
                this.descargarArchivo(blob, 'objetivos-estrategicos.pdf');
                this.exportandoPDF = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'PDF exportado correctamente'
                });
            },
            error: (error) => {
                console.error('Error al exportar PDF:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo exportar el PDF'
                });
                this.exportandoPDF = false;
            }
        });
    }

    exportarExcel() {
        if (this.datos.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'No hay datos para exportar'
            });
            return;
        }

        this.exportandoExcel = true;
        const filtro: FiltroObjetivoEstrategicoModel = {
            nombreObjetivoInstitucional: this.obtenerNombreObjetivoInstitucional(),
            nombrePlanNacional: this.obtenerNombrePlanNacional(),
            nombreODS: this.obtenerNombreODS(),
            nombreAlineacion: undefined
        };

        this.reporteService.exportToExcel(filtro).subscribe({
            next: (blob) => {
                this.descargarArchivo(blob, 'objetivos-estrategicos.xlsx');
                this.exportandoExcel = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Excel exportado correctamente'
                });
            },
            error: (error) => {
                console.error('Error al exportar Excel:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo exportar el Excel'
                });
                this.exportandoExcel = false;
            }
        });
    }

    exportarJSON() {
        if (this.datos.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'No hay datos para exportar'
            });
            return;
        }

        this.exportandoJSON = true;
        const filtro: FiltroObjetivoEstrategicoModel = {
            nombreObjetivoInstitucional: this.obtenerNombreObjetivoInstitucional(),
            nombrePlanNacional: this.obtenerNombrePlanNacional(),
            nombreODS: this.obtenerNombreODS(),
            nombreAlineacion: undefined
        };

        this.reporteService.exportToJSON(filtro).subscribe({
            next: (data) => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                this.descargarArchivo(blob, 'objetivos-estrategicos.json');
                this.exportandoJSON = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'JSON exportado correctamente'
                });
            },
            error: (error) => {
                console.error('Error al exportar JSON:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo exportar el JSON'
                });
                this.exportandoJSON = false;
            }
        });
    }

    private descargarArchivo(blob: Blob, nombreArchivo: string) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}
