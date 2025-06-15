import { Component, Input } from '@angular/core';
import { BadgeModule } from 'primeng/badge';

@Component({
    selector: 'app-estado-general',
    standalone: true,
    template: `@if (estado === 'Activo') {
            <p-badge value="Activo" severity="success" badgeSize="large" />
        } @else {
            <p-badge value="Inactivo" severity="danger" badgeSize="large" />
        }`,
    imports: [BadgeModule],
    providers: []
})
export class AppEstadoGeneral {
    @Input({ required: true }) estado: string = '';
    constructor() {}
}
