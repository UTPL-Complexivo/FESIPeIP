import { Pipe, PipeTransform } from '@angular/core';
import { ObjetivoInstitucionalModel } from '../models/objetivo-institucional.model';
import { EstadoObjetivosEstrategicos } from '../shared/enums/estado-objetivos-estrategicos.enum';

@Pipe({
  name: 'objetivosInstitucionalesFilter',
  standalone: true
})
export class ObjetivosInstitucionalesFilterPipe implements PipeTransform {

  transform(objetivos: ObjetivoInstitucionalModel[], rol: string): ObjetivoInstitucionalModel[] {
    if (!objetivos || !rol) {
      return objetivos || [];
    }

    switch (rol) {
      case 'Revisor':
        // Revisor solo ve objetivos pendientes de revisión
        return objetivos.filter(objetivo =>
          objetivo.estado === EstadoObjetivosEstrategicos.PendienteRevision
        );

      case 'Autoridad':
        // Autoridad solo ve objetivos pendientes de autorización
        return objetivos.filter(objetivo =>
          objetivo.estado === EstadoObjetivosEstrategicos.PendienteAutoridad
        );

      case 'Administrador':
      case 'Planificador':
      default:
        // Administrador y Planificador ven todos los objetivos
        return objetivos;
    }
  }
}
