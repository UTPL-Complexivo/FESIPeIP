import { Component, OnInit } from '@angular/core';
import { AppDetallePrincipal } from '../../../layout/component/app.detalle-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppToolbarCrud } from '../../../layout/component/app.toolbar-crud';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CatalogoService } from '../../../service/catalogo.service';
import { CatalogoModel } from '../../../models/catalogo.model';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { PlanNacionalDesarrolloService } from '../../../service/plan-nacional-desarrollo.service';

@Component({
    selector: 'app-plan-nacional-desarrollo-nuevo',
    standalone: true,
    template: `
        <div class="card">
            <app-detalle-principal [items]="items" titulo="Nuevo Objetivo Institucional"></app-detalle-principal>
            <form [formGroup]="formPND" (ngSubmit)="onSubmit()">
                <app-toolbar-crud [linkRegreso]="'/objetivo-estrategico/objetivo-pnd'" [grabando]="grabando" [initializeUserForm]="initializeUserForm.bind(this)"></app-toolbar-crud>
                <div class="p-fluid">
                    <div class="p-field mt-8 mb-6">
                        <p-floatLabel>
                            <input id="codigo" type="text" pInputText formControlName="codigo" class="w-1/5" style="text-transform:uppercase" />
                            <label for="codigo">Código</label>
                        </p-floatLabel>
                        @if (formPND.get('codigo')?.invalid && formPND.get('codigo')?.touched) {
                            @if (formPND.get('codigo')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El código es requerido." />
                            }
                            @if (formPND.get('codigo')?.errors?.['minlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El código debe tener al menos 3 caracteres." />
                            }
                            @if (formPND.get('codigo')?.errors?.['maxlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El código no puede exceder los 10 caracteres." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <label for="nombre">Nombre</label>
                            <input id="nombre" type="text" pInputText formControlName="nombre" class="w-1/2" />
                        </p-floatLabel>
                        @if (formPND.get('nombre')?.invalid && formPND.get('nombre')?.touched) {
                            @if (formPND.get('nombre')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre es requerido." />
                            }
                            @if (formPND.get('nombre')?.errors?.['minlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre debe tener al menos 3 caracteres." />
                            }
                            @if (formPND.get('nombre')?.errors?.['maxlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre no puede exceder los 255 caracteres." />
                            }
                        }
                    </div>
                     <div class="p-field mt-8 mb-6">
                        <p-floatLabel>
                            <p-select id="eje" formControlName="eje" [options]="ejes" optionLabel="valor" optionValue="valor" class="w-1/5" [showClear]="true"> </p-select>
                            <label for="eje">Eje</label>
                        </p-floatLabel>
                        @if (formPND.get('eje')?.invalid && formPND.get('eje')?.touched) {
                            @if (formPND.get('eje')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El eje es requerido." />
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
    imports: [AppDetallePrincipal, ReactiveFormsModule, AppToolbarCrud, FloatLabelModule, MessageModule, InputTextModule, ButtonModule, TextareaModule, SelectModule],
    providers: [MessageService]
})
export class PlanNacionalDesarrolloNuevoComponent implements OnInit {
    items: MenuItem[] = [{ icon: 'pi pi-home', route: '/' }, { label: 'Objetivos Estratégicos' }, { label: 'Objetivos PND' }, { label: 'Nuevo' }];
    formPND!: FormGroup;
    grabando: boolean = false;
    ejes: CatalogoModel[] = [];
    constructor(private messageService: MessageService, private fb: FormBuilder, private catalogoService: CatalogoService, private pndService: PlanNacionalDesarrolloService) {}
    ngOnInit() {
        this.catalogoService.getCatalogosByTipo(1).subscribe({
            next: (data) => {
                this.ejes = data;
            },
            error: (error) => {
                console.error('Error al cargar los ejes:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los ejes.' });
            }
        });
        this.initializeUserForm();
    }
    onSubmit() {
        if(this.formPND.invalid) {
            console.log('Formulario enviado:', this.formPND.value);
            this.formPND.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar errores
            return;
        }
        this.grabando = true;
        this.pndService.addPlanNacionalDesarrollo(this.formPND.value).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                    this.initializeUserForm();
                }
            },
            error: (error) => {
                console.error('Error al guardar el PND:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el PND.' });
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }
    initializeUserForm() {
        this.formPND = this.fb.group({
            id: [0],
            codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
            eje: ['', [Validators.required]],
            descripcion: [''],
            estado: ['Activo']
        });
    }
}
