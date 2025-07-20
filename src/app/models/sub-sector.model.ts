import { EstadoConfiguracionInstitucional } from "../shared/enums/estado-configuracion-institucional.enum";

export interface SubSectorModel {
    id: number;
    codigo: string;
    nombre: string;
    macroSectorId: number;
    nombreMacroSector: string;
    sectorId: number;
    nombreSector: string;
    estado: EstadoConfiguracionInstitucional;
}
