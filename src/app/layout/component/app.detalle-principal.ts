import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MenuItem } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";

@Component({
    selector: 'app-detalle-principal',
    standalone: true,
    template: `<div class="font-semibold text-xl">{{titulo}}</div>
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
        </p-breadcrumb>`,
    imports: [BreadcrumbModule, RouterModule, CommonModule],
    providers: []
})
export class AppDetallePrincipal {
    @Input({ required: true }) items: MenuItem[] = [];
    @Input({ required: true }) titulo: string = '';
    constructor() {}
}
