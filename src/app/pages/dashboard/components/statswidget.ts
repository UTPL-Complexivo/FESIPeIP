import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para configurar cada card de estadísticas
 */
export interface StatCard {
    titulo: string;
    valor: number | string;
    subtitulo?: string;
    sufijo?: string;
    icono: string;
    colorIcono: string;
    colorFondo: string;
    loading?: boolean;
}

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `
        @for (card of cards; track card.titulo) {
            <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">{{ card.titulo }}</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                                <span *ngIf="!card.loading; else skeleton">{{ card.valor }}{{ card.sufijo || '' }}</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-center {{ card.colorFondo }} rounded-border" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi {{ card.icono }} {{ card.colorIcono }} !text-xl"></i>
                        </div>
                    </div>
                    <span class="text-primary font-medium" *ngIf="card.subtitulo && !card.loading">{{ card.subtitulo }}</span>
                </div>
            </div>
        }

        <ng-template #skeleton>
            <div class="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
        </ng-template>
    `
})
export class StatsWidget {
    @Input() cards: StatCard[] = [];

    /**
     * Utilidad para obtener el porcentaje de elementos activos
     */
    static obtenerPorcentajeActivos(activos: number, total: number): number {
        return total > 0 ? Math.round((activos / total) * 100) : 0;
    }
}
