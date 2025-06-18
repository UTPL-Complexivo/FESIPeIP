import { Component, OnInit } from '@angular/core';
import { AppDetallePrincipal } from '../../layout/component/app.detalle-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppToolbarCrud } from '../../layout/component/app.toolbar-crud';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CatalogoModel } from '../../models/catalogo.model';
import { DialogModule } from 'primeng/dialog';
import { SelectGridComponent } from '../../helpers/select-grid.component';
import { SubSectorModel } from '../../models/sub-sector.model';
import { HeaderTableModel } from '../../models/header-table.model';
import { InputTextModule } from 'primeng/inputtext';
import { SubSectorService } from '../../service/sub-sector.service';
import { CatalogoService } from '../../service/catalogo.service';
import { InstitucionService } from '../../service/institucion.service';
import { ActivatedRoute } from '@angular/router';
import { InstitucionModel } from '../../models/institucion.model';

@Component({
    selector: 'app-institucion-editar',
    standalone: true,
    template: `<div class="card">
            <app-detalle-principal [titulo]="titulo" [items]="items"></app-detalle-principal>
            <form [formGroup]="institucionForm" (ngSubmit)="onSubmit()">
                <app-toolbar-crud [linkRegreso]="'/configuracion-institucional/instituciones'" [grabando]="grabando" [initializeUserForm]="initializeUserForm" [mostrarReset]="false"></app-toolbar-crud>
                <div class="p-fluid">
                    <div class="p-field mt-8 mb-6">
                        <p-floatLabel>
                            <label for="id">Id</label>
                            <input id="id" type="text" pInputText formControlName="id" class="w-1/5" />
                        </p-floatLabel>
                        @if (institucionForm.get('id')?.invalid && institucionForm.get('id')?.touched) {
                            @if (institucionForm.get('id')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El ID es requerido." />
                            }
                        }
                    </div>
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
            <app-select-grid [data]="subsectores" [globalFilters]="filters" [headers]="headers" (returnData)="seleccionSubSector($event)"></app-select-grid>
        </p-dialog>`,
    imports: [AppDetallePrincipal, ReactiveFormsModule, AppToolbarCrud, FloatLabelModule, MessageModule, InputGroupModule, InputGroupAddonModule, ButtonModule, SelectModule, DialogModule, SelectGridComponent, InputTextModule],
    providers: [MessageService]
})
export class InstitucionEditarComponent implements OnInit {
    items: MenuItem[] = [];
    institucionForm!: FormGroup;
    grabando: boolean = false;
    catalogos: CatalogoModel[] = [];
    visible: boolean = false;
    filters: string[] = [];
    titulo: string = 'Editar Institución';
    headers: HeaderTableModel[] = [
        { id: 'codigo', label: 'Código', type: 'text' },
        { id: 'nombre', label: 'Nombre', type: 'text' },
        { id: 'nombreMacroSector', label: 'Macro Sector', type: 'text' },
        { id: 'nombreSector', label: 'Sector', type: 'text' }
    ];
    subsectores: SubSectorModel[] = [];
    id: number = 0;
    institucion!: InstitucionModel;
    constructor(
        private fb: FormBuilder,
        private subSectorService: SubSectorService,
        private catalogoService: CatalogoService,
        private messageService: MessageService,
        private institucionService: InstitucionService,
        private activateRoute: ActivatedRoute
    ) {}
    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Configuracion Institucional' }, { label: 'Instituciones' }, { label: 'Editar', route: '/instituciones/editar' }];
        this.subSectorService.getSubsectores().subscribe({
            next: (data) => {
                this.subsectores = data;
            },
            error: (error) => {
                console.error('Error loading subsectores:', error);
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
        this.id = Number(this.activateRoute.snapshot.paramMap.get('id'));

        this.institucionService.getInstitucionById(this.id).subscribe({
            next: (data) => {
                this.institucion = data;
                this.titulo = `Editar Institución: ${data.nombre}`;
                this.institucionForm.patchValue({
                    id: data.id,
                    subSectorId: data.subsectorId,
                    codigo: data.codigo,
                    nombre: data.nombre,
                    macroSectorNombre: data.nombreMacroSector,
                    sectorNombre: data.nombreSector,
                    subSectorNombre: data.nombreSubsector,
                    nivelGobierno: data.nivelGobierno,
                    correo: data.correo,
                    direccion: data.direccion,
                    telefono: data.telefono
                });
            },
            error: (error) => {
                console.error('Error loading institucion:', error);
            }
        });

        this.initializeUserForm();
    }
    onSubmit() {
        if (this.institucionForm.invalid) {
            this.institucionForm.markAllAsTouched();
            return;
        }

        this.grabando = true;
        const institucionData = {
            ...this.institucion,
            ...this.institucionForm.value
        };

        this.institucionService.updateInstitucion(this.id, institucionData).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    this.grabando = false;
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                this.grabando = false;
            },
            error: (error) => {
                console.error('Error updating institucion:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la institución.' });
                this.grabando = false;
            }
        });
    }
    initializeUserForm() {
        this.institucionForm = this.fb.group({
            id: [{ value: '', disabled: true }, [Validators.required]],
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
    seleccionSubSector($event: any) {
        this.visible = false;
        this.institucionForm.patchValue({
            macroSectorNombre: $event.nombreMacroSector,
            sectorNombre: $event.nombreSector,
            subSectorNombre: $event.nombre,
            subSectorId: $event.id
        });
    }
    showSelect() {
        this.visible = true;
    }
}
