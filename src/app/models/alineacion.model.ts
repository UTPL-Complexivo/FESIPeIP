import { EstadoObjetivosEstrategicos } from "../shared/enums/estado-objetivos-estrategicos.enum";

export interface AlineacionModel {
    id: number;
    objetivoDesarrolloSostenibleId: number;
    objetivoInstitucionalId: number;
    planNacionalDesarrolloId: number;
    nombreODS: string;
    iconoODS: string;
    nombreOI: string;
    nombrePND: string;
    estado: EstadoObjetivosEstrategicos;
    nombreEstado: string;
}
