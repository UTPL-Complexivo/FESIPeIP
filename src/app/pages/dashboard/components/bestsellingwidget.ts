import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { InstitucionService } from '../../../service/institucion.service';
import { InstitucionModel } from '../../../models/institucion.model';
import { forkJoin } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule, ButtonModule, MenuModule],
    template: ` <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Distribución de Instituciones por Macrosector</div>
            <div>
                <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
                <p-menu #menu [popup]="true" [model]="items"></p-menu>
            </div>
        </div>

        @if (loading()) {
            <div class="flex justify-center items-center h-48">
                <i class="pi pi-spin pi-spinner text-2xl text-blue-500"></i>
                <span class="ml-2 text-gray-500">Cargando datos...</span>
            </div>
        } @else {
            <ul class="list-none p-0 m-0">
                @for (macrosector of macrosectoresData(); track macrosector.nombre) {
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">{{ macrosector.nombre }}</span>
                            <div class="mt-1 text-muted-color">{{ macrosector.cantidad }} instituciones</div>
                        </div>
                        <div class="mt-2 md:mt-0 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="h-full" [style.width.%]="macrosector.porcentaje" [style.background-color]="macrosector.color"></div>
                            </div>
                            <span class="ml-4 font-medium" [style.color]="macrosector.color">{{ macrosector.porcentaje }}%</span>
                        </div>
                    </li>
                } @empty {
                    <li class="text-center py-8 text-gray-500">
                        <i class="pi pi-info-circle text-2xl block mb-2"></i>
                        <span>No hay datos disponibles</span>
                    </li>
                }
            </ul>
        }
    </div>`
})
export class BestSellingWidget implements OnInit {
    menu = null;
    loading = signal(false);
    macrosectoresData = signal<any[]>([]);

    // Colores para los diferentes macrosectores
    private colores = [
        '#f97316', // orange-500
        '#06b6d4', // cyan-500
        '#ec4899', // pink-500
        '#10b981', // green-500
        '#8b5cf6', // purple-500
        '#14b8a6', // teal-500
        '#f59e0b', // amber-500
        '#ef4444', // red-500
        '#3b82f6', // blue-500
        '#84cc16'  // lime-500
    ];

    items = [
        { label: 'Actualizar', icon: 'pi pi-fw pi-refresh' },
        { label: 'Exportar', icon: 'pi pi-fw pi-download' }
    ];

    constructor(private institucionService: InstitucionService) {}

    ngOnInit(): void {
        this.cargarDatosMacrosectores();
    }

    private cargarDatosMacrosectores(): void {
        this.loading.set(true);

        this.institucionService.getInstituciones().subscribe({
            next: (instituciones) => {
                const datosPorMacrosector = this.procesarDatosMacrosectores(instituciones);
                this.macrosectoresData.set(datosPorMacrosector);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error al cargar instituciones:', error);
                this.loading.set(false);
            }
        });
    }

    private procesarDatosMacrosectores(instituciones: InstitucionModel[]): any[] {
        // Agrupar instituciones por macrosector
        const agrupados = instituciones.reduce((acc, institucion) => {
            const macrosector = institucion.nombreMacroSector || 'Sin Macrosector';
            if (!acc[macrosector]) {
                acc[macrosector] = 0;
            }
            acc[macrosector]++;
            return acc;
        }, {} as Record<string, number>);

        const total = instituciones.length;

        // Convertir a array y calcular porcentajes
        const resultado = Object.entries(agrupados)
            .map(([nombre, cantidad], index) => ({
                nombre,
                cantidad,
                porcentaje: Math.round((cantidad / total) * 100),
                color: this.colores[index % this.colores.length]
            }))
            .sort((a, b) => b.cantidad - a.cantidad); // Ordenar por cantidad descendente

        return resultado;
    }
}
