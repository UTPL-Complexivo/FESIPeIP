export interface TipologiaModel {
    id: number;
    nombre: string;
    descripcion: string;
    estado: 'Activo' | 'Inactivo';
    codigo: string;
}
