import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AppEstadoGeneral } from '../layout/component/app.estado-general';
import { HeaderTableModel } from '../models/header-table.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-select-grid',
    standalone: true,
    template: `<p-table #dt1 [value]="data" [tableStyle]="{ 'min-width': '50rem' }" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10, 20, 50, 100]" [responsiveLayout]="'scroll'" [globalFilterFields]="globalFilters" [size]="'small'">
        <ng-template #caption>
            <div class="flex justify-between items-center flex-column sm:flex-row">
                <button pButton label="Limpiar Filtro General" class="p-button-outlined mb-2" icon="pi pi-filter-slash" (click)="clear(dt1)"></button>
                <p-iconfield iconPosition="left" class="ml-auto">
                    <p-inputicon>
                        <i class="pi pi-search"></i>
                    </p-inputicon>
                    <input pInputText type="text" (input)="onGlobalFilter(dt1, $event)" placeholder="Filtro General" />
                </p-iconfield>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th>Acciones</th>
                @for (item of headers; track $index) {
                    <th [pSortableColumn]="item.id">
                        <div class="flex justify-between items-center w-full">
                            <span>{{ item.label }}</span>
                            <div class="flex items-center gap-2 mr-3">
                                <p-columnFilter [type]="item.type" [field]="item.id" display="menu" [placeholder]="'Buscar por ' + item.id"></p-columnFilter>
                                <p-sortIcon [field]="item.id"></p-sortIcon>
                            </div>
                        </div>
                    </th>
                }
            </tr>
        </ng-template>
        <ng-template #body let-item>
            <tr>
                <td>
                    <button pButton icon="pi pi-check" class="p-button-rounded p-button-text" (click)="selectSubsector(item)"></button>
                </td>
                @for (header of headers; track $index) {
                    @if (header.id === 'estado') {
                        <td>
                            <app-estado-general [estado]="item[header.id]"></app-estado-general>
                        </td>
                    } @else {
                        <td>{{ item[header.id] }}</td>
                    }
                }
            </tr>
        </ng-template>
        <ng-template #emptymessage>
            <tr>
                <td colspan="4">Al momento no se dispone de información.</td>
            </tr>
        </ng-template>
        <ng-template #loadingbody>
            <tr>
                <td colspan="4">Cargando informacion. Por favor espere.</td>
            </tr>
        </ng-template>
    </p-table>`,
    imports: [TableModule, IconFieldModule, InputIconModule, AppEstadoGeneral, InputTextModule, ButtonModule],
    providers: []
})
export class SubsectorSelectComponent {
    @ViewChild('filter') filter!: ElementRef;
    @Input({ required: true }) globalFilters: string[] = [];
    @Input({ required: true }) headers: HeaderTableModel[] = [];
    @Input({ required: true }) data: any[] = [];
    @Output() returnData: EventEmitter<any> = new EventEmitter();
    constructor() {}
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    selectSubsector(item: any) {
        this.returnData.emit(item);
    }
}
