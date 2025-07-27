import { EstadoObjetivosEstrategicos } from "../shared/enums/estado-objetivos-estrategicos.enum";

export interface PlanNacionalItem {
    nombre: string;
    estado: string;
    ods: {
        nombre: string;
        estado: string;
    }[];
    alineaciones: {
        nombre: string;
        estado: string;
    }[];
}

export interface ReporteObjetivoEstrategicoModel {
    nombre: string;
    estado: string;
    planesNacionales: PlanNacionalItem[];
}
