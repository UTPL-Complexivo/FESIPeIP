import { Component, OnInit } from '@angular/core';
import { AppDetallePrincipal } from '../../../layout/component/app.detalle-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppToolbarCrud } from '../../../layout/component/app.toolbar-crud';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ActivatedRoute } from '@angular/router';
import { ObjetivoDesarrolloSostenibleService } from '../../../service/objetivo-desarrollo-sostenible.service';
import { ObjetivoDesarrolloSostenibleModel } from '../../../models/objetivo-desarrollo-sostenible.model';

@Component({
    selector: 'app-ods-editar',
    template: `
        <div class="card">
            <app-detalle-principal [items]="items" [titulo]="titulo"></app-detalle-principal>
            <form [formGroup]="formODS" (ngSubmit)="onSubmit()">
                <app-toolbar-crud [linkRegreso]="'/objetivo-estrategico/objetivo-ds'" [grabando]="grabando" [initializeUserForm]="initializeForm.bind(this)" [mostrarReset]="false"></app-toolbar-crud>
                <div class="p-fluid">
                    @if(formODS.get('icono')?.value && formODS.get('icono')?.value.trim() !== '' && !formODS.get('icono')?.errors?.['pattern']) {
                            <img [src]="formODS.get('icono')?.value" alt="Icono ODS" class="w-64 h-64 mt-2" />
                        }
                    <div class="p-field mt-8 mb-6">
                        <p-floatLabel>
                            <input id="id" type="text" pInputText formControlName="id" class="w-1/5" />
                            <label for="id">ID</label>
                        </p-floatLabel>
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <input id="codigo" type="text" pInputText formControlName="codigo" class="w-1/5" style="text-transform:uppercase" />
                            <label for="codigo">Código</label>
                        </p-floatLabel>
                        @if (formODS.get('codigo')?.invalid && formODS.get('codigo')?.touched) {
                            @if (formODS.get('codigo')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El código es requerido." />
                            }
                            @if (formODS.get('codigo')?.errors?.['minlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El código debe tener al menos 3 caracteres." />
                            }
                            @if (formODS.get('codigo')?.errors?.['maxlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El código no puede exceder los 10 caracteres." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <label for="icono">Icono (URL)</label>
                            <input id="icono" type="text" pInputText formControlName="icono" class="w-1/2" />
                        </p-floatLabel>
                        @if (formODS.get('icono')?.invalid && formODS.get('icono')?.touched) {
                            @if (formODS.get('icono')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El icono es requerido." />
                            }
                            @if (formODS.get('icono')?.errors?.['pattern']) {
                                <p-message severity="error" variant="simple" size="small" text="El icono debe ser una URL válida." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <label for="nombre">Nombre</label>
                            <input id="nombre" type="text" pInputText formControlName="nombre" class="w-1/2" />
                        </p-floatLabel>
                        @if (formODS.get('nombre')?.invalid && formODS.get('nombre')?.touched) {
                            @if (formODS.get('nombre')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre es requerido." />
                            }
                            @if (formODS.get('nombre')?.errors?.['minlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre debe tener al menos 3 caracteres." />
                            }
                            @if (formODS.get('nombre')?.errors?.['maxlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre no puede exceder los 255 caracteres." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <label for="descripcion">Descripcion</label>
                            <textarea rows="5" pTextarea formControlName="descripcion" class="w-1/2"></textarea>
                        </p-floatLabel>
                    </div>
                </div>
            </form>
        </div>
    `,
    standalone: true,
    imports: [AppDetallePrincipal, ReactiveFormsModule, AppToolbarCrud, FloatLabelModule, MessageModule, InputTextModule, ButtonModule, TextareaModule],
    providers: [MessageService]
})
export class ObjetivoDesarrolloSostenibleEditarComponent implements OnInit {
    items: MenuItem[] = [{ icon: 'pi pi-home', route: '/' }, { label: 'Objetivos Estratégicos' }, { label: 'Objetivos Desarrollo Sostenible' }, { label: 'Editar' }];
    formODS!: FormGroup;
    grabando: boolean = false;
    id: number = 0;
    ods!: ObjetivoDesarrolloSostenibleModel;
    titulo: string = 'Editar Objetivo de Desarrollo Sostenible';
    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private odsService: ObjetivoDesarrolloSostenibleService
    ) {}
    ngOnInit(): void {
        this.initializeForm();
        this.id = this.activatedRoute.snapshot.params['id'];
        if (this.id) {
            this.odsService.getObjetivoDesarrolloSostenible(this.id).subscribe({
                next: (data) => {
                    this.titulo = `Editar Objetivo Desarrollo Sostenible: ${data.codigo} - ${data.nombre}`;
                    this.ods = data;
                    this.formODS.patchValue(data);
                },
                error: (error) => {
                    console.error('Error al cargar el ODS:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el ODS.' });
                }
            });
        }
    }
    onSubmit() {
        if (this.formODS.invalid) {
            this.formODS.markAllAsTouched();
            return;
        }

        const ods = {
            ...this.ods,
            ...this.formODS.value
        }

        this.grabando = true;
        this.odsService.updateObjetivoDesarrolloSostenible(this.id, ods).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error al actualizar el ODS:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el ODS.' });
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }
    initializeForm() {
        this.formODS = this.fb.group({
            id: [{ value: 0, disabled: true }],
            codigo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
            icono: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\.svg|\.png|\.jpg|\.jpeg|\.gif)?$/i)]],
            descripcion: [''],
            estado: ['Activo']
        });
    }
}
