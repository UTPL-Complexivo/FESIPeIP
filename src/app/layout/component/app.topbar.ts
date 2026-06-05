import { Component, OnInit, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AppUser } from "./app.user";
import { NotificationBellComponent } from './notification-bell.component';
import { NotificationService } from '../../service/notification.service';
import { UsuarioService } from '../../service/usuario.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, AppUser, NotificationBellComponent],
    styles: [`
        .layout-topbar-logo img {
            height: 3.5rem;
            width: auto;
        }
    `],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="assets/logo.png" alt="Image" class="mr-2" />
                <span>versión 2.0</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <app-notification-bell />
                    <div class="relative">
                        <button
                            class="layout-topbar-action"
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-user"></i>
                            <span>Profile</span>
                        </button>
                        <app-user />
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar implements OnInit {
    items!: MenuItem[];
    private notificationService = inject(NotificationService);
    private usuarioService = inject(UsuarioService);
    constructor(public layoutService: LayoutService) { }    ngOnInit(): void {
        this.setupNotifications();
    }

    /**
     * Configura las notificaciones SignalR basadas en el usuario actual
     */
    private setupNotifications(): void {
        // Obtener el usuario actual y configurar notificaciones
        this.usuarioService.getMe().subscribe({
            next: (usuario) => {
                if (usuario?.roles && usuario.roles.length > 0) {
                    // Configurar listeners de SignalR
                    this.notificationService.setupUserRoleListeners(usuario.roles);

                    // Solicitar notificaciones no leídas después de configurar los listeners
                    setTimeout(() => {
                        this.notificationService.requestUnreadNotifications();
                    }, 2000);
                }
            },
            error: (error) => {
                console.error('Error obteniendo usuario:', error);
            }
        });
    }    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
