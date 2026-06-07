import { NgIf } from '@angular/common';
import { Component, DestroyRef, ElementRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppMenu } from './app.menu';
import { UsuarioService } from '../../service/usuario.service';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu, NgIf],
    template: ` <div class="layout-sidebar">
        <div class="sidebar-user-card" *ngIf="usuarioActual">
            <div class="sidebar-user-name">{{ usuarioActual.nombre || usuarioActual.userName || 'Usuario' }}</div>
            <div class="sidebar-user-role">{{ getRolPrincipal(usuarioActual) }}</div>
            <div class="sidebar-user-email">{{ usuarioActual.correo || 'Sin correo' }}</div>
        </div>
        <app-menu></app-menu>
    </div>`
})
export class AppSidebar implements OnInit {
    usuarioActual: UsuarioModel | null = null;
    private readonly destroyRef = inject(DestroyRef);

    constructor(
        public el: ElementRef,
        private userService: UsuarioService
    ) {}

    ngOnInit(): void {
        this.usuarioActual = this.userService.getCurrentUser();
        this.userService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
            this.usuarioActual = user;
        });
    }

    getRolPrincipal(user: UsuarioModel): string {
        return user?.roles?.[0] || user?.tipoUsuario || 'Sin rol';
    }
}
