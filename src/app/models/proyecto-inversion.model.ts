import { EstadoObjetivosEstrategicos } from "../shared/enums/estado-objetivos-estrategicos.enum";
import { ActividadModel } from "./actividad.model";
import { AnexoProyectoModel } from "./anexo-proyecto.model";

export interface ProyectoInversionModel{
    id: number;
    idEntidadesEstado: number;
    cup: string;
    titulo: string;
    descripcion: string;
    estado: EstadoObjetivosEstrategicos;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    fechaInicio?: Date;
    fechaFin?: Date;
    valorTotal?: number;
    actividades: ActividadModel[];
    anexos: AnexoProyectoModel[];
}
