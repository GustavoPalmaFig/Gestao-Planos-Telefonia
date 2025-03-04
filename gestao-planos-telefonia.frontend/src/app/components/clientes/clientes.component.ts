import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { TooltipModule } from 'primeng/tooltip';
import { Plano } from '../../models/plano';
import { PlanoService } from '../../services/plano.service';
import { LoadingService } from '../../services/loading.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-clientes',
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
    NgxMaskDirective,
    TooltipModule
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  providers: [ConfirmationService, MessageService, provideNgxMask(), NgxMaskPipe]
})
export class ClientesComponent implements OnInit {
  allPlanos: Plano[] = [];
  allClientes: Cliente[] = [];
  selectedClientesToDelete!: Cliente[] | null;
  clienteForm!: FormGroup;
  expandedRows: { [key: string]: boolean } = {};

  clienteFormDialog: boolean = false;
  submitted: boolean = false;

  constructor(private clienteService: ClienteService, private planoService: PlanoService, private confirmationService: ConfirmationService,
    private messageService: MessageService, private fb: FormBuilder, private primengConfig: PrimeNGConfig,
    public maskPipe: NgxMaskPipe, public loadingService: LoadingService) {
      this.clienteForm = this.fb.group({
        id: [null],
        nome: ['', Validators.required],
        cpf: ['', Validators.required],
        telefone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        clientesPlanos: []
      });
  }

  ngOnInit() {
    this.loadingService.show();
    forkJoin({
      planos: this.planoService.getAllPlanos(),
      clientes: this.clienteService.getAllClientes()
    }).subscribe(({ planos, clientes }) => {
      this.allPlanos = planos;
      this.allClientes = clientes;
      this.loadingService.hide();
    });

    this.primengConfig.setTranslation({
      emptyMessage: 'Nenhum registro encontrado',
      apply: 'Aplicar',
      clear: 'Limpar'
    });
  }

  openClienteFormDialog(cliente?: Cliente) {
    if (cliente) {
      this.clienteForm.patchValue(cliente);
      if (cliente.clientesPlanos && cliente.clientesPlanos.length > 0) {
        this.clienteForm.get('clientesPlanos')?.setValue(cliente.clientesPlanos.map(cp => cp.planoId));
      } 
    } 
    else {
      this.clienteForm.reset();
    }
    this.clienteFormDialog = true;
  }

  saveCliente() {
    this.submitted = true;
    
    if (this.clienteForm.valid) {
      const cliente = this.clienteForm.value as Cliente;

      const selectedPlanosIds = this.clienteForm.get('clientesPlanos')?.value as string[];

      if (selectedPlanosIds?.length > 0) {
        cliente.clientesPlanos = selectedPlanosIds.map(planoId => {
          return {
            clienteId: cliente.id || undefined,
            planoId: planoId,
          };
        });
      } else {
        cliente.clientesPlanos = [];
      }

      if (cliente.id) {
        this.clienteService.updateCliente(cliente).subscribe(() => {
          cliente.clientesPlanos?.forEach(cp => cp.plano = this.allPlanos.find(p => p.id === cp.planoId));
          const index = this.allClientes.findIndex(c => c.id === cliente.id);
          this.allClientes[index] = cliente;
          this.clienteFormDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente Atualizado', life: 3000 });
          this.resetForm();
        });
      }
      else {
        this.clienteService.createCliente(cliente).subscribe((newCliente) => {
          newCliente.clientesPlanos?.forEach(cp => cp.plano = this.allPlanos.find(p => p.id === cp.planoId));
          this.allClientes.push(newCliente);
          this.clienteFormDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente Criado', life: 3000 });
          this.resetForm();
        });
      }
    }
  }

  resetForm() {
    this.clienteForm.reset();
    this.clienteForm.markAsPristine();
    this.clienteForm.markAsUntouched();
    this.submitted = false;
  }

  deleteSelectedClientes(cliente?: Cliente) {
    this.selectedClientesToDelete = cliente ? [cliente] : this.selectedClientesToDelete;

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o(s) cliente(s) selecionado(s)?',
      header: 'Confirmar',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedClientesToDelete!.map(async cliente => {
          this.clienteService.deleteCliente(cliente.id!).subscribe(() => {
          this.allClientes = this.allClientes.filter(c => c.id !== cliente.id);
          });
        });

        this.selectedClientesToDelete = null;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente(s) Deletedo(s)', life: 3000 });
      },
      reject: () => {
        this.selectedClientesToDelete = null;
        this.messageService.add({ severity: 'warn', summary: 'Cancelada', detail: 'Operação Cancelada', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.clienteFormDialog = false;
    this.submitted = false;
  }

  getFilterOptionsByField(field: keyof Cliente) {
    const options = this.allClientes.map(cliente => cliente[field]);
    return[...new Set(options)]
  }
}