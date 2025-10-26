import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { AppFloatingConfigurator } from '../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-callback',
    standalone: true,
    imports: [CommonModule, ProgressSpinnerModule, CardModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                        <div class="gap-4 flex flex-col items-center">
                            <div class="flex justify-center items-center border-2 border-primary-500 rounded-full" style="width: 3.2rem; height: 3.2rem">
                                <i class="text-primary-500 pi pi-fw pi-sign-in !text-2xl"></i>
                            </div>
                            <h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-5xl mb-2 text-center">Procesando Autenticación</h1>
                            <span class="text-muted-color mb-8 text-center">Por favor espere mientras validamos sus credenciales...</span>

                            <div class="flex flex-col items-center gap-4">
                                <p-progressSpinner
                                    [style]="{'width': '60px', 'height': '60px'}"
                                    strokeWidth="4"
                                    fill="var(--surface-ground)"
                                    animationDuration="1s">
                                </p-progressSpinner>
                                <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">Autenticando usuario...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class CallbackComponent implements OnInit {
    constructor(private auth: AuthService, private router: Router) {}

    ngOnInit() {
        this.auth.handleRedirectCallback().subscribe({
            next: ({ appState }) => {
                const target = appState?.target ?? '/';
                this.router.navigateByUrl(target);
            },
            error: err => {
                console.error('Error al procesar callback', err);
                // Redirigir a página de error si hay problema con el callback
                this.router.navigateByUrl('/auth/error');
            }
        });
    }
}
