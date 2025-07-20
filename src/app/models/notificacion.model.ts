export interface NotificacionModel {
   id: number;
   usuarioId?: string;
   rolDestino?: string;
   titulo: string;
   mensaje: string;
   fecha: Date;
   leida: boolean;
   tipo: string;
   entidadId?: number;
   estado: any;
   clase: string;
   icono: any;
}
