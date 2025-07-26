import { EstadoConfiguracionInstitucional } from "../shared/enums/estado-configuracion-institucional.enum";

export interface ActividadModel {
    id: number;
    nombre: string;
    estado: EstadoConfiguracionInstitucional;
    codigo: string;
}
