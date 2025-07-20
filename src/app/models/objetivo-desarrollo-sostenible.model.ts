import { EstadoConfiguracionInstitucional } from "../shared/enums/estado-configuracion-institucional.enum";

export interface ObjetivoDesarrolloSostenibleModel {
    id: number;
    nombre: string;
    descripcion: string;
    icono: string;
    estado: EstadoConfiguracionInstitucional;
    nombreEstado: string;
    codigo: string;
}
