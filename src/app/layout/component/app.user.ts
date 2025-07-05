import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { UsuarioService } from '../../service/usuario.service';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService, LogoutOptions } from '@auth0/auth0-angular';

@Component({
    selector: 'app-user',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        SkeletonModule,
        ButtonModule,
        AvatarModule,
        BadgeModule,
        DividerModule
    ],
    template: `
        <div class="user-profile-card">
            @if (loading()) {
                <div class="text-center p-4">
                    <p-skeleton shape="circle" size="4rem" styleClass="mb-3" />
                    <p-skeleton width="8rem" height="1.5rem" styleClass="mb-2" />
                    <p-skeleton width="6rem" height="1rem" styleClass="mb-2" />
                    <p-skeleton width="5rem" height="1rem" styleClass="mb-3" />
                    <p-skeleton width="100%" height="2.5rem" />
                </div>
            } @else {
                <div class="user-profile-content">
                    <div class="user-header">
                        @if (usuario()?.avatarUrl) {
                            <p-avatar
                                [image]="usuario()?.avatarUrl"
                                size="large"
                                shape="circle"
                                class="user-avatar">
                            </p-avatar>
                        } @else {
                            <p-avatar
                                icon="pi pi-user"
                                size="large"
                                shape="circle"
                                [style]="{'background-color': 'var(--primary-color)', 'color': 'var(--primary-color-text)'}"
                                class="user-avatar">
                            </p-avatar>
                        }
                    </div>

                    <div class="user-info">
                        <h4 class="user-name">{{ usuario()?.nombre }}</h4>
                        <p class="user-email">{{ usuario()?.correo }}</p>
                        <p class="user-username">&#64;{{ usuario()?.userName }}</p>
                    </div>

                    <p-divider />

                    <div class="user-details">
                        <div class="detail-item">
                            <span class="detail-label">Rol:</span>
                            <span class="detail-value">
                                {{ usuario()?.roles?.[0] }}
                                @if ((usuario()?.roles?.length || 0) > 1) {
                                    <p-badge
                                        [value]="usuario()?.roles?.length?.toString() || '0'"
                                        severity="info"
                                        size="small">
                                    </p-badge>
                                }
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Estado:</span>
                            <p-badge
                                [value]="usuario()?.estado || 'Desconocido'"
                                [severity]="getEstadoSeverity(usuario()?.estado)"
                                size="small">
                            </p-badge>
                        </div>
                    </div>

                    <p-divider />

                    <div class="user-actions">
                        <button
                            pButton
                            type="button"
                            severity="danger"
                            label="Cerrar Sesión"
                            icon="pi pi-sign-out"
                            class="w-full"
                            (click)="cerrarSesion()">
                        </button>
                    </div>
                </div>
            }
        </div>
    `,
    host: {
        class: 'hidden absolute top-[3.25rem] right-0 w-72 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]'
    },

    styles: [`
        .user-profile-card {
            width: 100%;
            max-width: 300px;
        }

        .user-profile-content {
            padding: 1.5rem;
        }

        .user-header {
            display: flex;
            justify-content: center;
            margin-bottom: 1rem;
        }

        .user-avatar {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .user-info {
            text-align: center;
            margin-bottom: 1rem;
        }

        .user-name {
            margin: 0 0 0.5rem 0;
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-color);
        }

        .user-email {
            margin: 0 0 0.25rem 0;
            font-size: 0.875rem;
            color: var(--text-color-secondary);
        }

        .user-username {
            margin: 0;
            font-size: 0.875rem;
            color: var(--text-color-secondary);
            font-style: italic;
        }

        .user-details {
            margin-bottom: 1rem;
        }

        .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
        }

        .detail-item:last-child {
            margin-bottom: 0;
        }

        .detail-label {
            font-weight: 500;
            color: var(--text-color);
            font-size: 0.875rem;
        }

        .detail-value {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            color: var(--text-color-secondary);
        }

        .user-actions {
            margin-top: 1rem;
        }
    `]
})
export class AppUser implements OnInit {
    private usuarioService = inject(UsuarioService);
    private auth = inject(AuthService);

    loading = signal(true);
    usuario = signal<UsuarioModel | null>(null);

    ngOnInit(): void {
        this.usuarioService.getMe().subscribe({
            next: (data) => {
                this.usuario.set(data);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error fetching user data:', error);
                this.loading.set(false);
            }
        });
    }

    cerrarSesion() {
        this.auth.logout({ returnTo: window.location.origin } as LogoutOptions);
    }

    getEstadoSeverity(estado: string | undefined): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
        switch (estado?.toLowerCase()) {
            case 'activo':
                return 'success';
            case 'inactivo':
                return 'danger';
            case 'pendiente':
                return 'warn';
            case 'suspendido':
                return 'secondary';
            default:
                return 'info';
        }
    }
}
