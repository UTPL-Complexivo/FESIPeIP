import { EstadoObjetivosEstrategicos } from "../shared/enums/estado-objetivos-estrategicos.enum";

export interface ObjetivoInstitucionalModel {
    id: number;
    nombre: string;
    descripcion: string;
    estado: EstadoObjetivosEstrategicos;
    codigo: string;
}
