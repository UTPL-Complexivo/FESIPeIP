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
import { ActividadService } from '../../../service/actividad.service';
import { ActividadModel } from '../../../models/actividad.model';
import { AppDetallePrincipal } from "../../../layout/component/app.detalle-principal";
import { AppToolbarCrud } from "../../../layout/component/app.toolbar-crud";

@Component({
    selector: 'app-actividad-editar',
    standalone: true,
    template: `<div class="card">
            <app-detalle-principal [items]="items" [titulo]="nombre"></app-detalle-principal>
            <form [formGroup]="actividadForm" (ngSubmit)="onSubmit()">
                <app-toolbar-crud [linkRegreso]="'/proyecto-inversion/actividad'" [grabando]="grabando" [initializeUserForm]="initializeUserForm.bind(this)" [mostrarReset]="false"></app-toolbar-crud>
                <div class="p-fluid">
                    <div class="p-field mt-8 mb-6">
                        <p-floatLabel>
                            <input id="id" type="text" pInputText formControlName="id" class="w-1/5" />
                            <label for="id">Id</label>
                        </p-floatLabel>
                        @if (actividadForm.get('id')?.invalid && actividadForm.get('id')?.touched) {
                            @if (actividadForm.get('id')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El ID es requerido." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
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
        </div>`,
    imports: [BreadcrumbModule, RouterModule, CommonModule, ReactiveFormsModule, ToolbarModule, ButtonModule, FloatLabelModule, MessageModule, ToastModule, InputTextModule, AppDetallePrincipal, AppToolbarCrud],
    providers: [MessageService]
})
export class ActividadEditarComponent implements OnInit {
    items: MenuItem[] = [];
    actividadForm!: FormGroup;
    grabando = false;
    nombre = '';
    actividad!: ActividadModel;
    id: number = 0;

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private actividadService: ActividadService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.items = [
            { icon: 'pi pi-home', route: '/' },
            { label: 'Proyecto de Inversión' },
            { label: 'Actividades', route: '/proyecto-inversion/actividad' },
            { label: 'Editar', route: '/proyecto-inversion/actividad/editar' }
        ];
        this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.initializeUserForm();
        this.loadActividad();
    }

    loadActividad() {
        this.actividadService.getActividadById(this.id).subscribe({
            next: (data) => {
                this.actividadForm.patchValue({
                    id: data.id,
                    codigo: data.codigo,
                    nombre: data.nombre
                });
                this.actividad = data;
                this.nombre = `Editar Actividad: ${data.nombre}`;
            },
            error: (error) => {
                console.error('Error al obtener la actividad:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la actividad.' });
            }
        });
    }

    initializeUserForm() {
        this.actividadForm = this.fb.group({
            id: [{ value: '', disabled: true }],
            codigo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]]
        });
        this.actividadForm.markAsUntouched();
    }

    onSubmit() {
        if (this.actividadForm.invalid) {
            this.actividadForm.markAllAsTouched();
            return;
        }

        this.grabando = true;
        const actividadData: ActividadModel = {
            ...this.actividad,
            ...this.actividadForm.value
        };
        this.actividadService.updateActividad(this.id, actividadData).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error al actualizar la actividad:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la actividad.' });
                this.grabando = false;
            },
            complete: () => {
                console.log('Proceso de actualización completado.');
                this.grabando = false;
            }
        });
    }
}
