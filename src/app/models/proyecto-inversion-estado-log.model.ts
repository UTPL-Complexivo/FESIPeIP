export interface ProyectoInversionEstadoLogModel {
    id: string;
    proyectoId: number;
    estado: number;
    nombreEstado: string;
    usuarioId: string;
    nombreUsuario: string;
    fecha: Date;
}
