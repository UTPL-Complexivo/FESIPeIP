import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-dialog-confirmation',
    standalone: true,
    template: `<p-dialog [header]="tituloMotivo" [(visible)]="displayMotivoDialog" [modal]="true" [closable]="false">
        <form [formGroup]="motivoForm" (ngSubmit)="confirmarEliminacion()">
            <div class="p-field">
                <textarea id="motivo" pInputTextarea formControlName="motivo" rows="3" class="w-full"></textarea>
            </div>
            <div class="p-dialog-footer">
                <button pButton type="button" label="Cancelar" class="p-button-secondary" (click)="cancelarEliminacion()"></button>
                <button pButton type="submit" label="Confirmar" [disabled]="motivoForm.invalid"></button>
            </div>
        </form>
    </p-dialog>`,
    imports: [DialogModule, ReactiveFormsModule, TextareaModule, ButtonModule],
    providers: []
})
export class AppDialogConfirmation {
    @Input({ required: true }) tituloMotivo: string = '';
    @Input({ required: true }) displayMotivoDialog: boolean = false;
    @Input({ required: true }) inactivar: any = false;
    @Input({ required: true }) id: any = false;
    @Output() save: EventEmitter<any> = new EventEmitter<any>();
    @Output() cerrarDialogo: EventEmitter<boolean> = new EventEmitter<boolean>();
    motivoForm!: FormGroup;
    constructor(private fb: FormBuilder) {
        this.inizializeMotivoForm();
    }
    cancelarEliminacion() {
        this.displayMotivoDialog = false;
        this.cerrarDialogo.emit(this.displayMotivoDialog);
        if (this.motivoForm) {
            this.inizializeMotivoForm();
        }
    }

    inizializeMotivoForm() {
this.motivoForm = this.fb.group({
            id: [this.id, Validators.required],
            motivo: ['', Validators.required]
        });
    }
    confirmarEliminacion() {
        if (this.motivoForm.invalid) {
            return;
        }
        this.save.emit({
            id: this.id,
            motivoInactivacion: this.motivoForm.value.motivo,
            inactivar: this.inactivar
        });
        this.displayMotivoDialog = false;
        this.cerrarDialogo.emit(this.displayMotivoDialog);
        this.inizializeMotivoForm();
    }
}
