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
import { AppCabeceraPrincipal } from '../../layout/component/app.cabecera-principal';
import { AppToolbarReporte } from '../../layout/component/app.toolbar-reporte';
import { FiltroTipologiaModel } from '../../models/filtro-tipologia.model';
import { ReporteTipologiaModel } from '../../models/reporte-tipologia.model';
import { ReporteTipologiaService } from '../../service/reporte-tipologia.service';
import { TipologiaService } from '../../service/tipologia.service';
import { TipologiaActividadService } from '../../service/tipologia-actividad.service';
import { TipologiaModel } from '../../models/tipologia.model';
import { TipologiaActividadModel } from '../../models/tipologia-actividad.model';
import { EstadoConfiguracionInstitucional } from '../../shared/enums/estado-configuracion-institucional.enum';

@Component({
    selector: 'app-tipologia',
    standalone: true,
    template: `
        <div class="card">
            <div class="col-12">
                <app-cabecera-principal [nuevo]="false" [items]="items" titulo="Reportes - Tipologías" linkNuevo=""> </app-cabecera-principal>
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
                            <label for="tipologia">Tipología</label>
                            <p-select
                                id="tipologia"
                                formControlName="tipologiaNombre"
                                [options]="tipologias"
                                placeholder="Seleccione una Tipología"
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
                            <label for="actividad">Actividad</label>
                            <p-select
                                id="actividad"
                                formControlName="actividadNombre"
                                [options]="actividades"
                                placeholder="Seleccione una Actividad"
                                optionLabel="actividadNombre"
                                optionValue="actividadNombre"
                                [showClear]="true"
                                [filter]="true"
                                filterBy="actividadNombre"
                                class="w-full"
                            >
                            </p-select>
                        </div>

                        <div class="field col-12 md:col-3">
                            <label for="estado">Estado</label>
                            <p-select
                                id="estado"
                                formControlName="estado"
                                [options]="estadosOptions"
                                placeholder="Seleccione un Estado"
                                optionLabel="label"
                                optionValue="value"
                                [showClear]="true"
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
                <p-card header="Datos de Tipologías">
                    <p-table
                        [value]="datos"
                        [loading]="cargandoDatos"
                        [paginator]="true"
                        [rows]="10"
                        [rowsPerPageOptions]="[5, 10, 20, 50]"
                        [tableStyle]="{ 'min-width': '50rem' }"
                        [globalFilterFields]="['codigo', 'nombre', 'descripcion', 'nombreEstado']"
                    >
                        <ng-template pTemplate="header">
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Fecha Creación</th>
                                <th>Fecha Actualización</th>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="body" let-fila>
                            <tr>
                                <td>{{ fila.codigo }}</td>
                                <td>{{ fila.nombre }}</td>
                                <td>{{ fila.descripcion | slice:0:100 }}{{ fila.descripcion?.length > 100 ? '...' : '' }}</td>
                                <td>
                                    <span class="p-tag" [class]="getEstadoClass(fila.estado)">
                                        {{ fila.nombreEstado }}
                                    </span>
                                </td>
                                <td>{{ fila.fechaCreacion | date:'dd/MM/yyyy' }}</td>
                                <td>{{ fila.fechaActualizacion | date:'dd/MM/yyyy' }}</td>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="6" class="text-center">No se encontraron datos. Utilice los filtros para buscar información.</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            </div>
        </div>

        <p-toast position="top-right"></p-toast>
    `,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonModule, CardModule, SelectModule, InputTextModule, TableModule, ToastModule, AppCabeceraPrincipal, AppToolbarReporte],
    providers: [MessageService]
})
export class TipologiaComponent implements OnInit {
    items: MenuItem[] = [];
    filtroForm: FormGroup;
    datos: ReporteTipologiaModel[] = [];
    cargandoDatos: boolean = false;
    exportandoPDF: boolean = false;
    exportandoExcel: boolean = false;
    exportandoJSON: boolean = false;

    // Listas para los selects
    tipologias: TipologiaModel[] = [];
    actividades: TipologiaActividadModel[] = [];
    estadosOptions = [
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' }
    ];

    constructor(
        private fb: FormBuilder,
        private reporteService: ReporteTipologiaService,
        private tipologiaService: TipologiaService,
        private tipologiaActividadService: TipologiaActividadService,
        private messageService: MessageService
    ) {
        this.filtroForm = this.fb.group({
            tipologiaNombre: [''],
            actividadNombre: [''],
            estado: ['']
        });
    }

    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Reportes y Visualización' }, { label: 'Tipologías' }];

        this.cargarDatosIniciales();
    }

    cargarDatosIniciales() {
        // Cargar tipologías
        this.tipologiaService.getTipologias().subscribe({
            next: (data: TipologiaModel[]) => {
                this.tipologias = data.filter((tip) => tip.estado === EstadoConfiguracionInstitucional.Activo);
            },
            error: (error: any) => {
                console.error('Error al cargar tipologías:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las tipologías'
                });
            }
        });

        // Cargar actividades
        this.tipologiaActividadService.getTipologiasActividades().subscribe({
            next: (data: TipologiaActividadModel[]) => {
                this.actividades = data;
            },
            error: (error: any) => {
                console.error('Error al cargar actividades:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las actividades'
                });
            }
        });
    }

    buscarDatos() {
        this.cargandoDatos = true;

        // Convertir IDs a nombres para el filtro
        const filtro: FiltroTipologiaModel = {
            tipologiaNombre: this.obtenerNombreTipologia(),
            actividadNombre: this.filtroForm.get('actividadNombre')?.value || undefined,
            estado: this.filtroForm.get('estado')?.value || undefined
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

    obtenerNombreTipologia(): string | undefined {
        const id = this.filtroForm.get('tipologiaNombre')?.value;
        return id ? this.tipologias.find((tip) => tip.id === id)?.nombre : undefined;
    }

    limpiarFiltros() {
        this.filtroForm.reset();
        this.datos = [];
    }

    getEstadoClass(estado: EstadoConfiguracionInstitucional): string {
        switch (estado) {
            case EstadoConfiguracionInstitucional.Activo:
                return 'p-tag-success';
            case EstadoConfiguracionInstitucional.Inactivo:
                return 'p-tag-danger';
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
        const filtro: FiltroTipologiaModel = {
            tipologiaNombre: this.obtenerNombreTipologia(),
            actividadNombre: this.filtroForm.get('actividadNombre')?.value || undefined,
            estado: this.filtroForm.get('estado')?.value || undefined
        };

        this.reporteService.exportToPDF(filtro).subscribe({
            next: (blob) => {
                this.descargarArchivo(blob, 'tipologias.pdf');
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
        const filtro: FiltroTipologiaModel = {
            tipologiaNombre: this.obtenerNombreTipologia(),
            actividadNombre: this.filtroForm.get('actividadNombre')?.value || undefined,
            estado: this.filtroForm.get('estado')?.value || undefined
        };

        this.reporteService.exportToExcel(filtro).subscribe({
            next: (blob) => {
                this.descargarArchivo(blob, 'tipologias.xlsx');
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
        const filtro: FiltroTipologiaModel = {
            tipologiaNombre: this.obtenerNombreTipologia(),
            actividadNombre: this.filtroForm.get('actividadNombre')?.value || undefined,
            estado: this.filtroForm.get('estado')?.value || undefined
        };

        this.reporteService.exportToJSON(filtro).subscribe({
            next: (data) => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                this.descargarArchivo(blob, 'tipologias.json');
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
