import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";

@Component({
    selector: 'app-toolbar-crud',
    standalone: true,
    template: ` <p-toolbar>
                <ng-template #start>
                    <button pButton type="button" icon="pi pi-arrow-left" label="Regresar" class="p-button-secondary mr-2" [routerLink]="[linkRegreso]" [disabled]="grabando"></button>
                    <button pButton type="submit" icon="pi pi-save" label="Guardar" class="mr-2" [disabled]="grabando"></button>
                    @if(mostrarReset){
                        <p-button type="button" icon="pi pi-refresh" label="Resetear" severity="warn" variant="outlined" (click)="initializeUserForm()" [disabled]="grabando"></p-button>
                    }
                </ng-template>
            </p-toolbar>
            <p-toast/>`,
    imports: [ToolbarModule, ButtonModule, RouterModule, ToastModule],
    providers: []
})

export class AppToolbarCrud {
    @Input({ required: true }) linkRegreso: string = '';
    @Input({ required: true }) grabando: boolean = false;
    @Input({ required: true }) initializeUserForm: () => void = () => { console.warn('initializeUserForm function not provided'); };
    @Input() mostrarReset: boolean = true;
}
