import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { forkJoin } from 'rxjs';
import { AlineacionService } from '../../../service/alineacion.service';
import { PlanNacionalDesarrolloService } from '../../../service/plan-nacional-desarrollo.service';
import { UsuarioService } from '../../../service/usuario.service';
import { AlineacionModel } from '../../../models/alineacion.model';
import { PlanNacionalDesarrolloModel } from '../../../models/plan-nacional-desarrollo.model';
import { UsuarioModel } from '../../../models/usuario.model';
import { EstadoObjetivosEstrategicos } from '../../../shared/enums/estado-objetivos-estrategicos.enum';

interface AlineacionPorEje {
    eje: string;
    total: number;
    activas: number;
    pendientesRevision: number;
    pendientesAutoridad: number;
    rechazadas: number;
    inactivas: number;
    color: string;
}

@Component({
    selector: 'app-alineaciones-chart',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ChartModule],
    template: `
        <div class="card h-full flex flex-col">
            <div class="flex justify-between items-center mb-4 flex-shrink-0">
                <h5 class="font-bold text-xl text-gray-800 m-0">Alineaciones por Eje</h5>
                <i class="pi pi-compass text-2xl text-primary-500"></i>
            </div>

            @if (loading()) {
                <div class="flex justify-center items-center flex-1">
                    <i class="pi pi-spin pi-spinner text-3xl text-primary-500"></i>
                </div>
            } @else if (radarChartData()) {
                <!-- Gráfico de Araña por Estado -->
                <div class="flex-1 min-h-0">
                    <p-chart type="radar" [data]="radarChartData()" [options]="radarChartOptions()"
                             class="w-full h-full"></p-chart>
                </div>
            } @else {
                <div class="flex flex-col items-center justify-center flex-1 text-gray-500">
                    <i class="pi pi-chart-bar text-4xl mb-3"></i>
                    <p class="text-lg font-medium">No hay alineaciones disponibles</p>
                </div>
            }
        </div>
    `
})
export class AlineacionesChartComponent implements OnInit {
    // Servicios inyectados
    private alineacionService = inject(AlineacionService);
    private planNacionalDesarrolloService = inject(PlanNacionalDesarrolloService);
    private usuarioService = inject(UsuarioService);

    // Mapa de colores para ejes (replicando la lógica del pipe)
    private colorMap: { [key: string]: string } = {
        'Social': '#8b5cf6',
        'Desarrollo Económico': '#14b8a6',
        'Infraestructura, Energia y Medio Ambiente': '#0ea5e9',
        'Institucional': '#6366f1',
        'Gestión de Riesgos': '#eab308'
    };

    // Método para obtener el color de un eje
    private getEjeColor(eje: string): string {
        return this.colorMap[eje] || '#6b7280';
    }

    // Método para obtener las iniciales de un eje
    private getEjeIniciales(eje: string): string {
        const iniciales: { [key: string]: string } = {
            'Social': 'SOC',
            'Desarrollo Económico': 'DE',
            'Infraestructura, Energia y Medio Ambiente': 'IEMA',
            'Institucional': 'INST',
            'Gestión de Riesgos': 'GR'
        };
        return iniciales[eje] || eje.substring(0, 3).toUpperCase();
    }

    // Signals para el estado
    loading = signal<boolean>(true);
    alineaciones = signal<AlineacionModel[]>([]);
    planesNacionalesDesarrollo = signal<PlanNacionalDesarrolloModel[]>([]);
    usuarioActual = signal<UsuarioModel | null>(null);
    alineacionesPorEje = signal<AlineacionPorEje[]>([]);

    // Computed para verificar roles
    esRevisor = computed(() => {
        const usuario = this.usuarioActual();
        return usuario?.roles?.includes('Revisor') || false;
    });

    esAutoridadValidante = computed(() => {
        const usuario = this.usuarioActual();
        return usuario?.roles?.includes('Autoridad') || false;
    });

    // Computed para datos del gráfico de araña (radar)
    radarChartData = computed(() => {
        const alineaciones = this.alineacionesPorEje();
        if (alineaciones.length === 0) return null;

        return {
            labels: alineaciones.map(a => this.getEjeIniciales(a.eje)),
            datasets: [
                {
                    label: 'Activas',
                    data: alineaciones.map(a => a.activas),
                    backgroundColor: 'rgba(16, 185, 129, 0.3)',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#059669',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Pendientes Revisión',
                    data: alineaciones.map(a => a.pendientesRevision),
                    backgroundColor: 'rgba(245, 158, 11, 0.3)',
                    borderColor: '#f59e0b',
                    borderWidth: 2,
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#d97706',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Pendientes Autoridad',
                    data: alineaciones.map(a => a.pendientesAutoridad),
                    backgroundColor: 'rgba(59, 130, 246, 0.3)',
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#2563eb',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Rechazadas',
                    data: alineaciones.map(a => a.rechazadas),
                    backgroundColor: 'rgba(239, 68, 68, 0.3)',
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#dc2626',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Inactivas',
                    data: alineaciones.map(a => a.inactivas),
                    backgroundColor: 'rgba(107, 114, 128, 0.3)',
                    borderColor: '#6b7280',
                    borderWidth: 2,
                    pointBackgroundColor: '#6b7280',
                    pointBorderColor: '#4b5563',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        };
    });

    // Opciones para el gráfico de araña (radar)
    radarChartOptions = computed(() => ({
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        },
        plugins: {
            title: {
                display: false
            },
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                callbacks: {
                    title: (context: any) => {
                        const alineaciones = this.alineacionesPorEje();
                        const index = context[0].dataIndex;
                        return `Eje ${alineaciones[index]?.eje || context[0].label}`;
                    },
                    label: (context: any) => {
                        return `${context.dataset.label}: ${context.parsed.r} alineaciones`;
                    }
                }
            }
        },
        interaction: {
            mode: 'point',
            intersect: false
        },
        scales: {
            r: {
                beginAtZero: true,
                min: 0,
                grid: {
                    color: 'rgba(156, 163, 175, 0.3)',
                    lineWidth: 1
                },
                angleLines: {
                    color: 'rgba(156, 163, 175, 0.5)',
                    lineWidth: 1
                },
                pointLabels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    color: '#374151',
                    padding: 15
                },
                ticks: {
                    stepSize: 1,
                    font: {
                        size: 11
                    },
                    color: '#6b7280',
                    backdropColor: 'rgba(255, 255, 255, 0.8)',
                    backdropPadding: 2,
                    showLabelBackdrop: true
                }
            }
        },
        elements: {
            line: {
                tension: 0.1
            },
            point: {
                radius: 6,
                hoverRadius: 9
            }
        }
    }));

    ngOnInit(): void {
        this.cargarDatos();
    }

    private cargarDatos(): void {
        this.loading.set(true);

        forkJoin({
            alineaciones: this.alineacionService.getAlineaciones(),
            planesNacionalesDesarrollo: this.planNacionalDesarrolloService.getPlanesNacionalesDesarrollo(),
            usuarioActual: this.usuarioService.getMe()
        }).subscribe({
            next: (data) => {
                this.alineaciones.set(data.alineaciones);
                this.planesNacionalesDesarrollo.set(data.planesNacionalesDesarrollo);
                this.usuarioActual.set(data.usuarioActual);

                this.procesarAlineacionesPorEje();
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error al cargar datos de alineaciones:', error);
                this.loading.set(false);
            }
        });
    }

    private procesarAlineacionesPorEje(): void {
        const alineaciones = this.alineaciones();
        const planes = this.planesNacionalesDesarrollo();

        // Mostrar TODAS las alineaciones sin filtrar por rol
        // El gráfico debe mostrar el panorama completo de todos los estados
        const alineacionesFiltradas = alineaciones;

        // Crear mapa de ejes desde los planes nacionales
        const ejesPorPlan = new Map<number, string>();
        planes.forEach(plan => {
            ejesPorPlan.set(plan.id, plan.eje);
        });

        // Agrupar alineaciones por eje
        const alineacionesPorEje = new Map<string, AlineacionPorEje>();

        alineacionesFiltradas.forEach(alineacion => {
            const eje = ejesPorPlan.get(alineacion.planNacionalDesarrolloId) || 'Sin Eje';

            if (!alineacionesPorEje.has(eje)) {
                alineacionesPorEje.set(eje, {
                    eje,
                    total: 0,
                    activas: 0,
                    pendientesRevision: 0,
                    pendientesAutoridad: 0,
                    rechazadas: 0,
                    inactivas: 0,
                    color: this.getEjeColor(eje)
                });
            }

            const ejeData = alineacionesPorEje.get(eje)!;
            ejeData.total++;

            // Contar por estado
            switch (alineacion.estado) {
                case EstadoObjetivosEstrategicos.Activo:
                    ejeData.activas++;
                    break;
                case EstadoObjetivosEstrategicos.PendienteRevision:
                    ejeData.pendientesRevision++;
                    break;
                case EstadoObjetivosEstrategicos.PendienteAutoridad:
                    ejeData.pendientesAutoridad++;
                    break;
                case EstadoObjetivosEstrategicos.Rechazado:
                    ejeData.rechazadas++;
                    break;
                case EstadoObjetivosEstrategicos.Inactivo:
                    ejeData.inactivas++;
                    break;
            }
        });

        // Convertir a array y ordenar por eje
        const alineacionesArray = Array.from(alineacionesPorEje.values())
            .sort((a, b) => a.eje.localeCompare(b.eje));

        this.alineacionesPorEje.set(alineacionesArray);
    }
}
