import { Component, Input } from '@angular/core';
import { BadgeModule } from 'primeng/badge';

@Component({
    selector: 'app-estado-general',
    standalone: true,
    template: `@if (estado === 'Activo') {
            <p-badge value="Activo" severity="success" badgeSize="large" />
        } @else if (estado === 'Inactivo') {
            <p-badge value="Inactivo" severity="danger" badgeSize="large" />
        } @else if (estado === 'Social') {
            <span class="bg-violet-500 text-white text-sm font-semibold px-4 py-1 rounded-full">EJE {{estado}} </span>
        } @else if(estado === 'Desarrollo Económico') {
            <span class="bg-teal-500 text-white text-sm font-semibold px-4 py-1 rounded-full">EJE {{estado}} </span>
        } @else if(estado === 'Infraestructura, Energia y Medio Ambiente') {
            <span class="bg-sky-500 text-white text-sm font-semibold px-4 py-1 rounded-full">EJE {{estado}} </span>
        } @else if(estado === 'Institucional') {
            <span class="bg-indigo-500 text-white text-sm font-semibold px-4 py-1 rounded-full">EJE {{estado}} </span>
        } @else if(estado === 'Gestión de Riesgos') {
            <span class="bg-yellow-500 text-white text-sm font-semibold px-4 py-1 rounded-full">EJE {{estado}} </span>
        }  @else {
            <p-badge [value]="estado" severity="info" badgeSize="large" />
        } `,
    imports: [BadgeModule],
    providers: []
})
export class AppEstadoGeneral {
    @Input({ required: true }) estado: string = '';
    constructor() {}
}
