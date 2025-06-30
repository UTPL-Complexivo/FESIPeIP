import { Component, OnInit } from '@angular/core';
import { AppDetallePrincipal } from '../../../layout/component/app.detalle-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppToolbarCrud } from '../../../layout/component/app.toolbar-crud';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SubSectorService } from '../../../service/sub-sector.service';
import { SubSectorModel } from '../../../models/sub-sector.model';
import { SelectGridComponent } from '../../../helpers/select-grid.component';
import { HeaderTableModel } from '../../../models/header-table.model';
import { CatalogoService } from '../../../service/catalogo.service';
import { CatalogoModel } from '../../../models/catalogo.model';
import { InstitucionService } from '../../../service/institucion.service';
import { ActiveFilterPipe } from '../../../pipes/active-filter.pipe';

@Component({
    selector: 'app-institucion-nuevo',
    standalone: true,
    template: `<div class="card">
            <app-detalle-principal [titulo]="'Nueva Institución'" [items]="items"></app-detalle-principal>
            <form [formGroup]="institucionForm" (ngSubmit)="onSubmit()">
                <app-toolbar-crud [linkRegreso]="'/configuracion-institucional/instituciones'" [grabando]="grabando" [initializeUserForm]="initializeUserForm"></app-toolbar-crud>
                <div class="p-fluid">
                    <div class="p-field mt-8 mb-6 flex w-full gap-6">
                        <div class="flex-2">
                            <p-floatLabel>
                                <input pInputText id="macroSectorNombre" formControlName="macroSectorNombre" style="text-transform:uppercase" class="w-full" />
                                <label for="macroSectorNombre">Macro Sector</label>
                            </p-floatLabel>
                            @if (institucionForm.get('macroSectorNombre')?.invalid && institucionForm.get('macroSectorNombre')?.touched) {
                                @if (institucionForm.get('macroSectorNombre')?.errors?.['required']) {
                                    <p-message severity="error" variant="simple" size="small" text="El macro sector es requerido." />
                                }
                            }
                        </div>
                        <div class="flex-1">
                            <p-floatLabel>
                                <input pInputText id="sectorNombre" formControlName="sectorNombre" style="text-transform:uppercase" class="w-full" />
                                <label for="sectorNombre">Sector</label>
                            </p-floatLabel>
                            @if (institucionForm.get('sectorNombre')?.invalid && institucionForm.get('sectorNombre')?.touched) {
                                @if (institucionForm.get('sectorNombre')?.errors?.['required']) {
                                    <p-message severity="error" variant="simple" size="small" text="El sector es requerido." />
                                }
                            }
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
                            @if (institucionForm.get('subSectorNombre')?.invalid && institucionForm.get('subSectorNombre')?.touched) {
                                @if (institucionForm.get('subSectorNombre')?.errors?.['required']) {
                                    <p-message severity="error" variant="simple" size="small" text="El subsector es requerido." />
                                }
                            }
                        </div>
                    </div>
                    <div class="p-field mt-8 mb-6">
                        <p-floatLabel>
                            <p-select id="nivelGobierno" formControlName="nivelGobierno" [options]="catalogos" optionLabel="valor" optionValue="valor" class="w-1/5"> </p-select>
                            <label for="nivelGobierno">Nivel de Gobierno</label>
                        </p-floatLabel>
                        @if (institucionForm.get('nivelGobierno')?.invalid && institucionForm.get('nivelGobierno')?.touched) {
                            @if (institucionForm.get('nivelGobierno')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El nivel de gobierno es requerido." />
                            }
                        }
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
                            <input id="nombre" type="text" pInputText formControlName="nombre" class="w-full" style="text-transform:uppercase" />
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
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <label for="correo">Correo electrónico</label>
                            <input id="correo" type="text" pInputText formControlName="correo" class="w-1/2" />
                        </p-floatLabel>
                        @if (institucionForm.get('correo')?.invalid && institucionForm.get('correo')?.touched) {
                            @if (institucionForm.get('correo')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El correo es requerido." />
                            }
                            @if (institucionForm.get('correo')?.errors?.['email']) {
                                <p-message severity="error" variant="simple" size="small" text="El correo debe ser un email válido." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <label for="direccion">Dirección</label>
                            <input id="direccion" type="text" pInputText formControlName="direccion" class="w-full" />
                        </p-floatLabel>
                        @if (institucionForm.get('direccion')?.invalid && institucionForm.get('direccion')?.touched) {
                            @if (institucionForm.get('direccion')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="La dirección es requerida." />
                            }
                            @if (institucionForm.get('direccion')?.errors?.['minlength']) {
                                <p-message severity="error" variant="simple" size="small" text="La dirección debe tener al menos 3 caracteres." />
                            }
                            @if (institucionForm.get('direccion')?.errors?.['maxlength']) {
                                <p-message severity="error" variant="simple" size="small" text="La dirección no puede exceder los 500 caracteres." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <label for="telefono">Teléfono</label>
                            <input id="telefono" type="text" pInputText formControlName="telefono" class="w-1/2" style="text-transform:uppercase" />
                        </p-floatLabel>
                        @if (institucionForm.get('telefono')?.invalid && institucionForm.get('telefono')?.touched) {
                            @if (institucionForm.get('telefono')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El teléfono es requerido." />
                            }
                            @if (institucionForm.get('telefono')?.errors?.['pattern']) {
                                <p-message severity="error" variant="simple" size="small" text="El teléfono debe contener solo números." />
                            }
                        }
                    </div>
                </div>
            </form>
        </div>
        <p-dialog header="Seleccionar Subsector" [modal]="true" [(visible)]="visible" [style]="{ width: '96rem' }">
            <app-select-grid [data]="subsectores | activeFilter" [globalFilters]="filters" [headers]="headers" (returnData)="seleccionSubSector($event)"></app-select-grid>
        </p-dialog>`,
    imports: [AppDetallePrincipal, ReactiveFormsModule, AppToolbarCrud, FloatLabelModule, SelectModule, MessageModule, InputGroupModule, InputGroupAddonModule, ButtonModule, DialogModule, InputTextModule, SelectGridComponent, ActiveFilterPipe],
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
    catalogos: CatalogoModel[] = [];
    constructor(
        private fb: FormBuilder,
        private subSectorService: SubSectorService,
        private catalogoService: CatalogoService,
        private messageService: MessageService,
        private institucionService: InstitucionService
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

        this.catalogoService.getCatalogosByTipo(0).subscribe({
            next: (data) => {
                this.catalogos = data as CatalogoModel[];
            },
            error: (error) => {
                console.error('Error loading catalogos:', error);
            }
        });
    }
    onSubmit() {
        if (this.institucionForm.invalid) {
            console.warn('Formulario inválido:', this.institucionForm.errors);
            this.institucionForm.markAllAsTouched();
            return;
        }

        this.grabando = true;
        this.institucionService.addInstitucion(this.institucionForm.value).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error al guardar la institución:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la institución.' });
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
                this.institucionForm.reset();
                this.institucionForm.markAsPristine();
            }
        });
    }
    initializeUserForm() {
        this.institucionForm = this.fb.group({
            subSectorId: ['', [Validators.required]],
            codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
            macroSectorNombre: [{ value: '', disabled: true }, [Validators.required]],
            sectorNombre: [{ value: '', disabled: true }, [Validators.required]],
            subSectorNombre: [{ value: '', disabled: true }, [Validators.required]],
            nivelGobierno: [null, [Validators.required]],
            correo: ['', [Validators.required, Validators.email]],
            direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
            telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
        });
    }
    showSelect() {
        this.visible = true;
    }

    seleccionSubSector($event: any) {
        this.visible = false;
        this.institucionForm.patchValue({
            macroSectorNombre: $event.nombreMacroSector,
            sectorNombre: $event.nombreSector,
            subSectorNombre: $event.nombre,
            subSectorId: $event.id
        });
    }
}
