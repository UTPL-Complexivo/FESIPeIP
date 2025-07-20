import { Component, Input } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { EjeColorPipe } from '../../pipes/eje-color.pipe';

@Component({
    selector: 'app-estado-general',
    standalone: true,
    template: `@if (estado === 'Activo') {
            <p-badge value="Activo" severity="success" badgeSize="large" />
        } @else if (estado === 'Inactivo') {
            <p-badge value="Inactivo" severity="danger" badgeSize="large" />
        }
        @else if (estado === 'Pendiente') {
            <p-badge value="Pendiente" severity="warn" badgeSize="large" />
        }
        @else if (isEjeEstrategico(estado)) {
            <span [class]="getEjeClasses(estado)">EJE {{estado}}</span>
        } @else {
            <p-badge [value]="estado" severity="info" badgeSize="large" />
        }`,
    imports: [BadgeModule],
    providers: []
})
export class AppEstadoGeneral {
    @Input({ required: true }) estado: string = '';

    private ejesEstrategicos = [
        'Social',
        'Desarrollo Económico',
        'Infraestructura, Energia y Medio Ambiente',
        'Institucional',
        'Gestión de Riesgos'
    ];

    private ejeColorPipe = new EjeColorPipe();

    constructor() {}

    isEjeEstrategico(estado: string): boolean {
        return this.ejesEstrategicos.includes(estado);
    }

    getEjeClasses(estado: string): string {
        const bgColor = this.ejeColorPipe.transform(estado, 'background');
        return `${bgColor} text-white text-sm font-semibold px-4 py-1 rounded-full`;
    }
}
