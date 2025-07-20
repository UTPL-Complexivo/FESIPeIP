import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { BadgeModule } from "primeng/badge";
import { EstadoObjetivosEstrategicos } from "../../shared/enums/estado-objetivos-estrategicos.enum";

@Component({
    selector: 'app-estado-oe',
    standalone: true,
    template: `<p-badge [value]="nombreEstado" [severity]="severity" badgeSize="large" />`,
    imports: [BadgeModule],
    providers: []
})

export class AppEstadoOe implements OnInit, OnChanges {
    @Input() nombreEstado: string = '';
    @Input({ required: true }) estado: EstadoObjetivosEstrategicos = EstadoObjetivosEstrategicos.PendienteRevision;
    severity: any = 'success';
    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['estado']) {
            switch (this.estado) {
                case EstadoObjetivosEstrategicos.PendienteRevision:
                    this.nombreEstado = 'Revisión';
                    this.severity = 'info';
                    break;
                case EstadoObjetivosEstrategicos.PendienteAutoridad:
                    this.nombreEstado = 'Autoridad';
                    this.severity = 'warn';
                    break;
                case EstadoObjetivosEstrategicos.Activo:
                    this.nombreEstado = 'Activo';
                    this.severity = 'success';
                    break;
                case EstadoObjetivosEstrategicos.Inactivo:
                    this.nombreEstado = 'Inactivo';
                    this.severity = 'danger';
                    break;
                case EstadoObjetivosEstrategicos.Rechazado:
                    this.nombreEstado = 'Rechazado';
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
