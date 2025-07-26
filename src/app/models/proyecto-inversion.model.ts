import { EstadoObjetivosEstrategicos } from "../shared/enums/estado-objetivos-estrategicos.enum";
import { ActividadModel } from "./actividad.model";
import { AnexoProyectoModel } from "./anexo-proyecto.model";

export interface ProyectoInversionModel{
    id: number;
    cup: string;
    titulo: string;
    descripcion: string;
    estado: EstadoObjetivosEstrategicos;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    actividades: ActividadModel[];
    anexos: AnexoProyectoModel[];
}
