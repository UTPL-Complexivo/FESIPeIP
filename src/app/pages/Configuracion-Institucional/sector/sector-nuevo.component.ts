import { Component, OnInit } from '@angular/core';
import { AppDetallePrincipal } from '../../../layout/component/app.detalle-principal';
import { AppToolbarCrud } from '../../../layout/component/app.toolbar-crud';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MacroSectorService } from '../../../service/macro-sector.service';
import { MacroSectorModel } from '../../../models/macro-sector.model';
import { SelectModule } from 'primeng/select';
import { SectorService } from '../../../service/sector.service';

@Component({
    selector: 'app-sector-nuevo',
    standalone: true,
    template: `<div class="card">
        <app-detalle-principal [titulo]="'Nuevo Sector'" [items]="items"></app-detalle-principal>
        <form [formGroup]="sectorForm" (ngSubmit)="onSubmit()">
            <app-toolbar-crud [linkRegreso]="'/configuracion-institucional/sectores'" [grabando]="grabando" [initializeUserForm]="initializeUserForm"></app-toolbar-crud>
            <div class="p-fluid">
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
                <div class="p-field mt-8 mb-6">
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
    imports: [AppDetallePrincipal, AppToolbarCrud, InputTextModule, InputTextModule, ButtonModule, CommonModule, MessageModule, FloatLabelModule, ReactiveFormsModule, SelectModule],
    providers: [MessageService]
})
export class SectorNuevoComponent implements OnInit {
    items: MenuItem[] = [];
    grabando: boolean = false;
    sectorForm!: FormGroup;
    macroSectores: MacroSectorModel[] = [];
    constructor(
        private fb: FormBuilder,
        private macroSectorService: MacroSectorService,
        private sectorService: SectorService,
        private messageService: MessageService
    ) {}
    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Configuracion Institucional' }, { label: 'Sectores' }, { label: 'Nuevo', route: '/sectores/nuevo' }];
        this.initializeUserForm();
        this.macroSectorService.getMacroSectores().subscribe({
            next: (data) => {
                this.macroSectores = data.filter((macroSector) => macroSector.estado === 'Activo');
            },
            error: (error) => {
                console.error('Error al obtener los macro sectores:', error);
            }
        });
    }

    initializeUserForm() {
        this.sectorForm = this.fb.group({
            codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
            macroSectorId: [null, [Validators.required]]
        });
    }

    onSubmit() {
        if(this.sectorForm.invalid) {
            this.sectorForm.markAllAsTouched();
            return;
        }
        this.grabando = true;
        this.sectorService.addSector(this.sectorForm.value).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error al crear el sector:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el sector.' });
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
                this.initializeUserForm();
            }
        });
    }
}
