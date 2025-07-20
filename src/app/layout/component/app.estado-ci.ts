import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { BadgeModule } from "primeng/badge";
import { EstadoConfiguracionInstitucional } from "../../shared/enums/estado-configuracion-institucional.enum";

@Component({
    selector: 'app-estado-ci',
    standalone: true,
    template: `<p-badge [value]="nombreEstado" [severity]="severity" badgeSize="large" />`,
    imports: [BadgeModule],
    providers: []
})

export class AppEstadoCi implements OnInit, OnChanges {
    @Input() nombreEstado: string = '';
    @Input({ required: true }) estado: EstadoConfiguracionInstitucional = EstadoConfiguracionInstitucional.Activo;
    severity: any = 'success';
    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['estado']) {
            switch (this.estado) {
                case EstadoConfiguracionInstitucional.Activo:
                    this.nombreEstado = 'Activo';
                    this.severity = 'success';
                    break;
                case EstadoConfiguracionInstitucional.Inactivo:
                    this.nombreEstado = 'Inactivo';
                    this.severity = 'danger';
                    break;
                default:
                    this.nombreEstado = 'Desconocido';
                    this.severity = 'info';
                    break;
            }
        }
    }
}
