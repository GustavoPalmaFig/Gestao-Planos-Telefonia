import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Plano } from '../../app/models/plano';
import { PlanoService } from '../../app/services/plano.service';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    MultiSelectModule,
    NgxMaskDirective
  ],
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.scss'],
  providers: [ConfirmationService, MessageService, provideNgxMask()]
})
export class PlanosComponent implements OnInit {
  allPlanos: Plano[] = [];
  planoForm!: FormGroup;
  selectedPlanos!: Plano[] | null;
  searchValue: string | undefined;

  isLoading: boolean = true;
  planoFormDialog: boolean = false;
  submitted = false;

  constructor(private planoService: PlanoService, private confirmationService: ConfirmationService,
    private messageService: MessageService, private fb: FormBuilder, private primengConfig: PrimeNGConfig) {
      this.planoForm = this.fb.group({
        id: [null],
        nome: ['', Validators.required],
        preco: ['', Validators.required],
        franquiaDados: ['', Validators.required],
        minutosLigacao: ['', [Validators.required]],
        planosPlanos: [[]]
      });
  }

  ngOnInit() {
    this.planoService.getAllPlanos().subscribe(planos => {
      this.allPlanos = planos;
      this.isLoading = false;
    });

    this.primengConfig.setTranslation({
      emptyMessage: 'Nenhum registro encontrado',
      apply: 'Aplicar',
      clear: 'Limpar'
    });
  }

  setCurrencyValues(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  openPlanoFormDialog(plano?: Plano) {
    if (plano) {
      this.planoForm.patchValue(plano);
    } else {
      this.planoForm.reset();
    }
    this.planoFormDialog = true;
  }

  savePlano() {
    this.submitted = true;
    
    if (this.planoForm.valid) {
      const plano = this.planoForm.value as Plano;

      if (!plano.clientesPlanos) {
        plano.clientesPlanos = [];
      }

      if (plano.id) {
        this.planoService.updatePlano(plano).subscribe(() => {
          const index = this.allPlanos.findIndex(c => c.id === plano.id);
          this.allPlanos[index] = plano;
          this.planoFormDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Plano Atualizado', life: 3000 });
        });
      }
      else {
        this.planoService.createPlano(plano).subscribe((newPlano) => {
          this.allPlanos.push(newPlano);
          this.planoFormDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Plano Criado', life: 3000 });
        });
      }
    }
  }

  deleteSelectedPlanos(plano?: Plano) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o(s) plano(s) selecionado(s)?',
      header: 'Confirmar',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      const planosToDelete = plano ? [plano] : this.selectedPlanos || [];
      
      planosToDelete.map(async plano => {
        this.planoService.deletePlano(plano.id!).subscribe(() => {
        this.allPlanos = this.allPlanos.filter(c => c.id !== plano.id);
        });
      });

      this.selectedPlanos = null;
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Plano(s) Deletedo(s)', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.planoFormDialog = false;
    this.submitted = false;
  }

  getFilterOptionsByField(field: keyof Plano) {
    const options = this.allPlanos.map(plano => plano[field]);
    return[...new Set(options)]
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }
}