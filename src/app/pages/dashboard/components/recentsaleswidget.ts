import { Component, Input } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InstitucionModel } from '../../../models/institucion.model';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Últimas Instituciones Activas</div>
        <p-table [value]="instituciones" [paginator]="true" [rows]="5" responsiveLayout="scroll" [loading]="loading">
            <ng-template #header>
                <tr>
                    <th>Código</th>
                    <th pSortableColumn="nombre">Institución <p-sortIcon field="nombre"></p-sortIcon></th>
                    <th>Macro Sector</th>
                    <th>Nivel Gobierno</th>
                </tr>
            </ng-template>
            <ng-template #body let-institucion>
                <tr>
                    <td style="width: 15%; min-width: 5rem;">
                        <span class="font-medium text-sm">{{ institucion.codigo }}</span>
                    </td>
                    <td style="width: 45%; min-width: 10rem;">
                        <div class="flex flex-col">
                            <span class="font-medium">{{ institucion.nombre }}</span>
                            <span class="text-sm text-muted-color">{{ institucion.nombreSubsector }}</span>
                        </div>
                    </td>
                    <td style="width: 25%; min-width: 8rem;">
                        <span class="text-sm">{{ institucion.nombreMacroSector }}</span>
                    </td>
                    <td style="width: 15%; min-width: 6rem;">
                        <span class="text-sm">{{ institucion.nivelGobierno }}</span>
                    </td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td colspan="4" class="text-center py-4">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-building text-4xl text-muted-color"></i>
                            <span class="text-muted-color">No hay instituciones activas registradas</span>
                        </div>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: []
})
export class RecentSalesWidget {
    @Input() instituciones: InstitucionModel[] = [];
    @Input() loading: boolean = false;

    constructor() {}

    /**
     * Método para refrescar la lista de instituciones (opcional para uso futuro)
     */
    refrescarInstituciones(): void {
        // Este método podría emitir un evento al componente padre si es necesario
        console.log('Solicitud de refrescar instituciones');
    }
}
