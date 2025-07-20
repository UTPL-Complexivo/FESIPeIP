import { Component, Input, OnInit } from '@angular/core';
import { AppDetallePrincipal } from '../../../layout/component/app.detalle-principal';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppToolbarCrud } from '../../../layout/component/app.toolbar-crud';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ObjetivoInstitucionalModel } from '../../../models/objetivo-institucional.model';
import { ActivatedRoute } from '@angular/router';
import { ObjetivoInstitucionalService } from '../../../service/objetivo-institucional.service';
import { EstadoObjetivosEstrategicos } from '../../../shared/enums/estado-objetivos-estrategicos.enum';

@Component({
    selector: 'app-objetivo-institucional-editar',
    standalone: true,
    template: `
        <div class="card">
            <app-detalle-principal [items]="items" titulo="Editar Objetivo Institucional"></app-detalle-principal>
            <form [formGroup]="formObjetivoInstitucional" (ngSubmit)="onSubmit()">
                <app-toolbar-crud [linkRegreso]="'/objetivo-estrategico/objetivo-institucional'" [grabando]="grabando" [initializeUserForm]="initializeUserForm.bind(this)" [mostrarReset]="false" ></app-toolbar-crud>
                <div class="p-fluid">
                    <div class="p-field mt-8 mb-6">
                        <p-floatLabel>
                            <input id="codigo" type="text" pInputText formControlName="codigo" class="w-1/5" style="text-transform:uppercase" />
                            <label for="codigo">Código</label>
                        </p-floatLabel>
                        @if (formObjetivoInstitucional.get('codigo')?.invalid && formObjetivoInstitucional.get('codigo')?.touched) {
                            @if (formObjetivoInstitucional.get('codigo')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El código es requerido." />
                            }
                            @if (formObjetivoInstitucional.get('codigo')?.errors?.['minlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El código debe tener al menos 3 caracteres." />
                            }
                            @if (formObjetivoInstitucional.get('codigo')?.errors?.['maxlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El código no puede exceder los 10 caracteres." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <label for="nombre">Nombre</label>
                            <input id="nombre" type="text" pInputText formControlName="nombre" class="w-1/2" />
                        </p-floatLabel>
                        @if (formObjetivoInstitucional.get('nombre')?.invalid && formObjetivoInstitucional.get('nombre')?.touched) {
                            @if (formObjetivoInstitucional.get('nombre')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre es requerido." />
                            }
                            @if (formObjetivoInstitucional.get('nombre')?.errors?.['minlength']) {
                                <p-message severity="error" variant="simple" size="small" text="El nombre debe tener al menos 3 caracteres." />
                            }
                            @if (formObjetivoInstitucional.get('nombre')?.errors?.['maxlength']) {
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
    imports: [AppDetallePrincipal, ReactiveFormsModule, AppToolbarCrud, FloatLabelModule, MessageModule, InputTextModule, TextareaModule],
    providers: [MessageService]
})
export class ObjetivoInstitucionalEditarComponent implements OnInit {
    items: MenuItem[] = [{ icon: 'pi pi-home', route: '/' }, { label: 'Objetivos Estratégicos' }, { label: 'Objetivos Institucionales' }, { label: 'Editar' }];
    formObjetivoInstitucional!: FormGroup;
    grabando: boolean = false;
    oiId: number = 0;
    constructor(private messageService: MessageService, private fb: FormBuilder, private activateRoute: ActivatedRoute, private oiService: ObjetivoInstitucionalService) {}
    ngOnInit() {
        this.initializeUserForm();
        this.oiId = this.activateRoute.snapshot.params['id'];
        this.oiService.getObjetivoInstitucional(this.oiId).subscribe({
            next: (data: ObjetivoInstitucionalModel) => {
                const {estado} = data;
                if(estado === EstadoObjetivosEstrategicos.Rechazado){
                    //Mostrar mensaje indicando que el objetivo institucional fue rechazado y se colocara en estado pendiente
                    this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'El objetivo institucional fue rechazado y se colocara en estado pendiente una vez guarde la información.' });
                }
                this.formObjetivoInstitucional.patchValue(data);
            },
            error: (error) => {
                console.error('Error al cargar el objetivo institucional:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el objetivo institucional.' });
            }
        });
    }
    initializeUserForm() {
        this.formObjetivoInstitucional = this.fb.group({
            id: [''],
            codigo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
            descripcion: [''],
            estado: [null],
        });

    }
    onSubmit() {
        if( this.formObjetivoInstitucional.invalid) {
            this.formObjetivoInstitucional.markAllAsTouched();
            return;
        }
        this.grabando = true;
        this.oiService.updateObjetivoInstitucional(this.oiId, this.formObjetivoInstitucional.value).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error al actualizar el objetivo institucional:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el objetivo institucional.' });
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }
}
