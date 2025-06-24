import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Sistema Integral de Planificación e Inversión Pública  by
        <a href="https://programacion-ecuador.com" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Vladimir Miranda (Programación Ecuador)</a>
    </div>`
})
export class AppFooter {}
