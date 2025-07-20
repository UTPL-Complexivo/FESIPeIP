import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { AlineacionModel } from '../../../models/alineacion.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AppDialogConfirmation } from '../../../layout/component/app.dialog-confirmation';
import { AlineacionService } from '../../../service/alineacion.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { EjeColorPipe } from '../../../pipes/eje-color.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { PlanNacionalDesarrolloService } from '../../../service/plan-nacional-desarrollo.service';
import { ObjetivoDesarrolloSostenibleService } from '../../../service/objetivo-desarrollo-sostenible.service';
import { PlanNacionalDesarrolloModel } from '../../../models/plan-nacional-desarrollo.model';
import { ObjetivoDesarrolloSostenibleModel } from '../../../models/objetivo-desarrollo-sostenible.model';

// Interfaz para las alineaciones individuales con información completa para agrupación
interface AlineacionCompleta extends AlineacionModel {
    pndEje: string;
    pndCompleto: string;
    iconoODS: string;
    nombreODS: string;
    grupoKey: string; // Para agrupación jerárquica
}

@Component({
    selector: 'app-alineacion',
    standalone: true,
    template: `
        <div class="card">
            <app-cabecera-principal [items]="items" titulo="Alineacion Objetivo Estratégico ↔ PND ↔ ODS" linkNuevo="/objetivo-estrategico/alineacion/nuevo"></app-cabecera-principal>
            <p-table
                #dt1
                [value]="alineacionesCompletas"
                sortField="grupoKey"
                sortMode="single"
                [tableStyle]="{ 'min-width': '80rem' }"
                [loading]="loading"
                [paginator]="true"
                [rows]="10"
                [rowsPerPageOptions]="[10, 20, 50]"
                rowGroupMode="subheader"
                groupRowsBy="grupoKey"
                [responsiveLayout]="'scroll'"
                [globalFilterFields]="['pndCompleto', 'nombreOI', 'nombreODS']"
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
                        <th style="width: 85%">Objetivo de Desarrollo Sostenible</th>
                    </tr>
                </ng-template>
                <ng-template #groupheader let-alineacion>
                    <tr pRowGroupHeader>
                        <td colspan="2">
                            <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4" [style.border-left-color]="alineacion.pndEje | ejeColor:'hex'">
                                <div class="flex items-center gap-3">
                                    <div class="w-4 h-4 rounded-full" [style.background-color]="alineacion.pndEje | ejeColor:'hex'"></div>
                                    <div class="flex flex-col">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span [class]="'px-2 py-1 rounded text-white text-xs font-semibold ' + (alineacion.pndEje | ejeColor:'background')">
                                                EJE {{ alineacion.pndEje }}
                                            </span>
                                        </div>
                                        <span class="font-bold text-lg text-gray-800">{{ alineacion.pndCompleto }}</span>
                                        <span class="text-sm text-gray-600 font-medium">{{ alineacion.nombreOI }}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #body let-alineacion>
                    <tr>
                        <td>
                            <div class="flex gap-2 justify-center">
                                <button pButton icon="pi pi-pencil" size="small"
                                        class="p-button-rounded p-button-success p-button-text"
                                        [routerLink]="['/objetivo-estrategico/alineacion/editar', alineacion.id]"
                                        pTooltip="Editar alineación" tooltipPosition="top"></button>
                                <button pButton icon="pi pi-trash" size="small"
                                        class="p-button-rounded p-button-danger p-button-text"
                                        (click)="deleteItem(alineacion.id, alineacion.pndCompleto, alineacion.nombreOI, alineacion.nombreODS)"
                                        pTooltip="Eliminar alineación" tooltipPosition="top"></button>
                            </div>
                        </td>
                        <td>
                            <div class="flex items-center gap-3">
                                <img [src]="alineacion.iconoODS" [alt]="alineacion.nombreODS"
                                     class="w-12 h-12 rounded-lg shadow-md"
                                     [pTooltip]="alineacion.nombreODS" tooltipPosition="top" />
                                <span class="font-medium">{{ alineacion.nombreODS }}</span>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="2">Al momento no se dispone de información.</td>
                    </tr>
                </ng-template>
                <ng-template #loadingbody>
                    <tr>
                        <td colspan="2">Cargando informacion. Por favor espere.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast position="top-right"></p-toast>
        <app-dialog-confirmation [displayMotivoDialog]="displayMotivoDialog" [inactivar]="inactivar" [tituloMotivo]="tituloMotivo" [id]="idAEliminar" (cerrarDialogo)="dialogo($event)" (save)="confirmarEliminacion($event)"></app-dialog-confirmation>
    `,
    imports: [AppCabeceraPrincipal, TableModule, IconFieldModule, InputIconModule, RouterModule, ToastModule, AppDialogConfirmation, InputTextModule, ButtonModule, EjeColorPipe, TooltipModule],
    providers: [ConfirmationService, MessageService]
})
export class AlineacionComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] = [{ icon: 'pi pi-home', route: '/' }, { label: 'Objetivos Estratégicos' }, { label: 'Alineaciones' }];
    alineaciones: AlineacionModel[] = [];
    alineacionesCompletas: AlineacionCompleta[] = [];
    planesNacionalesDesarrollo: PlanNacionalDesarrolloModel[] = [];
    objetivosDesarrolloSostenible: ObjetivoDesarrolloSostenibleModel[] = [];
    loading: boolean = true;
    displayMotivoDialog: boolean = false;
    inactivar: boolean = false;
    tituloMotivo: string = '';
    idAEliminar: number = 0;

    constructor(
        private alineacionService: AlineacionService,
        private planNacionalDesarrolloService: PlanNacionalDesarrolloService,
        private objetivoDesarrolloSostenibleService: ObjetivoDesarrolloSostenibleService
    ) {}
    ngOnInit(): void {
        this.loading = true;
        // Cargar todos los datos necesarios en paralelo
        forkJoin({
            alineaciones: this.alineacionService.getAlineaciones(),
            planesNacionalesDesarrollo: this.planNacionalDesarrolloService.getPlanesNacionalesDesarrollo(),
            objetivosDesarrolloSostenible: this.objetivoDesarrolloSostenibleService.getObjetivosDesarrolloSostenible()
        }).subscribe({
            next: (data) => {
                this.alineaciones = data.alineaciones;
                this.planesNacionalesDesarrollo = data.planesNacionalesDesarrollo;
                this.objetivosDesarrolloSostenible = data.objetivosDesarrolloSostenible;

                // Preparar las alineaciones completas para agrupación
                this.prepararAlineacionesCompletas();
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching data:', error);
                this.loading = false;
            }
        });
    }

    private prepararAlineacionesCompletas(): void {
        this.alineacionesCompletas = this.alineaciones.map(alineacion => {
            // Buscar el PND completo para obtener el eje
            const pnd = this.planesNacionalesDesarrollo.find(p => p.id === alineacion.planNacionalDesarrolloId);
            const ods = this.objetivosDesarrolloSostenible.find(o => o.id === alineacion.objetivoDesarrolloSostenibleId);

            const alineacionCompleta: AlineacionCompleta = {
                ...alineacion,
                pndEje: pnd?.eje || '',
                pndCompleto: alineacion.nombrePND || pnd?.nombre || '',
                iconoODS: alineacion.iconoODS || ods?.icono || '',
                nombreODS: alineacion.nombreODS || ods?.nombre || '',
                grupoKey: `${alineacion.nombrePND || pnd?.nombre || ''} - ${alineacion.nombreOI || ''}`
            };

            return alineacionCompleta;
        });

        // Ordenar por PND, luego por OI para que la agrupación funcione correctamente
        this.alineacionesCompletas.sort((a, b) => {
            const pndComparison = a.pndCompleto.localeCompare(b.pndCompleto);
            if (pndComparison !== 0) return pndComparison;
            return a.nombreOI.localeCompare(b.nombreOI);
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    deleteItem(alineacionId: number, pndNombre: string, oiNombre: string, odsNombre: string) {
        this.idAEliminar = alineacionId;
        this.displayMotivoDialog = true;
        this.inactivar = true;
        this.tituloMotivo = `¿Está seguro de eliminar la alineación "${pndNombre} → ${oiNombre} → ${odsNombre}"?`;
    }

    updateEstado(alineacionId: number) {
        // Implementar lógica para cambiar estado si es necesario

    }

    confirmarEliminacion(evento: any) {
        if (evento.confirmar) {
            // Aquí iría la lógica para eliminar la alineación
            const motivo = { motivo: evento.motivo || 'Eliminación solicitada por el usuario' };
            this.alineacionService.deleteAlineacion(this.idAEliminar, motivo).subscribe({
                next: () => {
                    // Recargar solo las alineaciones y reagrupar
                    this.alineacionService.getAlineaciones().subscribe({
                        next: (alineaciones) => {
                            this.alineaciones = alineaciones;
                            this.prepararAlineacionesCompletas();

                        }
                    });
                },
                error: (error) => {
                    console.error('Error al eliminar alineación:', error);
                }
            });
        }
        this.displayMotivoDialog = false;
    }
    dialogo($event: boolean) {
        this.displayMotivoDialog = $event;
        if ($event) {
            this.inactivar = false;
            this.tituloMotivo = '';
            this.idAEliminar = 0;
        }
    }
}
