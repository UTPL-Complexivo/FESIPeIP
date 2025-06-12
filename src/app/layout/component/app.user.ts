import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { UsuarioService } from '../../service/usuario.service';
import { UsuarioModel } from '../../models/usuario.component';
import { AuthService, LogoutOptions } from '@auth0/auth0-angular';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-user',
    template: `
        @if (loading) {
            <p-skeleton styleClass="mb-2" />
            <p-skeleton width="10rem" styleClass="mb-2" />
            <p-skeleton width="5rem" styleClass="mb-2" />
            <p-skeleton height="2rem" styleClass="mb-2" />
            <p-skeleton width="10rem" height="4rem" />
        } @else {
                <ng-template pTemplate="header">
                    @if (usuario?.avatarUrl) {
                        <img  [src]="usuario?.avatarUrl" alt="Avatar" class="w-16 h-16 rounded-full mx-auto" />
                    }
                    @else {
                        <span class="pi pi-user text-5xl text-gray-400 mx-auto"></span>
                    }
                </ng-template>
                <div class="text-center mt-2">
                    <h3>{{ usuario?.nombre }}</h3>
                    <p class="text-sm text-gray-500">{{ usuario?.correo }}</p>
                    <p class="text-sm text-gray-500">{{ usuario?.userName }}</p>
                    <p class="text-sm text-gray-500">Rol: {{ usuario?.roles?.[0] }}</p>
                    <p class="text-sm text-gray-500">Estado: {{ usuario?.estado }}</p>
                    <button pButton type="button" severity="danger" label="Cerrar sesión" class="mt-4 w-full" (click)="cerrarSesion()"></button>
                </div>
        }
    `,
    host: {
        class: 'hidden absolute top-[3.25rem] right-0 w-72 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]'
    },
    imports: [SkeletonModule, CardModule, ButtonModule]
})
export class AppUser implements OnInit {
    loading: boolean = true;
    usuario: UsuarioModel | null = null;
    constructor(private usuarioService: UsuarioService, public auth: AuthService  ) {}
    ngOnInit(): void {
        this.usuarioService.getMe().subscribe({
            next: (data) => {
                console.log('User data fetched:', data);
                this.usuario = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching user data:', error);
                this.loading = false;
            }
        });
    }

     cerrarSesion() {
        this.auth.logout({ returnTo: window.location.origin } as LogoutOptions);
    }
}
