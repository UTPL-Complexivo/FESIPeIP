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
import { FiltroMacroSectorModel } from '../../models/filtro-macro-sector.model';
import { ReporteMacroSectorModel } from '../../models/reporte-macrosector.model';
import { ReporteConfiguracionInstitucionalService } from '../../service/reporte-configuracion-institucional.service';
import { MacroSectorService } from '../../service/macro-sector.service';
import { SectorService } from '../../service/sector.service';
import { SubSectorService } from '../../service/sub-sector.service';
import { InstitucionService } from '../../service/institucion.service';
import { MacroSectorModel } from '../../models/macro-sector.model';
import { SectorModel } from '../../models/sector.model';
import { SubSectorModel } from '../../models/sub-sector.model';
import { InstitucionModel } from '../../models/institucion.model';

@Component({
    selector: 'app-configuracion-institucional',
    standalone: true,
    template: `
        <div class="card">
            <div class="col-12">
                <app-cabecera-principal [nuevo]="false" [items]="items" titulo="Reportes - Configuración Institucional" linkNuevo=""> </app-cabecera-principal>
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
                            <label for="macroSector">Macro Sector</label>
                            <p-select
                                id="macroSector"
                                formControlName="nombreMacroSector"
                                [options]="macroSectores"
                                placeholder="Seleccione un Macro Sector"
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
                            <label for="sector">Sector</label>
                            <p-select
                                id="sector"
                                formControlName="nombreSector"
                                [options]="sectores"
                                placeholder="Seleccione un Sector"
                                optionLabel="nombre"
                                optionValue="id"
                                [showClear]="true"
                                [filter]="true"
                                filterBy="nombre"
                                [disabled]="!filtroForm.get('nombreMacroSector')?.value"
                                class="w-full"
                            >
                            </p-select>
                        </div>

                        <div class="field col-12 md:col-3">
                            <label for="subsector">Subsector</label>
                            <p-select
                                id="subsector"
                                formControlName="nombreSubsector"
                                [options]="subsectores"
                                placeholder="Seleccione un Subsector"
                                optionLabel="nombre"
                                optionValue="id"
                                [showClear]="true"
                                [filter]="true"
                                filterBy="nombre"
                                [disabled]="!filtroForm.get('nombreSector')?.value"
                                class="w-full"
                            >
                            </p-select>
                        </div>

                        <div class="field col-12 md:col-3">
                            <label for="institucion">Institución</label>
                            <p-select
                                id="institucion"
                                formControlName="nombreInstitucion"
                                [options]="instituciones"
                                placeholder="Seleccione una Institución"
                                optionLabel="nombre"
                                optionValue="id"
                                [showClear]="true"
                                [filter]="true"
                                filterBy="nombre"
                                [disabled]="!filtroForm.get('nombreSubsector')?.value"
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
                <p-card header="Datos de Configuración Institucional">
                    <p-table
                        [value]="datosTabla"
                        [loading]="cargandoDatos"
                        [paginator]="true"
                        [rows]="10"
                        [rowsPerPageOptions]="[5, 10, 20, 50]"
                        [tableStyle]="{ 'min-width': '50rem' }"
                        [globalFilterFields]="['macroSector', 'sector', 'subsector', 'institucion', 'estado']"
                    >
                        <ng-template pTemplate="header">
                            <tr>
                                <th>Macro Sector</th>
                                <th>Sector</th>
                                <th>Subsector</th>
                                <th>Institución</th>
                                <th>Estado</th>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="body" let-fila>
                            <tr>
                                <td>{{ fila.macroSector }}</td>
                                <td>{{ fila.sector || '-' }}</td>
                                <td>{{ fila.subsector || '-' }}</td>
                                <td>{{ fila.institucion || '-' }}</td>
                                <td>
                                    <span class="p-tag" [class]="fila.estado === 'Activo' ? 'p-tag-success' : (fila.estado === 'Inactivo' ? 'p-tag-danger' : 'p-tag-secondary')">
                                        {{ fila.estado }}
                                    </span>
                                </td>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="5" class="text-center">No se encontraron datos. Utilice los filtros para buscar información.</td>
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
export class ConfiguracionInstitucionalComponent implements OnInit {
    items: MenuItem[] = [];
    filtroForm: FormGroup;
    datos: ReporteMacroSectorModel[] = [];
    datosTabla: any[] = [];
    cargandoDatos: boolean = false;
    exportandoPDF: boolean = false;
    exportandoExcel: boolean = false;
    exportandoJSON: boolean = false;

    // Listas para los selects en cascada
    macroSectores: MacroSectorModel[] = [];
    sectores: SectorModel[] = [];
    subsectores: SubSectorModel[] = [];
    instituciones: InstitucionModel[] = [];

    constructor(
        private fb: FormBuilder,
        private reporteService: ReporteConfiguracionInstitucionalService,
        private macroSectorService: MacroSectorService,
        private sectorService: SectorService,
        private subSectorService: SubSectorService,
        private institucionService: InstitucionService,
        private messageService: MessageService
    ) {
        this.filtroForm = this.fb.group({
            nombreMacroSector: [''],
            nombreSector: [''],
            nombreSubsector: [''],
            nombreInstitucion: ['']
        });

        // Configurar suscripciones para cascada
        this.setupCascadingDropdowns();
    }

    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Reportes y Visualización' }, { label: 'Configuración Institucional' }];

        this.cargarMacroSectores();
    }

    setupCascadingDropdowns() {
        // Cuando cambie el macro sector, cargar sectores
        this.filtroForm.get('nombreMacroSector')?.valueChanges.subscribe((macroSectorId) => {
            if (macroSectorId) {
                this.cargarSectores(macroSectorId);
            } else {
                this.sectores = [];
                this.subsectores = [];
                this.instituciones = [];
            }
            // Limpiar los campos dependientes
            this.filtroForm.patchValue({
                nombreSector: '',
                nombreSubsector: '',
                nombreInstitucion: ''
            });
        });

        // Cuando cambie el sector, cargar subsectores
        this.filtroForm.get('nombreSector')?.valueChanges.subscribe((sectorId) => {
            if (sectorId) {
                this.cargarSubsectores(sectorId);
            } else {
                this.subsectores = [];
                this.instituciones = [];
            }
            // Limpiar los campos dependientes
            this.filtroForm.patchValue({
                nombreSubsector: '',
                nombreInstitucion: ''
            });
        });

        // Cuando cambie el subsector, cargar instituciones
        this.filtroForm.get('nombreSubsector')?.valueChanges.subscribe((subsectorId) => {
            if (subsectorId) {
                this.cargarInstituciones(subsectorId);
            } else {
                this.instituciones = [];
            }
            // Limpiar el campo dependiente
            this.filtroForm.patchValue({
                nombreInstitucion: ''
            });
        });
    }

    cargarMacroSectores() {
        this.macroSectorService.getMacroSectores().subscribe({
            next: (data) => {
                this.macroSectores = data.filter((ms) => ms.estado === 'Activo');
            },
            error: (error) => {
                console.error('Error al cargar macro sectores:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los macro sectores'
                });
            }
        });
    }

    cargarSectores(macroSectorId: number) {
        this.sectorService.getSectoresByMacroSectorId(macroSectorId).subscribe({
            next: (data) => {
                this.sectores = data.filter((s) => s.estado === 'Activo');
            },
            error: (error) => {
                console.error('Error al cargar sectores:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los sectores'
                });
            }
        });
    }

    cargarSubsectores(sectorId: number) {
        this.subSectorService.getSubsectores().subscribe({
            next: (data) => {
                this.subsectores = data.filter((ss) => ss.estado === 'Activo' && ss.sectorId === sectorId);
            },
            error: (error) => {
                console.error('Error al cargar subsectores:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los subsectores'
                });
            }
        });
    }

    cargarInstituciones(subsectorId: number) {
        this.institucionService.getInstituciones().subscribe({
            next: (data) => {
                this.instituciones = data.filter((i) => i.estado === 'Activo' && i.subsectorId === subsectorId);
            },
            error: (error) => {
                console.error('Error al cargar instituciones:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las instituciones'
                });
            }
        });
    }

    buscarDatos() {
        this.cargandoDatos = true;

        // Convertir IDs a nombres para el filtro
        const filtro: FiltroMacroSectorModel = {
            nombreMacroSector: this.obtenerNombreMacroSector(),
            nombreSector: this.obtenerNombreSector(),
            nombreSubsector: this.obtenerNombreSubsector(),
            nombreInstitucion: this.obtenerNombreInstitucion()
        };

        this.reporteService.getData(filtro).subscribe({
            next: (data) => {
                this.datos = data;
                this.procesarDatosParaTabla(data);
                this.cargandoDatos = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Se encontraron ${this.datosTabla.length} registros`
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

    obtenerNombreMacroSector(): string | undefined {
        const id = this.filtroForm.get('nombreMacroSector')?.value;
        return id ? this.macroSectores.find((ms) => ms.id === id)?.nombre : undefined;
    }

    obtenerNombreSector(): string | undefined {
        const id = this.filtroForm.get('nombreSector')?.value;
        return id ? this.sectores.find((s) => s.id === id)?.nombre : undefined;
    }

    obtenerNombreSubsector(): string | undefined {
        const id = this.filtroForm.get('nombreSubsector')?.value;
        return id ? this.subsectores.find((ss) => ss.id === id)?.nombre : undefined;
    }

    obtenerNombreInstitucion(): string | undefined {
        const id = this.filtroForm.get('nombreInstitucion')?.value;
        return id ? this.instituciones.find((i) => i.id === id)?.nombre : undefined;
    }

    procesarDatosParaTabla(datos: ReporteMacroSectorModel[]) {
        this.datosTabla = [];

        datos.forEach((macroSector) => {
            // Si el macro sector no tiene sectores, mostrar solo el macro sector
            if (!macroSector.sectores || macroSector.sectores.length === 0) {
                this.datosTabla.push({
                    macroSector: macroSector.nombre,
                    sector: '',
                    subsector: '',
                    institucion: '',
                    estado: 'N/A'
                });
            } else {
                // Procesar cada sector
                macroSector.sectores.forEach((sector) => {
                    // Si el sector no tiene subsectores, mostrar hasta el nivel de sector
                    if (!sector.subsectores || sector.subsectores.length === 0) {
                        this.datosTabla.push({
                            macroSector: macroSector.nombre,
                            sector: sector.nombre,
                            subsector: '',
                            institucion: '',
                            estado: 'N/A'
                        });
                    } else {
                        // Procesar cada subsector
                        sector.subsectores.forEach((subsector) => {
                            // Si el subsector no tiene instituciones, mostrar hasta el nivel de subsector
                            if (!subsector.instituciones || subsector.instituciones.length === 0) {
                                this.datosTabla.push({
                                    macroSector: macroSector.nombre,
                                    sector: sector.nombre,
                                    subsector: subsector.nombre,
                                    institucion: '',
                                    estado: 'N/A'
                                });
                            } else {
                                // Procesar cada institución
                                subsector.instituciones.forEach((institucion) => {
                                    this.datosTabla.push({
                                        macroSector: macroSector.nombre,
                                        sector: sector.nombre,
                                        subsector: subsector.nombre,
                                        institucion: institucion.nombre,
                                        estado: institucion.estado
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    limpiarFiltros() {
        this.filtroForm.reset();
        this.datos = [];
        this.datosTabla = [];
        this.sectores = [];
        this.subsectores = [];
        this.instituciones = [];
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
        const filtro: FiltroMacroSectorModel = {
            nombreMacroSector: this.obtenerNombreMacroSector(),
            nombreSector: this.obtenerNombreSector(),
            nombreSubsector: this.obtenerNombreSubsector(),
            nombreInstitucion: this.obtenerNombreInstitucion()
        };

        this.reporteService.exportToPDF(filtro).subscribe({
            next: (blob) => {
                this.descargarArchivo(blob, 'configuracion-institucional.pdf');
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
        const filtro: FiltroMacroSectorModel = {
            nombreMacroSector: this.obtenerNombreMacroSector(),
            nombreSector: this.obtenerNombreSector(),
            nombreSubsector: this.obtenerNombreSubsector(),
            nombreInstitucion: this.obtenerNombreInstitucion()
        };

        this.reporteService.exportToExcel(filtro).subscribe({
            next: (blob) => {
                this.descargarArchivo(blob, 'configuracion-institucional.xlsx');
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
        const filtro: FiltroMacroSectorModel = {
            nombreMacroSector: this.obtenerNombreMacroSector(),
            nombreSector: this.obtenerNombreSector(),
            nombreSubsector: this.obtenerNombreSubsector(),
            nombreInstitucion: this.obtenerNombreInstitucion()
        };

        this.reporteService.exportToJSON(filtro).subscribe({
            next: (data) => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                this.descargarArchivo(blob, 'configuracion-institucional.json');
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
