export interface ReporteMacroSectorModel {
    nombre: string;
    sectores: ReporteSectorModel[];
}

export interface ReporteSectorModel {
    nombre: string;
    subsectores: ReporteSubsectorModel[];
}

export interface ReporteSubsectorModel {
    nombre: string;
    instituciones: ReporteInstitucionModel[];
}

export interface ReporteInstitucionModel {
    nombre: string;
    estado: string;
}
