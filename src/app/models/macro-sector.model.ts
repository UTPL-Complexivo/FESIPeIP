import { EstadoConfiguracionInstitucional } from "../shared/enums/estado-configuracion-institucional.enum";

export interface MacroSectorModel {
    id: number;
    codigo: string;
    nombre: string;
    estado: EstadoConfiguracionInstitucional;
    nombreEstado?: string;
}
