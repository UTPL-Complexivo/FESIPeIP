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
import { TextareaModule } from 'primeng/textarea';
import { TipologiaService } from '../../../service/tipologia.service';
import { AppDetallePrincipal } from "../../../layout/component/app.detalle-principal";
import { AppToolbarCrud } from "../../../layout/component/app.toolbar-crud";

@Component({
    selector: 'app-tipologia-nuevo',
    standalone: true,
    template: `<div class="card">
        <app-detalle-principal [items]="items" titulo="Nueva Tipología"></app-detalle-principal>
        <form [formGroup]="tipologiaForm" (ngSubmit)="onSubmit()">
            <app-toolbar-crud [linkRegreso]="'/proyecto-inversion/tipologia'" [grabando]="grabando" [initializeUserForm]="initializeUserForm.bind(this)"></app-toolbar-crud>
            <div class="p-fluid">
                <div class="p-field mt-8 mb-6">
                    <p-floatLabel>
                        <input id="codigo" type="text" pInputText formControlName="codigo" class="w-1/5" style="text-transform:uppercase" />
                        <label for="codigo">Código</label>
                    </p-floatLabel>
                    @if (tipologiaForm.get('codigo')?.invalid && tipologiaForm.get('codigo')?.touched) {
                        @if (tipologiaForm.get('codigo')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El código es requerido." />
                        }
                        @if (tipologiaForm.get('codigo')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El código debe tener al menos 3 caracteres." />
                        }
                        @if (tipologiaForm.get('codigo')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El código no puede exceder los 10 caracteres." />
                        }
                    }
                </div>
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <input id="nombre" type="text" pInputText formControlName="nombre" class="w-1/2" style="text-transform:uppercase" />
                        <label for="nombre">Nombre</label>
                    </p-floatLabel>
                    @if (tipologiaForm.get('nombre')?.invalid && tipologiaForm.get('nombre')?.touched) {
                        @if (tipologiaForm.get('nombre')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre es requerido." />
                        }
                        @if (tipologiaForm.get('nombre')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre debe tener al menos 3 caracteres." />
                        }
                        @if (tipologiaForm.get('nombre')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre no puede exceder los 255 caracteres." />
                        }
                    }
                </div>
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <textarea id="descripcion" pInputTextarea formControlName="descripcion" class="w-3/4" rows="3"></textarea>
                        <label for="descripcion">Descripción</label>
                    </p-floatLabel>
                    @if (tipologiaForm.get('descripcion')?.invalid && tipologiaForm.get('descripcion')?.touched) {
                        @if (tipologiaForm.get('descripcion')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="La descripción es requerida." />
                        }
                        @if (tipologiaForm.get('descripcion')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="La descripción debe tener al menos 10 caracteres." />
                        }
                        @if (tipologiaForm.get('descripcion')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="La descripción no puede exceder los 500 caracteres." />
                        }
                    }
                </div>
            </div>
        </form>
    </div>
    `,
    imports: [ReactiveFormsModule, BreadcrumbModule, CommonModule, RouterModule, SelectModule, ToolbarModule, ButtonModule, InputTextModule, FloatLabelModule, MessageModule, TextareaModule, AppDetallePrincipal, AppToolbarCrud],
    providers: [MessageService]
})
export class TipologiaNuevoComponent implements OnInit {
    tipologiaForm!: FormGroup;
    items: MenuItem[] = [];
    grabando = false;
    
    constructor(
        private fb: FormBuilder,
        private tipologiaService: TipologiaService,
        private messageService: MessageService
    ) {}
    
    ngOnInit(): void {
        this.items = [
            { icon: 'pi pi-home', route: '/' }, 
            { label: 'Proyecto de Inversión' }, 
            { label: 'Tipologías', route: '/proyecto-inversion/tipologia' }, 
            { label: 'Nueva', route: '/proyecto-inversion/tipologia/nuevo' }
        ];
        this.initializeUserForm();
    }

    initializeUserForm() {
        this.tipologiaForm = this.fb.group({
            codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
            descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
            estado: ['Activo']
        });
        this.tipologiaForm.patchValue({ estado: 'Activo' });
    }

    onSubmit() {
        if (this.tipologiaForm.invalid) {
            this.tipologiaForm.markAllAsTouched();
            console.error('Formulario inválido', this.tipologiaForm);
            return;
        }
        this.grabando = true;
        this.tipologiaService.addTipologia(this.tipologiaForm.value).subscribe({
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
                console.error('Error al guardar la tipología:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la tipología.' });
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }
}
