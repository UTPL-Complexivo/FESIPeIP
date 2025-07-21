import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    selector: 'app-alineaciones-resumen',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
    template: `
        <div class="card h-full">
            <div class="flex justify-between items-center mb-4">
                <h5 class="font-bold text-xl text-gray-800 m-0">Resumen Detallado por Eje</h5>
                <i class="pi pi-list text-2xl text-primary-500"></i>
            </div>

            @if (loading) {
                <div class="flex justify-center items-center py-8">
                    <i class="pi pi-spin pi-spinner text-3xl text-primary-500"></i>
                </div>
            } @else if (alineacionesPorEje && alineacionesPorEje.length > 0) {
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    @for (eje of alineacionesPorEje; track eje.eje) {
                        <div class="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-4 h-4 rounded-full" [style.background-color]="eje.color"></div>
                                <span class="font-semibold text-gray-800">Eje {{ eje.eje }}</span>
                            </div>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Total:</span>
                                    <span class="font-medium">{{ eje.total }}</span>
                                </div>
                                @if (eje.activas > 0) {
                                    <div class="flex justify-between">
                                        <span class="text-green-600">Activas:</span>
                                        <span class="font-medium text-green-600">{{ eje.activas }}</span>
                                    </div>
                                }
                                @if (eje.pendientesRevision > 0) {
                                    <div class="flex justify-between">
                                        <span class="text-orange-600">Pendientes Revisión:</span>
                                        <span class="font-medium text-orange-600">{{ eje.pendientesRevision }}</span>
                                    </div>
                                }
                                @if (eje.pendientesAutoridad > 0) {
                                    <div class="flex justify-between">
                                        <span class="text-blue-600">Pendientes Autoridad:</span>
                                        <span class="font-medium text-blue-600">{{ eje.pendientesAutoridad }}</span>
                                    </div>
                                }
                                @if (eje.rechazadas > 0) {
                                    <div class="flex justify-between">
                                        <span class="text-red-600">Rechazadas:</span>
                                        <span class="font-medium text-red-600">{{ eje.rechazadas }}</span>
                                    </div>
                                }
                                @if (eje.inactivas > 0) {
                                    <div class="flex justify-between">
                                        <span class="text-gray-500">Inactivas:</span>
                                        <span class="font-medium text-gray-500">{{ eje.inactivas }}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            } @else {
                <div class="flex flex-col items-center justify-center py-8 text-gray-500">
                    <i class="pi pi-info-circle text-4xl mb-3"></i>
                    <p class="text-lg font-medium">No hay datos de resumen disponibles</p>
                </div>
            }
        </div>
    `
})
export class AlineacionesResumenComponent {
    @Input() alineacionesPorEje: AlineacionPorEje[] | null = null;
    @Input() loading: boolean = false;
}
