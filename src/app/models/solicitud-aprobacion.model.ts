export interface SolicitudAprobacionModel {
    tipoEntidad: 'objetivo' | 'alineacion';
    id: number
    accion: 'aprobar' | 'rechazar';
    comentario?: string;
}
