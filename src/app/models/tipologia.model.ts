import { EstadoConfiguracionInstitucional } from "../shared/enums/estado-configuracion-institucional.enum";

export interface TipologiaModel {
    id: number;
    nombre: string;
    descripcion: string;
    estado: EstadoConfiguracionInstitucional;
    codigo: string;
}
