import { Component, OnInit } from '@angular/core';
import { AppDetallePrincipal } from '../../../layout/component/app.detalle-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppToolbarCrud } from '../../../layout/component/app.toolbar-crud';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { MacroSectorModel } from '../../../models/macro-sector.model';
import { SectorModel } from '../../../models/sector.model';
import { InputTextModule } from 'primeng/inputtext';
import { MacroSectorService } from '../../../service/macro-sector.service';
import { SectorService } from '../../../service/sector.service';
import { SubSectorService } from '../../../service/sub-sector.service';
import { ActivatedRoute } from '@angular/router';
import { SubSectorModel } from '../../../models/sub-sector.model';

@Component({
    selector: 'app-subsector-editar',
    standalone: true,
    template: `<div class="card">
        <app-detalle-principal [titulo]="titulo" [items]="items"></app-detalle-principal>
        <form [formGroup]="subsectorForm" (ngSubmit)="onSubmit()">
            <app-toolbar-crud [linkRegreso]="'/configuracion-institucional/sub-sectores'" [grabando]="grabando" [initializeUserForm]="initializeUserForm" [mostrarReset]="false"></app-toolbar-crud>
            <div class="p-fluid">
                <div class="p-field mt-8 mb-6">
                    <p-floatLabel>
                        <label for="id">Id</label>
                        <input id="id" type="text" pInputText formControlName="id" class="w-1/5" />
                    </p-floatLabel>
                    @if (subsectorForm.get('id')?.invalid && subsectorForm.get('id')?.touched) {
                        @if (subsectorForm.get('id')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El ID es requerido." />
                        }
                    }
                </div>
                <div class="p-field mt-8 mb-6">
                    <p-floatLabel>
                        <p-select id="macroSectorId" [options]="macroSectores" formControlName="macroSectorId" optionValue="id" optionLabel="nombre" class="w-1/3" [showClear]="true" (onChange)="buscarSector($event)" [filter]="true"> </p-select>
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
                        <p-select id="sectorId" [options]="sectores" formControlName="sectorId" optionValue="id" optionLabel="nombre" class="w-1/3" [showClear]="true" [loading]="cargaSector" [filter]="true"> </p-select>
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
    imports: [AppDetallePrincipal, ReactiveFormsModule, AppToolbarCrud, FloatLabelModule, MessageModule, SelectModule, InputTextModule],
    providers: [MessageService]
})
export class SubsectorEditarComponent implements OnInit {
    items: MenuItem[] = [];
    subsectorForm!: FormGroup;
    grabando = false;
    macroSectores: MacroSectorModel[] = [];
    sectores: SectorModel[] = [];
    cargaSector = false;
    id: number = 0;
    titulo: string = 'Editar Subsector';
    subsector!: SubSectorModel;
    constructor(
        private fb: FormBuilder,
        private macroSectorService: MacroSectorService,
        private sectorService: SectorService,
        private subSectorService: SubSectorService,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute
    ) {
        console.warn('SubsectorEditarComponent no implementado aún');
    }

    ngOnInit(): void {
        this.id = Number(this.activatedRoute.snapshot.params['id']);
        this.macroSectorService.getMacroSectores().subscribe({
            next: (macroSectores) => {
                this.macroSectores = macroSectores;
                this.subSectorService.getSubsectoresById(this.id).subscribe({
                    next: (subsector) => {
                        this.subsector = subsector;
                        const { sectorId } = subsector;
                        this.subsectorForm.patchValue({
                            id: subsector.id,
                            macroSectorId: subsector.macroSectorId,
                            codigo: subsector.codigo,
                            nombre: subsector.nombre
                        });
                        this.titulo = `Editar Subsector: ${subsector.nombre}`;
                        this.loadSectoresForMacroSector(subsector.macroSectorId);
                        this.subsectorForm.get('sectorId')?.setValue(sectorId);
                    },
                    error: (error) => {
                        console.error('Error al cargar el subsector:', error);
                    }
                })
            },
            error: (error) => {
                console.error('Error al cargar los macrosectores:', error);
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
        const subsectorData: SubSectorModel = {
            ...this.subsector,
            ...this.subsectorForm.value
        };
        this.subSectorService.updateSubSector(this.id, subsectorData).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error al guardar el subsector:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el subsector.' });
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }

    initializeUserForm() {
        this.subsectorForm = this.fb.group({
            id: [{value: '', disabled: true}, [Validators.required]],
            macroSectorId: ['', [Validators.required]],
            sectorId: ['', [Validators.required]],
            codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]]
        });
    }
    buscarSector($event: SelectChangeEvent) {
        const macroSectorId = $event.value;
        this.loadSectoresForMacroSector(macroSectorId);
    }

    private loadSectoresForMacroSector(macroSectorId: any) {
        this.cargaSector = true;
        this.subsectorForm.get('sectorId')?.disable();
        this.sectorService.getSectoresByMacroSectorId(macroSectorId).subscribe({
            next: (sectores) => {
                this.sectores = sectores;
                this.subsectorForm.get('sectorId')?.enable();
            },
            error: (error) => {
                console.error('Error al cargar los sectores:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los sectores.' });
            },
            complete: () => {
                this.cargaSector = false;
            }
        });
    }
}
