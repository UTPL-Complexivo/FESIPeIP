import { EstadoConfiguracionInstitucional } from "../shared/enums/estado-configuracion-institucional.enum";

export interface ReporteTipologiaModel {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    estado: EstadoConfiguracionInstitucional;
    nombreEstado: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    // Información de la jerarquía institucional
    nombreMacroSector: string;
    nombreSector: string;
    nombreSubSector: string;
    nombreInstitucion: string;
}
