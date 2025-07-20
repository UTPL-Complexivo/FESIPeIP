import { EstadoConfiguracionInstitucional } from "../shared/enums/estado-configuracion-institucional.enum";
export interface PlanNacionalDesarrolloModel {
    id: number;
    nombre: string;
    descripcion: string;
    estado: EstadoConfiguracionInstitucional;
    nombreEstado: string;
    codigo: string;
    eje: string;
}
