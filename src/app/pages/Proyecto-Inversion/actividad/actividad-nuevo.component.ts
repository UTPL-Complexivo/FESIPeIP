import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { ActividadService } from '../../../service/actividad.service';
import { AppDetallePrincipal } from "../../../layout/component/app.detalle-principal";
import { AppToolbarCrud } from "../../../layout/component/app.toolbar-crud";

@Component({
    selector: 'app-actividad-nuevo',
    standalone: true,
    template: `<div class="card">
        <app-detalle-principal [items]="items" titulo="Nueva Actividad"></app-detalle-principal>
        <form [formGroup]="actividadForm" (ngSubmit)="onSubmit()">
            <app-toolbar-crud [linkRegreso]="'/proyecto-inversion/actividad'" [grabando]="grabando" [initializeUserForm]="initializeUserForm.bind(this)"></app-toolbar-crud>
            <div class="p-fluid">
                <div class="p-field mt-8 mb-6">
                    <p-floatLabel>
                        <input id="codigo" type="text" pInputText formControlName="codigo" class="w-1/5" style="text-transform:uppercase" />
                        <label for="codigo">Código</label>
                    </p-floatLabel>
                    @if (actividadForm.get('codigo')?.invalid && actividadForm.get('codigo')?.touched) {
                        @if (actividadForm.get('codigo')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El código es requerido." />
                        }
                        @if (actividadForm.get('codigo')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El código debe tener al menos 3 caracteres." />
                        }
                        @if (actividadForm.get('codigo')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El código no puede exceder los 10 caracteres." />
                        }
                    }
                </div>
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <input id="nombre" type="text" pInputText formControlName="nombre" class="w-1/2" style="text-transform:uppercase" />
                        <label for="nombre">Nombre</label>
                    </p-floatLabel>
                    @if (actividadForm.get('nombre')?.invalid && actividadForm.get('nombre')?.touched) {
                        @if (actividadForm.get('nombre')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre es requerido." />
                        }
                        @if (actividadForm.get('nombre')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre debe tener al menos 3 caracteres." />
                        }
                        @if (actividadForm.get('nombre')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre no puede exceder los 255 caracteres." />
                        }
                    }
                </div>
            </div>
        </form>
    </div>
    `,
    imports: [ReactiveFormsModule, BreadcrumbModule, CommonModule, RouterModule, SelectModule, ToolbarModule, ButtonModule, InputTextModule, FloatLabelModule, MessageModule, AppDetallePrincipal, AppToolbarCrud],
    providers: [MessageService]
})
export class ActividadNuevoComponent implements OnInit {
    actividadForm!: FormGroup;
    items: MenuItem[] = [];
    grabando = false;

    constructor(
        private fb: FormBuilder,
        private actividadService: ActividadService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.items = [
            { icon: 'pi pi-home', route: '/' },
            { label: 'Proyecto de Inversión' },
            { label: 'Actividades', route: '/proyecto-inversion/actividad' },
            { label: 'Nueva', route: '/proyecto-inversion/actividad/nuevo' }
        ];
        this.initializeUserForm();
    }

    initializeUserForm() {
        this.actividadForm = this.fb.group({
            codigo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
            estado: ['Activo']
        });
        this.actividadForm.patchValue({ estado: 'Activo' });
    }

    onSubmit() {
        if (this.actividadForm.invalid) {
            this.actividadForm.markAllAsTouched();
            console.error('Formulario inválido', this.actividadForm);
            return;
        }
        this.grabando = true;
        this.actividadService.addActividad(this.actividadForm.value).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                this.initializeUserForm();
            },
            error: (error) => {
                console.error('Error al guardar la actividad:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la actividad.' });
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }
}
