export interface AuditEventModel {
    _id: string;
    usuario_id: string;
    modulo: string;
    entidad: string;
    entidad_id: string;
    accion: string;
    detalles: string;
    motivo: string | null;
    fecha_hora: Date;
}
