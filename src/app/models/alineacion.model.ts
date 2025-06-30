export interface AlineacionModel {
    /*
    public int Id { get; set; }
        public required int ObjetivoDesarrolloSostenibleId { get; set; }
        public required int ObjetivoInstitucionalId { get; set; }
        public required int PlanNacionalDesarrolloId { get; set; }
        public required string NombreODS { get; set; }
        public required string IconoODS { get; set; }
        public required string NombreOI { get; set; }
        public required string NombrePND { get; set; }
        */
    id: number;
    objetivoDesarrolloSostenibleId: number;
    objetivoInstitucionalId: number;
    planNacionalDesarrolloId: number;
    nombreODS: string;
    iconoODS: string;
    nombreOI: string;
    nombrePND: string;
}
