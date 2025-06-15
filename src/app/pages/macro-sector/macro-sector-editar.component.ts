import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MacroSectorService } from '../../service/macro-sector.service';
import { MacroSectorModel } from '../../models/macro-sector.model';
import { AppDetallePrincipal } from "../../layout/component/app.detalle-principal";
import { AppToolbarCrud } from "../../layout/component/app.toolbar-crud";

@Component({
    selector: 'app-macro-sector-editar',
    standalone: true,
    template: `<div class="card">
            <app-detalle-principal [items]="items" [titulo]="nombre"></app-detalle-principal>
            <form [formGroup]="macroSectorForm" (ngSubmit)="onSubmit()">
                <app-toolbar-crud [linkRegreso]="'/configuracion-institucional/macro-sectores'" [grabando]="grabando" [initializeUserForm]="initializeUserForm.bind(this)" [mostrarReset]="false"></app-toolbar-crud>
                <div class="p-fluid">
                    <div class="p-field mt-8 mb-6">
                        <p-floatLabel>
                            <label for="id">Id</label>
                            <input id="id" type="text" pInputText formControlName="id" class="w-1/5" />
                        </p-floatLabel>
                        @if (macroSectorForm.get('id')?.invalid && macroSectorForm.get('id')?.touched) {
                            @if (macroSectorForm.get('id')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El ID es requerido." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <input id="codigo" type="text" pInputText formControlName="codigo" class="w-1/5" style="text-transform:uppercase" />
                            <label for="codigo">Código</label>
                        </p-floatLabel>
                        @if (macroSectorForm.get('codigo')?.invalid && macroSectorForm.get('codigo')?.touched) {
                            @if (macroSectorForm.get('codigo')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El código es requerido." />
                            }
                            @if (macroSectorForm.get('codigo')?.errors?.['minlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El código debe tener al menos 3 caracteres." />
                            }
                            @if (macroSectorForm.get('codigo')?.errors?.['maxlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El código no puede exceder los 10 caracteres." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <label for="nombre">Nombre</label>
                            <input id="nombre" type="text" pInputText formControlName="nombre" class="w-1/2" style="text-transform:uppercase" />
                        </p-floatLabel>
                        @if (macroSectorForm.get('nombre')?.invalid && macroSectorForm.get('nombre')?.touched) {
                            @if (macroSectorForm.get('nombre')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre es requerido." />
                            }
                            @if (macroSectorForm.get('nombre')?.errors?.['minlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre debe tener al menos 3 caracteres." />
                            }
                            @if (macroSectorForm.get('nombre')?.errors?.['maxlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre no puede exceder los 255 caracteres." />
                            }
                        }
                    </div>
                </div>
            </form>
        </div>`,
    imports: [BreadcrumbModule, RouterModule, CommonModule, ReactiveFormsModule, ToolbarModule, ButtonModule, FloatLabelModule, MessageModule, ToastModule, InputTextModule, AppDetallePrincipal, AppToolbarCrud],
    providers: [MessageService]
})
export class MacroSectorEditarComponent implements OnInit {
    items: MenuItem[] = [];
    macroSectorForm!: FormGroup;
    grabando = false;
    nombre = '';
    macroSector!: MacroSectorModel;
    id: number = 0;
    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private macroSectorService: MacroSectorService,
        private messageService: MessageService
    ) {}
    ngOnInit() {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Configuracion Institucional' }, { label: 'MacroSector' }, { label: 'Editar', route: '/macro-sectores/editar' }];
        this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.macroSectorService.getMacroSectorById(this.id).subscribe({
            next: (data) => {
                this.macroSectorForm.patchValue({
                    id: data.id,
                    codigo: data.codigo,
                    nombre: data.nombre
                });
                this.macroSector = data;
                this.nombre = `Editar Macro Sector: ${data.nombre}`;
            },
            error: (error) => {
                console.error('Error al obtener el macro sector:', error);
            }
        });
        this.initializeUserForm();
    }

    initializeUserForm() {
        this.macroSectorForm = this.fb.group({
            id: [{ value: '', disabled: true }],
            codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]]
        });
        this.macroSectorForm.markAsUntouched();
    }

    onSubmit() {
        if (this.macroSectorForm.invalid) {
            this.macroSectorForm.markAllAsTouched();
            return;
        }

        this.grabando = true;
        const macroSectorData: MacroSectorModel = {
            ...this.macroSector,
            ...this.macroSectorForm.value
        };
        this.macroSectorService.updateMacroSector(this.id, macroSectorData).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error al actualizar el macro sector:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el macro sector.' });
                this.grabando = false;
            },
            complete: () => {
                console.log('Proceso de actualización completado.');
                this.grabando = false;
            }
        });
    }
}
