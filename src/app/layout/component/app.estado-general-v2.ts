import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { EjeColorPipe } from '../../pipes/eje-color.pipe';

@Component({
    selector: 'app-estado-general-v2',
    standalone: true,
    template: `@if (estado === 'Activo') {
            <p-badge value="Activo" severity="success" badgeSize="large" />
        } @else if (estado === 'Inactivo') {
            <p-badge value="Inactivo" severity="danger" badgeSize="large" />
        } @else if (isEjeEstrategico(estado)) {
            <span [class]="'text-white text-sm font-semibold px-4 py-1 rounded-full ' + (estado | ejeColor:'background')">
                EJE {{estado}}
            </span>
        } @else {
            <p-badge [value]="estado" severity="info" badgeSize="large" />
        } `,
    imports: [BadgeModule, EjeColorPipe],
    providers: []
})
export class AppEstadoGeneralV2 {
    @Input({ required: true }) estado: string = '';

    private ejesEstrategicos = [
        'Social',
        'Desarrollo Económico',
        'Infraestructura, Energia y Medio Ambiente',
        'Institucional',
        'Gestión de Riesgos'
    ];

    constructor() {}

    isEjeEstrategico(estado: string): boolean {
        return this.ejesEstrategicos.includes(estado);
    }
}
