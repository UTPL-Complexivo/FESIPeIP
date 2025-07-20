import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../service/notification.service';
import { NotificacionService } from '../../service/notificacion.service';
import { NotificacionModel } from '../../models/notificacion.model';

@Component({
    selector: 'app-notification-bell',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="relative">
            <button type="button" class="layout-topbar-action notification-bell-button" (click)="toggleNotifications()">
                <i class="pi pi-bell"></i>
                <span>Notifications</span>
                @if (notifications().length > 0) {
                    <span class="notification-badge" [class.has-unread]="unreadCount() > 0">
                        {{ notifications().length }}
                    </span>
                }
            </button>

            @if (showNotifications) {
                <div class="notification-panel" (click)="$event.stopPropagation()">
                    <div class="notification-header">
                        <h3>
                            Notificaciones
                            <span class="notification-counter">
                                ({{ notifications().length }})
                                @if (unreadCount() > 0) {
                                    <span class="unread-indicator">{{ unreadCount() }} nuevas</span>
                                }
                            </span>
                        </h3>
                        <div class="notification-actions">
                            @if (unreadCount() > 0) {
                                <button type="button" class="btn-link" (click)="markAllAsRead()">Marcar todas como leídas</button>
                            }
                            <button type="button" class="btn-link" (click)="clearAll()">Limpiar todo</button>
                        </div>
                    </div>

                    <div class="notification-content">
                        @if (notifications().length > 0) {
                            @for (notification of notifications(); track notification.id) {
                                <div class="notification-item" [class.unread]="!notification.leida" (click)="markAsRead(notification.id)">
                                    <div class="notification-icon">
                                        <i [class]="notification.icono || getNotificationIcon(notification.tipo)" [style.color]="getNotificationColor(notification.tipo)"></i>
                                    </div>
                                    <div class="notification-body">
                                        <div class="notification-title">{{ notification.titulo }}</div>
                                        <div class="notification-message">{{ notification.mensaje }}</div>
                                        <div class="notification-time">{{ formatTime(notification.fecha) }}</div>
                                    </div>
                                    <div class="notification-border" [style.background-color]="getNotificationColor(notification.tipo)"></div>
                                    <button type="button" class="notification-close" (click)="removeNotification(notification.id, $event)">
                                        <i class="pi pi-times"></i>
                                    </button>
                                </div>
                            }
                        } @else {
                            <div class="notification-empty">
                                <i class="pi pi-bell text-4xl mb-2"></i>
                                <p>No tienes notificaciones</p>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    `,
    styles: [
        `
            .notification-bell-button {
                position: relative !important;
            }

            .notification-badge {
                position: absolute !important;
                top: -8px !important;
                right: -8px !important;
                background: var(--surface-300) !important;
                color: var(--text-color) !important;
                border: 2px solid var(--surface-card) !important;
                border-radius: 50% !important;
                min-width: 20px !important;
                height: 20px !important;
                font-size: 11px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-weight: bold !important;
                transition: all 0.2s ease !important;
                z-index: 10 !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
            }

            .notification-badge.has-unread {
                background: var(--red-500);
                color: white;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                }
            }

            .notification-panel {
                position: absolute;
                top: 100%;
                right: 0;
                width: 380px;
                max-height: 500px;
                background: var(--surface-card);
                border: 1px solid var(--surface-border);
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                overflow: hidden;
            }

            .notification-header {
                padding: 1rem;
                border-bottom: 1px solid var(--surface-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .notification-header h3 {
                margin: 0;
                font-size: 1.1rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .notification-counter {
                font-size: 0.9rem;
                font-weight: normal;
                color: var(--text-color-secondary);
            }

            .unread-indicator {
                color: var(--red-500);
                font-weight: 600;
            }

            .notification-actions {
                display: flex;
                gap: 0.5rem;
            }

            .btn-link {
                background: none;
                border: none;
                color: var(--primary-color);
                font-size: 0.8rem;
                cursor: pointer;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                transition: background-color 0.2s;
            }

            .btn-link:hover {
                background: var(--surface-hover);
            }

            .notification-content {
                max-height: 400px;
                overflow-y: auto;
            }

            .notification-item {
                display: flex;
                align-items: flex-start;
                padding: 1rem;
                border-bottom: 1px solid var(--surface-border);
                cursor: pointer;
                transition: background-color 0.2s;
                position: relative;
            }

            .notification-item:hover {
                background: var(--surface-hover);
            }

            .notification-item.unread {
                background: var(--surface-50);
            }

            .notification-item.unread::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: var(--primary-color);
            }

            .notification-border {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                opacity: 0;
                transition: opacity 0.2s;
            }

            .notification-item.unread .notification-border {
                opacity: 1;
            }

            .notification-icon {
                margin-right: 0.75rem;
                margin-top: 0.25rem;
                flex-shrink: 0;
            }

            .notification-icon i {
                font-size: 1.1rem;
            }

            .notification-body {
                flex: 1;
                min-width: 0;
            }

            .notification-title {
                font-weight: 600;
                font-size: 0.875rem;
                margin-bottom: 0.25rem;
            }

            .notification-message {
                font-size: 0.8rem;
                color: var(--text-color-secondary);
                margin-bottom: 0.25rem;
            }

            .notification-time {
                font-size: 0.75rem;
                color: var(--text-color-secondary);
            }

            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                color: var(--text-color-secondary);
                opacity: 0;
                transition: opacity 0.2s;
            }

            .notification-item:hover .notification-close {
                opacity: 1;
            }

            .notification-close:hover {
                background: var(--surface-hover);
            }

            .notification-empty {
                padding: 2rem;
                text-align: center;
                color: var(--text-color-secondary);
            }

            .notification-empty i {
                display: block;
                margin-bottom: 0.5rem;
            }
        `
    ]
})
export class NotificationBellComponent {
    private notificationService = inject(NotificationService);
    private notificacionApiService = inject(NotificacionService);

    showNotifications = false;

    get notifications() {
        return this.notificationService.notifications;
    }

    get unreadCount() {
        return this.notificationService.unreadCount;
    }

    toggleNotifications(): void {
        this.showNotifications = !this.showNotifications;

        // Cerrar al hacer clic fuera
        if (this.showNotifications) {
            setTimeout(() => {
                document.addEventListener('click', this.closeNotifications.bind(this), { once: true });
            }, 0);
        }
    }

    closeNotifications(): void {
        this.showNotifications = false;
    }

    markAsRead(notificationId: number): void {
        // Marcar como leída localmente primero
        this.notificationService.markAsRead(notificationId.toString());

        // Enviar al API para marcar como leída
        this.notificacionApiService.marcarLeida(notificationId).subscribe({
            next: () => {
                // Notificación marcada como leída exitosamente
            },
            error: (error) => {
                console.error('Error al marcar notificación como leída:', error);
            }
        });
    }

    markAllAsRead(): void {
        // Marcar todas como leídas localmente primero
        this.notificationService.markAllAsRead();

        // Enviar al API para marcar todas como leídas
        this.notificacionApiService.marcarTodasLeidas().subscribe({
            next: () => {
                // Todas las notificaciones marcadas como leídas exitosamente
            },
            error: (error) => {
                console.error('Error al marcar todas las notificaciones como leídas:', error);
            }
        });
    }

    removeNotification(notificationId: number, event: Event): void {
        event.stopPropagation();

        // Eliminar localmente primero
        this.notificationService.removeNotification(notificationId.toString());

        // Enviar al API para eliminar del servidor
        this.notificacionApiService.eliminarNotificacion(notificationId).subscribe({
            next: () => {
                // Notificación eliminada exitosamente
            },
            error: (error) => {
                console.error('Error al eliminar notificación del servidor:', error);
            }
        });
    }

    clearAll(): void {
        // Obtener todas las notificaciones actuales para extraer sus IDs
        const notifications = this.notificationService.notifications();
        const ids = notifications.map((n) => n.id);

        // Limpiar localmente primero
        this.notificationService.clearAllNotifications();

        // Enviar al API para eliminar la lista de notificaciones
        if (ids.length > 0) {
            this.notificacionApiService.eliminarLista(ids).subscribe({
                next: () => {
                    // Todas las notificaciones eliminadas exitosamente
                },
                error: (error) => {
                    console.error('Error al eliminar todas las notificaciones del servidor:', error);
                }
            });
        }
    }

    getNotificationIcon(type: string): string {
        switch (type?.toLowerCase()) {
            case 'success':
            case 'aprobacion':
            case 'aprobado':
                return 'pi pi-check-circle';

            case 'warning':
            case 'advertencia':
            case 'pendiente':
            case 'atencion':
                return 'pi pi-exclamation-triangle';

            case 'error':
            case 'rechazo':
            case 'rechazado':
                return 'pi pi-times-circle';

            case 'info':
            case 'informacion':
            case 'objetivo':
                return 'pi pi-info-circle';

            case 'usuario':
            case 'user':
                return 'pi pi-user';

            case 'proyecto':
            case 'project':
                return 'pi pi-briefcase';

            case 'actualizacion':
            case 'update':
                return 'pi pi-sync';

            case 'sistema':
            case 'system':
                return 'pi pi-cog';

            case 'revision':
            case 'review':
                return 'pi pi-eye';

            case 'nuevo':
            case 'new':
                return 'pi pi-plus-circle';

            case 'notificacion':
            case 'notification':
                return 'pi pi-bell';

            case 'importante':
            case 'important':
                return 'pi pi-star';

            default:
                return 'pi pi-info-circle';
        }
    }

    getNotificationColor(tipo: string): string {
        // Determinar color basado únicamente en el tipo de notificación
        switch (tipo?.toLowerCase()) {
            case 'success':
            case 'aprobacion':
            case 'aprobado':
                return '#22c55e'; // Verde

            case 'warning':
            case 'advertencia':
            case 'pendiente':
            case 'atencion':
                return '#f97316'; // Naranja

            case 'error':
            case 'rechazo':
            case 'rechazado':
                return '#ef4444'; // Rojo

            case 'info':
            case 'informacion':
            case 'objetivo':
                return '#3b82f6'; // Azul

            case 'usuario':
            case 'user':
                return '#6366f1'; // Índigo

            case 'proyecto':
            case 'project':
                return '#2563eb'; // Azul oscuro

            case 'actualizacion':
            case 'update':
                return '#06b6d4'; // Cian

            case 'sistema':
            case 'system':
                return '#6b7280'; // Gris

            case 'revision':
            case 'review':
                return '#14b8a6'; // Teal

            case 'nuevo':
            case 'new':
                return '#10b981'; // Esmeralda

            case 'notificacion':
            case 'notification':
                return '#8b5cf6'; // Púrpura

            case 'importante':
            case 'important':
                return '#eab308'; // Amarillo

            default:
                return '#3b82f6'; // Azul por defecto
        }
    }
    getNotificationBorderColor(tipo: string): string {
        return this.getNotificationColor(tipo);
    }

    formatTime(timestamp: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - timestamp.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours} h`;
        if (diffDays < 7) return `Hace ${diffDays} d`;

        return timestamp.toLocaleDateString();
    }
}
