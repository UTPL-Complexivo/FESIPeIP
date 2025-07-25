import { EstadoConfiguracionInstitucional } from "../shared/enums/estado-configuracion-institucional.enum";

export interface InstitucionModel {
    id: number;
    codigo: string;
    nombre: string;
    subsectorId: number;
    nombreSubsector: string;
    nombreSector: string;
    nombreMacroSector: string;
    direccion: string;
    telefono: string;
    correo: string;
    estado: EstadoConfiguracionInstitucional;
    nivelGobierno: string;
}
