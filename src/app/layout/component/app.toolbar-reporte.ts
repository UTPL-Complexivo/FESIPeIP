import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-toolbar-reporte',
    standalone: true,
    template: `
        <p-toolbar>
            <div class="p-toolbar-group-start">
                <h5 class="m-0">{{ titulo }}</h5>
            </div>
            <div class="p-toolbar-group-end">
                <div class="flex gap-2">
                    <button
                        pButton
                        type="button"
                        label="Excel"
                        icon="pi pi-file-excel"
                        class="p-button-success"
                        (click)="exportarExcel()"
                        [loading]="loadingExcel"
                        [disabled]="disabled">
                    </button>
                    <button
                        pButton
                        type="button"
                        label="PDF"
                        icon="pi pi-file-pdf"
                        class="p-button-danger"
                        (click)="exportarPDF()"
                        [loading]="loadingPDF"
                        [disabled]="disabled">
                    </button>
                    <button
                        pButton
                        type="button"
                        label="JSON"
                        icon="pi pi-file"
                        class="p-button-info"
                        (click)="exportarJSON()"
                        [loading]="loadingJSON"
                        [disabled]="disabled">
                    </button>
                </div>
            </div>
        </p-toolbar>
    `,
    imports: [
        CommonModule,
        ToolbarModule,
        ButtonModule
    ]
})
export class AppToolbarReporte {
    @Input() titulo: string = 'Reportes';
    @Input() disabled: boolean = false;
    @Input() loadingExcel: boolean = false;
    @Input() loadingPDF: boolean = false;
    @Input() loadingJSON: boolean = false;

    @Output() exportExcel = new EventEmitter<void>();
    @Output() exportPDF = new EventEmitter<void>();
    @Output() exportJSON = new EventEmitter<void>();

    exportarExcel() {
        this.exportExcel.emit();
    }

    exportarPDF() {
        this.exportPDF.emit();
    }

    exportarJSON() {
        this.exportJSON.emit();
    }
}
