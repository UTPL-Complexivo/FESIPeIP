import { EstadoConfiguracionInstitucional } from "../shared/enums/estado-configuracion-institucional.enum";

export interface SectorModel {
    id: number;
    codigo: string;
    nombre: string;
    macroSectorId: number;
    nombreMacroSector: string;
    estado: EstadoConfiguracionInstitucional;
}
