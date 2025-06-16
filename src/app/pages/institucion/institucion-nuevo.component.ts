import { Component, OnInit } from '@angular/core';
import { AppDetallePrincipal } from '../../layout/component/app.detalle-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppToolbarCrud } from '../../layout/component/app.toolbar-crud';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SubSectorService } from '../../service/sub-sector.service';
import { SubSectorModel } from '../../models/sub-sector.model';
import { SubsectorSelectComponent } from '../../helpers/select-grid.component';
import { HeaderTableModel } from '../../models/header-table.model';

@Component({
    selector: 'app-institucion-nuevo',
    standalone: true,
    template: `<div class="card">
            <app-detalle-principal [titulo]="'Nuevo Sector'" [items]="items"></app-detalle-principal>
            <form [formGroup]="institucionForm" (ngSubmit)="onSubmit()">
                <app-toolbar-crud [linkRegreso]="'/configuracion-institucional/sub-sectores'" [grabando]="grabando" [initializeUserForm]="initializeUserForm"></app-toolbar-crud>
                <div class="p-fluid">
                    <div class="p-field mt-8 mb-6 flex w-full gap-6">
                        <div class="flex-2">
                            <p-floatLabel>
                                <input pInputText id="macroSectorNombre" formControlName="macroSectorNombre" style="text-transform:uppercase" class="w-full" />
                                <label for="macroSectorNombre">Macro Sector</label>
                            </p-floatLabel>
                        </div>
                        <div class="flex-1">
                            <p-floatLabel>
                                <input pInputText id="sectorNombre" formControlName="sectorNombre" style="text-transform:uppercase" class="w-full" />
                                <label for="sectorNombre">Sector</label>
                            </p-floatLabel>
                        </div>
                        <div class="flex-1">
                            <p-floatLabel>
                                <p-inputgroup>
                                    <input pInputText formControlName="subSectorNombre" />
                                    <label for="codigo">Subsector</label>
                                    <p-inputgroup-addon>
                                        <p-button icon="pi pi-search" severity="secondary" variant="text" (click)="showSelect()" />
                                    </p-inputgroup-addon>
                                </p-inputgroup>
                            </p-floatLabel>
                        </div>
                    </div>
                    <div class="p-field mt-8 mb-6">
                        <p-floatLabel>
                            <input id="codigo" type="text" pInputText formControlName="codigo" class="w-1/5" style="text-transform:uppercase" />
                            <label for="codigo">Código</label>
                        </p-floatLabel>
                        @if (institucionForm.get('codigo')?.invalid && institucionForm.get('codigo')?.touched) {
                            @if (institucionForm.get('codigo')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El código es requerido." />
                            }
                            @if (institucionForm.get('codigo')?.errors?.['minlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El código debe tener al menos 3 caracteres." />
                            }
                            @if (institucionForm.get('codigo')?.errors?.['maxlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El código no puede exceder los 10 caracteres." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <label for="nombre">Nombre</label>
                            <input id="nombre" type="text" pInputText formControlName="nombre" class="w-1/2" style="text-transform:uppercase" />
                        </p-floatLabel>
                        @if (institucionForm.get('nombre')?.invalid && institucionForm.get('nombre')?.touched) {
                            @if (institucionForm.get('nombre')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre es requerido." />
                            }
                            @if (institucionForm.get('nombre')?.errors?.['minlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre debe tener al menos 3 caracteres." />
                            }
                            @if (institucionForm.get('nombre')?.errors?.['maxlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre no puede exceder los 255 caracteres." />
                            }
                        }
                    </div>
                </div>
            </form>
        </div>
        <p-dialog header="Seleccionar Subsector" [modal]="true" [(visible)]="visible" [style]="{ width: '96rem' }">
            <app-select-grid [data]="subsectores" [globalFilters]="filters" [headers]="headers" (returnData)="seleccionSubSector($event)"></app-select-grid>
        </p-dialog>`,
    imports: [AppDetallePrincipal, ReactiveFormsModule, AppToolbarCrud, FloatLabelModule, SelectModule, MessageModule, InputGroupModule, InputGroupAddonModule, ButtonModule, DialogModule, InputTextModule, SubsectorSelectComponent],
    providers: [MessageService]
})
export class InstitucionNuevoComponent implements OnInit {
    items: MenuItem[] = [];
    institucionForm!: FormGroup;
    grabando: boolean = false;
    visible: boolean = false;
    subsectores: SubSectorModel[] = [];
    filters: string[] = ['codigo', 'nombre', 'nombreMacroSector', 'nombreSector'];
    loading: boolean = true;
    headers: HeaderTableModel[] = [];
    constructor(
        private fb: FormBuilder,
        private subSectorService: SubSectorService
    ) {}
    ngOnInit() {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Configuracion Institucional' }, { label: 'Instituciones' }, { label: 'Nuevo', route: '/instituciones/nuevo' }];
        this.initializeUserForm();
        this.subSectorService.getSubsectores().subscribe({
            next: (data) => {
                this.subsectores = data;
                this.loading = false;
                this.headers = [
                    { id: 'codigo', label: 'Código', type: 'text' },
                    { id: 'nombre', label: 'Nombre', type: 'text' },
                    { id: 'nombreMacroSector', label: 'Macro Sector', type: 'text' },
                    { id: 'nombreSector', label: 'Sector', type: 'text' }
                ];
            },
            error: (error) => {
                console.error('Error loading subsectores:', error);
                this.loading = false;
            }
        });
    }
    onSubmit() {}
    initializeUserForm() {
        this.institucionForm = this.fb.group({
            subSectorId: ['', [Validators.required]],
            codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
            macroSectorNombre: [{value: '', disabled: true}, [Validators.required]],
            sectorNombre: [{value: '', disabled: true}, [Validators.required]],
            subSectorNombre: [{value: '', disabled: true}, [Validators.required]],
        });
    }
    showSelect() {
        this.visible = true;
    }

    seleccionSubSector($event: any) {
        console.log('Subsector seleccionado:', $event);
        this.visible = false;
        this.institucionForm.patchValue({
            macroSectorNombre: $event.nombreMacroSector,
            sectorNombre: $event.nombreSector,
            subSectorNombre: $event.nombre,
            subSectorId: $event.id
        });
    }
}
