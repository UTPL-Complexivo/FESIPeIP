import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
    selector: 'app-usuarios-nuevo',
    standalone: true,
    template: `
        <div class="card">
            <div class="font-semibold text-xl">Usuarios</div>
            <p-breadcrumb class="max-w-full" [model]="items">
                <ng-template #item let-item>
                    <ng-container *ngIf="item.route; else elseBlock">
                        <a [routerLink]="item.route" class="p-breadcrumb-item-link">
                            <span [ngClass]="[item.icon ? item.icon : '', 'text-color']"></span>
                            <span class="text-primary font-semibold">{{ item.label }}</span>
                        </a>
                    </ng-container>
                    <ng-template #elseBlock>
                        <a [href]="item.url">
                            <span class="text-color">{{ item.label }}</span>
                        </a>
                    </ng-template>
                </ng-template>
            </p-breadcrumb>
        </div>
    `,
    imports: [BreadcrumbModule, RouterModule, CommonModule]
})
export class UsuariosNuevoComponent implements OnInit {
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    constructor() {}
    ngOnInit() {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Gestión de Usuarios' }, { label: 'Usuarios', route: '/usuarios' }, { label: 'Nuevo', route: '/usuarios/nuevo' }];
    }
}
