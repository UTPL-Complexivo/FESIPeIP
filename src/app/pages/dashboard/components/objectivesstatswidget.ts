import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EstadisticasObjetivos {
    totalObjetivosInstitucionales: number;
    objetivosInstitucionalesActivos: number;
    totalObjetivosDesarrolloSostenible: number;
    objetivosDesarrolloSostenibleActivos: number;
    totalPlanesNacionalesDesarrollo: number;
    planesNacionalesDesarrolloActivos: number;
}

@Component({
    standalone: true,
    selector: 'app-objectives-stats-widget',
    imports: [CommonModule],
    template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Objetivos Institucionales</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            <span *ngIf="estadisticas; else skeleton">{{ estadisticas.totalObjetivosInstitucionales }}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-flag text-green-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium" *ngIf="estadisticas">{{ estadisticas.objetivosInstitucionalesActivos }} activos </span>
                <span class="text-muted-color">planificados</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">ODS</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            <span *ngIf="estadisticas; else skeleton">{{ estadisticas.totalObjetivosDesarrolloSostenible }}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-teal-100 dark:bg-teal-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-globe text-teal-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium" *ngIf="estadisticas">{{ estadisticas.objetivosDesarrolloSostenibleActivos }} activos </span>
                <span class="text-muted-color">sostenibles</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Planes Nacionales</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            <span *ngIf="estadisticas; else skeleton">{{ estadisticas.totalPlanesNacionalesDesarrollo }}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-indigo-100 dark:bg-indigo-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-chart-line text-indigo-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium" *ngIf="estadisticas">{{ estadisticas.planesNacionalesDesarrolloActivos }} activos </span>
                <span class="text-muted-color">de desarrollo</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Alineación Total</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            <span *ngIf="estadisticas; else skeleton">{{ obtenerTotalAlineaciones() }}%</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-pink-100 dark:bg-pink-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-compass text-pink-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium" *ngIf="estadisticas">{{ obtenerObjetivosActivosTotal() }} objetivos </span>
                <span class="text-muted-color">estratégicos</span>
            </div>
        </div>

        <ng-template #skeleton>
            <div class="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
        </ng-template>`
})
export class ObjectivesStatsWidget {
    @Input() estadisticas: EstadisticasObjetivos | null = null;

    /**
     * Obtiene el porcentaje de objetivos activos del total
     */
    obtenerTotalAlineaciones(): number {
        if (!this.estadisticas) return 0;

        const totalObjetivos = this.estadisticas.totalObjetivosInstitucionales +
                              this.estadisticas.totalObjetivosDesarrolloSostenible +
                              this.estadisticas.totalPlanesNacionalesDesarrollo;

        const objetivosActivos = this.estadisticas.objetivosInstitucionalesActivos +
                               this.estadisticas.objetivosDesarrolloSostenibleActivos +
                               this.estadisticas.planesNacionalesDesarrolloActivos;

        return totalObjetivos > 0 ? Math.round((objetivosActivos / totalObjetivos) * 100) : 0;
    }

    /**
     * Obtiene el total de objetivos activos
     */
    obtenerObjetivosActivosTotal(): number {
        if (!this.estadisticas) return 0;

        return this.estadisticas.objetivosInstitucionalesActivos +
               this.estadisticas.objetivosDesarrolloSostenibleActivos +
               this.estadisticas.planesNacionalesDesarrolloActivos;
    }
}
