import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { RolService } from '../../service/rol.service';

@Component({
    selector: 'app-rol-nuevo',
    standalone: true,
    template: `<div class="card">
            <div class="font-semibold text-xl">Nuevo Rol</div>
            <p-breadcrumb class="max-w-full" [model]="items">
                <ng-template #item let-item>
                    <ng-container *ngIf="item.route; else elseBlock">
                        <a [routerLink]="item.route" class="p-breadcrumb-item-link">
                            <span [ngClass]="[item.icon ? item.icon : '', 'text-color']"></span>
                            <span class="text-primary font-semibold">{{ item.label }}</span>
                        </a>
                    </ng-container>
                    <ng-template #elseBlock>
                        <a [href]="item.url">
                            <span class="text-color">{{ item.label }}</span>
                        </a>
                    </ng-template>
                </ng-template>
            </p-breadcrumb>
            <form [formGroup]="rolForm" (ngSubmit)="onSubmit()" class="p-fluid mt-4">
                <p-toolbar>
                    <ng-template #start>
                        <button pButton type="button" icon="pi pi-arrow-left" label="Regresar" class="p-button-secondary mr-2" [routerLink]="['/gestion-usuarios/roles']" [disabled]="grabando"></button>
                        <button pButton type="submit" icon="pi pi-save" label="Guardar" class="mr-2" [disabled]="grabando"></button>
                        <p-button type="button" icon="pi pi-refresh" label="Resetear" severity="warn" variant="outlined" (click)="initializeUserForm()" [disabled]="grabando"></p-button>
                    </ng-template>
                </p-toolbar>
                <div class="p-field mb-6 mt-8">
                    <p-floatLabel>
                        <input id="nombre" type="text" pInputText formControlName="nombre" class="w-1/2" />
                        <label for="nombre">Nombre</label>
                    </p-floatLabel>
                    @if (rolForm.get('nombre')?.invalid && rolForm.get('nombre')?.touched) {
                        @if (rolForm.get('nombre')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre es requerido." />
                        }
                        @if (rolForm.get('nombre')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre debe tener al menos 3 caracteres." />
                        }
                        @if (rolForm.get('nombre')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre no puede exceder los 100 caracteres." />
                        }
                    }
                </div>
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <input id="descripcion" type="text" pInputText formControlName="descripcion" class="w-full" />
                        <label for="descripcion">Descripción</label>
                    </p-floatLabel>
                    @if (rolForm.get('descripcion')?.invalid && rolForm.get('descripcion')?.touched) {
                        @if (rolForm.get('descripcion')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="La descripción debe tener al menos 3 caracteres." />
                        }
                        @if (rolForm.get('descripcion')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="La descripción no puede exceder los 2000 caracteres." />
                        }
                    }
                </div>
            </form>
        </div>
        <p-toast position="top-right"></p-toast>`,
    imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule, ToolbarModule, RouterModule, BreadcrumbModule, CommonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class RolNuevoComponent implements OnInit {
    rolForm!: FormGroup;
    items: MenuItem[] | undefined;
    grabando = false;
    constructor(
        private fb: FormBuilder,
        private rolService: RolService,
        private messageService: MessageService
    ) {}
    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Gestión de Usuarios' }, { label: 'Roles' }, { label: 'Nuevo', route: '/roles/nuevo' }];
        this.initializeUserForm();
    }
    onSubmit() {
        if (this.rolForm.invalid) {
            console.error('Formulario errado:', this.rolForm.value);
            this.rolForm.markAllAsTouched();
            return;
        }
        this.grabando = true;
        this.rolService.addRol(this.rolForm.value).subscribe({
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
                console.error('Error al crear el rol:', error);
                this.grabando = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el rol.' });
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }

    initializeUserForm() {
        this.rolForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            descripcion: ['', [Validators.minLength(3), Validators.maxLength(2000)]],
            estado: ['Activo']
        });
    }
}
