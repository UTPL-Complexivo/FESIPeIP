import { Component, OnInit } from '@angular/core';
import { AppDetallePrincipal } from '../../../layout/component/app.detalle-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppToolbarCrud } from '../../../layout/component/app.toolbar-crud';
import { MacroSectorModel } from '../../../models/macro-sector.model';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MacroSectorService } from '../../../service/macro-sector.service';
import { ActivatedRoute } from '@angular/router';
import { SectorService } from '../../../service/sector.service';
import { SectorModel } from '../../../models/sector.model';

@Component({
    selector: 'app-sector-editar',
    standalone: true,
    template: `<div class="card">
        <app-detalle-principal [items]="items" [titulo]="nombre"></app-detalle-principal>
        <form [formGroup]="sectorForm" (ngSubmit)="onSubmit()">
            <app-toolbar-crud [linkRegreso]="'/configuracion-institucional/sectores'" [grabando]="grabando" [initializeUserForm]="initializeUserForm.bind(this)" [mostrarReset]="false"></app-toolbar-crud>
            <div class="p-fluid">
                <div class="p-field mt-8 mb-6">
                    <p-floatLabel>
                        <label for="id">Id</label>
                        <input id="id" type="text" pInputText formControlName="id" class="w-1/5" />
                    </p-floatLabel>
                    @if (sectorForm.get('id')?.invalid && sectorForm.get('id')?.touched) {
                        @if (sectorForm.get('id')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El ID es requerido." />
                        }
                    }
                </div>
                <div class="p-field mt-8 mb-6">
                    <p-floatLabel>
                        <p-select id="macroSectorId" [options]="macroSectores" formControlName="macroSectorId" optionValue="id" optionLabel="nombre" class="w-1/3" [showClear]="true"> </p-select>
                        <label for="macroSectorId">Macro Sector</label>
                    </p-floatLabel>
                    @if (sectorForm.get('macroSectorId')?.invalid && sectorForm.get('macroSectorId')?.touched) {
                        @if (sectorForm.get('macroSectorId')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El macro sector es requerido." />
                        }
                    }
                </div>
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <input id="codigo" type="text" pInputText formControlName="codigo" class="w-1/5" style="text-transform:uppercase" />
                        <label for="codigo">Código</label>
                    </p-floatLabel>
                    @if (sectorForm.get('codigo')?.invalid && sectorForm.get('codigo')?.touched) {
                        @if (sectorForm.get('codigo')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El código es requerido." />
                        }
                        @if (sectorForm.get('codigo')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El código debe tener al menos 3 caracteres." />
                        }
                        @if (sectorForm.get('codigo')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El código no puede exceder los 10 caracteres." />
                        }
                    }
                </div>
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <label for="nombre">Nombre</label>
                        <input id="nombre" type="text" pInputText formControlName="nombre" class="w-1/2" style="text-transform:uppercase" />
                    </p-floatLabel>
                    @if (sectorForm.get('nombre')?.invalid && sectorForm.get('nombre')?.touched) {
                        @if (sectorForm.get('nombre')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre es requerido." />
                        }
                        @if (sectorForm.get('nombre')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre debe tener al menos 3 caracteres." />
                        }
                        @if (sectorForm.get('nombre')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre no puede exceder los 255 caracteres." />
                        }
                    }
                </div>
            </div>
        </form>
    </div>`,
    imports: [AppDetallePrincipal, ReactiveFormsModule, AppToolbarCrud, FloatLabel, MessageModule, InputTextModule, ButtonModule, SelectModule],
    providers: [MessageService]
})
export class SectorEditarComponent implements OnInit {
    items: MenuItem[] = [];
    nombre: string = 'Sector Editar';
    sectorForm!: FormGroup;
    grabando: boolean = false;
    macroSectores: MacroSectorModel[] = [];
    id: number = 0;
    sector!: SectorModel;
    constructor(
        private fb: FormBuilder,
        private macroSectorService: MacroSectorService,
        private activatedRoute: ActivatedRoute,
        private sectorService: SectorService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Configuracion Institucional' }, { label: 'Sectores' }, { label: 'Editar', route: '/sectores/id' }];
        this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.macroSectorService.getMacroSectores().subscribe({
            next: (data) => {
                this.macroSectores = data.filter((macroSector) => macroSector.estado === 'Activo');
                this.sectorService.getSectorById(this.id).subscribe({
                    next: (data) => {
                        this.sector = data;
                        this.nombre = `Editar Sector: ${data.nombre}`;
                        this.sectorForm.patchValue({
                            id: data.id,
                            codigo: data.codigo,
                            nombre: data.nombre,
                            macroSectorId: data.macroSectorId
                        });
                    },
                    error: (error) => {
                        console.error('Error fetching sector:', error);
                    }
                });
            },
            error: (error) => {
                console.error('Error fetching macro sectors:', error);
            }
        });

        this.initializeUserForm();
    }

    onSubmit() {
        if (this.sectorForm.invalid) {
            this.sectorForm.markAllAsTouched();
            return;
        }
        const editedSector = {
            ...this.sector,
            ...this.sectorForm.value
        };

        this.grabando = true;
        this.sectorService.updateSector(this.id, editedSector).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error al actualizar el sector:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el sector.' });
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }

    initializeUserForm() {
        this.sectorForm = this.fb.group({
            id: [{ value: '', disabled: true }, [Validators.required]],
            codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
            macroSectorId: ['', [Validators.required]]
        });
    }
}
