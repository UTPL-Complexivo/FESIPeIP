export interface UsuarioModel {
    id: string;
    correo: string;
    nombre: string;
    telefono: string;
    avatarUrl: string;
    userName: string;
    tipoUsuario: string;
    roles: string[];
    estado: string;
    eliminado: boolean;
    primerNombre: string;
    segundoNombre: string;
    idEntidadEstado: number;
}
