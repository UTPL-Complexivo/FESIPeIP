import { Component, OnInit, OnDestroy, inject, computed, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ObjetivoInstitucionalService } from '../../../service/objetivo-institucional.service';
import { EstadoObjetivosEstrategicos } from '../../../shared/enums/estado-objetivos-estrategicos.enum';
import { ObjetivoInstitucionalModel } from '../../../models/objetivo-institucional.model';

@Component({
  selector: 'app-objetivos-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-lg">Estados de Objetivos Institucionales</h3>
        <div class="flex items-center gap-2">
          <button
            class="p-2 text-sm bg-primary text-primary-contrast rounded-md hover:bg-primary-600"
            (click)="cargarDatos()"
            [disabled]="loading()">
            <i class="pi pi-refresh" [class.pi-spin]="loading()"></i>
            Actualizar
          </button>
        </div>
      </div>

      <div class="chart-container">
        @if (loading()) {
          <div class="flex justify-center items-center h-80">
            <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
          </div>
        } @else if (objetivos().length > 0) {
          <p-chart type="doughnut" [data]="chartData()" [options]="chartOptions()" class="h-80" />

          <!-- Leyenda personalizada -->
          <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
            @for (item of estadisticas(); track item.estado) {
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded" [style.background-color]="item.color"></div>
                <span>{{ item.label }}: {{ item.count }}</span>
              </div>
            }
          </div>
        } @else {
          <div class="text-center text-muted-color py-8">
            <i class="pi pi-chart-pie text-4xl mb-2"></i>
            <p>No hay objetivos institucionales registrados</p>
          </div>
        }
      </div>
    </div>
  `
})
export class ObjetivosChartComponent implements OnInit, OnDestroy {
  private objetivoService = inject(ObjetivoInstitucionalService);

  loading = signal(false);
  objetivosData = signal<ObjetivoInstitucionalModel[]>([]);

  // Configuración de colores para cada estado
  private estadoColors = {
    [EstadoObjetivosEstrategicos.Activo]: '#22c55e',
    [EstadoObjetivosEstrategicos.PendienteRevision]: '#f59e0b',
    [EstadoObjetivosEstrategicos.PendienteAutoridad]: '#449fefff',
    [EstadoObjetivosEstrategicos.Inactivo]: '#6b7280',
    [EstadoObjetivosEstrategicos.Rechazado]: '#dc2626'
  };

  private estadoLabels = {
    [EstadoObjetivosEstrategicos.Activo]: 'Activo',
    [EstadoObjetivosEstrategicos.PendienteRevision]: 'Pendiente Revisión',
    [EstadoObjetivosEstrategicos.PendienteAutoridad]: 'Pendiente Autoridad',
    [EstadoObjetivosEstrategicos.Inactivo]: 'Inactivo',
    [EstadoObjetivosEstrategicos.Rechazado]: 'Rechazado'
  };

  objetivos = computed(() => this.objetivosData());

  estadisticas = computed(() => {
    const objetivos = this.objetivos();
    const estadoCounts = new Map<EstadoObjetivosEstrategicos, number>();

    // Inicializar contadores
    Object.values(EstadoObjetivosEstrategicos).forEach(estado => {
      if (typeof estado === 'number') {
        estadoCounts.set(estado, 0);
      }
    });

    // Contar objetivos por estado
    objetivos.forEach(objetivo => {
      const currentCount = estadoCounts.get(objetivo.estado) || 0;
      estadoCounts.set(objetivo.estado, currentCount + 1);
    });

    // Convertir a array para el template
    return Array.from(estadoCounts.entries())
      .filter(([, count]) => count > 0) // Solo mostrar estados con objetivos
      .map(([estado, count]) => ({
        estado,
        count,
        label: this.estadoLabels[estado],
        color: this.estadoColors[estado]
      }));
  });

  chartData = computed(() => {
    const stats = this.estadisticas();

    return {
      labels: stats.map(item => item.label),
      datasets: [{
        data: stats.map(item => item.count),
        backgroundColor: stats.map(item => item.color),
        borderColor: stats.map(item => item.color),
        borderWidth: 2
      }]
    };
  });

  chartOptions = computed(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Usamos nuestra propia leyenda
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            }
          }
        }
      }
    };
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  cargarDatos(): void {
    this.loading.set(true);

    this.objetivoService.getObjetivosInstitucionales().subscribe({
      next: (objetivos) => {
        this.objetivosData.set(objetivos);
        this.loading.set(false);
        console.log('📊 [ObjetivosChart] Objetivos cargados:', objetivos.length);
      },
      error: (error) => {
        console.error('❌ [ObjetivosChart] Error cargando objetivos:', error);
        this.objetivosData.set([]);
        this.loading.set(false);
      }
    });
  }
}
