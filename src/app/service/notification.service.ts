import { Injectable, signal } from '@angular/core';
import { SignalRService } from './signalr.service';
import { Subscription } from 'rxjs';
import { NotificacionModel } from '../models/notificacion.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private subscriptions = new Subscription();

    // Signals para las notificaciones
    private notificationsSignal = signal<NotificacionModel[]>([]);
    private unreadCountSignal = signal<number>(0);
    private isConnectedSignal = signal<boolean>(false);

    // Public getters para los signals
    get notifications() {
        return this.notificationsSignal.asReadonly();
    }
    get unreadCount() {
        return this.unreadCountSignal.asReadonly();
    }
    get isConnected() {
        return this.isConnectedSignal.asReadonly();
    }

    constructor(private signalRService: SignalRService) {
        this.initializeSignalR();
    }

    private initializeSignalR(): void {
        // Suscribirse al estado de conexión
        this.subscriptions.add(
            this.signalRService.isConnected$.subscribe((isConnected) => {
                this.isConnectedSignal.set(isConnected);
            })
        );

        // Iniciar la conexión y configurar listeners básicos
        this.signalRService
            .startConnection()
            .then(() => {
                this.setupBasicListeners();
            })
            .catch((error) => {
                console.error('❌ [NotificationService] Error connecting to SignalR:', error);
            });
    }

    private setupBasicListeners(): void {
        this.subscriptions.add(
            this.signalRService.on<NotificacionModel>('ReceiveNotification').subscribe((notification) => {
                this.addNotification({
                    id: notification.id || this.generateNumericId(),
                    titulo: notification.titulo || 'Notificación',
                    mensaje: notification.mensaje || '',
                    tipo: notification.tipo || 'info',
                    fecha: new Date(notification.fecha || Date.now()),
                    leida: false,
                    estado: notification.estado,
                    clase: notification.clase,
                    icono: notification.icono // Usar el ícono del backend directamente
                });
            })
        );

        // Listener para notificaciones no leídas
        this.subscriptions.add(
            this.signalRService.on<any>('notificacionesnoleidas').subscribe((data) => {
                // Manejar diferentes tipos de datos que puede enviar el servidor
                if (typeof data === 'number') {
                    // Si es un número, actualizar el contador directamente
                    this.unreadCountSignal.set(data);
                } else if (Array.isArray(data)) {
                    // Si es un array de notificaciones, procesarlas
                    const notifications = data.map((item: NotificacionModel) => ({
                        id: item.id || this.generateNumericId(),
                        titulo: item.titulo || 'Notificación',
                        mensaje: item.mensaje || '',
                        tipo: item.tipo || 'info',
                        fecha: new Date(item.fecha || Date.now()),
                        leida: item.leida || false,
                        estado: item.estado,
                        clase: item.clase,
                        icono: item.icono // Usar el ícono del backend directamente
                    }));

                    // Agregar las notificaciones no leídas al inicio
                    const currentNotifications = this.notificationsSignal();
                    const newNotifications = [...notifications, ...currentNotifications];
                    this.notificationsSignal.set(newNotifications.slice(0, 50));
                    this.updateUnreadCount();
                } else if (data && typeof data === 'object') {
                    // Si es un objeto, tratarlo como una notificación individual
                    const notificationData = data as NotificacionModel;
                    this.addNotification({
                        id: notificationData.id || this.generateNumericId(),
                        titulo: notificationData.titulo || 'Notificación No Leída',
                        mensaje: notificationData.mensaje || '',
                        tipo: notificationData.tipo || 'info',
                        fecha: new Date(notificationData.fecha || Date.now()),
                        leida: false,
                        estado: notificationData.estado,
                        clase: notificationData.clase,
                        icono: notificationData.icono // Usar el ícono del backend directamente
                    });
                }
            })
        );

        // Listener para notificaciones específicas de objetivos (catch-all)
        this.subscriptions.add(
            this.signalRService.on<NotificacionModel>('notificacionobjetivo').subscribe((objetivo) => {
                this.addNotification({
                    id: objetivo.id || this.generateNumericId(),
                    titulo: objetivo.titulo || 'Notificación de Objetivo',
                    mensaje: objetivo.mensaje || '',
                    tipo: objetivo.tipo || 'info',
                    fecha: new Date(objetivo.fecha || Date.now()),
                    leida: false,
                    estado: objetivo.estado,
                    clase: objetivo.clase,
                    icono: objetivo.icono // Usar el ícono del backend directamente
                });
            })
        );

        // Listener para usuarios conectados
        this.subscriptions.add(
            this.signalRService.on<any>('usuariosconectados').subscribe((usuarios) => {
                // Esto normalmente no genera notificaciones visibles, solo logging
            })
        );

        // Listener genérico para cualquier notificación del sistema
        this.subscriptions.add(
            this.signalRService.on<NotificacionModel>('notificacionsistema').subscribe((notificacion) => {
                this.addNotification({
                    id: notificacion.id || this.generateNumericId(),
                    titulo: notificacion.titulo || 'Notificación del Sistema',
                    mensaje: notificacion.mensaje || '',
                    tipo: notificacion.tipo || 'info',
                    fecha: new Date(notificacion.fecha || Date.now()),
                    leida: false,
                    estado: notificacion.estado,
                    clase: notificacion.clase,
                    icono: notificacion.icono // Usar el ícono del backend directamente
                });
            })
        );

        // Listener para aprobación de objetivos (disponible globalmente)
        this.subscriptions.add(
            this.signalRService.on<NotificacionModel>('notificacionaprobacionobjetivo').subscribe((aprobacion) => {
                this.addNotification({
                    id: aprobacion.id || this.generateNumericId(),
                    titulo: aprobacion.titulo || 'Objetivo Aprobado',
                    mensaje: aprobacion.mensaje || `El objetivo ha sido aprobado exitosamente`,
                    tipo: aprobacion.tipo || 'success',
                    fecha: new Date(aprobacion.fecha || Date.now()),
                    leida: false,
                    estado: aprobacion.estado,
                    clase: aprobacion.clase || 'alert-success',
                    icono: aprobacion.icono || 'fa fa-check-circle'
                });
            })
        );

        // Listener para rechazo de objetivos (disponible globalmente)
        this.subscriptions.add(
            this.signalRService.on<NotificacionModel>('notificacionrechazoobjetivo').subscribe((rechazo) => {
                this.addNotification({
                    id: rechazo.id || this.generateNumericId(),
                    titulo: rechazo.titulo || 'Objetivo Rechazado',
                    mensaje: rechazo.mensaje || `El objetivo ha sido rechazado`,
                    tipo: rechazo.tipo || 'error',
                    fecha: new Date(rechazo.fecha || Date.now()),
                    leida: false,
                    estado: rechazo.estado,
                    clase: rechazo.clase || 'alert-danger',
                    icono: rechazo.icono || 'fa fa-times-circle'
                });
            })
        );
    }

    /**
     * Configura los listeners de SignalR según el rol del usuario
     */
    public setupUserRoleListeners(userRoles: string[]): void {
        if (!this.signalRService.isConnected) {
            // Intentar iniciar conexión si no está conectado
            this.signalRService
                .startConnection()
                .then(() => {
                    setTimeout(() => this.setupUserRoleListeners(userRoles), 1000);
                })
                .catch((error) => {
                    console.error('❌ [NotificationService] Error iniciando conexión:', error);
                    // Intentar nuevamente en 5 segundos
                    setTimeout(() => this.setupUserRoleListeners(userRoles), 5000);
                });
            return;
        }

        // Configurar grupos automáticamente usando el nuevo método
        this.signalRService
            .setupUserGroups(userRoles)
            .then(() => {
                // Configurar listeners específicos por rol después de unirse a los grupos
                this.configureRoleSpecificListeners(userRoles);
            })
            .catch((error) => {
                console.error('❌ [NotificationService] Error configurando grupos:', error);
                // Intentar configurar listeners individuales como respaldo
                this.configureRoleSpecificListeners(userRoles);
            });
    }

    /**
     * Configura listeners específicos para cada rol
     */
    private configureRoleSpecificListeners(userRoles: string[]): void {
        if (userRoles.includes('Revisor')) {
            this.setupRevisorListeners();
        }

        if (userRoles.includes('Administrador')) {
            this.setupAdministradorListeners();
        }

        if (userRoles.includes('Planificador')) {
            this.setupPlanificadorListeners();
        }
    }

    private setupRevisorListeners(): void {
        // Listener específico para revisores - notificación de nuevo objetivo
        this.subscriptions.add(
            this.signalRService.on<NotificacionModel>('NotificarNuevoObjetivo').subscribe((objetivo) => {
                this.addNotification({
                    id: objetivo.id,
                    titulo: objetivo.titulo,
                    mensaje: objetivo.mensaje,
                    tipo: objetivo.tipo,
                    fecha: new Date(objetivo.fecha),
                    leida: objetivo.leida,
                    estado: objetivo.estado,
                    clase: objetivo.clase,
                    icono: objetivo.icono
                });
            })
        );

        // Listener para revisiones pendientes
        this.subscriptions.add(
            this.signalRService.on<NotificacionModel>('NotificarRevisionPendiente').subscribe((revision) => {
                this.addNotification({
                    id: revision.id,
                    titulo: revision.titulo,
                    mensaje: revision.mensaje,
                    tipo: revision.tipo,
                    fecha: new Date(revision.fecha),
                    leida: revision.leida,
                    estado: revision.estado,
                    clase: revision.clase,
                    icono: revision.icono
                });
            })
        );
    }

    private setupAdministradorListeners(): void {
        // Listeners específicos para administradores
        this.subscriptions.add(
            this.signalRService.on<NotificacionModel>('NotificarUsuarioCreado').subscribe((usuario) => {
                this.addNotification({
                    id: usuario.id,
                    titulo: usuario.titulo,
                    mensaje: usuario.mensaje,
                    tipo: usuario.tipo,
                    fecha: new Date(usuario.fecha),
                    leida: usuario.leida,
                    estado: usuario.estado,
                    clase: usuario.clase,
                    icono: usuario.icono
                });
            })
        );
    }

    private setupPlanificadorListeners(): void {
        // Listeners específicos para planificadores
        this.subscriptions.add(
            this.signalRService.on<NotificacionModel>('NotificarProyectoActualizado').subscribe((proyecto) => {
                this.addNotification({
                    id: proyecto.id,
                    titulo: proyecto.titulo,
                    mensaje: proyecto.mensaje,
                    tipo: proyecto.tipo,
                    fecha: new Date(proyecto.fecha),
                    leida: proyecto.leida,
                    estado: proyecto.estado,
                    clase: proyecto.clase,
                    icono: proyecto.icono
                });
            })
        );
    }

    private addNotification(notification: NotificacionModel): void {
        const currentNotifications = this.notificationsSignal();
        const newNotifications = [notification, ...currentNotifications];

        // Mantener solo las últimas 50 notificaciones
        const limitedNotifications = newNotifications.slice(0, 50);

        this.notificationsSignal.set(limitedNotifications);
        this.updateUnreadCount();
    }

    private updateUnreadCount(): void {
        const unreadCount = this.notificationsSignal().filter((n) => !n.leida).length;
        this.unreadCountSignal.set(unreadCount);
    }

    /**
     * Marcar notificación como leída
     */
    public markAsRead(notificationId: string): void {
        const id = parseInt(notificationId);
        const notifications = this.notificationsSignal();
        const updatedNotifications = notifications.map((n) => (n.id === id ? { ...n, leida: true } : n));
        this.notificationsSignal.set(updatedNotifications);
        this.updateUnreadCount();
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    public markAllAsRead(): void {
        const notifications = this.notificationsSignal();
        const updatedNotifications = notifications.map((n) => ({ ...n, leida: true }));
        this.notificationsSignal.set(updatedNotifications);
        this.updateUnreadCount();
    }

    /**
     * Eliminar notificación
     */
    public removeNotification(notificationId: string): void {
        const id = parseInt(notificationId);
        const notifications = this.notificationsSignal();
        const filteredNotifications = notifications.filter((n) => n.id !== id);
        this.notificationsSignal.set(filteredNotifications);
        this.updateUnreadCount();
    }

    /**
     * Limpiar todas las notificaciones
     */
    public clearAllNotifications(): void {
        this.notificationsSignal.set([]);
        this.unreadCountSignal.set(0);
    }

    /**
     * Solicitar notificaciones no leídas del servidor
     */
    public requestUnreadNotifications(): void {
        if (this.signalRService.isConnected) {
            this.signalRService
                .send('GetUnreadNotifications')
                .then(() => {
                    // Solicitud enviada exitosamente
                })
                .catch((error) => {
                    console.error('❌ [NotificationService] Error solicitando notificaciones no leídas:', error);
                });
        }
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    private generateNumericId(): number {
        return Date.now() + Math.floor(Math.random() * 1000);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
