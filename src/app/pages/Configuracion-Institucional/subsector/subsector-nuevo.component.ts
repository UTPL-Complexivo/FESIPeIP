import { Component, OnInit } from '@angular/core';
import { AppDetallePrincipal } from '../../../layout/component/app.detalle-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppToolbarCrud } from '../../../layout/component/app.toolbar-crud';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { MacroSectorModel } from '../../../models/macro-sector.model';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { SectorModel } from '../../../models/sector.model';
import { MacroSectorService } from '../../../service/macro-sector.service';
import { SectorService } from '../../../service/sector.service';
import { SubSectorService } from '../../../service/sub-sector.service';
import { ActiveFilterPipe } from '../../../pipes/active-filter.pipe';
import { EstadoConfiguracionInstitucional } from '../../../shared/enums/estado-configuracion-institucional.enum';

@Component({
    selector: 'app-subsector-nuevo',
    standalone: true,
    template: `<div class="card">
        <app-detalle-principal [titulo]="'Nuevo Sector'" [items]="items"></app-detalle-principal>
        <form [formGroup]="subsectorForm" (ngSubmit)="onSubmit()">
            <app-toolbar-crud [linkRegreso]="'/configuracion-institucional/sub-sectores'" [grabando]="grabando" [initializeUserForm]="initializeUserForm"></app-toolbar-crud>
            <div class="p-fluid">
                <div class="p-field mt-8 mb-6">
                    <p-floatLabel>
                        <p-select id="macroSectorId" [options]="macroSectores | activeFilter" formControlName="macroSectorId" optionValue="id" optionLabel="nombre" class="w-1/3" [showClear]="true" (onChange)="buscarSector($event)" [filter]="true"> </p-select>
                        <label for="macroSectorId">Macro Sector</label>
                    </p-floatLabel>
                    @if (subsectorForm.get('macroSectorId')?.invalid && subsectorForm.get('macroSectorId')?.touched) {
                        @if (subsectorForm.get('macroSectorId')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El macro sector es requerido." />
                        }
                    }
                </div>
                <div class="p-field mt-8 mb-6">
                    <p-floatLabel>
                        <p-select id="sectorId" [options]="sectores | activeFilter" formControlName="sectorId" optionValue="id" optionLabel="nombre" class="w-1/3" [showClear]="true" [loading]="cargaSector" [filter]="true"> </p-select>
                        <label for="sectorId">Sector</label>
                    </p-floatLabel>
                    @if (subsectorForm.get('sectorId')?.invalid && subsectorForm.get('sectorId')?.touched) {
                        @if (subsectorForm.get('sectorId')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El sector es requerido." />
                        }
                    }
                </div>
                <div class="p-field mt-8 mb-6">
                    <p-floatLabel>
                        <input id="codigo" type="text" pInputText formControlName="codigo" class="w-1/5" style="text-transform:uppercase" />
                        <label for="codigo">Código</label>
                    </p-floatLabel>
                    @if (subsectorForm.get('codigo')?.invalid && subsectorForm.get('codigo')?.touched) {
                        @if (subsectorForm.get('codigo')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El código es requerido." />
                        }
                        @if (subsectorForm.get('codigo')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El código debe tener al menos 3 caracteres." />
                        }
                        @if (subsectorForm.get('codigo')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El código no puede exceder los 10 caracteres." />
                        }
                    }
                </div>
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <label for="nombre">Nombre</label>
                        <input id="nombre" type="text" pInputText formControlName="nombre" class="w-1/2" style="text-transform:uppercase" />
                    </p-floatLabel>
                    @if (subsectorForm.get('nombre')?.invalid && subsectorForm.get('nombre')?.touched) {
                        @if (subsectorForm.get('nombre')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre es requerido." />
                        }
                        @if (subsectorForm.get('nombre')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre debe tener al menos 3 caracteres." />
                        }
                        @if (subsectorForm.get('nombre')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre no puede exceder los 255 caracteres." />
                        }
                    }
                </div>
            </div>
        </form>
    </div>`,
    imports: [AppDetallePrincipal, ReactiveFormsModule, AppToolbarCrud, FloatLabelModule, SelectModule, MessageModule, InputTextModule, ActiveFilterPipe],
    providers: [MessageService]
})
export class SubsectorNuevoComponent implements OnInit {
    items: MenuItem[] = [];
    subsectorForm!: FormGroup;
    grabando: boolean = false;
    macroSectores: MacroSectorModel[] = [];
    sectores: SectorModel[] = [];
    cargaSector: boolean = false;
    constructor(
        private fb: FormBuilder,
        private macroSectorService: MacroSectorService,
        private sectorSevice: SectorService,
        private subSectorService: SubSectorService,
        private messageService: MessageService,
    ) {

    }

    ngOnInit() {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Configuracion Institucional' }, { label: 'Sub Sectores' }, { label: 'Nuevo', route: '/sub-sectores/nuevo' }];
        this.macroSectorService.getMacroSectores().subscribe({
            next: (data) => {
                this.macroSectores = data;
            },
            error: (error) => {
                console.error('Error loading macro sectors:', error);
            }
        });
        this.initializeUserForm();
    }

    onSubmit() {
        if(this.subsectorForm.invalid) {
            this.subsectorForm.markAllAsTouched();
            return;
        }

        this.grabando = true;
        this.subSectorService.addSubSector(this.subsectorForm.value).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error saving sector:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el sector.' });
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
                this.initializeUserForm();
            }
        });
    }

    initializeUserForm() {
        this.subsectorForm = this.fb.group({
            macroSectorId: [null, [Validators.required]],
            sectorId: [{value: null, disabled: true}, [Validators.required]],
            codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]]
        });
    }

    buscarSector($event: SelectChangeEvent) {
        this.sectores = [];
        this.subsectorForm.get('sectorId')?.disable();
        if($event.value){
            this.cargaSector = true;
            this.sectorSevice.getSectoresByMacroSectorId($event.value).subscribe({
                next: (data) => {
                    this.sectores = data;
                    this.subsectorForm.get('sectorId')?.enable();
                },
                error: (error) => {
                    console.error('Error loading sectors:', error);
                    this.cargaSector = false;
                },
                complete: () => {
                    this.cargaSector = false;
                }
            });
        }
    }
}
