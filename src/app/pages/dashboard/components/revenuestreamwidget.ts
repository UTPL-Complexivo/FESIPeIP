import { Component, OnInit, OnDestroy, inject, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { TipologiaModel } from '../../../models/tipologia.model';
import { ActividadModel } from '../../../models/actividad.model';
import { TipologiaActividadModel } from '../../../models/tipologia-actividad.model';
import { EstadoConfiguracionInstitucional } from '../../../shared/enums/estado-configuracion-institucional.enum';

@Component({
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule, CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Proyectos de Inversión</div>
        @if (loading()) {
            <div class="flex justify-center items-center h-80">
                <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
            </div>
        } @else {
            <p-chart type="bar" [data]="chartData()" [options]="chartOptions()" class="h-80" />
        }
    </div>`
})
export class RevenueStreamWidget implements OnInit, OnDestroy {
    private layoutService = inject(LayoutService);

    // Inputs para recibir toda la data
    tipologias = input<TipologiaModel[]>([]);
    actividades = input<ActividadModel[]>([]);
    tipologiasActividades = input<TipologiaActividadModel[]>([]);
    loading = input<boolean>(false);

    private subscription!: Subscription;

    chartData = computed(() => {
        const tipologiasData = this.tipologias();
        const actividadesData = this.actividades();
        const relacionesData = this.tipologiasActividades();

        if (tipologiasData.length === 0) return {};

        // Contar actividades por tipología
        const tipologiasConActividades = tipologiasData.map(tipologia => {
            const relacionesCount = relacionesData.filter(rel => rel.tipologiaId === tipologia.id).length;
            return {
                nombre: tipologia.nombre,
                codigo: tipologia.codigo,
                actividades: relacionesCount,
                estado: tipologia.estado
            };
        });

        // Separar tipologías activas e inactivas
        const tipologiasActivas = tipologiasConActividades.filter(t => t.estado === EstadoConfiguracionInstitucional.Activo);
        const tipologiasInactivas = tipologiasConActividades.filter(t => t.estado === EstadoConfiguracionInstitucional.Inactivo);

        const documentStyle = getComputedStyle(document.documentElement);

        return {
            labels: tipologiasConActividades.map(t => t.codigo),
            datasets: [
                {
                    type: 'bar',
                    label: 'Actividades por Tipología',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                    data: tipologiasConActividades.map(t => t.actividades),
                    barThickness: 32,
                    borderRadius: {
                        topLeft: 4,
                        topRight: 4,
                        bottomLeft: 0,
                        bottomRight: 0
                    }
                }
            ]
        };
    });

    chartOptions = computed(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        return {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                },
                title: {
                    display: true,
                    text: 'Distribución de Actividades por Tipología',
                    color: textColor
                },
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const tipologia = this.tipologias().find(t => t.codigo === context.label);
                            return `${tipologia?.nombre || context.label}: ${context.parsed.y} actividades`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textMutedColor,
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: 'transparent',
                        borderColor: 'transparent'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textMutedColor,
                        stepSize: 1
                    },
                    grid: {
                        color: borderColor,
                        borderColor: 'transparent',
                        drawTicks: false
                    }
                }
            }
        };
    });

    ngOnInit() {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            // Trigger chart update when layout changes
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
