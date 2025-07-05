import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-cabecera-principal',
    standalone: true,
    template: `<div class="font-semibold text-xl">{{ titulo }}</div>
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
        @if (nuevo) {
            <p-toolbar>
                <ng-template #start>
                    <button pButton type="button" icon="pi pi-plus" label="Nuevo registro" class="p-button-success" [routerLink]="[linkNuevo]"></button>
                </ng-template>
            </p-toolbar>
        } `,
    imports: [BreadcrumbModule, ToolbarModule, RouterModule, CommonModule, ButtonModule],
    providers: []
})
export class AppCabeceraPrincipal {
    @Input({ required: true }) items: MenuItem[] = [];
    @Input({ required: true }) titulo: string = '';
    @Input({ required: true }) linkNuevo: string = '';
    @Input() nuevo: boolean = true;
    constructor() {}
}
